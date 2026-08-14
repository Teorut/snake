// Lägger till en event listener som lyssnar efter knapptryck
document.addEventListener("keydown", keyInput);

// Hämtar canvas-elementet
const canvas = document.getElementById("canvas").getContext("2d");

// Hämtar start/pause-knappen och exit game-knappen
const toggleBtn = document.getElementById("toggleBtn");

// Hämtar elementet för information under spelets gång(nedräkning, vann/förlora)
const gameInfo = document.getElementById("gameInfo");

// Hämtar score div-elementet
const scoreDiv = document.getElementById("scoreDiv");

// Sätter twoPlayer till false
let twoPlayer = false;
let changeSpeed = false;

let cellSize;
let gridWidth;
let gridHeight;

let gameIsOn = false;
let isRunning = false;

let gameInterval;
let speed;
let doMoveBlocks = false;

let selectedLevel;
let selectedSkin;

let snake1 = {
  x: 0,
  y: 0,
  score: 0,
  facing: "right",
  inputs: [],
  body: [],
  isAlive: true
}

let snake2 = {
  x: 0,
  y: 50,
  score: 0,
  facing: "right",
  inputs: [],
  body: [],
  isAlive: true
};

const snakes = [snake1]
const food = [];
const blocks = [];

function drawArray(array, color) {
  // Om skinet är 1(classic) ska objekten inte ta upp hela rutan 
  let border = 0;
  if (selectedSkin == 1) {
    border = 1;
  }

  canvas.fillStyle = color;

  // Ritar ut alla objekt i en array i en viss färg
  for (let i = 0; i < array.length; i++) {
    canvas.fillRect(
      array[i].x + border,
      array[i].y + border,
      cellSize - (border * 2),
      cellSize - (border * 2)
    );
  }
}

function drawSnake(snake, snakeColor) {
  // ritar ormens huvud
  canvas.fillStyle = snakeColor;
  if (selectedSkin == 1) {
    canvas.fillRect(snake.x + 1, snake.y + 1, cellSize - 2, cellSize - 2);
  } else {
    canvas.fillRect(snake.x, snake.y, cellSize, cellSize);
  }
}

function drawGradient(array, start, end) {
  // Ritar ut objekten i en array med en unik färg baserat på index relativt längd
  for (let i = 0; i < array.length; i++) {
    startShare = i / array.length;
    endShare = 1 - startShare;

    red = (start[0] * startShare) + (end[0] * endShare);
    green = (start[1] * startShare) + (end[1] * endShare);
    blue = (start[2] * startShare) + (end[2] * endShare);
  
    canvas.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

    canvas.fillRect(array[i].x, array[i].y, cellSize, cellSize);
  }
}

function drawMultiGradient(array, colors) {
  // Delar upp en array i flera mindre arrays och ritar ut en gradient för alla med olika färger
  for (let i = 0; i < colors.length - 1; i++) {
    const startIndex = Math.ceil(array.length * i / (colors.length - 1))
    const endIndex = Math.ceil(array.length * (i + 1) / (colors.length - 1));
    const toDraw = array.slice(startIndex, endIndex);

    drawGradient(toDraw, colors[i + 1], colors[i])
  }
}

function draw() {
  // om skinet är 1 rita en svart bakgrund
  if (selectedSkin == 1) {
    canvas.fillStyle = "rgb(0,0,0)";
    canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    for (let i = 0; i < snakes.length; i++) {
      // Ritar orm 1
      drawSnake(snakes[i], "rgb(0,128,0)");
      
      // ritar ormens kropp
      drawArray(snakes[i].body, "rgb(0,128,0)");
    }
  } else {
    // Om skinet inte är 1, gör varannan ruta lite mörkare
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if ((x + y) % 2 == 0) {
          canvas.fillStyle = "rgb(0,128,0)";
        } else {
          canvas.fillStyle = "rgb(0,150,0)";
        }
        canvas.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // ritar ut maten
  drawArray(food, "rgb(255,0,0)");

  // ritar ut blocken
  drawArray(blocks, "rgb(152,116,62)");

  for (let i = 0; i < snakes.length; i++) {
    const body = snakes[i].body;

    // Ritar ormen
    if (selectedSkin == 1) {
      // Classic skin
      
      // Ritar ormen
      drawSnake(snakes[i], "rgb(0,128,0)");

      // ritar ormens kropp
      drawArray(body, "rgb(0,128,0)");
    }
    else if (selectedSkin == 2) {
      // Modern

      // Ritar ormen
      drawSnake(snakes[i], "rgb(0,0,250)");

      // ritar ormens kropp
      drawArray(body, "rgb(0,0,255)");
    }
    else if (selectedSkin == 3) {
      // Rainbow

      // Ritar ormen
      drawSnake(snakes[i], "rgb(0,0,255)");

      const colors = [
        [0,0,255],
        [255,0,255],
        [255,0,0],
        [255,255,0],
        [0,255,0],
        [0,255,255],
        [0,0,255]
      ]

      drawMultiGradient(body, colors)
    }
    else if (selectedSkin == 4) {
      // Lila, vit och svart

      // Ritar ormen
      drawSnake(snakes[i], "rgb(150,0,150)");

      // ritar ormens kropp
      drawMultiGradient(body, [[0, 0, 0], [255, 255, 255], [150, 0, 150]]);
      // }
    } else if (selectedSkin == 5) {
      // Röd och svart

      // Ritar ormen
      drawSnake(snakes[i], "rgb(255,0,0)");

      // ritar ormens kropp
      drawGradient(body, [255,0,0], [0,0,0]);
    } else if (selectedSkin == 6) {
      // Italien
      
      drawSnake(snakes[i], "rgb(0,255,0)");

      // ritar ormens kropp
      drawMultiGradient(body, [[255, 0, 0], [255, 255, 255], [0, 255, 0]]);
    } else {
      // Sverige

      // Ritar ormen
      drawSnake(snakes[i], "rgb(0,0,255)");

      // ritar ormens kropp
      drawMultiGradient(body, [[0, 0, 255], [255, 255, 0], [0, 0, 255]]);
    }
  }
}

// gay(affectionate)
// gay (derogatory)

function generateFood() {
  const foodAmount = document.getElementById("foodAmountInput").value;

  generateObjects(food, foodAmount, 40);
}

function generateObjects(array, amount, timerLength) {
  while (array.length < amount) {
    // slumpar fram ett x- och y-värde och sätter timerns längd
    const object = {
      x: Math.floor(Math.random() * gridWidth) * cellSize,
      y: Math.floor(Math.random() * gridHeight) * cellSize,
      timer: timerLength
    }

    let doPush = true;
    // om objektet överlappar med en matbit ska den inte läggas till
    for (let i = 0; i < food.length; i++) {
      if (food[i].x == object.x && food[i].y == object.y) {
        doPush = false;
      }
    }

    // om objektet överlappar med ett block ska den inte läggas till
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].x == object.x && blocks[i].y == object.y) {
        doPush = false;
      }
    }

    // om objektet överlappar med en kroppsdel ska den inte läggas till
    for (let i = 0; i < snake1.body.length; i++) {
      if (snake1.body[i].x == object.x && snake1.body[i].y == object.y) {
        doPush = false;
      }
    }

    // om objektet överlappar med huvudet ska den inte läggas till 
    if (snake1.x == object.x && snake1.y == object.y) {
      doPush = false;
    }

    if (doPush) {
      array.push(object);
    }
  }
}

function killSnake(snake) {
  snake.isAlive = false;
  snake.body.splice(0);
  snake.x = -50;
  snake.y = -50;

  // Om twoPlayer är av eller om båda ormar är döda, avsluta spelet
  if (!(twoPlayer && (snake1.isAlive || snake2.isAlive))) {
    endGame("förlorade");
  }
}

function setScore() {
  // Skriver ut score
  if (!twoPlayer) {
    document.getElementById("score1").innerHTML = "Score: " + snake1.score;
  } else {
    document.getElementById("score1").innerHTML = "Score orm 1: " + snake1.score;
    document.getElementById("score2").innerHTML = "Score orm 2: " + snake2.score;
  }
}

function checkSnakeCollide(snake) {
  if (snake.isAlive) {
    // Förlora spelet om ormen är utanför spelytan
    if (snake.x < 0 || snake.x >= gridWidth * cellSize || snake.y < 0 || snake.y >= gridHeight * cellSize) {
      killSnake(snake);
    } else {
      // Förlora spelet om ormen krockar med sig själv
      for (let i = 0; i < snake.body.length; i++) {
        if (snake.x == snake.body[i].x && snake.y == snake.body[i].y) {
          killSnake(snake);
        }
      }

      // Förlora spelet om kroppen krockar med ett block
      for (let i = 0; i < blocks.length; i++) {
        if (snake.x == blocks[i].x && snake.y == blocks[i].y) {
          killSnake(snake);
        }
      }
    }

    for (let i = 0; i < food.length; i++) {
      // Om ormen kolliderar med en viss matbit ska maten tas bort, score:n ökas och ormen bli längre och ny mat skapas
      if (food[i].x == snake.x && food[i].y == snake.y) {
        food.splice(i, 1);

        snake.score += 1;
        setScore()

        generateFood();

        // Om nivån är 5 ska spelintervallen avbrytas, hastigheten öka och en ny intervall skapas
        if (changeSpeed) {
          clearInterval(gameInterval)

          speed++

          gameInterval = setInterval(update, 1000 / speed);
        }
      }
    }
  }
}

function update() {
  moveSnake(snake1);

  if (twoPlayer) {
    moveSnake(snake2);
  }

  // Flyttar på blocken om nivån är 4
  if (selectedLevel == 4) {
    if (doMoveBlocks) {
      for (let i = 0; i < blocks.length; i++) {
        let moveX = 0;
        let moveY = 0;

        // sätter moveX till +/- en cell beroende på vart ormen är
        if (blocks[i].x - snake1.x > 0) {
          moveX = -1 * cellSize;
        } else if (blocks[i].x - snake1.x < 0) {
          moveX = cellSize;
        }

        // sätter moveY till +/- en cell beroende på vart ormen är
        if (blocks[i].y - snake1.y > 0) {
          moveY = -1 * cellSize;
        } else if (blocks[i].y - snake1.y < 0) {
          moveY = cellSize;
        }

        // Om blocket skulle röra sig in i kroppen ska den inte röra sig i den riktningen
        for (let j = 0; j < snake1.body.length; j++) {
          if (moveX > 0 && blocks[i].x + moveX == snake1.body[j].x && blocks[i].y == snake1.body[j].y) {
            moveX = 0;
          }

          if (moveY > 0 && blocks[i].x == snake1.body[j].x && blocks[i].y + moveY == snake1.body[j].y) {
            moveY = 0;
          }
        }

        // Om blocket skulle röra sig in i ett block ska den inte röra sig i den riktningen
        for (let j = 0; j < blocks.length; j++) {
          if (moveX > 0 && blocks[i].x + moveX == blocks[j].x && blocks[i].y == blocks[j].y) {
            moveX = 0;
          }

          if (moveY > 0 && blocks[i].x == blocks[j].x && blocks[i].y + moveY == blocks[j].y) {
            moveY = 0;
          }
        }

        // Rör blocket i riktningen som är längst ifrån spelaren
        if (Math.abs(blocks[i].x - snake1.x) > Math.abs(blocks[i].y - snake1.y)) {
          blocks[i].x += moveX;
        } else {
          blocks[i].y += moveY;
        }
      }
    }

    // Växla om blocken ska röra sog nästa runda
    doMoveBlocks = !doMoveBlocks;
  }

  // Beräknar antalet upptagna celler
  let occupiedCellsAmount = snake1.body.length + food.length + blocks.length + 1;

  // Vid flera spelare ska andra ormens längd läggas till i upptagna celler
  if (twoPlayer) {
    occupiedCellsAmount += snake2.body.length + 1;
  }

  // Om alla celler är upptagna, vinn
  if (occupiedCellsAmount >= gridHeight * gridWidth) {
    endGame("vann");
  } else {
    // Om spelet inte vunnits, kolla kollision för ormen
    checkSnakeCollide(snake1);

    if (twoPlayer) {
      // Vid flera spelare, kolla kollision för andra ormen
      checkSnakeCollide(snake2);
    }
  }

  for (let i = 0; i < food.length; i++) {
    // Om nivån är nivå 3 ska matens timer gå ner
    if (selectedLevel == 3) {
      food[i].timer--
      // om timern är ute ska maten tas bort och ny mat skapas
      if (food[i].timer <= 0) {
        food.splice(i, 1);

        generateFood();
      }
    }
  }

  draw();
}

function moveSnake(snake) {
  if (snake.isAlive) {
    if (snake.inputs.length > 0) {
      const facingValues = ["left", "up", "right", "down"];
      const firstInput = snake.inputs[0];

      // Kollar om firstinput är samma som motsatsen av ormens riktning(två steg till höger i facingValues)
      if (facingValues.indexOf(firstInput) != (facingValues.indexOf(snake.facing) + 2) % 4) {
        snake.facing = firstInput;
      }

      // Tar bort alla instanser av firstInput i rad
      while (snake.inputs[0] == firstInput) {
        snake.inputs.splice(0, 1);
      }
    }

    // Om kroppen är så lång som den ska vara ska första objektet tas bort
    if (snake.score < snake.body.length) {
      snake.body.splice(0, 1);
    }

    // Lägg till en ny kroppsdel där huvudet är innan huvudet flyttas
    snake.body.push({ x: snake.x, y: snake.y });

    // Flyttar ormen baserat på riktningen
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
}

function toggleRunning() {
  if (isRunning) {
    clearInterval(gameInterval);
    toggleBtn.innerHTML = "Start";
  } else {
    gameInterval = setInterval(update, 1000 / speed)
    toggleBtn.innerHTML = "Pause";
  }

  isRunning = !(isRunning);
}

function keyInput(k) {
  let key = k.keyCode;
  // console.log(key);
  if (gameIsOn) {
    if (isRunning && snake1.inputs.length < 3) {
      // keycode 37 = vänster
      if (key == 37) {
        snake1.inputs.push("left");
        // keycode 38 = upp
      } else if (key == 38) {
        snake1.inputs.push("up");
        // keycode 39 = höger
      } else if (key == 39) {
        snake1.inputs.push("right");
        // keycode 40 = ner
      } else if (key == 40) {
        snake1.inputs.push("down");
      }
    }

    if (isRunning && twoPlayer) {
      if (snake2.inputs.length < 3) {
        // keycode 65 = a
        if (key == 65) {
          snake2.inputs.push("left");
          // keycode 87 = w
        } else if (key == 87) {
          snake2.inputs.push("up");
          // keycode 68 = d
        } else if (key == 68) {
          snake2.inputs.push("right");
          // keycode 83 = s
        } else if (key == 83) {
          snake2.inputs.push("down");
        }
      }

    }

    // keycode 27 = esc
    if (key == 27) {
      toggleRunning();
    }
  }
}

function updateCountdown() {
  gameInfo.innerHTML = parseInt(gameInfo.innerHTML) - 1;
}

function newSnake(offsetY, startingLength) {
  // Skapar en ny orm
  const snake = {
    x: cellSize * 3,
    y: (Math.floor(gridHeight / 2) + offsetY) * cellSize,
    score: 0,
    facing: "right",
    inputs: [],
    body: [],
    isAlive: true
  }

  if (gridWidth < 4 && gridWidth > 1) {
    snake.x = cellSize;
  } else if (gridWidth <= 1) {
    snake.x = 0;
  }

  while (snake.body.length < startingLength) {
    snake.body.push({ x: snake.x - cellSize, y: snake.y });
  }

  return snake;
}

function toggleMenuGame(menu, game) {
  // Växlar menyn och spelet
  document.getElementById("menuDiv").style.display = menu;
  document.getElementById("gameDiv").style.display = game;
}

function toggleGameBtns(doDisable) {
  toggleBtn.disabled = doDisable;
  document.getElementById("exitGameBtn").disabled = doDisable;
}

function startGame() {
  toggleMenuGame("none", "block");

  cellSize = parseInt(document.getElementById("cellSizeInput").value);
  gridWidth = document.getElementById("gridWidthInput").value;
  gridHeight = document.getElementById("gridHeightInput").value;

  canvas.canvas.width = gridWidth * cellSize;
  canvas.canvas.height = gridHeight * cellSize;

  speed = document.getElementById("speedInput").value;

  selectedLevel = document.getElementById("levelSelector").value;
  selectedSkin = document.getElementById("skinSelector").value

  doMoveBlocks = false;

  // Återställer positioner
  let startingLength = document.getElementById("lengthInput").value;

  if (!twoPlayer) {
    // Ska bara en orm ritas har den ingen offset
    snake1 = newSnake(0, startingLength)
  } else {
    // Ska två ormar ritas har de en offset med 1 cell
    snake1 = newSnake(1, startingLength);
    snake2 = newSnake(-1, startingLength);
  }

  snakes.splice(0)

  snakes.push(snake1);

  if (twoPlayer) {
    snakes.push(snake2);
  }

  // Tar bort alla hinder och skapar nya om man är på nivå 2
  blocks.splice(0);
  if (selectedLevel == 2 || selectedLevel == 4) {
    const blockAmount = document.getElementById("blockAmountInput").value;

    generateObjects(blocks, blockAmount, null);
  }

  // Tar bort all mat och skapar ny mat
  food.splice(0);

  generateFood();

  if (!twoPlayer) {
    scoreDiv.style.justifyContent = "center";
  } else {
    scoreDiv.style.justifyContent = "space-between";
  }

  setScore();

  draw();

  toggleGameBtns(true);

  let countdownInterval = setInterval(updateCountdown, 1000);

  setTimeout(function () {
    clearInterval(countdownInterval);

    gameInfo.innerHTML = "";

    gameIsOn = true;

    toggleGameBtns(false);

    toggleRunning();
  }, 3000);

  gameInfo.innerHTML = "3";
}

function endGame(status) {
  if (isRunning) {
    toggleRunning();
  }

  gameIsOn = false;

  // stäng av start/paus-knappen och exit-knappen
  toggleGameBtns(false);

  setTimeout(function () {
    toggleMenuGame("block", "none");

    // Säger till om du vann eller förlorade
    if (!twoPlayer) {
      // Om det bara är en spelare, säg direkt om ormen vann eller förlorade
      if (status == "vann") {
        gameInfo.innerHTML = "Du vann :)";
      } else if (status == "förlorade") {
        gameInfo.innerHTML = "Du förlorade :(";
      }
    } else {
      // Om det är två spelare, säg vilka ormar som överlevde
      if (status == "vann") {
        if (snake1.isAlive && snake2.isAlive) {
          // Om båda ormar överlevde blir det lika
          gameInfo.innerHTML = "Båda överlevde";
        } else if (snake1.isAlive) {
          // Om snake1 överlevde och snake2 inte gjorde det vinner snake1
          gameInfo.innerHTML = "Spelare 1 vann : )";
        } else {
          // Annars vinner snake2
          gameInfo.innerHTML = "Spelare 2 vann : )";
        }
      } else if (status == "förlorade") {
        // Säg till om båda ormarna förlorade
        gameInfo.innerHTML = "Ni förlorade :("
      }
    }
  }, 100);
}

function toggleSettings(menu, btn, settings) {
  // Sätter score, knappar och snake-texten till inparametrarna
  scoreDiv.style.display = menu;
  document.getElementById("startGameBtn").style.display = menu;
  document.getElementById("titleCard").style.display = menu;
  document.getElementById("showSettingsBtn").style.display = menu;
  gameInfo.style.display = menu;

  // Sätter inställningar till inparametrarna
  document.getElementById("hideSettingsBtn").style.display = btn;
  document.getElementById("settingsDiv").style.display = settings;
}

function toggleTwoPlayer() {
  const twoPlayerBtn = document.getElementById("twoPlayerBtn");

  twoPlayer = !twoPlayer;

  if (twoPlayer) {
    twoPlayerBtn.value = "On";
  } else {
    twoPlayerBtn.value = "Off";
  }
}

function toggleChangeSpeed() {
  const changeSpeedBtn = document.getElementById("changeSpeedBtn");

  changeSpeed = !changeSpeed;

  if (changeSpeed) {
    changeSpeedBtn.value = "On";
  } else {
    changeSpeedBtn.value = "Off";
  }
}