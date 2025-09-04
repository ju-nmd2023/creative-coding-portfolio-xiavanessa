const grid = 80;
const mx = 80;
const my = 110;

function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL);
  angleMode(DEGREES);
  rectMode(CENTER);
}

function draw() {
  background("#0005d6");

  const halfW = innerWidth / 2;
  const halfH = innerHeight / 2;

  for (let x = -halfW + grid / 2 + mx; x < halfW - mx; x += grid) {
    for (let y = -halfH + grid / 2 + my; y < halfH - my; y += grid) {
      push();
      translate(x, y);

      // left top
      if (x < 0 && y < 0) {
        fill(255, 0, 181);
        rotateX(frameCount);
        rotateY(-frameCount);
      }
      // left bottom
      else if (x < 0 && y >= 0) {
        fill(0, 255, 181);
        rotateX(frameCount);
        rotateY(frameCount);
      }
      // right top
      else if (x >= 0 && y < 0) {
        fill(255, 255, 0);
        rotateX(-frameCount);
        rotateY(-frameCount);
      }
      // right bottom
      else {
        fill(0, 181, 255);
        rotateX(-frameCount);
        rotateY(frameCount);
      }

      rect(0, 0, grid, grid);
      pop();
    }
  }
}

// function setup() {
//   createCanvas(innerWidth, innerHeight);
//   background(34, 39, 46);
// }

// function draw() {
//   background(34, 39, 46, 40);
//   noStroke();
//   fill(108, 182, 255);

//   push();
//   translate(width / 2, height / 2);

//   push();
//   rotate(frameCount / 8);
//   ellipse(25, 0, 50);
//   pop();

//   push();
//   rotate(-frameCount / 10);
//   ellipse(75, 0, 50);
//   pop();

//   push();
//   rotate(frameCount / 12);
//   ellipse(125, 0, 50);
//   pop();

//   push();
//   rotate(-frameCount / 14);
//   ellipse(175, 0, 50);
//   pop();

//   pop();
// }
