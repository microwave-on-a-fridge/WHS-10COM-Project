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
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_COLOR = "#7FFFD4";
const PLAYER_HIT_COLOR = "#8E17A3";
const ENEMY_WIDTH = 20;
const ENEMY_HEIGHT = 20;
const ENEMY_Y_SPEED = 4;
const ENEMY_COLOR = "#FF2222";

var ctx;
var playerXPosition = 30;
var playerYPosition = 30;
var playerColor;
var enemyArray = [];

window.onload = startCanvas;

function startCanvas() {
  ctx = document.getElementById("myCanvas").getContext("2d");
  timer = setInterval(updateCanvas, 20);

  var enemyNumber = 0;
  while (enemyNumber < 200) {
    enemyArray.push(new Enemy(Math.random() * WIDTH));
    enemyNumber++;
  }
  console.log("There are", enemyArray.length, "enemies in the enemyArray");
}

function updateCanvas() {
  //Colours the background
  ctx.fillStyle = "BG_COLOR";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

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
    ctx.fillStyle = ENEMY_COLOR;
    ctx.fillRect(
      enemyArray[enemyNumber].xPosition,
      enemyArray[enemyNumber].yPosition,
      ENEMY_WIDTH,
      ENEMY_HEIGHT
    );
    enemyNumber++;
  }

  ctx.fillStyle = playerColor;
  ctx.fillRect(playerXPosition, playerYPosition, PLAYER_WIDTH, PLAYER_HEIGHT);
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
    this.xPosition = x;
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
    this.yPosition += ENEMY_Y_SPEED;

    // When rain it's the bottom, restart at the top
    if (this.yPosition > HEIGHT) {
      this.yPosition = 0; // There is a problem here. This line means the rain flickers in at the top of the canvas. See if you can fix it.
    }
  }
}

function playerHit(enemyX, enemyY) {
  if (
    playerXPosition + PLAYER_WIDTH > enemyX &&
    playerXPosition < enemyX + ENEMY_WIDTH &&
    playerYPosition + PLAYER_HEIGHT > enemyY &&
    playerYPosition < enemyY + ENEMY_HEIGHT
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
