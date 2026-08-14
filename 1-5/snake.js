// Lägger till en event listener som lyssnar efter knapptryck
document.addEventListener("keydown", keyInput);

// Hämtar canvas-elementet
const canvas = document.getElementById("canvas").getContext("2d");

// Hämtar score div-elementet
const scoreDiv = document.getElementById("scoreDiv");

// Hämtar alla input-element 
const foodAmountInput = document.getElementById("foodAmountInput");
const gridWidthInput = document.getElementById("gridWidthInput");
const gridHeightInput = document.getElementById("gridHeightInput");
const speedInput = document.getElementById("speedInput");
const lengthInput = document.getElementById("lengthInput");

const cellSize = 50;
let startingX = 400;
let startingY = 200;

let isRunning = false;
let gameInterval;

// Sätter värdet på ett input element till ett visst värde om den inte har något
function setDefaultValue(element, value) {
  if (element.value == "") {
    element.value = value;
  }
}

setDefaultValue(foodAmountInput, 2);
setDefaultValue(gridWidthInput, 17);
setDefaultValue(gridHeightInput, 9);
setDefaultValue(speedInput, 5);
setDefaultValue(lengthInput, 1);

let foodAmount;
let gridWidth;
let gridHeight;
let speed;
let startingLength;

let canvasWidth;
let canvasHeight;

const snake = {};
const body = []
const food = [];
const inputs = [];

function draw() {
  // gör varannan ruta lite mörkare
  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if ((x+y) % 2 == 0) {
        canvas.fillStyle = "rgb(255,255,255)";
      } else {
        canvas.fillStyle = "rgb(230,230,230)";
      }
      canvas.fillRect(x * cellSize,y * cellSize, cellSize, cellSize);
    }
  }

  // ritar ut maten
  canvas.fillStyle = "rgb(255,0,0)";
  for (let i = 0; i < food.length; i++) {
    canvas.fillRect(food[i].x,food[i].y, cellSize, cellSize);
  };

  // ritar ormens huvud
  canvas.fillStyle = "rgb(0,0,0)";
  canvas.fillRect(snake.x,snake.y, cellSize, cellSize);

  // ritar ormens kropp
  canvas.fillStyle = "rgb(50,50,50)";
  for (let i = 0; i < body.length; i++) {
    canvas.fillRect(body[i].x,body[i].y, cellSize, cellSize);
  };
}

function generateFood() {
  while (food.length < foodAmount) {
    // slumpar fram ett x- och y-värde på maten
    const object = {
      x: Math.floor(Math.random() * gridWidth) * cellSize,
      y: Math.floor(Math.random() * gridHeight) * cellSize
    }

    let doPush = true;
    // om maten överlappar med en annan matbit ska den inte läggas till
    for (let i = 0; i < food.length; i++) {
      if (food[i].x == object.x && food[i].y == object.y) {
        doPush = false;
      }
    }
    // om maten överlappar med en kroppsdel ska den inte läggas till
    for (let i = 0; i < body.length; i++) {
      if (body[i].x == object.x && body[i].y == object.y) {
        doPush = false;
      }
    }    
    // om maten överlappar med huvudet ska den inte läggas till 
    if (snake.x == object.x && snake.y == object.y) {
      doPush = false;
    }

    if (doPush) {
      food.push(object);
    }
  }
}

function resetPositions() {
  // Sätter ormens värden till startvärden
  snake.x = startingX;
  snake.y = startingY;
  snake.facing = "up";
  snake.score = 0;

  // tar bort alla kroppsdelar och skapar startkroppsdelen
  body.splice(0);
  for (let i = 3; i > 0; i--) {
    body.push({x: startingX, y: startingY + (cellSize * i)});
  }

  // Tar bort all mat och skapar ny mat
  food.splice(0);
  generateFood();
}

function newGame() {
  canvas.clearRect(0,0,canvasWidth,canvasHeight);

  if (isRunning) {
    toggleGame();
  }

  foodAmount = foodAmountInput.value;

  gridWidth = gridWidthInput.value; 

  canvasWidth = gridWidth * cellSize;
  canvas.canvas.width = canvasWidth;
  startingX = Math.floor(gridWidth / 2) * 50;

  gridHeight = gridHeightInput.value;
  canvasHeight = gridHeight * cellSize;
  startingXY = Math.floor(gridHeight / 2) * 50;

  canvas.canvas.height = canvasHeight;

  speed = speedInput.value;

  startingLength = lengthInput.value

  // Återstller positioner
  resetPositions();

  scoreDiv.innerHTML = "Score: " + snake.score;

  draw();
}

function restart(status) {
  // Säger till om du vann eller förlorade
  alert("Du " + status);
  
  newGame()
}

function update() {
  if (inputs.length > 0) {
    const facingValues = ["left", "up", "right", "down"];
    const firstInput = inputs[0];
    
    // Kollar om firstinput är samma som motsatsen av ormens riktning(två steg till höger i facingValues)
    if (facingValues.indexOf(firstInput) != (facingValues.indexOf(snake.facing) + 2) % 4) {
      snake.facing = firstInput;
    }
  
  // Tar bort alla instanser av firstInput i rad
  while (inputs[0] == firstInput) {
    inputs.splice(0,1);
  }
  }

  move()

  if (body.length + foodAmount >= gridHeight * gridWidth) {
    restart("vann");
  }

  if (snake.x < 0 || snake.x >= canvasWidth || snake.y < 0 || snake.y >= canvasHeight) {
    restart("förlorade");
  } else {
    for (let i = 0; i < body.length; i++) {
      if (snake.x == body[i].x && snake.y == body[i].y){
        restart("förlorade");
      }
    }
  }

  for (let i = 0; i < food.length; i++) {
    if (food[i].x == snake.x && food[i].y == snake.y) {
      food.splice(i,1);
      snake.score += 1;

      scoreDiv.innerHTML = "Score: " + snake.score;

      body.push(body[body.length - 1]);
    }
  }

  generateFood();
}

function move() {
  if (isRunning) {
    body.splice(0,1);
    body.push({x: snake.x, y: snake.y});

    if (snake.facing == "left") {
      snake.x -= cellSize;
    }
    else if (snake.facing == "up") {
      snake.y -= cellSize;
    }
    else if (snake.facing == "right") {
      snake.x += cellSize;
    }
    else if (snake.facing == "down") {
      snake.y += cellSize;
    }
  }

  draw();
}

function toggleGame() {
  if (isRunning) {
    clearInterval(gameInterval);
    document.getElementById("toggleBtn").innerHTML = "Start";
  } else {
    gameInterval = setInterval(update, 1000/speed)
    document.getElementById("toggleBtn").innerHTML = "Pause";
  }

  isRunning = !(isRunning);
}

function keyInput(k) {
  let key = k.keyCode;
  // console.log(key);
  // keycode 37 = a
  if (key == 37) {
    inputs.push("left");
  // keycode 38 = w
  } else if (key == 38) {
    inputs.push("up");
  // keycode 39 = d
  } else if (key == 39) {
    inputs.push("right");
  // keycode 40 = s
  } else if (key == 40) {
    inputs.push("down");
  // keycode 82 = r
  } else if (key == 82) {
    toggleGame();
  }
}


newGame();