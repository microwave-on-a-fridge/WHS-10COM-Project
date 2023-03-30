/**
* Title: 10COM Game Project
* Author: Koen Hina
* Date: 31/3/2023
* Version: 1
**/

const WIDTH = 600;
const HEIGHT = 500;

var ctx;

window.onload = startCanvas;

function startCanvas() {
    // The startCanvas() function sets up the game.
    // This is where all of the once off startup stuff should go

    ctx = document.getElementById("myCanvas").getContext("2d");
    // This timer sets the framerate.
    // 10 means 10 milliseconds between frames (100 frames per second)
    timer = setInterval(updateCanvas, 20);
}

function updateCanvas() {
    // The updateCanvas() function contains the main game loop
    // It is run once every frame. Most of the game code will go here

    // Clear the frame
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    // Task 2b
    // Draw the background
    // The background image is already the correct size, it just needs to be positioned in the top left
    // Uncomment the line below and fix the coordinates
    ctx.drawImage(backgroundImage, 0, 0);
}