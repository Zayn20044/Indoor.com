const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Game variables
let gameState = 'start'; // New game state variable
let level = 1;  // Track the current level
let maxLevel = 5;  // Maximum number of levels
const paddleWidthBase = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidthBase) / 2;
let paddleWidth = paddleWidthBase;
let rightPressed = false;
let leftPressed = false;

const ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 4; // Ball's horizontal movement
let ballDY = -4; // Ball's vertical movement

const brickRowCountBase = 5;
let brickRowCount = brickRowCountBase;
const brickColumnCount = 8;
const brickWidth = 60;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 40;
const brickOffsetLeft = 35;
let score = 0;
let lives = 3;  // Lives remain constant across levels

// Create bricks
let bricks = createBricks(brickRowCount);

function createBricks(rows) {
  const bricksArray = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricksArray[c] = [];
    for (let r = 0; r < rows; r++) {
      bricksArray[c][r] = { x: 0, y: 0, status: 1 }; // 'status' indicates if brick is still present
    }
  }
  return bricksArray;
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = getBrickColor(r);  // Different colors for each row
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 10, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#FF4500';  // Orange-red ball color
  ctx.fill();
  ctx.closePath();
}

// Draw score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Score: ' + score, 8, 20);
}

// Draw lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

// Draw level
function drawLevel() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Level: ' + level, canvas.width / 2 - 30, 20);
}

// Key event listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (e.key === 'Enter' && gameState === 'start') {
    gameState = 'playing';  // Start the game when "Enter" is pressed
  } else if (e.key === 'Enter' && gameState === 'gameover') {
    restartGame();  // Restart game on Enter after game over
  }
}

function keyUpHandler(e) {
  if (e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (ballX > brick.x && ballX < brick.x + brickWidth &&
            ballY > brick.y && ballY < brick.y + brickHeight) {
          ballDY = -ballDY;
          brick.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            nextLevel();  // Move to the next level when all bricks are cleared
          }
        }
      }
    }
  }
}

// Move to the next level
function nextLevel() {
  if (level < maxLevel) {
    level++;
    resetGameForNextLevel();
  } else {
    alert("Congratulations! You beat all levels!");
    document.location.reload();
  }
}

// Reset game for the next level
function resetGameForNextLevel() {
  ballDX += 1;  // Increase ball speed for next level
  ballDY = -(Math.abs(ballDY) + 1);  // Keep vertical speed negative, increasing difficulty

  paddleWidth -= 10;  // Reduce paddle size

  brickRowCount++;  // Increase the number of rows
  bricks = createBricks(brickRowCount);  // Create new bricks for the next level

  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  paddleX = (canvas.width - paddleWidth) / 2;
  score = 0;
}

// Ball movement and game frame update
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  drawLevel();
  collisionDetection();

  // Ball movement
  if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
    ballDX = -ballDX;
  }
  if (ballY + ballDY < ballRadius) {
    ballDY = -ballDY;
  } else if (ballY + ballDY > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else {
      lives--;  // Decrease lives when ball hits the ground
      if (!lives) {
        gameState = 'gameover';  // Set game state to gameover when lives are lost
        alert("Game Over! Press Enter to restart.");
      } else {
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  ballX += ballDX;
  ballY += ballDY;

  // Paddle movement
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  if (gameState === 'playing') {
    requestAnimationFrame(update);
  }
}

// Function to get different brick colors for each row
function getBrickColor(row) {
  const colors = ['#FF6347', '#FF4500', '#FFD700', '#32CD32', '#4682B4', '#6A5ACD'];
  return colors[row % colors.length];
}

// Display a message to press Enter to start the game
function drawStartScreen() {
  ctx.font = '24px Arial';
  ctx.fillStyle = '#FFF';
  ctx.fillText('Press Enter to Start', canvas.width / 2 - 100, canvas.height / 2);
}

// Start screen logic
function startGame() {
  if (gameState === 'start') {
    drawStartScreen();
    requestAnimationFrame(startGame); // Keep checking until game starts
  } else {
    update(); // Start the game loop
  }
}

startGame(); // Initiate the start screen
