let particles = [];
let fireworkLaunchers = [];
let hueBase = 0;
let reverb;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);
  background(0);

  // Global reverb for fireworks
  reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).toDestination();
  Tone.start();
}

// Click to create multiple fireworks across screen
function mousePressed() {
  let count = int(random(3, 7)); // 3–6 fireworks per click
  for (let i = 0; i < count; i++) {
    let x = random(width * 0.2, width * 0.8);
    let y = random(height * 0.1, height * 0.8);
    fireworkLaunchers.push(new FireworkLauncher(x, y));
  }
}

function draw() {
  background(0, 0.1);

  // Update launchers
  for (let i = fireworkLaunchers.length - 1; i >= 0; i--) {
    let fw = fireworkLaunchers[i];
    fw.update();
    fw.draw();

    if (fw.exploded && !fw.triggered) {
      fw.triggered = true;
      createFirework(fw.x, fw.y, fw.hue);
      playFireworkSound(fw.hue);
      fireworkLaunchers.splice(i, 1);
    }
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isDead()) particles.splice(i, 1);
  }
}

// Firework launcher
class FireworkLauncher {
  constructor(x, targetY) {
    this.x = x;
    this.y = height;
    this.velY = -random(12, 20);
    this.gravity = 0.25;
    this.exploded = false;
    this.triggered = false;
    this.hue = (hueBase + random(60)) % 360;
    hueBase += 40;
    this.explosionHeight = targetY;
  }

  update() {
    this.y += this.velY;
    this.velY += this.gravity;
    if (this.velY >= 0 || this.y <= this.explosionHeight) this.exploded = true;
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

// Particle system
class Particle {
  constructor(x, y, angle, speed, h) {
    this.x = x;
    this.y = y;
    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;
    this.h = h;
    this.life = 0;
    this.maxLife = 60 + int(random(50));
    this.weight = random(2, 4);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.08; // gravity pull
    this.vx *= 0.97;
    this.vy *= 0.97;
    this.life++;
  }

  show() {
    push();
    let alpha = map(this.life, 0, this.maxLife, 1, 0);
    stroke(this.h, 90, 100, alpha);
    strokeWeight(this.weight);
    point(this.x, this.y);
    pop();
  }

  isDead() {
    return this.life > this.maxLife;
  }
}

function createFirework(x, y, hueVal) {
  let num = 100 + int(random(80));
  for (let i = 0; i < num; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 9);
    particles.push(new Particle(x, y, angle, speed, hueVal));
  }
}
function playFireworkSound(hue) {
  let popNoise = new Tone.Noise("white").start();
  let popFilter = new Tone.Filter(2500, "highpass").connect(reverb);
  let popEnv = new Tone.AmplitudeEnvelope({
    attack: 0.001,
    decay: 0.08,
    sustain: 0,
    release: 0.02,
  }).connect(popFilter);
  popNoise.connect(popEnv);
  popEnv.triggerAttackRelease("32n");
  popNoise.stop("+0.2");

  let boomNoise = new Tone.Noise("brown").start();
  let boomFilter = new Tone.Filter(200, "lowpass").connect(reverb);
  let boomEnv = new Tone.AmplitudeEnvelope({
    attack: 0.005,
    decay: 0.8,
    sustain: 0,
    release: 1.2,
  }).connect(boomFilter);
  boomNoise.connect(boomEnv);
  boomEnv.triggerAttackRelease("1n");
  boomNoise.stop("+1.5");

  let boomOsc = new Tone.Oscillator({
    frequency: random(40, 70),
    type: "sine",
  }).start();
  let oscEnv = new Tone.AmplitudeEnvelope({
    attack: 0.005,
    decay: 0.6,
    sustain: 0,
    release: 0.8,
  }).connect(reverb);
  boomOsc.connect(oscEnv);
  oscEnv.triggerAttackRelease("1n");
  boomOsc.stop("+1.2");

  //the clacking sound after the explosion
  for (let i = 0; i < 12; i++) {
    let delay = random(0.05, 0.3);
    let crackle = new Tone.Noise("white").start();
    let crackleFilter = new Tone.Filter(random(3000, 7000), "bandpass").connect(
      reverb
    );
    let crackleEnv = new Tone.AmplitudeEnvelope({
      attack: 0.001,
      decay: random(0.05, 0.15),
      sustain: 0,
      release: random(0.05, 0.2),
    }).connect(crackleFilter);
    crackle.connect(crackleEnv);
    crackleEnv.triggerAttackRelease("32n", `+${delay}`);
    crackle.stop(`+${delay + 0.2}`);
  }
}
