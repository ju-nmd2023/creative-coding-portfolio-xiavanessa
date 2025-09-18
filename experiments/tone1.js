let particles = [];
let fireworkLaunchers = [];
let mic;
let micThreshold = 0.02;
let prevMicLevel = 0;
let hueBase = 0;
let synth;
let reverb;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0);

  // Initialize Tone.js synth
  synth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
  }).toDestination();

  Tone.start();
  reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
}

// Trigger firework on mouse click
function mousePressed() {
  let fw = new FireworkLauncher(mouseX, mouseY);
  fireworkLaunchers.push(fw);
  // 30% chance to spawn a second firework
  if (random() < 0.3) {
    let fw2 = new FireworkLauncher(mouseX + random(-50, 50), mouseY);
    fireworkLaunchers.push(fw2);
  }
}

function draw() {
  background(0, 0.1);

  // Update and draw launchers
  for (let i = fireworkLaunchers.length - 1; i >= 0; i--) {
    let fw = fireworkLaunchers[i];
    fw.update();
    fw.draw();

    // trigger explosion only once
    if (fw.exploded && !fw.triggered) {
      fw.triggered = true;
      createFirework(fw.x, fw.y, fw.hue);
      playFireworkSound(fw.hue);
      fireworkLaunchers.splice(i, 1);
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDead()) particles.splice(i, 1);
  }
}

// Firework launcher now accepts position
class FireworkLauncher {
  constructor(x, y) {
    this.x = x !== undefined ? x : random(width * 0.2, width * 0.8);
    this.y = y !== undefined ? y : height;
    this.velY = -random(10, 20);
    this.gravity = 0.2;
    this.exploded = false;
    this.triggered = false;
    this.explosionHeight =
      y !== undefined ? y : random(height * 0.2, height * 0.6);
    this.hue = (hueBase + random(60)) % 360;
    hueBase += 40;
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
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.h = h;
    this.life = 0;
    this.maxLife = 60 + int(random(40));
    this.weight = random(2, 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05;
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
  let num = 120 + int(random(50));
  for (let i = 0; i < num; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 8);
    particles.push(new Particle(x, y, angle, speed, hueVal));
  }
}

// Tone.js sound
function playFireworkSound() {
  // Create a short noise burst
  let noise = new Tone.Noise("white").start();
  let ampEnv = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: random(0.1, 0.4),
    sustain: 0,
    release: 0.1,
  }).connect(reverb);

  noise.connect(ampEnv);
  ampEnv.triggerAttackRelease("32n");

  //  add random pitch burst
  let synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 1,
    envelope: {
      attack: 0.001,
      decay: random(0.1, 0.3),
      sustain: 0,
      release: 0.1,
    },
  }).connect(reverb);
  synth.triggerAttackRelease(random(50, 120), "8n");
}
