const sky = document.getElementById("sky");
const widthSky = sky.offsetWidth;
const heightSky = sky.offsetHeight;

const moon = document.getElementById("moon");
let positionMoon = {
  x: widthSky / 2,
  y: heightSky / 2,
};

const rocket = document.getElementById("rocket");
const widthRocket = rocket.offsetWidth;
const heightRocket = rocket.offsetHeight;
let positionRocket = {
  x: 0,
  y: heightSky - heightRocket,
};
let velocityRocket = {
  x: 0,
  y: 0,
};
let accellerationRocket = {
  x: 0,
  y: 0,
};

let lastAnimationTimestamp;

const kp = 0.00001;
const kd = 0.002;

window.addEventListener("pointerdown", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  positionMoon = { x, y };
});

requestAnimationFrame(animate);

function animate(timestamp) {
  if (!lastAnimationTimestamp) {
    lastAnimationTimestamp = timestamp;
  }

  const deltaTime = timestamp - lastAnimationTimestamp;

  updatePosition(deltaTime);
  updateVelocity(deltaTime);
  updateAcceleration();
  draw();

  lastAnimationTimestamp = timestamp;
  requestAnimationFrame(animate);
}

function updatePosition(deltaTime) {
  positionRocket.x += velocityRocket.x * deltaTime;
  positionRocket.y += velocityRocket.y * deltaTime;
}

function updateVelocity(deltaTime) {
  velocityRocket.x += accellerationRocket.x * deltaTime;
  velocityRocket.y += accellerationRocket.y * deltaTime;
}

function updateAcceleration() {
  const error = {
    x: positionMoon.x - positionRocket.x,
    y: positionMoon.y - positionRocket.y,
  };

  accellerationRocket = {
    x: kp * error.x - kd * velocityRocket.x,
    y: kp * error.y - kd * velocityRocket.y,
  };
}

function draw() {
  moon.style.transform = `translate(${positionMoon.x}px, ${positionMoon.y}px)`;

  const defaultVectorRocket = { x: 1, y: -1 };
  const hasVelocity = velocityRocket.x !== 0 && velocityRocket.y !== 0;
  const targetVector = hasVelocity ? velocityRocket : { x: 0, y: -1 };
  const rotationRocket = angleBetweenVectorsRad(
    defaultVectorRocket,
    targetVector
  );
  rocket.style.transform = `translate(${positionRocket.x}px, ${positionRocket.y}px) rotate(${rotationRocket}rad)`;
}

function angleBetweenVectorsRad(vec1, vec2) {
  return Math.atan2(vec2.y, vec2.x) - Math.atan2(vec1.y, vec1.x);
}
