'use strict'
const ctx = document.querySelector("#canvas").getContext("2d");
const gameOverText = document.querySelector("h1");
const button = document.querySelector('button');
const logo = document.querySelector('.logo');

const width = canvas.width;
const height = canvas.height;
const blockSize = 20;

const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

const game = () => {

    let score = 0;

    button.setAttribute('disabled', true);

    function drawBorder() {
        ctx.fillStyle = "rgb(1, 212, 4)";
        ctx.fillRect(0, 0, width, blockSize);
        ctx.fillRect(0, height - blockSize, width, blockSize);
        ctx.fillRect(0, 0, blockSize, height);
        ctx.fillRect(width - blockSize, 0, blockSize, height);
    };

    function drawScore() {
        const scoreElement = document.querySelector('.score');
        scoreElement.textContent = `Score: ${score}`;
    };

    function circle(x, y, radius, fillCircle) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        if (fillCircle) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    };

    class Block {
        constructor(col, row) {
            this.col = col;
            this.row = row;
        }
    };

    Block.prototype.drawSquare = function () {
        const x = this.col * blockSize;
        const y = this.row * blockSize;
        ctx.fillStyle = 'Green';
        ctx.fillRect(x, y, blockSize, blockSize);
    };

    Block.prototype.drawCircle = function () {
        const centerX = this.col * blockSize + blockSize / 2;
        const centerY = this.row * blockSize + blockSize / 2;
        ctx.fillStyle = 'LimeGreen';
        circle(centerX, centerY, blockSize / 2, true);
    };

    Block.prototype.equal = function (otherBlock) {
        return this.col === otherBlock.col && this.row === otherBlock.row;
    };

    class Snake {
        segments = [
            new Block(7, 5),
            new Block(6, 5),
            new Block(5, 5)
        ];
        direction = "right";
        nextDirection = "right";
    };

    Snake.prototype.draw = function () {
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].drawSquare();
        }
    };

    Snake.prototype.move = function () {
        const head = this.segments[0];
        let newHead;
        this.direction = this.nextDirection;

        switch (this.direction) {
            case "right":
                newHead = new Block(head.col + 1, head.row);
                break;
            case "down":
                newHead = new Block(head.col, head.row + 1);
                break;
            case "left":
                newHead = new Block(head.col - 1, head.row);
                break;
            case "up":
                newHead = new Block(head.col, head.row - 1);
                break;
        }
        if (this.checkCollision(newHead)) {
            gameOver();
            return;
        }

        this.segments.unshift(newHead);

        if (newHead.equal(apple.position)) {
            score++;
            apple.move();
        } else {
            this.segments.pop();
        }
    };

    Snake.prototype.checkCollision = function (head) {
        const leftCollision = (head.col === 0);
        const topCollision = (head.row === 0);
        const rightCollision = (head.col === widthInBlocks - 1);
        const bottomCollision = (head.row === heightInBlocks - 1);
        const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;
        let selfCollision = false;
        for (let i = 0; i < this.segments.length; i++) {
            if (head.equal(this.segments[i])) {
                selfCollision = true;
            }
        }
        return wallCollision || selfCollision;
    };

    Snake.prototype.setDirection = function (newDirection) {
        switch (true) {
            case this.direction === "up" && newDirection === "down":
                return;
            case this.direction === "right" && newDirection === "left":
                return;
            case this.direction === "down" && newDirection === "up":
                return;
            case this.direction === "left" && newDirection === "right":
                return;
        }
        this.nextDirection = newDirection;
    };

    class Apple {
        position = new Block(10, 10);
    };

    Apple.prototype.draw = function () {
        this.position.drawCircle();
    };

    Apple.prototype.move = function () {
        const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
        this.position = new Block(randomCol, randomRow);
        soundApple();
    };

    const snake = new Snake();
    const apple = new Apple();

    const intervalId = setInterval(function () {
        ctx.clearRect(0, 0, width, height);
        drawScore();
        snake.move();
        snake.draw();
        apple.draw();
        drawBorder();
    }, 100);

    document.body.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "ArrowLeft":
            snake.setDirection("left");
            break;
          case "ArrowUp":
            snake.setDirection("up");
            break;
          case "ArrowRight":
            snake.setDirection("right");
            break;
          case "ArrowDown":
            snake.setDirection("down");
            break;
          default:
            break;
        }
      });

    function gameOver() {
        gameOverText.style.display = 'block';
        canvas.classList.toggle('canvas__game_over');
        clearInterval(intervalId);
        button.removeAttribute('disabled');
        soundOver();
    };

    function soundApple() {
        const soundOver = document.querySelector('#backgroundaudio');
        soundOver.src = "/src/audio/EatingAnApple.mp3";
        soundOver.autoplay = true;
    };

    function soundOver() {
        const soundOver = document.querySelector('audio');
        soundOver.src = "/src/audio/GameOver.mp3";
        soundOver.autoplay = true;
    };
};

button.addEventListener('click', () => {
    canvas.classList.toggle('canvas__game_over');
    gameOverText.style.display = 'none';
    logo.style.display = 'none';
    game();
});