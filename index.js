/**
 * Title: 10COM Game Project
 * Author: Koen Hina
 * Date: 9/6/2023
 * Version: 7.1
 * Description: Survival game.
 * License: MIT
 **/

console.log("10COM JS Project");

const WIDTH = 600;
const HEIGHT = 800;
const BG_COLOR = "#EFB0FF";
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 36;
const ENEMY_WIDTH = 26;
const ENEMY_HEIGHT = 38;
const ENEMY_COLOR = "#FF2222";
const HARD_ENEMY_WIDTH = 50;
const HARD_ENEMY_HEIGHT = 50;
const HEART_WIDTH = 22;
const HEART_HEIGHT = 20;

var c;
var ctx;
var debugMode = false;
var level = 0;
var score = 0;
//This checks the saved information for what the previously saved high score is
var highScore = localStorage.getItem("topscore");
var dead = false;
var playerXPosition = 288;
var playerYPosition = 381;
var playerColor;
var playerImage = new Image();
playerImage.src = "images/marisa.png";
var enemyArray = [];
var enemyCap = 10;
var enemyImage = new Image();
enemyImage.src = "images/cirno.png";
var enemySpeed = 6;
var hardEnemyArray = [];
var hardEnemyCap = 3;
var hardEnemyImage = new Image();
hardEnemyImage.src = "images/test.png";
var hardEnemySpeed = 3;
var heart = 0;
var heartArray = [];
var heartImage = new Image();
heartImage.src = "images/heart.png";
var heartXSpeed = 3;
var heartYSpeed = 3;
var heartSpawn;

window.onload = startCanvas;

function startCanvas() {
  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");
  timer = setInterval(updateCanvas, 20);
  progression();
  timer = setInterval(progression, 5000);
  c.addEventListener("mousemove", mouseMovedFunction);
  c.addEventListener("click", reset);
  c.style.cursor = "none";
}

//Controls progression with difficulty increasing with each level
function progression() {
  heartSpawn = Math.ceil(Math.random() * 4);
  console.log("Heart spawn value: " + heartSpawn);
  var enemyNumber = 0;
  while (enemyNumber < enemyCap) {
    enemyArray.push(new Enemy(Math.random() * WIDTH));
    enemyNumber++;
  }
  console.log("here 1");
  //At level 5 a new enemy type is made
  if (level >= 5) {
    var hardEnemyNumber = 0;
    while (hardEnemyNumber < hardEnemyCap) {
      hardEnemyArray.push(new HardEnemy(Math.random() * WIDTH));
      hardEnemyNumber++;
    }
    hardEnemyCap + 1;
  }

  if (heartSpawn == 4) {
    heartArray.push(new Heart(Math.random() * WIDTH));
  }

  level++;
  enemyCap + 1;
  enemySpeed + 1;
  console.log("There are", enemyArray.length, "enemies in the enemyArray");
  console.log(
    "There are",
    hardEnemyArray.length,
    "enemies in the hardEnemyArray"
  );
  console.log("Heart array length: " + heartArray.length);
  console.log("The current enemy speed is", enemySpeed);
}

function updateCanvas() {
  //Ends the updateCanvas() function and calls a function to display a death message if dead = true
  if (dead) {
    death();
    return;
  }

  //Colours the background
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  //Controls the level display
  ctx.font = "30px arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Level " + level, 0, 25);
  ctx.fillText(heart + " extra lives", 0, 55);

  //Controls the border to stop the player from being able to move out of the playfield to avoid being hit by the enemies
  if (playerXPosition > WIDTH - PLAYER_WIDTH) {
    playerXPosition = WIDTH - PLAYER_WIDTH;
  }
  if (playerYPosition > HEIGHT - PLAYER_HEIGHT) {
    playerYPosition = HEIGHT - PLAYER_HEIGHT;
  }
  if (playerXPosition < 0) {
    playerXPosition = 0;
  }
  if (playerYPosition < 0) {
    playerYPosition = 0;
  }

  var enemyNumber = 0;
  while (enemyNumber < enemyArray.length) {
    enemyArray[enemyNumber].moveEnemy();
    enemyNumber++;
  }

  var hardEnemyNumber = 0;
  while (hardEnemyNumber < hardEnemyArray.length) {
    hardEnemyArray[hardEnemyNumber].moveHardEnemy();
    hardEnemyNumber++;
  }

  var heartNumber = 0;
  while (heartNumber < heartArray.length) {
    heartArray[heartNumber].moveHeart();
    heartNumber++;
  }

  //Controls what happens if you get hit by a standard enemy
  var enemyNumber = 0;
  while (enemyNumber < enemyArray.length) {
    if (
      playerHit(
        enemyArray[enemyNumber].xPosition,
        enemyArray[enemyNumber].yPosition
      )
    ) {
      if (heart <= 0) {
        dead = true;
      } else {
        enemyArray[enemyNumber].yPosition = Math.random() * -HEIGHT;
        heart--;
      }
    }
    enemyNumber++;
  }

  //Controls what happens if you get hit by a hard enemy
  var hardEnemyNumber = 0;
  while (hardEnemyNumber < hardEnemyArray.length) {
    if (
      playerHit(
        hardEnemyArray[hardEnemyNumber].xPosition,
        hardEnemyArray[hardEnemyNumber].yPosition
      )
    ) {
      if (heart <= 0) {
        dead = true;
      } else {
        hardEnemyArray[hardEnemyNumber].yPosition = Math.random() * -HEIGHT;
        heart--;
      }
    }
    hardEnemyNumber++;
  }

  //Trying to get this shit to work is making me want to kill myself
  var heartNumber = 0;
  while (heartNumber < heartArray.length) {
    if (
      heartCollide(
        heartArray[heartNumber].xPosition,
        heartArray[heartNumber].yPosition
      ) &&
      heartSpawn == 4
    ) {
      heart++;
      heartArray.splice(heartNumber, 1);
    }
    heartNumber++;
  }

  //Draws standard enemies
  var enemyNumber = 0;
  while (enemyNumber < enemyArray.length) {
    ctx.drawImage(
      enemyImage,
      enemyArray[enemyNumber].xPosition,
      enemyArray[enemyNumber].yPosition,
      ENEMY_WIDTH,
      ENEMY_HEIGHT
    );
    enemyNumber++;
  }

  //Draws harder, larger enemies
  var hardEnemyNumber = 0;
  while (hardEnemyNumber < hardEnemyArray.length) {
    ctx.drawImage(
      hardEnemyImage,
      hardEnemyArray[hardEnemyNumber].xPosition,
      hardEnemyArray[hardEnemyNumber].yPosition,
      HARD_ENEMY_WIDTH,
      HARD_ENEMY_HEIGHT
    );
    hardEnemyNumber++;
  }

  //I can't even remember what this was meant to do 😭
  var heartNumber = 0;
  while (heartNumber < heartArray.length) {
    ctx.drawImage(
      heartImage,
      heartArray[heartNumber].xPosition,
      heartArray[heartNumber].yPosition,
      HEART_WIDTH,
      HEART_HEIGHT
    );
    heartNumber++;
  }

  //Draws the player
  ctx.drawImage(
    playerImage,
    playerXPosition,
    playerYPosition,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );

  //Adds to the total score when you die (each frame that you were alive for = 1 point)
  score++;
}

//Controls ordinary enemies
class Enemy {
  constructor() {
    this.xPosition = Math.random() * -WIDTH;
    this.yPosition = Math.random() * -HEIGHT;
  }
  moveEnemy() {
    this.xPosition += enemySpeed;
    this.yPosition += enemySpeed;

    if (this.xPosition > WIDTH) {
      this.xPosition = 0;
    }
    if (this.yPosition > HEIGHT) {
      this.yPosition = 0;
    }
  }
}

//Controls big enemies
class HardEnemy {
  constructor() {
    this.xPosition = Math.random() * -WIDTH;
    this.yPosition = Math.random() * -HEIGHT;
  }
  moveHardEnemy() {
    this.xPosition -= hardEnemySpeed;
    this.yPosition -= hardEnemySpeed;

    if (this.xPosition < 0 - HARD_ENEMY_WIDTH) {
      this.xPosition = WIDTH;
    }
    if (this.yPosition < 0 - HARD_ENEMY_HEIGHT) {
      this.yPosition = HEIGHT;
    }
  }
}

//Spawns hearts that give you an extra life when collected
class Heart {
  constructor() {
    this.xPosition = Math.random() * WIDTH;
    this.yPosition = Math.random() * HEIGHT;
  }
  moveHeart() {
    this.xPosition += heartXSpeed;
    this.yPosition += heartYSpeed;

    if (this.xPosition < 0 || this.xPosition + HEART_WIDTH > WIDTH) {
      heartXSpeed = -heartXSpeed;
    }
    if (this.yPosition < 0 || this.yPosition + HEART_HEIGHT > HEIGHT) {
      heartYSpeed = -heartYSpeed;
    }
  }
}

function playerHit(enemyX, enemyY, hardEnemyX, hardEnemyY, heartX, heartY) {
  //Hitbox stuff
  var playerHitLeft = playerXPosition + 6;
  var playerHitRight = playerXPosition + PLAYER_WIDTH - 12;
  var playerHitTop = playerYPosition + 6;
  var playerHitBottom = playerYPosition + 6;

  var enemyHitLeft = enemyX;
  var enemyHitRight = enemyX + ENEMY_WIDTH;
  var enemyHitTop = enemyY;
  var enemyHitBottom = enemyY + ENEMY_HEIGHT;

  var hardEnemyHitLeft = hardEnemyX;
  var hardEnemyHitRight = hardEnemyX + HARD_ENEMY_WIDTH;
  var hardEnemyHitTop = hardEnemyY;
  var hardEnemyHitBottom = hardEnemyY + HARD_ENEMY_HEIGHT;

  var heartHitLeft = heartX;
  var heartHitRight = heartX + HEART_WIDTH;
  var heartHitTop = heartY;
  var heartHitBottom = heartY + HEART_HEIGHT;

  //Pretty sure this block of code doesn't do anything unless debug mode is enabled
  var playerHitWidth = playerHitRight - playerHitLeft;
  var playerHitHeight = playerHitBottom - playerHitTop;
  var enemyHitWidth = enemyHitRight - enemyHitLeft;
  var enemyHitHeight = enemyHitBottom - enemyHitTop;
  var hardEnemyHitWidth = hardEnemyHitRight - hardEnemyHitLeft;
  var hardEnemyHitHeight = hardEnemyHitBottom - hardEnemyHitTop;
  var heartHitWidth = heartHitRight - heartHitLeft;
  var heartHitHeight = heartHitBottom - heartHitTop;

  //DEBUG DEBUG DEBUG
  /*
  console.log("Debug mode enabled!");
  ctx.strokeStyle = "rgb(0,255,0)";
  ctx.strokeRect(playerHitLeft, playerHitTop, playerHitWidth, playerHitHeight);
  ctx.strokeRect(enemyHitLeft, enemyHitTop, enemyHitWidth, enemyHitHeight);
  ctx.strokeRect(
    hardEnemyHitLeft,
    hardEnemyHitTop,
    hardEnemyHitWidth,
    hardEnemyHitHeight
  );
  ctx.strokeRect(heartHitLeft, heartHitTop, heartHitWidth, heartHitHeight);
  ctx.font = "15px arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("X pos = " + playerXPosition, 400, 25);
  ctx.fillText("Y pos = " + playerYPosition, 400, 40);
  */

  if (
    playerHitRight > enemyHitLeft &&
    playerHitLeft < enemyHitRight &&
    playerHitTop < enemyHitBottom &&
    playerHitBottom > enemyHitTop
  ) {
    return true;
  } else if (
    playerHitRight > hardEnemyHitLeft &&
    playerHitLeft < hardEnemyHitRight &&
    playerHitTop < hardEnemyHitBottom &&
    playerHitBottom > hardEnemyHitTop
  ) {
    return true;
  } else {
    return false;
  }
}

function heartCollide(heartX, heartY) {
  if (heartSpawn == 4) {
    var playerHitLeft = playerXPosition;
    var playerHitRight = playerXPosition + PLAYER_WIDTH;
    var playerHitTop = playerYPosition;
    var playerHitBottom = playerYPosition;

    var heartHitLeft = heartX - 5;
    var heartHitRight = heartX + HEART_WIDTH + 5;
    var heartHitTop = heartY - 5;
    var heartHitBottom = heartY + HEART_HEIGHT + 5;

    var heartHitWidth = heartHitRight - heartHitLeft;
    var heartHitHeight = heartHitBottom - heartHitTop;
    //console.log("Debug mode enabled!");
    //ctx.strokeStyle = "rgb(0,255,0)";
    //ctx.strokeRect(heartHitLeft, heartHitTop, heartHitWidth, heartHitHeight);

    if (
      playerHitRight > heartHitLeft &&
      playerHitLeft < heartHitRight &&
      playerHitTop < heartHitBottom &&
      playerHitBottom > heartHitTop
    ) {
      return true;
    } else {
      return false;
    }
  }
}

//Code to make the player follow the mouse position

function mouseMovedFunction(mouseEvent) {
  playerXPosition = mouseEvent.offsetX;
  playerYPosition = mouseEvent.offsetY;
}

// This block of code displays a death screen when the player gets hit and doesn't have any extra lifes
function death() {
  c.style.cursor = "default";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.font = "30px arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("You died!", 220, 300);
  ctx.fillText("Score: " + score, 220, 350);
  ctx.fillText("Highscore: " + highScore, 220, 380);
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.roundRect(200, 550, 200, 100, 20);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Click to retry", 220, 610);
  if (
    playerXPosition >= 200 &&
    playerXPosition <= 400 &&
    playerYPosition >= 550 &&
    playerYPosition <= 650
  ) {
    c.style.cursor = "pointer";
  }
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("topscore", highScore);
  }
  if (debugMode) {
    if (playerXPosition >= 575 && playerYPosition >= 775) {
      highScore = 0;
      localStorage.setItem("topscore", highScore);
    }
  }
}
function reset() {
  if (
    playerXPosition >= 200 &&
    playerXPosition <= 400 &&
    playerYPosition >= 550 &&
    playerYPosition <= 650
  ) {
    console.log("reset");
    location.reload();
  }
}
