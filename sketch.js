let canvas;
let x;
let v = 0;
let a = 0;
let m = 1;
let k = 50;
let dragging = false;
let offsetX = 0;
let blockWidth = 50;
let equilibrium;
let isRunning = false;
let isPaused = false;
let originalX;

let pxPerMeter = 100;
let slowmo = false;

function setup() {
  canvas = createCanvas(800, 500);
  canvas.parent('canvas-container');
  equilibrium = width / 2;
  x = equilibrium + 100;
  originalX = x;

  const massSlider = select('#massSlider');
  const kSlider = select('#kSlider');

  massSlider.input(() => {
    m = parseFloat(massSlider.value());
    select('#massValue').html(m + ' kg');
  });

  kSlider.input(() => {
    k = parseFloat(kSlider.value());
    select('#kValue').html(k + ' N/m');
  });

  m = parseFloat(massSlider.value());
  k = parseFloat(kSlider.value());

  select('#startBtn').mousePressed(() => {
    isRunning = true;
    isPaused = false;
    v = 0;
  });

  select('#resetBtn').mousePressed(() => {
    x = originalX;
    v = 0;
    a = 0;
    isRunning = false;
    isPaused = false;
  });

  select('#infoToggle').mousePressed(() => {
    let panel = select('#infoPanel');
    panel.toggleClass('hidden');
  });

  select('#infoClose').mousePressed(() => {
    select('#infoPanel').addClass('hidden');
  });

  select('#slowmoCheckbox').changed(() => {
    slowmo = select('#slowmoCheckbox').checked();
  });
}

function draw() {
  background(30);

  stroke(200);
  strokeWeight(4);
  line(100, height / 2, x, height / 2);

  fill('#00adb5');
  noStroke();
  rectMode(CENTER);
  rect(x, height / 2, blockWidth, blockWidth);

  if (isPaused && isRunning) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("PAUSED - Press SPACE to resume", width / 2, height / 2 - 100);
  }

  if (isRunning && !isPaused) {
    let dt = 1 / 60;
    if (slowmo) dt *= 0.25; // Slow motion
    let displacement = x - equilibrium;
    a = (-k * displacement) / m;
    v += a * dt;
    x += v * dt;
  }

  let dx_m = (x - equilibrium) / pxPerMeter;
  let v_mps = v / pxPerMeter;
  let a_mps2 = a / pxPerMeter;

  let ke = 0.5 * m * v_mps * v_mps;
  let pe = 0.5 * k * dx_m * dx_m;
  let totalE = ke + pe;

  let statsHTML = `
    <strong>Stats</strong><br>
    Displacement: ${dx_m.toFixed(2)} m<br>
    Velocity: ${v_mps.toFixed(2)} m/s<br>
    Acceleration: ${a_mps2.toFixed(2)} m/s²<br>
    Kinetic Energy: ${ke.toFixed(2)} J<br>
    Potential Energy: ${pe.toFixed(2)} J<br>
    Total Energy: ${totalE.toFixed(2)} J
  `;
  select('#stats-panel').html(statsHTML);
}

function mousePressed() {
  if (!isRunning && abs(mouseX - x) < blockWidth / 2 && abs(mouseY - height / 2) < blockWidth / 2) {
    dragging = true;
    offsetX = mouseX - x;
  }
}

function mouseDragged() {
  if (dragging) {
    x = mouseX - offsetX;
    x = constrain(x, 100 + blockWidth / 2, width - 50);
  }
}

function mouseReleased() {
  dragging = false;
}

window.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    e.preventDefault();
    if (isRunning) {
      isPaused = !isPaused;
    }
  }
});
