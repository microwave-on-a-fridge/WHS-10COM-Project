/**
 * Title: 10COM Game Project
 * Author: Koen Hina
 * Date: 23/06/2023
 * Version: idek at this point, probably pre0.600 or some shit
 * Description: Survival highscore game.
 * License: MIT
 **/

//This whole project is held together with glue and sellotape
console.log("10COM JS Project");

const WIDTH = 600;
const HEIGHT = 800;
const BG_COLOR = "#efb0ff";
const PLAYER_WIDTH = 24;
const PLAYER_HEIGHT = 36;
const ENEMY_WIDTH = 31;
const ENEMY_HEIGHT = 29;
const HARD_ENEMY_WIDTH = 50;
const HARD_ENEMY_HEIGHT = 50;
const HEART_WIDTH = 27;
const HEART_HEIGHT = 28;
const HIT_SPRITE_WIDTH = 73;
const HIT_SPRITE_HEIGHT = 60;

var c;
var ctx;
var debugMode = false;
var level = 0;
var score = 0;
var highScore = localStorage.getItem("topscore"); //This checks the locally saved information for what the previously saved high score is
var dead = false;
var invincible = false;
var highContrast = false;
//This is an array full of different background images that will be randomly chosen and then rendered as the background image for each playthrough. The images were made with this tool I found on itch.io by Deep-Fold, very cool tool! https://deep-fold.itch.io/space-background-generator
var bgImages = [
  "images/bg/01.png",
  "images/bg/02.png",
  "images/bg/03.png",
  "images/bg/04.png",
  "images/bg/05.png",
  "images/bg/06.png",
  "images/bg/07.png",
  "images/bg/08.png",
  "images/bg/09.png",
  "images/bg/10.png",
  "images/bg/11.png",
  "images/bg/12.png",
  "images/bg/13.png",
  "images/bg/14.png",
];
var bgRandomizer = Math.floor(Math.random() * bgImages.length);
var bgImage = new Image();
bgImage.src = (bgRandomizer, bgImages[bgRandomizer]);
var playerXPosition = 288;
var playerYPosition = 381;
var playerColor;
//Sprite created by SNK and ripped by Gussprint on The Spriters Resource. Source: https://www.spriters-resource.com/neo_geo_ngcd/ms3/sheet/11346/
var playerImage = new Image();
playerImage.src = "images/player.png";
//Sprite created by SNK and ripped by Gussprint on The Spriters Resource. Source: https://www.spriters-resource.com/neo_geo_ngcd/ms3/sheet/11305/
var playerHitImage = new Image();
playerHitImage.src = "images/hit.png";
var enemyArray = [];
var enemyCap = 10;
//Sprite created by SNK and ripped by MagmaDragoon on The Spriters Resource. Source: https://www.spriters-resource.com/neo_geo_ngcd/ms3/sheet/46508/
var enemyImage = new Image();
enemyImage.src = "images/enemy.png";
var enemySpeed = 6;
var hardEnemyArray = [];
var hardEnemyCap = 3;
//Sprite created by SNK and ripped by c2000mc/futaokuu on The Spriters Resource. Source: https://www.spriters-resource.com/neo_geo_ngcd/ms3/sheet/36253/
var hardEnemyImage = new Image();
hardEnemyImage.src = "images/hard.png";
var hardEnemySpeed = 3;
var heart = 0;
var heartArray = [];
//Sprite created by SNK and ripped by MagmaDragoon on The Spriters Resource. Source: https://www.spriters-resource.com/neo_geo_ngcd/ms3/sheet/39080/
var heartImage = new Image();
heartImage.src = "images/gas.png";
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
  if (debugMode) {
    highScore = document.getElementById("setScore").value;
    if (highScore >= highScore) {
      localStorage.setItem("topscore", highScore);
    }
  }
  //Ends the updateCanvas() function and calls a function to display a death message if dead = true
  if (dead) {
    death();
    return;
  }

  //Draws the background image if high contrast mode is disabled (default)
  if (!highContrast) {
    ctx.drawImage(bgImage, 0, 0, WIDTH, HEIGHT);
  } else {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  //Controls the level display
  ctx.font = "30px arial";
  ctx.textAlign = "start";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Level " + level, 0, 25);
  ctx.fillText(heart + " extra gas tanks", 0, 55);
  ctx.textAlign = "center";
  if (level <= 2) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Move your character by", 300, 600);
    ctx.fillText("moving the mouse. Try", 300, 630);
    ctx.fillText("your best not to get hit!", 300, 660);
    ctx.fillText("Collect gas tanks to stay", 300, 690);
    ctx.fillText("alive for longer!", 300, 720);
  }

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
      if (!invincible) {
        if (heart <= 0) {
          dead = true;
        } else {
          enemyArray[enemyNumber].yPosition = Math.random() * -HEIGHT;
          heart--;
          //Gives the player temporary invincibility by making the player invincible, then waiting one second and calling a function to make the player no longer invincible
          invincible = true;
          setTimeout(iFramesTimer, 1000);
        }
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
      if (!invincible) {
        if (heart <= 0) {
          dead = true;
        } else {
          hardEnemyArray[hardEnemyNumber].yPosition = Math.random() * -HEIGHT;
          heart--;
          invincible = true;
          setTimeout(iFramesTimer, 1000);
        }
      }
    }
    hardEnemyNumber++;
  }

  //Controls what happens when you collide with a heart
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

  //Draws heart objects
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
  if (!invincible) {
    ctx.drawImage(
      playerImage,
      playerXPosition,
      playerYPosition,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    );
  }

  //Draws a hit sprite when the player is invincible after being hit by an enemy
  if (invincible) {
    ctx.drawImage(
      playerHitImage,
      playerXPosition,
      playerYPosition,
      HIT_SPRITE_WIDTH,
      HIT_SPRITE_HEIGHT
    );
  }
  //Adds to the total score when you die (each frame that you were alive for is 1 point)
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
  //Hitbox stuff (IT IS AN INTENTIONAL GAMEPLAY DECISION TO MAKE THE PLAYER HITBOX MUCH SMALLER THAN THE PLAYER SPRITE!!!)
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

  var playerHitWidth = playerHitRight - playerHitLeft;
  var playerHitHeight = playerHitBottom - playerHitTop;
  var enemyHitWidth = enemyHitRight - enemyHitLeft;
  var enemyHitHeight = enemyHitBottom - enemyHitTop;
  var hardEnemyHitWidth = hardEnemyHitRight - hardEnemyHitLeft;
  var hardEnemyHitHeight = hardEnemyHitBottom - hardEnemyHitTop;
  var heartHitWidth = heartHitRight - heartHitLeft;
  var heartHitHeight = heartHitBottom - heartHitTop;

  //DEBUG DEBUG DEBUG
  if (debugMode) {
    ctx.strokeStyle = "rgb(0,255,0)";
    ctx.strokeRect(
      playerHitLeft,
      playerHitTop,
      playerHitWidth,
      playerHitHeight
    );
    ctx.strokeRect(enemyHitLeft, enemyHitTop, enemyHitWidth, enemyHitHeight);
    ctx.strokeRect(
      hardEnemyHitLeft,
      hardEnemyHitTop,
      hardEnemyHitWidth,
      hardEnemyHitHeight
    );
    ctx.font = "15px arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("X pos = " + playerXPosition, 400, 25);
    ctx.fillText("Y pos = " + playerYPosition, 400, 40);
  }
  //If the player isn't currently invincible, do collision
  if (!invincible) {
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
}

//Player to heart collision
function heartCollide(heartX, heartY) {
  if (heartSpawn == 4) {
    var playerHitLeft = playerXPosition;
    var playerHitRight = playerXPosition + PLAYER_WIDTH;
    var playerHitTop = playerYPosition;
    var playerHitBottom = playerYPosition;

    var heartHitLeft = heartX - 10;
    var heartHitRight = heartX + HEART_WIDTH + 10;
    var heartHitTop = heartY - 10;
    var heartHitBottom = heartY + HEART_HEIGHT + 10;

    var heartHitWidth = heartHitRight - heartHitLeft;
    var heartHitHeight = heartHitBottom - heartHitTop;
    if (debugMode) {
      ctx.strokeStyle = "rgb(0,255,0)";
      ctx.strokeRect(heartHitLeft, heartHitTop, heartHitWidth, heartHitHeight);
    }

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

function death() {
  //This block of code displays a death screen when the player gets hit and doesn't have any extra lives
  c.style.cursor = "default";
  if (!highContrast) {
    ctx.drawImage(bgImage, 0, 0, WIDTH, HEIGHT);
  } else {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  ctx.font = "30px arial";
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.fillText("You died!", 300, 300);
  ctx.fillText("Score: " + score, 300, 350);
  ctx.fillText("Highscore: " + highScore, 300, 380);
  ctx.strokeStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.roundRect(200, 550, 200, 100, 20);
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "#000000";
  ctx.fillText("Click to retry", 300, 610);
  //Changes the cursor to a pointer cursor (improves the experience as it makes the player know that the Retry button is clickable)
  if (
    playerXPosition >= 200 &&
    playerXPosition <= 400 &&
    playerYPosition >= 550 &&
    playerYPosition <= 650
  ) {
    c.style.cursor = "pointer";
  }
  //If the score from that playthrough was higher than the highscore, that new score will be locally saved as the new highscore, and will display a message congratulating the player on their accomplishment
  if (score >= highScore) {
    highScore = score;
    localStorage.setItem("topscore", highScore);
    console.log("New highscore set");
    ctx.font = "30px arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText("New Highscore!", 300, 410);
  }
}

//Reloads the page when the user clicks on the Retry button on the death screen
function reset() {
  if (dead) {
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
}

//Some debug dipswitches, such as manually resetting the high score and granting the player invincibility
function dipswitches(dipswitch) {
  if (debugMode) {
    if ((dipswitch = score)) {
      score = 0;
      highScore = 0;
      localStorage.setItem("topscore", highScore);
    }
    if ((dipswitch = life)) {
      invincible = true;
    }
  }
}

//Controls whether debug mode is enabled or not
function debug() {
  debugMode = true;
  //Displays debug elements on the HTML page
  var doc = document.getElementById("debug");
  if (doc.style.display === "none") {
    doc.style.display = "block";
  } else {
    doc.style.display = "none";
  }
}

function iFramesTimer() {
  invincible = false;
}

function contrast() {
  if (!highContrast) {
    highContrast = true;
  } else {
    highContrast = false;
  }
}
