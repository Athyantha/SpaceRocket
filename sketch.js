let ground;
let rocketPlayer,space;
var rocketPlayer_img;
var bg_img;
var asteroid1_img
var asteroid2_img
var asteroid3_img
var resetImg, reset
var missile_img,missile, collide, frameNum
var obstaclesGroup
var lives = 3
var score = 0
var gameState = "PLAY"
var  leftEdge, rightEdge, bottomEdge

function preload()
{
  rocketPlayer_img = loadImage("rocketPlayer.png");
  bg_img = loadImage("space.jpg");
  asteroid1_img = loadImage("asteroid1.png")
  asteroid2_img = loadImage("asteroid2.png")
  asteroid3_img = loadImage("asteroid3.png")
  missile_img = loadImage("missile.png")
  collisionImg = loadImage("collision.png")
  resetImg = loadImage("resetbtn.png")
  pointSound = loadSound("point.mp3")
  collisionSound = loadSound("error.mp3")
  gameOverSound = loadSound("gameover.mp3")

}

function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(80);
  space = createSprite(windowWidth/2,windowHeight/2)
  space.addImage(bg_img)
  rocketPlayer = createSprite(windowWidth/4,windowHeight-150,30,30);
  rocketPlayer.addImage(rocketPlayer_img);
  rocketPlayer.scale = 0.5;
  bottomEdge = createSprite(windowWidth/2,windowHeight,windowWidth,1)
  obstaclesGroup = createGroup()
  missileGroup = createGroup()
  frameNum = 200
  reset = createSprite(windowWidth/2,windowHeight/2+50)
  reset.addImage(resetImg)
  reset.scale = 0.3
  reset.visible = false
  rectMode(CENTER);
  textSize(15);
}

function draw() 
{
  background(51);
  if (gameState=="PLAY"){
    //lives=3
    reset.visible = false
    space.velocityY = 4
    space.visible = true
    rocketPlayer.visible = true
    rocketPlayer.debug = true
    rocketPlayer.setCollider("circle",0,0,180)
    //var collide = obstaclesGroup.isTouching(rocketPlayer)
    //rocketPlayer.bounceOff(leftEdge)
    //rocketPlayer.bounceOff(rightEdge)
    rocketPlayer.collide(bottomEdge)
    if (frameCount % 1000&&frameNum>60){
      frameNum-=10
    }
    if (space.y>2000){
      space.y = 100
    }
    if (keyDown(RIGHT_ARROW)&&(rocketPlayer.position.x>-50&&rocketPlayer.position.x<windowWidth)){
      rocketPlayer.position.x+=10
    }
    if (keyDown(LEFT_ARROW)&&(rocketPlayer.position.x>-50&&rocketPlayer.position.x<windowWidth)){
      rocketPlayer.position.x-=10
    }
    if (keyDown("space")){
      shoot()
    }
    if (obstaclesGroup.isTouching(missileGroup)){
      obstaclesGroup[0].destroy()
      missileGroup[0].destroy()
      score += 5 
      stopCollisionSound()
      pointSound.play()
    }
    if (obstaclesGroup.isTouching(rocketPlayer)){
      lives -= 1
      //rocketPlayer.collide(obstaclesGroup)
      posx = obstaclesGroup[0].position.x
      posy = obstaclesGroup[0].position.y
      //rocketPlayer.position.x = posx+10
      obstaclesGroup[0].destroy()
      var bang = createSprite(posx,posy,20,20)
      bang.addImage(collisionImg)
      bang.scale = 0.5
      bang.velocityY = 4
      rocketPlayer.velocityX = 0
      rocketPlayer.velocityY = 0
      stopPointSound()
      collisionSound.play()
      setTimeout(function(){bang.remove()},1500)
    }
    spawnObstacles()
    if(lives===0){
      gameState = "END"
    }
  }
  else/*if (gameState === "END")*/{
    space.velocityY=0
    obstaclesGroup.destroyEach()
    space.visible = false
    rocketPlayer.visible = false
    reset.visible = true
    textSize(70)
    fill("orange")
    text("GAME OVER", windowWidth/2,windowHeight/2)
    stopCollisionSound()
    stopPointSound()
    lives = 0
    score = 0
    if (mousePressedOver(reset)){
      lives = 3
      gameState = "PLAY"
    }
  }
  drawSprites();
  textSize(30)
  fill("orange")
  text("Score: "+score,50,100)
  text("Lives: "+lives,50,50)
}

function spawnObstacles(){
  if (frameCount %frameNum == 0 && gameState === "PLAY"){
    var obstacle = createSprite(random(0,windowWidth),10,20,20)
    obstacle.velocityY=4
    obstacle.debug = true
    var rand = Math.round(random(1,3))
    switch(rand){
      case 1: obstacle.addImage(asteroid1_img);
              obstacle.scale = 0.3;
              obstacle.velocityX = 3
              break;
      case 2: obstacle.addImage(asteroid2_img);
              obstacle.scale = 0.2;
              //obstacle.velocityX = random
              break;
      case 3: obstacle.addImage(asteroid3_img);
              obstacle.scale = 0.3;
              obstacle.velocityX = -3
              break;
      default: break;

    }
    obstaclesGroup.add(obstacle)
  }
}
function shoot(){
  missile = createSprite(rocketPlayer.position.x,rocketPlayer.position.y,20,20)
  missile.addImage(missile_img)
  missile.velocityY = -12
  missile.scale = 0.1
  missileGroup.add(missile)
}
function stopCollisionSound(){
  if (collisionSound.isPlaying()){
    collisionSound.stop()
  }
}
function stopPointSound(){
  if (pointSound.isPlaying()){
    pointSound.stop()
  }
}
