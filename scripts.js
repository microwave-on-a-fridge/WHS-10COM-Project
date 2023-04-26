/**
* Title: 10COM Game Project
* Author: Koen Hina
* Date: 26/4/2023
* Version: 1
* Description: Vertical shooter game.
* License: MIT
**/

const WIDTH = 600;
const HEIGHT = 800;
const PLAYERHEIGHT = 5;
const PLAYERWIDTH = 5;
const PLAYERCOLOR = "#7FFFD4";
const ENEMYWIDTH = 10;
const ENEMYHEIGHT = 10;
const ENEMY_X_SPEED = 10;
const ENEMY_Y_SPEED = 10;
const ENEMYCOLOR = "Red";
var ctx;
var playerXPosition = 30;
var playerYPosition = 30;
window.onload = startCanvas;

function startCanvas() {

    ctx = document.getElementById("myCanvas").getContext("2d");
    timer = setInterval(updateCanvas, 20);
}

function updateCanvas() {
    ctx.fillStyle = "#EFB0FF";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
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

function collisionDetected() {
  if (
    playerXPosition + PLAYERWIDTH >= enemyXPosition &&
    playerXPosition <= enemyXPosition + OBSTACLEWIDTH &&
    playerYPosition + PLAYERHEIGHT >= enemyYPosition &&
    playerYPosition <= enemyYPosition + OBSTACLEHEIGHT
  ) {
    return true;
  } else {
    return false;
  }
}

window.addEventListener("mousemove", mouseMovedFunction);

function mouseMovedFunction(mouseEvent) {
  // Set the umbrella  position to the mouse position
  playerXPosition = mouseEvent.offsetX;
  playerYPosition = mouseEvent.offsetY;
}