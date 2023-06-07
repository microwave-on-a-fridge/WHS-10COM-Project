/**
* Title: 10COM Game Project
* Author: Koen Hina
* Date: 31/3/2023
* Version: 1
**/

const WIDTH = 600;
const HEIGHT = 800;
const RECWIDTH = WIDTH
const RECHEIGHT = 50;
var recXPosition = 0;
var recYPosition = 650;
var ctx;
window.onload = startCanvas;

function startCanvas() {

    ctx = document.getElementById("myCanvas").getContext("2d");
    timer = setInterval(updateCanvas, 20);
}

function updateCanvas() {
  ctx.fillStyle = "#EFB0FF";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#7FFFD4";
  ctx.fillRect(
    recXPosition,
    recYPosition,
    RECWIDTH,
    RECHEIGHT
  );

  ctx.fillStyle = "blue";
  ctx.fillRect(playerXPosition, playerYPosition, PLAYERWIDTH, PLAYERHEIGHT);
}

function collisionDetected() {
  if (
    playerXPosition + PLAYERWIDTH >= obstacleXPosition &&
    playerXPosition <= obstacleXPosition + OBSTACLEWIDTH &&
    playerYPosition + PLAYERHEIGHT >= obstacleYPosition &&
    playerYPosition <= obstacleYPosition + OBSTACLEHEIGHT
  ) {
    return true;
  } else {
    return false;
  }
}