let particles = [];
let fireworkLaunchers = [];
let mic;
let micThreshold = 0.02;
let prevMicLevel = 0;
let hueBase = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0);
  startButton();
}

function startButton() {
  startBtn = createButton("🎤 Start Mic");
  startBtn.position(width / 2 - 50, height / 2 - 25);
  startBtn.style("padding", "12px 20px");
  startBtn.style("font-size", "16px");
  startBtn.style("border-radius", "12px");
  startBtn.style("background-color", "#4CAF50");
  startBtn.style("color", "white");
  startBtn.style("border", "none");
  startBtn.style("cursor", "pointer");

  startBtn.mousePressed(() => {
    initMic();
    startBtn.hide();
  });
}

function initMic() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume().then(startMic);
  } else {
    startMic();
  }
}

function startMic() {
  if (mic) mic.stop();
  mic = new p5.AudioIn();
  mic.start(
    () => console.log("Mic started"),
    (err) => console.error("Mic error:", err)
  );
}

function draw() {
  background(0, 0.1); // trail effect

  if (!mic || !mic.enabled) return;
  let micLevel = mic.getLevel();

  // Launch firework on sound peak
  if (micLevel > micThreshold && prevMicLevel <= micThreshold) {
    let count = int(random(1, 4));
    for (let i = 0; i < count; i++) {
      fireworkLaunchers.push(new FireworkLauncher());
    }
  }
  prevMicLevel = micLevel;

  // Update and draw launchers
  for (let i = fireworkLaunchers.length - 1; i >= 0; i--) {
    let fw = fireworkLaunchers[i];
    fw.update();
    fw.draw();
    if (fw.exploded) {
      createFirework(fw.x, fw.y, fw.hue);
      fireworkLaunchers.splice(i, 1);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

class FireworkLauncher {
  constructor() {
    this.x = random(width * 0.2, width * 0.8);
    this.y = height;
    //initial upward velocity
    this.velY = -random(10, 20);
    this.gravity = 0.2;
    this.exploded = false;
    this.explosionHeight = random(height * 0.2, height * 0.6);
    this.hue = (hueBase + random(60)) % 360;
    hueBase += 40; // shift hues for variety
  }

  update() {
    this.y += this.velY;
    this.velY += this.gravity;
    if (this.velY >= 0 || this.y <= this.explosionHeight) {
      this.exploded = true;
    }
  }

  draw() {
    if (!this.exploded) {
      push();
      stroke(this.hue, 100, 100, 0.9);
      strokeWeight(3);
      line(this.x, this.y, this.x, this.y + 15);
      pop();
    }
  }
}

class Particle {
  constructor(x, y, angle, speed, h) {
    this.x = x;
    this.y = y;
    // velocity
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.h = h;
    this.life = 0;
    this.maxLife = 60 + int(random(40));
    // particle size
    this.weight = random(2, 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    //apply gravity -- to make it fall down after explosion
    this.vy += 0.05;
    // slow down particles to make it more natural
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life++;
  }

  show() {
    push();
    let alpha = map(this.life, 0, this.maxLife, 1, 0);
    stroke(this.h, 80, 100, alpha);
    strokeWeight(this.weight);
    point(this.x, this.y);

    // sparkle effect
    if (random() < 0.1) {
      stroke(this.h, 80, 100, alpha * 0.8);
      strokeWeight(this.weight * 2);
      point(this.x + random(-2, 2), this.y + random(-2, 2));
    }
    pop();
  }

  isDead() {
    return this.life > this.maxLife;
  }
}

function createFirework(x, y, hueVal) {
  // random number of (120 - 170) particles per explosion
  let num = 120 + int(random(50));
  for (let i = 0; i < num; i++) {
    //random angle(0-2PI) and speed
    let angle = random(TWO_PI);
    let speed = random(2, 8);
    particles.push(new Particle(x, y, angle, speed, hueVal));
  }
}
