let center;
let particles = [];
let radius = 10;

class Particle {
  constructor(prePosition, angle, radius, index) {
    this.prePosition = prePosition;
    this.angle = radians(angle);
    this.radius = radius;
    this.center = createVector(windowWidth / 2, windowHeight / 2);
    this.position = this.calcPosition();
    this.tempPosition = createVector(this.prePosition.x, this.prePosition.y);
    this.lerpCounter = 0;
    this.lerpStep = 0.2;

    // Randomized but smooth color
    colorMode(HSB, 360, 100, 100, 1);
    this.hue = random(150, 200) + index * 0.3;
    this.saturation = random(50, 80);
    this.brightness = map(index, 0, 600, 50, 100);

    // transparency with depth
    this.alpha = map(index, 0, 600, 1, 0.2);
  }

  calcPosition() {
    let x = this.center.x + this.radius * sin(this.angle);
    let y = this.center.y + this.radius * cos(this.angle);
    return createVector(x, y);
  }

  draw() {
    colorMode(HSB, 360, 100, 100, 1);
    stroke(this.hue % 360, this.saturation, this.brightness, this.alpha);
    // depth thickness
    strokeWeight(map(this.radius, 0, 400, 0.8, 3));
    noFill();

    if (abs(this.tempPosition.x - this.position.x) > 0.001) {
      this.tempPosition.x = lerp(
        this.prePosition.x,
        this.position.x,
        this.lerpCounter
      );
      this.tempPosition.y = lerp(
        this.prePosition.y,
        this.position.y,
        this.lerpCounter
      );

      ellipse(
        this.tempPosition.x,
        this.tempPosition.y,
        this.radius * 0.6,
        this.radius * 0.6
      );

      this.lerpCounter += this.lerpStep;
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  center = createVector(windowWidth / 2, windowHeight / 2);
  // glowing effect
  blendMode(ADD);
  background(0);
  let loopnum = random(200, 300);

  for (let i = 0; i < loopnum; i++) {
    if (i == 0) {
      particles.push(new Particle(center, 1, 1, i));
    } else {
      let prePosition = particles[i - 1].position;
      particles.push(
        new Particle(prePosition, 10 * i, sin(0.075 * i) * 350 + 0.5 * i, i)
      );
    }
  }
}

let element = 0;
function draw() {
  if (element < particles.length) {
    particles[element].draw();
    if (particles[element].lerpCounter >= 1) {
      element++;
    }
  }
}
