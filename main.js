const canvasElem = document.getElementById('canvas');
const ctx = canvasElem.getContext('2d');

const TRAIL_LENGTH = 24; // Max number of vertices
const NONLOCALITY = 6; // How many vertices away each vertex is connected to
const RANDOMIZATION = 50; // How much noise to add to mouse position
const SPAWNING_SPEED = 30; // How many vertices to add per second

// Twelve colors evenly spaced around the color wheel
const NODE_COLORS = [
  '#eb4034',
  '#eb8f34',
  '#e2eb34',
  '#71eb34',
  '#34eb52',
  '#34eb9b',
  '#34d8eb',
  '#3489eb',
  '#343aeb',
  '#8934eb',
  '#cc34eb',
  '#eb34cc',
];

window.addEventListener('resize', updateCanvasSize);
function updateCanvasSize(e) {
  let size = Math.min(window.innerWidth, window.innerHeight);
  canvas.width = size;
  canvas.height = size;
}

function main() {
  updateCanvasSize();
}

let mouseX;
let mouseY;
canvasElem.addEventListener('mousemove', (e) => {
  mouseX = e.offsetX;
  mouseY = e.offsetY;
});

let vertices = [];
setInterval(() => {
  vertices.push({
    x: mouseX + Math.random() * RANDOMIZATION - (RANDOMIZATION / 2),
    y: mouseY + Math.random() * RANDOMIZATION - (RANDOMIZATION / 2)
  });
  if (vertices.length > TRAIL_LENGTH) {
    vertices.shift();
  }
}, 1000 / SPAWNING_SPEED);

setInterval(animate, 1000 / 60);
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw lines between the vertices
  // TODO: color based on average of vertex indices
  for (let step = 1; step < NONLOCALITY; step++) {
    for (let i = 0; i < vertices.length - 1; i++) {
      let vertex1 = vertices[i];
      let vertex2 = vertices[i + step];
      if (!vertex1 || !vertex2) {
        continue;
      }
      ctx.strokeStyle = avgHexColors(
        NODE_COLORS[i % NODE_COLORS.length],
        NODE_COLORS[(i + step) % NODE_COLORS.length]
      );
      ctx.beginPath();
      ctx.moveTo(vertex1.x, vertex1.y);
      ctx.lineTo(vertex2.x, vertex2.y);
      ctx.moveTo(vertex1.x, vertex1.y);
      ctx.stroke();
    }
  }

}

function avgHexColors(hex1, hex2) {
  let r1 = parseInt(hex1.slice(1, 3), 16);
  let g1 = parseInt(hex1.slice(3, 5), 16);
  let b1 = parseInt(hex1.slice(5, 7), 16);
  let r2 = parseInt(hex2.slice(1, 3), 16);
  let g2 = parseInt(hex2.slice(3, 5), 16);
  let b2 = parseInt(hex2.slice(5, 7), 16);
  let r = Math.floor((r1 + r2) / 2);
  let g = Math.floor((g1 + g2) / 2);
  let b = Math.floor((b1 + b2) / 2);
  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

main();