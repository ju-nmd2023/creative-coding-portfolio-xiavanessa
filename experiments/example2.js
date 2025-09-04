let raindrops = [];
let flowers = [];
const flowerColors = [
  [255, 100, 100], //red
  [255, 255, 255], //white
  [255, 200, 50], //yellow
  [255, 100, 255], //purple
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  //update raindrops
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let drop = raindrops[i];
    //autonomous agent: each raindrop updates itself
    drop.update();
    if (drop.y >= drop.groundY) {
      // autonomous agent: each flower grows itself
      flowers.push(new Flower(drop.x, drop.groundY));
      raindrops.splice(i, 1);
    } else {
      drop.show();
    }
  }

  //update flowers
  for (let f of flowers) {
    // autonomous agent: each flower updates itself
    f.update();
    f.show();
  }
}

// when w is pressed, add raindrops
// Particle generator: pressing "w" spawns new raindrops
function keyPressed() {
  if (key === "w" || key === "W") {
    //random number of raindrop each time 2 to 4
    let count = floor(random(2, 3));
    for (let i = 0; i < count; i++) {
      //random ground height for each raindrop
      let groundY = height - random(150, 220);
      let margin = width * 0.15;
      let x = random(margin, width - margin);
      raindrops.push(new Raindrop(x, 0, groundY));
    }
  }
}

class Raindrop {
  constructor(x, y, groundY) {
    this.x = x;
    this.y = y;
    this.noiseX = 0.015;
    this.noiseY = 0.012;
    this.groundY = groundY;
    this.speed = random(3, 5);
    this.size = random(5, 10);
    // this.offset = random(TWO_PI);
  }

  update() {
    // variation1: Raindrops aren’t falling perfectly straight; they sway slightly left and right using Perlin noise.
    this.y += this.speed;
    let n = noise(
      this.x * this.noiseX,
      this.y * this.noiseY
      // frameCount * 0.01
    );
    this.x += map(n, 0, 1, -2, 2);
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size, this.size * 1.8);
  }
}

class Flower {
  constructor(x, groundY) {
    this.baseX = x;
    this.baseY = groundY;

    // stem
    this.stemHeight = 0;
    this.targetStemHeight = random(100, 300);
    this.stemSegments = 5;
    this.segmentLength = 1;
    this.stemPoints = [];
    // variation3: different sway amplitude for each stem
    this.stemSwingAmplitude = random(2, 4);
    // variation3: different sway speed per stem
    this.speed = random(0.03, 0.07);

    // flower
    this.size = 0;
    this.maxSize = random(10, 20);
    this.petals = floor(random(8, 9));
    this.color = color(...flowerColors[floor(random(flowerColors.length))]);
    this.phase = "stem";
    this.angleOffset = random(TWO_PI);
    this.x = x;
    this.y = groundY;
    this.swingX = random(2, 8);
    this.swingY = random(1, 4);

    this.hueOffset = random(0, 360);
    this.hueSpeed = random(1, 2); //each flower has different hue changing speed
  }

  update() {
    this.stemPoints = [];
    // stem growth
    if (this.stemHeight < this.targetStemHeight) {
      this.stemHeight += this.segmentLength;
    }

    //variation2:Each flower grows to a slightly different height, so the garden looks varied.
    for (let i = 0; i <= this.stemSegments; i++) {
      let t = i / this.stemSegments;
      let y = this.baseY - t * this.stemHeight;

      //variation3:Bottom of the stem stays almost vertical, top swings more. Uses pow(t,3) to achieve smooth growth.
      let wind =
        sin(frameCount * this.speed + this.angleOffset) *
        this.stemSwingAmplitude;

      //using pow function to make the btn more stable and top swings more
      let x = this.baseX + wind * pow(t, 3);
      this.stemPoints.push({ x, y });
    }
    console.log(this.stemPoints);

    // the tip of the stem
    // autonomous agent： update flower tip to follow stem tip
    let tip = this.stemPoints[this.stemPoints.length - 1];
    this.x = tip.x;
    this.y = tip.y;

    // flower growth
    if (this.stemHeight >= this.targetStemHeight) {
      this.phase = "flower";
      if (this.size < this.maxSize) this.size += 0.3;
    }
  }

  show() {
    stroke(50, 150, 50);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of this.stemPoints) {
      vertex(pt.x, pt.y);
    }
    endShape();

    // variation4: Each flower’s petals have slightly different number and size, creating visual diversity. ✅
    if (this.phase === "flower") {
      colorMode(HSB, 360, 100, 100);
      noStroke();
      for (let i = 0; i < this.petals; i++) {
        let hueShift = (frameCount * this.hueSpeed + this.hueOffset) % 360;
        fill(hueShift, 60, 80);
        let angle = (TWO_PI * i) / this.petals;
        ellipse(
          this.x + cos(angle) * this.size,
          this.y + sin(angle) * this.size,
          this.size,
          this.size
        );
      }

      colorMode(RGB);
      fill(this.color);
      ellipse(this.x, this.y, this.size * 1.2, this.size * 1.2);
    }
  }
}

// class Flower {
//   constructor(x, groundY) {
//     this.baseX = x;
//     this.baseY = groundY;
//     this.stemHeight = 0;
//     this.targetStemHeight = random(80, 350);
//     this.size = 0;
//     this.petals = random(8, 9);
//     this.maxSize = random(10, 20);
//     this.color = color(...flowerColors[floor(random(flowerColors.length))]);
//     this.phase = "stem";
//     this.angleOffset = random(TWO_PI);
//     this.x = x;
//     this.y = groundY;
//     this.swingX = random(2, 8);
//     this.swingY = random(1, 4);
//     this.speed = random(0.03, 0.07);
//     this.hueOffset = random(0, 360);
//   }

//   update() {
//     if (this.phase === "stem") {
//       this.stemHeight += 1;
//       if (this.stemHeight >= this.targetStemHeight) {
//         this.phase = "flower";
//       }
//     } else if (this.phase === "flower") {
//       if (this.size < this.maxSize) {
//         this.size += 0.3;
//       }

//       // flower swing
//       this.x =
//         this.baseX +
//         sin((frameCount + this.angleOffset) * this.speed) * this.swingX;
//       this.y =
//         this.baseY -
//         this.stemHeight +
//         cos((frameCount + this.angleOffset) * this.speed) * this.swingY;
//     }
//   }

//   show() {
//     stroke(50, 150, 50);
//     strokeWeight(3);

//     line(this.baseX, this.baseY, this.baseX, this.baseY - this.stemHeight);

//     if (this.phase === "flower") {
//       colorMode(HSB, 360, 100, 100);
//       noStroke();

//       for (let i = 0; i < this.petals; i++) {
//         let hueShift = (frameCount * 2 + this.hueOffset) % 360;
//         fill(hueShift, 60, 80);
//         ellipse(
//           this.x + cos((TWO_PI * i) / this.petals) * this.size,
//           this.y + sin((TWO_PI * i) / this.petals) * this.size,
//           this.size,
//           this.size
//         );
//       }
//       colorMode(RGB);
//       fill(this.color);
//       ellipse(this.x, this.y, this.size * 1.2, this.size * 1.2);
//     }
//   }
// }
