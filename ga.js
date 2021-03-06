function nextGeneration() {
  console.log('next generation');
  calculateFitness();
  let r = random(TOTAL_SNAKES - 100, TOTAL_SNAKES + 100); 
  for (let i = 0; i < r; i++) {
    snakes[i] = pickOne();
  }
  savedSnakes = [];
  genNumber++;
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r -= savedSnakes[index].fitness;
    index++;
  }
  index--;
  let snake = savedSnakes[index];
  let child = new Snake(snake.brain);
  child.mutate(0.1);
  return child;
}

function calculateFitness() {
  let sum = 0;
  for (let snake of savedSnakes) {
    sum += snake.body.length;
  }
  for (let snake of savedSnakes) {
    snake.fitness = snake.body.length / sum;
  }
}
