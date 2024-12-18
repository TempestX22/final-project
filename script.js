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
const bgm = new Audio('sfx/Jeremy Blake - Powerup.mp3');
let canShoot = false;

let t = 0;
let balls = [];
let enemies = [];
let score = 0;
let lives = 3;
let boss;
let enemyimg;
let playerimg;
let starimg;
let bulletimg;
let canvas1;

let startButton;
let restartButton;

//preload things
function preload ()
{
  //boss = loadModel("objects/tree.obj");
  enemyimg = loadImage("images/enemy.png");
  playerimg = loadImage("images/player.png");
  starimg = loadImage("images/star.png");
  bulletimg = loadImage("images/bullet.png");

}

function setup() {
  canvas1.remove();
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
  bgm.play();

  // Create the canvas
  createCanvas(windowWidth, windowHeight - 65);
  rectMode(CENTER);
  textSize(30);

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
  background(0, 0, 0);

  //draw stars
  // push();
  // tint(255, 255, 255, 128);
  // for (let y = 0; y < 20; y++) {
  //   for (let i = 0; i < 80; i++) {
  //     image(starimg,(i*200), y*200, 10, 10);
  //   }
  // }
  // noTint();
  // pop();

  // Draw the player as an image
  image(playerimg, mouseX - 50, height - 100, 100, 100); // Adjusted size and position

  // Update and draw the balls
  for (let ball of balls) {
    ball.y -= 20;
    image(bulletimg,ball.x, ball.y, 20,20);
  }

  // Push enemies down towards the player and draw them as images
  for (let enemy of enemies) {
    //speed of enemies
    enemy.y += 1;
    image(enemyimg, enemy.x, enemy.y, 40, 40); // Draw the enemy image

    if (enemy.y > height) {
      enemies.splice(enemies.indexOf(enemy), 1);
      lives -= 1;
    }
  }

  // Collision detection between enemies and balls
  for (let enemy of enemies) {
    for (let ball of balls) {
      if (dist(enemy.x + 20, enemy.y + 20, ball.x, ball.y) < 20) { // Adjusted for image center
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
  fill(255);
  textFont('Courier New');
  text("Score: " + score, 20, 80);
  text("Lives: " + lives, 20, 40);
}
// Create restart button when the game is over
function createRestartButton() {
  // Only create a new restart button if it doesn't already exist
  if (!restartButton) {
  canShoot = false;
  bgm.pause();
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
