let raindrops = [];
let flowers = [];
let splash = [];
let mic, micNode;
let micThreshold = 0.02;
let prevMicLevel = 0;

const flowerColors = [
  [255, 100, 100], //red
  [255, 255, 255], //white
  [255, 200, 50], //yellow
  [255, 129, 193], //pink
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  startButton();
}

function startButton() {
  startBtn = createButton("🎤 Start Mic");
  startBtn.position(
    width / 2 - startBtn.width / 2,
    height / 2 - startBtn.height * 2
  );
  startBtn.style("padding", "12px 20px");
  startBtn.style("font-size", "16px");
  startBtn.style("border-radius", "12px");
  startBtn.style("background-color", "#4CAF50");
  startBtn.style("color", "white");
  startBtn.style("border", "none");
  startBtn.style("cursor", "pointer");

  //Browsers block microphone and audio context initialization unless it’s triggered by a user gesture
  startBtn.mousePressed(() => {
    initMic();
    startBtn.hide();
  });
  startBtn.show();
}

// need to resume the audio context cuz browser automatically pauses the audio context every time the page is refreshed
function initMic() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume().then(startMic);
  } else {
    startMic();
  }
}

//resetting the mic object
function startMic() {
  if (mic) mic.stop();
  mic = new p5.AudioIn();
  mic.start(
    () => console.log("Mic started"),
    (err) => console.error("Mic error:", err)
  );
}

function draw() {
  background(0);
  if (!mic || !mic.enabled) return;

  if (!mic.enabled) return;
  micLevel = mic.getLevel();
  console.log(micLevel);
  if (micLevel > micThreshold && prevMicLevel <= micThreshold) {
    //random number of raindrop each time 1 to 2
    let count = floor(random(1, 3));
    for (let i = 0; i < count; i++) {
      //random ground height for each raindrop
      let groundY = height - random(150, 220);
      let margin = width * 0.15;
      let x = random(margin, width - margin);
      raindrops.push(new Raindrop(x, 0, groundY));
    }
  }
  prevMicLevel = micLevel;

  //autonomous agent: each raindrop updates itself
  for (let i = raindrops.length - 1; i >= 0; i--) {
    let drop = raindrops[i];
    drop.update();
    if (drop.y >= drop.groundY) {
      // autonomous agent: each flower grows itself
      flowers.push(new Flower(drop.x, drop.groundY));
      // autonomous agent: each splash creates itself
      splash.push(new Splash(drop.x, drop.y));
      raindrops.splice(i, 1);
    } else {
      drop.show();
    }
  }

  // autonomous agent: each splash updates itself
  for (let i = splash.length - 1; i >= 0; i--) {
    splash[i].update();
    splash[i].show();
    if (splash[i].splashAlpha <= 0) splash.splice(i, 1);
  }

  // autonomous agent: each flower updates itself
  for (let i = flowers.length - 1; i >= 0; i--) {
    let f = flowers[i];
    f.update();
    f.show();
  }
}

class Raindrop {
  constructor(x, y, groundY) {
    this.x = x;
    this.y = y;
    this.noiseX = 0.015;
    this.noiseY = 0.012;
    this.groundY = groundY;
    this.speed = random(6, 10);
    this.size = random(5, 8);
  }

  update() {
    // variation1: Raindrops aren’t falling perfectly straight; they sway slightly left and right using Perlin noise.
    this.y += this.speed;
    let n = noise(this.x * this.noiseX, this.y * this.noiseY);
    this.x += map(n, 0, 1, -1, 1);
  }

  show() {
    fill(191, 244, 247);
    noStroke();
    triangle(
      this.x - this.size / 2,
      this.y,
      this.x + this.size / 2,
      this.y,
      this.x,
      this.y - this.size * 1.5
    );
    ellipse(this.x, this.y, this.size, this.size);
  }
}

class Splash {
  constructor(x, y, radius = 0) {
    this.x = x;
    this.y = y;
    this.splashRadius = radius;
    this.splashAlpha = random(150, 700);
  }

  update() {
    // splash expands and fades
    this.splashRadius += 2;
    this.splashAlpha -= 10;
  }

  show() {
    if (this.splashAlpha <= 0) return;
    noFill();
    stroke(212, 241, 249, this.splashAlpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.splashRadius, this.splashRadius / 4);
  }
}

class Flower {
  constructor(x, groundY) {
    this.baseX = x;
    this.baseY = groundY;
    this.phase = this.stemHeight >= this.targetStemHeight ? "flower" : "stem";

    // stem
    this.stemHeight = 0;
    this.targetStemHeight = random(100, 250);
    this.stemSegments = 6;
    this.segmentLength = 1;
    this.stemPoints = [];
    // variation3: different sway amplitude for each stem
    this.stemSwingAmplitude = random(2, 10);
    // variation3: different sway speed per stem
    this.speed = random(0.03, 0.07);

    // flower
    this.size = 0;
    this.maxSize = random(10, 20);
    this.petals = floor(random(8, 10));
    this.color = color(...flowerColors[floor(random(flowerColors.length))]);
    this.angleOffset = random(TWO_PI);
    this.x = x;
    this.y = groundY;
    this.swingX = random(2, 8);
    this.swingY = random(1, 4);

    this.hueOffset = random(0, 360);
    this.hueSpeed = random(1, 3); //each flower has different hue changing speed
    this.birthTime = millis();
    this.delay = random(200, 800);
  }

  update() {
    if (millis() - this.birthTime < this.delay) return; // skip update until delay passes
    if (!this.stemPoints.length)
      this.stemPoints = new Array(this.stemSegments + 1).fill({ x: 0, y: 0 });

    // stem growth
    if (this.stemHeight < this.targetStemHeight) {
      this.stemHeight += this.segmentLength;
    }

    //variation2:Each flower grows to a slightly different height, so the garden looks varied.
    for (let i = 0; i <= this.stemSegments; i++) {
      let t = i / this.stemSegments;
      let y = this.baseY - t * this.stemHeight;

      //variation3:Bottom of the stem stays almost vertical, top swings more. Uses pow() to achieve smooth growth.
      let wind =
        sin(frameCount * this.speed + this.angleOffset) *
        this.stemSwingAmplitude;
      // console.log(t);
      // console.log(wind);

      //using pow function to make the btn more stable and top swings more
      let x = this.baseX + wind * pow(t, 4);
      this.stemPoints[i] = { x, y };
    }

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
    stroke(135, 180, 54);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let pt of this.stemPoints) {
      curveVertex(pt.x, pt.y);
      curveVertex(pt.x, pt.y);
    }
    endShape();

    // variation4: Each flower’s petals have slightly different number and size, creating visual diversity.
    if (this.phase === "flower") {
      push();
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
      pop();
      noStroke();
      fill(this.color);
      ellipse(this.x, this.y, this.size * 1.2, this.size * 1.2);
    }
  }
}
