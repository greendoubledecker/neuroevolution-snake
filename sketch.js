//Recommended learning time: 2-10 generations 
let snakes = [];
let savedSnakes = [];
let rez = 10;
let w;
let h;
const TOTAL_SNAKES = 1000;
let genNumber = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  w = floor(width / rez);
  h = floor(height / rez);
  for (let i = 0; i < TOTAL_SNAKES; i++) {
    snakes[i] = new Snake();
  }
}

function keyPressed() {
  let current;
  let longest = snakes[0];
  if (key === "s") {
    for (let snake of snakes) {
      current = snake;
      if(current.body.length > longest.body.length){
        longest = current;
      }
    }
    saveJSON(longest.brain, "snake.json");
  } else if(key === "K"){
    for (let i = snakes.length - 1; i >= 0; i--){
      savedSnakes.push(snakes[i]);
      snakes.splice(i, 1);
    }
  } 
}

function draw() {
  scale(rez);
  background(225);
  let current;
  for (let i = snakes.length - 1; i >= 0; i--) {
    current = snakes[i];

    if (current.eat()) {
      current.foodLocation();
    }
    current.think();
    current.update();
    current.show();
    fill(0);
    textSize(10);
    textAlign(CENTER);
    text("generation " + genNumber, w - 30, 10);

    if (current.endGame()) {
      savedSnakes.push(current);
      snakes.splice(i, 1);
      console.log(current.body.length);
    }
  }

  if (snakes.length === 0) {
    nextGeneration();
  }
}
