// let center;
// let particles = [];
// let loopnum = 500;

// class Particle {
//   constructor(prePosition, angle, radius, index) {
//     this.index = index;
//     this.prePosition = prePosition.copy();
//     this.angle = radians(angle);
//     this.radius = radius;
//     this.center = createVector(windowWidth / 2, windowHeight / 2);
//     this.position = this.calcPosition();
//     this.tempPosition = this.prePosition.copy();

//     this.lerpStep = random(0.02, 0.04); // 更快
//     this.lerpCounter = 0;
//     this.delay = index * 3;

//     this.baseHue = map(index, 0, loopnum, 260, 220);
//     this.saturation = 35;
//     this.brightness = map(index, 0, loopnum, 65, 40);

//     this.alpha = map(index, 0, loopnum, 1, 0.8);
//   }

//   calcPosition() {
//     let x = this.center.x + this.radius * sin(this.angle);
//     let y = this.center.y + this.radius * cos(this.angle);
//     return createVector(x, y);
//   }

//   draw(frameCount) {
//     //use noise to add some randomness to the stroke color
//     let hueShift = map(
//       noise(this.index * 0.02, frameCount * 0.003),
//       0,
//       1,
//       -12,
//       12
//     );
//     let currentHue = (this.baseHue + hueShift) % 360;

//     colorMode(HSB, 360, 100, 100, 1);
//     stroke(currentHue, this.saturation, this.brightness, this.alpha);

//     strokeWeight(map(this.index, 0, loopnum, 1.5, 1));

//     if (frameCount > this.delay && this.lerpCounter < 1) {
//       this.tempPosition.x = lerp(
//         this.prePosition.x,
//         this.position.x,
//         this.lerpCounter
//       );
//       this.tempPosition.y = lerp(
//         this.prePosition.y,
//         this.position.y,
//         this.lerpCounter
//       );
//       this.lerpCounter += this.lerpStep;
//     }

//     let fx = this.tempPosition.x + sin(frameCount * 0.02 + this.index) * 2;
//     let fy = this.tempPosition.y + cos(frameCount * 0.02 + this.index) * 2;

//     point(fx, fy);
//   }
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   center = createVector(windowWidth / 2, windowHeight / 2);
//   blendMode(ADD);
//   background(0);

//   for (let i = 0; i < loopnum; i++) {
//     if (i === 0) {
//       particles.push(new Particle(center, 1, 1, i));
//     } else {
//       let prePosition = particles[i - 1].position;
//       let r = sin(0.055 * i) * 320 + 0.45 * i;
//       particles.push(new Particle(prePosition, 9 * i, r, i));
//     }
//   }
// }

// function draw() {
//   background(0, 0, 0, 0.1);
//   for (let p of particles) {
//     p.draw(frameCount);
//   }
// }

let center;
let particles = [];
let baseRadius = 50;
let angleIncrement = 0.1;
let maxRadius;
let totalParticles = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
  center = createVector(width / 2, height / 2);
  maxRadius = width / 7;
}

class Particle {
  constructor(angle, radius, index) {
    this.angle = angle;
    this.radius = radius;
    this.index = index;
    this.noiseOffset = random(1000);
    this.position = this.calcPosition();
    this.alpha = random(30, 80);
    this.size = random(2, 6);
  }

  calcPosition() {
    let x = center.x + cos(this.angle) * this.radius;
    let y = center.y + sin(this.angle) * this.radius;
    x += map(noise(this.noiseOffset + this.index * 0.01), 0, 1, -10, 10);
    y += map(noise(this.noiseOffset + this.index * 0.02), 0, 1, -10, 10);
    return createVector(x, y);
  }

  update() {
    this.angle += 0.001;
    this.radius += 0.3;
    if (this.radius > maxRadius) {
      this.radius = baseRadius;
      this.noiseOffset = random(1000);
    }
    this.position = this.calcPosition();
    this.alpha = map(this.radius, baseRadius, maxRadius, 80, 0);
  }

  display() {
    noStroke();
    fill(map(this.index, 0, totalParticles, 180, 260), 50, 100, this.alpha);
    ellipse(this.position.x, this.position.y, this.size);
  }
}

function draw() {
  background(0, 0, 0, 10);
  for (let p of particles) {
    p.update();
    p.display();
  }

  if (particles.length < totalParticles) {
    createParticles();
  }
}

function createParticles() {
  for (let i = 0; i < totalParticles; i++) {
    let angle = i * angleIncrement;
    let radius = baseRadius + i * 0.5;
    particles.push(new Particle(angle, radius, i));
  }
}
