// 
// const redarrow = document.getElementById('red-arrow');
// const greenarrow = document.getElementById('green-arrow');
// const audio = new Audio('sfx/dream__univ_lyon3.wav');

// // Set red arrow's background image dynamically
// redarrow.style.backgroundImage = "url('images/redarrow.png')";

// start.addEventListener('click', () => {
//   audio.play(); // Play the sound

//   // Hide the start button after 1 second and change the background
//   setTimeout(() => {
//     start.style.display = 'none';
//     // document.body.classList.add('new-background');
//   }, 1000);
// });
const startsfx = new Audio('sfx/start_sfx.wav');
const losesfx = new Audio('sfx/lose_sfx.wav');
const buttonsfx = new Audio('sfx/mellau__button-click-3.wav');
const lasersfx = new Audio('sfx/laser_sfx.wav');
const winsfx = new Audio('sfx/win_sfx.wav');
let canShoot = false;

let t = 0;
let balls = [];
let enemies = [];
let score = 0;
let lives = 3;

let startButton;
let restartButton;

function setup() {
  // Create the start button and place it in the middle
  createCanvas(windowWidth, windowHeight - 75);
  rectMode(CENTER);
  textSize(30);

  // Create and Give the mouse a position
  startButton = createButton('Start');
  startButton.position(windowWidth / 2, windowHeight / 2);

  // Customize button appearance
  startButton.style('background-color', '#007BFF');  // Set background color
  startButton.style('color', 'white');  // Set text color
  startButton.style('padding', '10px 20px');  // Set padding
  startButton.style('border-radius', '5px');  // Set rounded corners
  startButton.style('font-size', '18px');  // Set font size
  
  // Call start function when the start button is pressed
  startButton.mousePressed(start);
}

function start() {
  // Hide the start button
  startButton.style('display', 'none');
  startsfx.play();
  // Initialize game state
  score = 0;
  lives = 3;
  balls = [];
  enemies = [];
  canShoot = true;
  // Spawn enemies at the start
  for (let i = 0; i < 5; i++) {
    let enemy = {
      x: random(0, width),
      y: random(height - 800, 0),
    };
    enemies.push(enemy);
  }
}

function draw() {
  background(0,0,0);
  push();
  fill(255,255,255,50);
  circle(200,200, 20);
  pop();

  //createShinyBackground();
  
  // Draw the player
  fill(200, 100, 0);
  rect(mouseX, height - 50, 100, 30);
  fill(0, 100, 200);
  rect(mouseX, height - 70, 50, 30);

  // Update and draw the balls
  for (let ball of balls) {
    fill(0, 0, 200);
    ball.y -= 20;
    circle(ball.x, ball.y, 10);
  }

  // Push enemies down towards the player
  for (let enemy of enemies) {
    fill(200, 0, 0);
    enemy.y += 2;
    rect(enemy.x, enemy.y, 20);
    if (enemy.y > height) {
      enemies.splice(enemies.indexOf(enemy), 1);
      lives -= 1;
    }
  }

  // Collision detection between enemies and balls
  for (let enemy of enemies) {
    for (let ball of balls) {
      if (dist(enemy.x, enemy.y, ball.x, ball.y) < 20) {
        enemies.splice(enemies.indexOf(enemy), 1);
        balls.splice(balls.indexOf(ball), 1);
        
        // Spawn a new enemy
        let newEnemy = {
          x: random(0, width),
          y: random(height - 800, 0),
        };
        enemies.push(newEnemy);
        score += 1;
      }
    }
  }

  // Check if lives are less than 1 (game over)
  if (lives < 1) {
    noLoop(); // Stop the game loop
    createRestartButton(); // Show the restart button
    losesfx.play();
  }

  // Check if score reaches a random value (win condition)
  if (score >= random(10, 20)) {
  restartButton = createButton('Restart');
  restartButton.position(windowWidth / 2 - 60, windowHeight / 2 + 50);

  // Customize button appearance
  restartButton.style('background-color', '#007BFF');  // Set background color
  restartButton.style('color', 'white');  // Set text color
  restartButton.style('padding', '10px 20px');  // Set padding
  restartButton.style('border-radius', '5px');  // Set rounded corners
  restartButton.style('font-size', '18px');  // Set font size
  restartButton.mousePressed(restart);
  winsfx.play();
  noLoop(); // Stop the game loop
  }

  // Display score and lives
  fill(0);
  text("Score: " + score, 20, 80);
  text("Lives: " + lives, 20, 40);
}

function createShinyBackground() {
  noStroke();
  background (0,0,0);
  let gradientColor = color(255, 255, 255, 50); // Semi-transparent white for shine

  for (let y = 0; y < height; y++) {
    let brightness = map(
      sin((y + shinyEffectOffset) * 0.02),
      -1,
      1,
      0,
      100
    ); // Wavy shine
    let col = lerpColor(color(0, 0, 0), gradientColor, brightness / 100);
    stroke(col);
    line(0, y, width, y);
  }

  // Move the shiny effect
  shinyEffectOffset += 2;
}
// Create restart button when the game is over
function createRestartButton() {
  // Only create a new restart button if it doesn't already exist
  if (!restartButton) {
  canShoot = false;
  restartButton = createButton('Restart');
  restartButton.position(windowWidth / 2 - 60, windowHeight / 2 + 50);

    // Customize button appearance
  restartButton.style('background-color', '#007BFF');  // Set background color
  restartButton.style('color', 'white');  // Set text color
  restartButton.style('padding', '10px 20px');  // Set padding
  restartButton.style('border-radius', '5px');  // Set rounded corners
  restartButton.style('font-size', '18px');  // Set font size
  restartButton.mousePressed(restart);
  buttonsfx.play();
  }
}

// Restart the game
function restart() {
  // Hide the restart button and restart the game
  restartButton.style('display', 'none');


  setTimeout(() => {
    location.reload();
  }, 500);
}

// Spawns a ball every time the mouse is pressed
function mousePressed() {
  if (canShoot) {
    lasersfx.play();

    // Spawn a ball
    let ball = {
      x: mouseX,
      y: height - 100,
    };
    balls.push(ball);

    // Temporarily disable shooting
    canShoot = false;

    // Re-enable shooting after 500ms
    setTimeout(() => {
      canShoot = true;
    }, 500);
  }
}

// Resize the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
