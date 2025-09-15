let i = 1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(20, 20, 20);
  strokeCap(ROUND);
}

function collatz(n) {
  return n % 2 === 0 ? n / 2 : (n * 3 + 1) / 2;
}

function drawBranch(sequence, index, len, weight) {
  if (index >= sequence.length || len < 1) return;

  // Perlin noise
  let noiseFactor = noise(i * 0.005, index * 0.005);
  let dynamicAngle = map(noiseFactor, 0, 1, -PI / 8, PI / 8);

  strokeWeight(weight);
  let hueVal = map(index, 0, sequence.length, 30, 120);
  stroke(hueVal, 80, 60);

  line(0, 0, 0, -len);
  translate(0, -len);

  // 15% chance to split
  if (random() < 0.15 && len > 5) {
    push();
    rotate(PI / 6); // right branch
    drawBranch(sequence, index + 1, len * 0.7, weight * 0.7);
    pop();

    push();
    rotate(-PI / 6); // left branch
    drawBranch(sequence, index + 1, len * 0.7, weight * 0.7);
    pop();
  }

  //  main trunk
  rotate(dynamicAngle);
  drawBranch(sequence, index + 1, len * 0.95, weight * 0.95);
}

function draw() {
  if (i < 100) {
    let sequence = [];
    let n = i;
    do {
      sequence.push(n);
      n = collatz(n);
    } while (n !== 1);
    sequence.push(1);
    sequence.reverse();

    resetMatrix();
    translate(width / 2, height - 250);

    drawBranch(sequence, 0, 25, 2);
    i++;
  }
}
