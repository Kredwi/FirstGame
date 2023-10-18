const gameZone =  document.getElementById('gameZone');
const gamePanel = document.getElementById('gamePanel');
const item = document.getElementById('item');
const player =  document.getElementById('player');
const control = document.getElementById('controls')

const killItem = new Audio('med.mp3');

const pageWidth = gameZone.clientWidth;
const pageHeight = gameZone.clientHeight;

let step = 5;
let isBall = localStorage.getItem('ball') || false;
let playerPosition = [0, 0];
let gameMap = [pageHeight, pageWidth, 0, 0];
let itemPosition = [0, 0, 0, 0];
let itemSize = 50;
let score = parseInt(localStorage.getItem('score')) ||  0;
let interval;
let moving;

gameZone.style.width = pageWidth;
gameZone.style.height = pageHeight;

randomSpawnItem(gameMap[0], gameMap[1], false);

document.addEventListener("keydown", (event) => {
    if (!moving)
        movingPlayer(event.code);
});

control.addEventListener('mousedown', (event) => {
    interval = setInterval(() => {
        movingPlayer(event.target.id)
        moving = true;
    }, 50)
});

control.addEventListener('mouseup', () => {
    clearInterval(interval)
    moving = false;
});

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
        ) {
        randomSpawnItem(gameMap[0], gameMap[1], true);
    }
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
    itemPosition[0] = oneCoordinate;
    itemPosition[1] = twoCoordinate;
}

function resetScore() {
    const confirmDeleteScore = confirm('Точно удалить ваш счет?');
    if (confirmDeleteScore) {
        localStorage.removeItem('score');
        location.reload();
    } else
        return;
}