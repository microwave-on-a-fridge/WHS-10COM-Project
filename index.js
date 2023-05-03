/**
 * Title: 10COM Game Project
 * Author: Koen Hina
 * Date: 26/4/2023
 * Version: 1
 * Description: Vertical shooter game.
 * License: MIT
 **/

console.log("10COM JS Project");

const WIDTH = 600;
const HEIGHT = 800;
const BG_COLOR = "#EFB0FF";
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 36;
const PLAYER_COLOR = "#7FFFD4";
const PLAYER_HIT_COLOR = "#8E17A3";
const ENEMY_WIDTH = 26;
const ENEMY_HEIGHT = 38;
const ENEMY_X_SPEED = 6;
const ENEMY_Y_SPEED = 6;
const ENEMY_COLOR = "#FF2222";
const HARD_ENEMY_WIDTH = 50;
const HARD_ENEMY_HEIGHT = 50;
const HARD_ENEMY_X_SPEED = 3;
const HARD_ENEMY_Y_SPEED = 5;

var ctx;
var level = 0;
var playerXPosition = 30;
var playerYPosition = 30;
var playerColor;
var playerImage = new Image();
playerImage.src = "images/marisa.png";
var enemyArray = [];
var enemyCap = 10;
var enemyImage = new Image();
enemyImage.src = "images/cirno.png";
var hardEnemyArray = [];
var hardEnemyCap = 3;
var hardEnemyImage = new Image();
hardEnemyImage.src = "images/hard.png";

window.onload = startCanvas;

function startCanvas() {
  ctx = document.getElementById("myCanvas").getContext("2d");
  timer = setInterval(updateCanvas, 20);
  timer = setInterval(progression, 5000);
}

function progression() {
  var enemyNumber = 0;
  while (enemyNumber < enemyCap) {
    enemyArray.push(new Enemy(Math.random() * WIDTH));
    enemyNumber++;
  }
  if (level > 20) {
    var hardEnemyNumber;
    while (hardEnemyNumber < hardEnemyCap) {
      hardEnemyArray.push(new HardEnemy(Math.random() * WIDTH));
      hardEnemyNumber++;
    }
  }
  level++;
  enemyCap + 5;
  hardEnemyCap + 1;
  console.log("There are", enemyArray.length, "enemies in the enemyArray");
}

function updateCanvas() {
  //Colours the background
  ctx.font = "30px arial";
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

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

  playerColor = PLAYER_COLOR;

  var hardEnemyNumber = 0;
  while (hardEnemyNumber < hardEnemyArray.length) {
    if (
      playerHit(
        hardEnemyArray[hardEnemyNumber].xPosition,
        hardEnemyArray[hardEnemyNumber].yPosition
      )
    ) {
      playerColor = PLAYER_HIT_COLOR;
      hardEnemyArray[hardEnemyNumber].yPosition = Math.random() * -HEIGHT;
    }
    hardEnemyNumber++;
  }

  var hardEnemyNumber = 0;
  while (hardEnemyNumber < hardEnemyArray.length) {
    //ctx.fillStyle = ENEMY_COLOR;
    ctx.drawImage(
      hardEnemyImage,
      hardEnemyArray[hardEnemyNumber].xPosition,
      hardEnemyArray[hardEnemyNumber].yPosition,
      HARD_ENEMY_WIDTH,
      HARD_ENEMY_HEIGHT
    );
    hardEnemyNumber++;
  }

  ctx.drawImage(
    playerImage,
    playerXPosition,
    playerYPosition,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );
}

class Enemy {
  constructor(x) {
    this.xPosition = Math.random() * -WIDTH;
    this.yPosition = Math.random() * -HEIGHT;
  }
  moveEnemy() {
    this.xPosition += ENEMY_X_SPEED;
    this.yPosition += ENEMY_Y_SPEED;

    if (this.xPosition > WIDTH) {
      this.xPosition = 0;
    }
    if (this.yPosition > HEIGHT) {
      this.yPosition = 0;
    }
  }
}

class HardEnemy {
  constructor(x) {
    this.xPosition = Math.random() * -WIDTH;
    this.yPosition = Math.random() * -HEIGHT;
  }
  moveHardEnemy() {
    this.xPosition += ENEMY_X_SPEED;
    this.yPosition += ENEMY_Y_SPEED;

    if (this.xPosition > WIDTH) {
      this.xPosition = 0;
    }
    if (this.yPosition > HEIGHT) {
      this.yPosition = 0;
    }
  }
}

function playerHit(enemyX, enemyY) {
  var playerHitLeft = playerXPosition + 6;
  var playerHitRight = playerXPosition + PLAYER_WIDTH - 6;
  var playerHitTop = playerYPosition + 6;
  var playerHitBottom = playerYPosition + 6;

  var enemyHitLeft = enemyX;
  var enemyHitRight = enemyX + ENEMY_WIDTH;
  var enemyHitTop = enemyY;
  var enemyHitBottom = enemyY + ENEMY_HEIGHT;

  var playerHitWidth = playerHitRight - playerHitLeft;
  var playerHitHeight = playerHitBottom - playerHitTop;
  var enemyHitWidth = enemyHitRight - enemyHitLeft;
  var enemyHitHeight = enemyHitBottom - enemyHitTop;

  /*
  //DEBUG DEBUG DEBUG
  var keyDown = keyboardEvent.key;
  if (keyDown == "a") {
    console.log("Debug mode enabled!");
    ctx.strokeStyle = "rgb(0,255,0)";
    ctx.strokeRect(
      playerHitLeft,
      playerHitTop,
      playerHitWidth,
      playerHitHeight
    );
    ctx.strokeRect(enemyHitLeft, enemyHitTop, enemyHitWidth, enemyHitHeight);
  }
  */
  if (
    /*
    playerXPosition + PLAYER_WIDTH > enemyX &&
    playerXPosition < enemyX + ENEMY_WIDTH &&
    playerYPosition + PLAYER_HEIGHT > enemyY &&
    playerYPosition < enemyY + ENEMY_HEIGHT
    */
    playerHitRight > enemyHitLeft &&
    playerHitLeft < enemyHitRight &&
    playerHitTop < enemyHitBottom &&
    playerHitBottom > enemyHitTop
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
