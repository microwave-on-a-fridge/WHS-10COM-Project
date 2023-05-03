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
/*
const ENEMY_X_SPAWNING = [0, WIDTH];
const ENEMY_X_SPAWNING_RNG =
  ENEMY_X_SPAWNING[Math.floor(Math.random() * ENEMY_X_SPAWNING.length)];
const ENEMY_Y_SPAWNING = [0, HEIGHT];
const ENEMY_Y_SPAWNING_RNG =
  ENEMY_Y_SPAWNING[Math.floor(Math.random() * ENEMY_Y_SPAWNING.length)];
*/

var ctx;
var level = 1;
var playerXPosition = 30;
var playerYPosition = 30;
var playerColor;
var playerImage = new Image();
playerImage.src = "images/marisa.png";
var enemyArray = [];
var enemyCap = 20;
var enemyImage = new Image();
enemyImage.src = "images/cirno.png";

window.onload = startCanvas;

function startCanvas() {
  ctx = document.getElementById("myCanvas").getContext("2d");
  timer = setInterval(updateCanvas, 20);

  var enemyNumber = 0;
  while (enemyNumber < enemyCap) {
    enemyArray.push(new Enemy(Math.random() * WIDTH));
    enemyNumber++;
  }
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

  playerColor = PLAYER_COLOR;

  var enemyNumber = 0;
  while (enemyNumber < enemyArray.length) {
    if (
      playerHit(
        enemyArray[enemyNumber].xPosition,
        enemyArray[enemyNumber].yPosition
      )
    ) {
      playerColor = PLAYER_HIT_COLOR;
      enemyArray[enemyNumber].yPosition = Math.random() * -HEIGHT;
    }
    enemyNumber++;
  }

  var enemyNumber = 0;
  while (enemyNumber < enemyArray.length) {
    //ctx.fillStyle = ENEMY_COLOR;
    ctx.drawImage(
      enemyImage,
      enemyArray[enemyNumber].xPosition,
      enemyArray[enemyNumber].yPosition,
      ENEMY_WIDTH,
      ENEMY_HEIGHT
    );
    enemyNumber++;
  }

  /*
  ctx.fillStyle = playerColor;
  ctx.fillRect(playerXPosition, playerYPosition, PLAYER_WIDTH, PLAYER_HEIGHT);
  */

  ctx.drawImage(
    playerImage,
    playerXPosition,
    playerYPosition,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );
}

class Enemy {
  /// Note that the name of the class starts with a capital letter, like the Math object. This is a convention that makes it easier to read the code.
  /* 
	The Rain class contains everything to do with rain. This includes:
		stuff about the rain - it's variables (or properties)
		and what the rain does - it's functions (or methods)
	*/
  constructor(x) {
    /* 
		All classes MUST have a constructor.
		The constructor sets up the properties. Each one starts with "this." That tells JavaScript that it is a variable inside this object.
		All variables to do with this object that are not CONST need to be defined here.
		*/
    this.xPosition = Math.random() * -WIDTH;
    // Task 8a
    // The rain looks terrible!
    // The drops should start at random heights
    // Change the line below that sets the yPosition
    // Make them appear at a random position above the canvas
    // A y position between 0 and -HEIGHT (negative y is above the canvas)
    this.yPosition = Math.random() * -HEIGHT;
  }
  moveEnemy() {
    // Move the rain - Change it's position
    this.xPosition += ENEMY_X_SPEED;
    this.yPosition += ENEMY_Y_SPEED;

    // When rain it's the bottom, restart at the top
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

setInterval(progression, 2000);
function progression() {
  level++;
}
