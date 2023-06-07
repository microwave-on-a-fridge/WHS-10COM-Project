/**
 * Title: 10COM Game Project
 * Author: Koen Hina
 * Date: 11/5/2023
 * Version: 1 (Initial version)
 * Description: Vertical shooter game.
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

var ctx;
var level = 0;
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
hardEnemyImage.src = "images/hard.png";
var hardEnemySpeed = 3;

window.onload = startCanvas;

function startCanvas() {
  ctx = document.getElementById("myCanvas").getContext("2d");
  timer = setInterval(updateCanvas, 20);
  timer = setInterval(progression, 5000);
}

//Controls progression with difficulty increasing with each level
function progression() {
  var enemyNumber = 0;
  while (enemyNumber < enemyCap) {
    enemyArray.push(new Enemy(Math.random() * WIDTH));
    enemyNumber++;
  }
  //At level 5 a new enemy type is made
  if (level > 5) {
    var hardEnemyNumber = 0;
    while (hardEnemyNumber < hardEnemyCap) {
      hardEnemyArray.push(new HardEnemy(Math.random() * WIDTH));
      hardEnemyNumber++;
    }
    hardEnemyCap + 1;
  }
  level++;
  enemyCap + 5;
  enemySpeed + 1;
  console.log("There are", enemyArray.length, "enemies in the enemyArray");
  console.log(
    "There are",
    hardEnemyArray.length,
    "enemies in the hardEnemyArray"
  );
  console.log("The current enemy speed is", enemySpeed);
}

function updateCanvas() {
  //Colours the background
  ctx.font = "30px arial";
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  //Controls the level display
  ctx.fillStyle = "#000000";
  ctx.fillText("Level " + level, 0, 25);

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

  var enemyNumber = 0;
  while (enemyNumber < enemyArray.length) {
    if (
      playerHit(
        enemyArray[enemyNumber].xPosition,
        enemyArray[enemyNumber].yPosition
      )
    ) {
      //player colour hit
      enemyArray[enemyNumber].yPosition = Math.random() * -HEIGHT;
    }
    enemyNumber++;
  }

  var hardEnemyNumber = 0;
  while (hardEnemyNumber < hardEnemyArray.length) {
    if (
      playerHit(
        hardEnemyArray[hardEnemyNumber].xPosition,
        hardEnemyArray[hardEnemyNumber].yPosition
      )
    ) {
      //player colour hit
      hardEnemyArray[hardEnemyNumber].yPosition = Math.random() * -HEIGHT;
    }
    hardEnemyNumber++;
  }

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
  //Draws the player
  ctx.drawImage(
    playerImage,
    playerXPosition,
    playerYPosition,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );
}

//Controls ordinary enemies
class Enemy {
  constructor(x) {
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
  constructor(x) {
    this.xPosition = Math.random() * -WIDTH;
    this.yPosition = Math.random() * -HEIGHT;
  }
  moveHardEnemy() {
    this.xPosition += hardEnemySpeed;
    this.yPosition += hardEnemySpeed;

    if (this.xPosition > WIDTH) {
      this.xPosition = 0;
    }
    if (this.yPosition > HEIGHT) {
      this.yPosition = 0;
    }
  }
}

function playerHit(enemyX, enemyY, hardEnemyX, hardEnemyY) {
  var playerHitLeft = playerXPosition + 6;
  var playerHitRight = playerXPosition + PLAYER_WIDTH - 6;
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

  //Pretty sure this block of code doesn't do anything unless debug mode is enabled
  var playerHitWidth = playerHitRight - playerHitLeft;
  var playerHitHeight = playerHitBottom - playerHitTop;
  var enemyHitWidth = enemyHitRight - enemyHitLeft;
  var enemyHitHeight = enemyHitBottom - enemyHitTop;
  var hardEnemyHitWidth = hardEnemyHitRight - hardEnemyHitLeft;
  var hardEnemyHitHeight = hardEnemyHitBottom - hardEnemyHitTop;

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

window.addEventListener("mousemove", mouseMovedFunction);

function mouseMovedFunction(mouseEvent) {
  playerXPosition = mouseEvent.offsetX;
  playerYPosition = mouseEvent.offsetY;
}
