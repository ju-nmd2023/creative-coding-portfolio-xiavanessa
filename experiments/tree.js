let angle;
let len;
let i;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(20, 20, 20);
  i = 1;
}

//n will eventually be 1
function collatz(n) {
  return n % 2 === 0 ? n / 2 : (n * 3 + 1) / 2;
}

function draw() {
  len = 20;
  if (i < 400) {
    let sequence = [];
    let n = i;
    do {
      sequence.push(n);
      n = collatz(n);
    } while (n !== 1);

    sequence.push(1);
    sequence.reverse();
    console.log(sequence);
    resetMatrix();
    translate(width / 2, height - 200);

    sequence.forEach((item, index) => {
      //Perlin noise
      let xAngle = 0.04;
      let yAngle = 0.008;
      let noiseFactor = noise(i * xAngle, index * yAngle);
      //each line in the sequence will rotate slightly left or right by at most ±20°
      let dynamicAngle = map(noiseFactor, 0, 1, -PI / 12, PI / 12);

      rotate(dynamicAngle);

      // Gradually decrease stroke weight toward the top
      let strokeW = map(index, 0, sequence.length, 2, 5.5); // 2 at bottom, 1.5 at top
      strokeWeight(strokeW);

      let hueVal = map(index, 0, sequence.length, 30, 120);
      stroke(hueVal, 80, 60);

      line(0, 0, 0, -len);
      //Moves the drawing origin to the end of the current line so the next line segment starts where the last one ended.
      translate(0, -len);
      //reduce the length of the line segment for the next iteration, and eventually lines get extremely short, making the branch visually terminate.
      len *= 0.95;
    });
    i++;
  }
}
