class Snake {
  constructor(brain) {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xdir = 0;
    this.ydir = 0;
    this.prev_xdir = 0;
    this.prev_ydir = 0;
    this.len = 0;
    this.score = 0;
    this.fitness = 0;
    this.food = null;
    this.foodLocation();
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(6, 6, 3);
    }
  }

  foodLocation() {
    let x = floor(random(w));
    let y = floor(random(h));
    this.food = createVector(x, y);
  }

  setDir(x, y) {
    this.prev_xdir = this.xdir;
    this.prev_ydir = this.ydir;
    this.xdir = x;
    this.ydir = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xdir;
    head.y += this.ydir;
    this.body.push(head);
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
      return true;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x == x && part.y == y) {
        return true;
      }
    }
    if (
      (this.xdir !== 0 && this.prev_xdir == -this.xdir) ||
      (this.ydir !== 0 && this.prev_ydir == -this.ydir)
    ) {
      return true;
    }
    return false;
  }

  checkMove(x, y) {
    if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
      return 0;
    }
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x == x && part.y == y) {
        return 0;
      }
    }
    return 1;
  }

  eat() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x == this.food.x && y == this.food.y) {
      this.grow();
      return true;
    }
    return false;
  }
  //Display me!
  show(isLongest) {
    if (!isLongest) {
      for (let i = 0; i < this.body.length; i++) {
        fill(255);
        noStroke();
        rect(this.body[i].x, this.body[i].y, 1, 1);
      }
    } else {
      for (let i = 0; i < this.body.length; i++) {
        fill(0, 255, 0);
        noStroke();
        rect(this.body[i].x, this.body[i].y, 1, 1);
      }
    }
    noStroke();
    fill(255, 0, 0);
    rect(this.food.x, this.food.y, 1, 1);
  }

  mutate(rate) {
    this.brain.mutate(rate);
  }

  think() {
    let canMoveForward = 0;
    let canTurnLeft = 0;
    let canTurnRight = 0;
    let isFoodForward = 0;
    let isFoodLeft = 0;
    let isFoodRight = 0;
    let inputs = [];
    if (this.xdir == 1) {
      canMoveForward = this.checkMove(
        this.body[this.body.length - 1].x + 1,
        this.body[this.body.length - 1].y
      );
      canTurnLeft = this.checkMove(
        this.body[this.body.length - 1].x,
        this.body[this.body.length - 1].y - 1
      );
      canTurnRight = this.checkMove(
        this.body[this.body.length - 1].x,
        this.body[this.body.length - 1].y + 1
      );
    } else if (this.xdir == -1) {
      canMoveForward = this.checkMove(
        this.body[this.body.length - 1].x - 1,
        this.body[this.body.length - 1].y
      );
      canTurnLeft = this.checkMove(
        this.body[this.body.length - 1].x,
        this.body[this.body.length - 1].y + 1
      );
      canTurnRight = this.checkMove(
        this.body[this.body.length - 1].x,
        this.body[this.body.length - 1].y - 1
      );
    } else if (this.ydir == 1) {
      canMoveForward = this.checkMove(
        this.body[this.body.length - 1].x,
        this.body[this.body.length - 1].y + 1
      );
      canTurnLeft = this.checkMove(
        this.body[this.body.length - 1].x + 1,
        this.body[this.body.length - 1].y
      );
      canTurnRight = this.checkMove(
        this.body[this.body.length - 1].x - 1,
        this.body[this.body.length - 1].y
      );
    } else {
      canMoveForward = this.checkMove(
        this.body[this.body.length - 1].x,
        this.body[this.body.length - 1].y - 1
      );
      canTurnLeft = this.checkMove(
        this.body[this.body.length - 1].x - 1,
        this.body[this.body.length - 1].y
      );
      canTurnRight = this.checkMove(
        this.body[this.body.length - 1].x + 1,
        this.body[this.body.length - 1].y
      );
    }

    if (this.xdir == 1) {
      if (this.body[this.body.length - 1].x < this.food.x) isFoodForward = 1;
      if (this.food.y < this.body[this.body.length - 1].y) isFoodLeft = 1;
      else isFoodRight = 1;
    } else if (this.xdir == -1) {
      if (this.body[this.body.length - 1].x > this.food.x) isFoodForward = 1;
      if (this.food.y > this.body[this.body.length - 1].y) isFoodLeft = 1;
      else isFoodRight = 1;
    } else if (this.ydir == 1) {
      if (this.body[this.body.length - 1].y < this.food.y) isFoodForward = 1;
      if (this.food.x > this.body[this.body.length - 1].x) isFoodLeft = 1;
      else isFoodRight = 1;
    } else {
      if (this.body[this.body.length - 1].y > this.food.y) isFoodForward = 1;
      if (this.food.x < this.body[this.body.length - 1].x) isFoodLeft = 1;
      else isFoodRight = 1;
    }

    inputs[0] = canMoveForward;
    inputs[1] = canTurnLeft;
    inputs[2] = canTurnRight;
    inputs[3] = isFoodForward;
    inputs[4] = isFoodLeft;
    inputs[5] = isFoodRight;
    let output = this.brain.predict(inputs);
    if (this.xdir == 1) {
      if ((output[0] > output[1]) && (output[0] > output[2])) {
        this.setDir(0, -1);
      }
      if ((output[1] > output[0]) && (output[1] > output[2])) {
        this.setDir(0, 1);
      }
    } else if (this.xdir == -1) {
      if ((output[0] > output[1]) && (output[0] > output[2])) {
        this.setDir(0, 1);
      }
      if ((output[1] > output[0]) && (output[1] > output[2])) {
        this.setDir(0, -1);
      }
    } else if (this.ydir == 1) {
      if ((output[0] > output[1]) && (output[0] > output[2])) {
        this.setDir(1, 0);
      }
      if ((output[1] > output[0]) && (output[1] > output[2])) {
        this.setDir(-1, 0);
      }
    } else {
      if ((output[0] > output[1]) && (output[0] > output[2])) {
        this.setDir(-1, 0);
      }
      if ((output[1] > output[0]) && (output[1] > output[2])) {
        this.setDir(1, 0);
      }
    }
  }
}
