let timer = 0;
let button;
canvasSize = [400, 450];
gameSize = [400, 400];
gameOffset = [0, 50];
var gridX = 16;
var gridY = 16;
var sizing = gameSize[0] / gridX; // the amount of pixels per tile
var refresh = 0.25 // in seconds
const snake = [3, 2, 1]; // stores the position of each part of the snake
var apple = 25;
var appleColor = [255, 0, 0];
var snakeColor = [0, 0, 255];
var right = [1, 0]; 
var left = [-1, 0];
var up = [0, -1]; 
var down = [0, 1];
var direction = right // starts as right
var quickDraw = false;
var queue = 0;
var score = 0;
var prevValue;
var gameLoop = true;

function coordinateToPoint(x, y)
{
  return (y * gridX) + x;
}

function pointToCoordinate(i)
{
  if (i == 0)
    {
      return [0, 0];
    }
  else
    {
      var x = i % gridX;
      var y =  (i - x) / gridY;
      return [x, y];
    }
}

function toPixels(x, y = -1)
{
  var px, py;
  if (y != -1)
    {
      px = x * sizing;
      py = y * sizing;
    }
  else
    {
      var fCoords = pointToCoordinate(x);
      px = fCoords[0] * sizing;
      py = fCoords[1] * sizing;
    }
  return [px + gameOffset[0], py + gameOffset[1]];
}

function makeApple()
{
  var going = true
  var newApple;
  while (going)
    {
      going = false;
      newApple = Math.floor(Math.random() * ((gridX * gridY) - 1))
      if (snake.includes(newApple))
        {
          going = true;
        }
    }
  apple = newApple;
}

function addSnake()
{
  if (queue > 0)
    {
      snake[snake.length] = prevValue;
      queue--;
    }
}

function moveSnake()
{
  var pureDirection = coordinateToPoint(direction[0], direction[1]);
  var snakeHead = pointToCoordinate(snake[0]);
  var newSnakeHead = [snakeHead[0]+direction[0], snakeHead[1]+direction[1]];
  prevValue = snake[0];
  if (newSnakeHead[0] >= 0 && newSnakeHead[0] < gridX && newSnakeHead[1] >= 0 && newSnakeHead[1] < gridY && !(snake.includes(snake[0] + pureDirection)))
  {
    // possible, now continue
    if (snake[0] + pureDirection == apple)
      {
        queue++;
        score++;
        makeApple();
        addSnake();
      }
    snake[0] = snake[0] + pureDirection;
    for (let i = 1; i < snake.length; i++)
      {
        var oldValue = snake[i];
        snake[i] = prevValue;
        prevValue = oldValue;
      }
  }
  else
  {
    gameLoop = false;
  }
}

function setup() 
{
  createCanvas(canvasSize[0], canvasSize[1]);
  //noStroke();
}

function mousePressed()
{
  if (mouseX > 0 && mouseX < canvasSize[0] && mouseY > 0 && mouseY < canvasSize[1] && !fullscreen())
    {
      fullscreen(true);
    }
}

function keyPressed()
{
  if (keyCode === ESCAPE && fullscreen())
    {
      fullscreen(false);
    }
  if (keyCode === LEFT_ARROW && direction != right)
  {
    direction = left;
    quickDraw = true;
  }
  if (keyCode === RIGHT_ARROW && direction != left)
  {
    direction = right;
    quickDraw = true;
  }
  if (keyCode === DOWN_ARROW && direction != up)
  {
    direction = down;
    quickDraw = true;
  }
  if (keyCode === UP_ARROW && direction != down)
  {
    direction = up;
    quickDraw = true;
  }
  if (key == ' ' && gameLoop == false)
    {
      snake.length = 0;
      snake[0] = 3; snake[1] = 2; snake[2] = 1;
      score = 0;
      queue = 0;
      makeApple();
      direction = right;
      gameLoop = true;
    }
}

function draw() 
{
  // DRAW GUI
  background(color(0, 255, 150));
  fill(color(255, 255, 255));
  rect(gameOffset[0], gameOffset[1], gameSize[0], gameSize[1]);
  textSize(40); textStyle(ITALIC); textAlign(LEFT);
  var scoreToDisplay = "Score: " + score;
  text(scoreToDisplay, 8, 38);
  // DRAW SNAKE
  for (let i = 0; i < snake.length; i++)
    {
      var pCoords = toPixels(snake[i]);
      px = pCoords[0]; py = pCoords[1]
      fill(color(snakeColor));
      square(px, py, sizing);
    }
  // DRAW APPLE
  appleCoords = toPixels(apple);
  apx = appleCoords[0]; apy = appleCoords[1];
  fill(color(appleColor));
  circle(apx + (sizing / 2), apy + (sizing / 2), sizing)
  // GAME LOOP
  if (gameLoop == true && (millis() >= (refresh * 1000) + timer || quickDraw == true))
    {
      quickDraw = false;

      timer = millis();

      moveSnake();
      addSnake();
    }
  // IF GAME IS OVER
  else if (gameLoop == false)
    {
      squareColor = color(64, 64, 64);
      squareColor.setAlpha(200);
      fill(squareColor);
      square(0, 0, 1000);
      fill(0, 0, 0);
      textSize(32); textStyle(BOLD); textAlign(CENTER);
      var textToDisplay = "Your score was: " + score + "\nPress space to play again.";
      text(textToDisplay, canvasSize[0] * 0.5, canvasSize[1] * 0.5);
      
    }
}
