const gameZone =  document.getElementById('gameZone');
const gamePanel = document.getElementById('gamePanel');
const item = document.getElementById('item');
const player =  document.getElementById('player');
const control = document.getElementById('controls');
const time = document.getElementById('time');
const defeatMessage = document.getElementById('defeatMessage');
const defeatBtn = document.getElementById('resetPlayerBtn');

const pageWidth = gameZone.clientWidth;
const pageHeight = gameZone.clientHeight;

const killItem = new Audio('med.mp3');
const deadPlayer = new Audio('eat.mp3');
const playerRespawn = new Audio('playerRenaissance.mp3');

let playerPosition = [0, 0];
let gameMap = [pageHeight, pageWidth, 0, 0];
let itemPosition = [0, 0];
let itemSize = 50;
let step = 5;
let gameTime = 60;
let score = parseInt(localStorage.getItem('score')) ||  0;
let interval, moving, defeatTime, isDead;

gameZone.style.width = pageWidth;
gameZone.style.height = pageHeight;

randomSpawnItem(gameMap[0], gameMap[1], false);

document.addEventListener("keydown", (event) => {
    if (!isDead) {
        if (!moving)
            movingPlayer(event.code);
    }
});

control.addEventListener('mousedown', (event) => {
    interval = setInterval(() => {
        movingPlayer(event.target.id)
        moving = true;
    }, 30)
});

control.addEventListener('mouseup', () => {
    clearInterval(interval)
    moving = false;
});

setInterval(() => {
    if (!isDead) {
        if (defeatTime == 0) {
            setTimeout(() => {
                deadPlayer.play();
                player.style.top = '23px';
                player.style.left = '64px';
                setTimeout(() => {
                    player.style.display = 'none';
                    item.style.display = 'none';
                    time.style.display = 'none';
                    control.style.display = 'none';
                    defeatMessage.style.display = 'block';
                    defeatMessage.textContent = 'ВЫ ПРОИГРАЛИ!!!!!';
                    defeatBtn.style.display = 'inline';
                    defeatTime = 60;
                    isDead = true;
                }, 600);
                player.style.transform = "scaleX(-1)";
            }, 402);
            setTimeout(() => {
                resetButton();
            }, 1000);
        } else {
            time.textContent = `Смерть через: ${defeatTime} сек`
            defeatTime--;
        }
    }
}, 1000);

function movingPlayer(key) {
    if (key == "KeyW" && playerPosition[0] > gameMap[3]) {
        item.style.transform = "scaleX(1)";
        playerPosition[0] -= step;
    } else if (key == "KeyS" && playerPosition[0] < gameMap[0]) {
        item.style.transform = "scaleX(-1)";
        playerPosition[0] += step;
    } else if (key == "KeyA" && playerPosition[1] > gameMap[2]) {
        player.style.transform = "scaleX(-1)";
        playerPosition[1] -= step;
    } else if (key == "KeyD" && playerPosition[1] < gameMap[1]) {
        player.style.transform = "scaleX(1)";
        playerPosition[1] += step;
    }
    player.style.top = `${playerPosition[0]}px`;
    player.style.left = `${playerPosition[1]}px`;
    if (
        playerPosition[0] >= itemPosition[0] - itemSize &&
        playerPosition[0] <= itemPosition[0] + itemSize &&
        playerPosition[1] >= itemPosition[1] - itemSize &&
        playerPosition[1] <= itemPosition[1] + itemSize
    )
        randomSpawnItem(gameMap[0], gameMap[1], true);
}

function randomSpawnItem(Height, Width, from) {
    const oneCoordinate = Math.floor(Math.random() * (Height - 0) + 0);
    const twoCoordinate = Math.floor(Math.random() * (Width - 0) + 0);
    item.style.top = `${oneCoordinate}px`;
    item.style.left = `${twoCoordinate}px`;
    if (from) {
        score++
        killItem.play();
    }
    document.getElementById('score').textContent = `СЧЕТ: ${score}`;
    localStorage.setItem('score', score);
    defeatTime = gameTime;
    itemPosition[0] = oneCoordinate;
    itemPosition[1] = twoCoordinate;
}

function resetScore() {
    const confirmDeleteScore = confirm('Точно удалить ваш счет?');
    if (confirmDeleteScore) {
        localStorage.removeItem('score');
        defeatTime = gameTime;
        isDead = false;
        moving = false;
        location.reload();
    }
}

function resetButton() {
    playerPosition[0] = playerPosition[1] = 0;
    player.style.top = '0px';
    player.style.left = '0px';
    clearInterval(interval);
    defeatTime = gameTime;
    moving = false;
}

function respawnPlayer() {
    defeatMessage.textContent = 'ПОДОЖ';
    setTimeout(() => {
        defeatMessage.textContent = 'ПОДОЖДИТЕ...';
    }, 1000);
    setTimeout(() => {
        defeatMessage.style.display = 'none';
        defeatBtn.style.display = 'none';
        setTimeout(() => {
            player.style.display = 'inline';
            item.style.display = 'inline';
            time.style.display = 'inline';
            control.style.display = 'inline-flex';
            setTimeout(() => {
                defeatMessage.textContent = '';
                defeatTime = gameTime;
                isDead = false;
                moving = false;
            }, 2000);
        }, 3000);
    }, 3000);
    playerRespawn.play();
}