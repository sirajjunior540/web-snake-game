const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const snakeBlock = 10;
let snakeSpeed = 100;
let snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
let direction = { x: 0, y: 0 };
let food = getRandomFoodPosition();
let score = 0;

document.addEventListener("keydown", changeDirection);

const joystick = document.getElementById("joystick");
const joystickContainer = joystick.parentElement;

joystick.addEventListener("touchstart", handleTouchStart, false);
joystick.addEventListener("touchmove", handleTouchMove, false);
joystick.addEventListener("touchend", handleTouchEnd, false);

function handleTouchStart(e) {
    e.preventDefault();
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = joystickContainer.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;
    const y = touch.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    const distance = Math.min(Math.sqrt(x * x + y * y), rect.width / 2 - joystick.offsetWidth / 2);
    const newX = distance * Math.cos(angle);
    const newY = distance * Math.sin(angle);

    joystick.style.transform = `translate(${newX}px, ${newY}px)`;

    if (Math.abs(newX) > Math.abs(newY)) {
        direction = newX > 0 ? { x: snakeBlock, y: 0 } : { x: -snakeBlock, y: 0 };
    } else {
        direction = newY > 0 ? { x: 0, y: snakeBlock } : { x: 0, y: -snakeBlock };
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    joystick.style.transform = `translate(-50%, -50%)`;
}

function main() {
    if (hasGameEnded()) {
        alert(`Game Over! Your score is ${score}`);
        document.location.reload();
        return;
    }

    setTimeout(function onTick() {
        clearCanvas();
        drawFood();
        advanceSnake();
        drawSnake();
        drawScore();

        main();
    }, snakeSpeed)
}

function clearCanvas() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.fillStyle = "black";
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, snakeBlock, snakeBlock);
    });
}

function advanceSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, snakeBlock, snakeBlock);
}

function getRandomFoodPosition() {
    let foodX = Math.floor(Math.random() * (canvas.width / snakeBlock)) * snakeBlock;
    let foodY = Math.floor(Math.random() * (canvas.height / snakeBlock)) * snakeBlock;
    return { x: foodX, y: foodY };
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = direction.y === -snakeBlock;
    const goingDown = direction.y === snakeBlock;
    const goingRight = direction.x === snakeBlock;
    const goingLeft = direction.x === -snakeBlock;

    if (keyPressed === LEFT_KEY && !goingRight) {
        direction = { x: -snakeBlock, y: 0 };
    }
    if (keyPressed === UP_KEY && !goingDown) {
        direction = { x: 0, y: -snakeBlock };
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        direction = { x: snakeBlock, y: 0 };
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        direction = { x: 0, y: snakeBlock };
    }
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

main();
