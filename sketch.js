//Learning time: 2-5 generations
let snakes = [];
let savedSnakes = [];
let rez = 10;
let w;
let h;
const TOTAL_SNAKES = 1000;
let genNumber = 1;
let frameRateSlider;
let longest;
let longestEver;
//Whether you only show the longest
let state = false;

function setup() {
  createCanvas(windowWidth, windowHeight - 30);
  frameRateSlider = createSlider(1, 24, 24, 1);
  w = floor(width / rez);
  h = floor(height / rez);
  for (let i = 0; i < TOTAL_SNAKES; i++) {
    snakes[i] = new Snake();
  }
  longest = snakes[0];
  longestEver = snakes[0];
  //fullscreen();
}

function keyPressed() {
  let current;
  if (key === "s") {
    saveJSON(longest.brain, "snake.json");
  } else if (key === "K") {
    for (let i = snakes.length - 1; i >= 0; i--) {
      savedSnakes.push(snakes[i]);
      snakes.splice(i, 1);
    }
  } else if (key === "l") {
    state = !state;
  }
}

function draw() {
  scale(rez);
  background(0);
  frameRate(frameRateSlider.value());
  let current;
  for (let snake of snakes) {
    if (snake.body.length > longest.body.length) {
      longest = snake;
    }
  }
  for (let i = snakes.length - 1; i >= 0; i--) {
    current = snakes[i];

    if (current.eat()) {
      current.foodLocation();
    }
    current.think();
    current.update();
    if (!state) {
      current.show(false);
    }
    fill(255);
    textSize(8);
    textAlign(CENTER);
    text("generation " + genNumber, w - 30, 10);
    if (current.endGame()) {
      savedSnakes.push(current);
      snakes.splice(i, 1);
      console.log(current.body.length);
      longest = snakes[0];
    }
    if (current === longest) {
      current.show(true);
    }
  }
  if (snakes.length === 0) {
    nextGeneration();
    longest = snakes[0];
  }
  if (longest.body.length > longestEver.body.length) {
    longestEver = longest;
  }
  fill(255);
  text("high score:" + longestEver.body.length, 30, 10);
  text("longest of the generation:" + longest.body.length, w / 2, h - 10);
}
