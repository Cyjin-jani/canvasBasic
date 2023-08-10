const canvas = document.querySelector('canvas');
// canvas는 기본적으로 width 300, height 150으로 그려짐. (크기 조정 x인 경우에)
// console.log('🚀 ~ file: index.js:2 ~ canvas:', canvas);

const ctx = canvas.getContext('2d');
// console.log('🚀 ~ file: index.js:5 ~ ctx:', ctx);
// console.log('dpr', window.devicePixelRatio);
/**
 * device pixel ratio (DPR)
 * 하나의 css를 그릴때 해당 장치에 사용되는 pixel 수
 *
 * 예를 들어, dpr이 2인 경우라면
 * 1픽셀을 그리는 데에 2*2로 표현이 된다. 즉 4개의 픽셀이 필요.
 *
 * dpr이 1이라면 1픽셀을 그리는 데에는 하나의 픽셀이면 된다.
 * 즉, dpr이 높을 수록 더욱 선명한 해상도가 된다.
 */
const dpr = window.devicePixelRatio;

// const canvasWidth = innerWidth;
// const canvasHeight = innerHeight;
// const canvasWidth = 300;
// const canvasHeight = 300;

// canvas.style.width = canvasWidth + 'px';
// canvas.style.height = canvasHeight + 'px';

// canvas.width = canvasWidth * dpr;
// canvas.height = canvasHeight * dpr;
// canvas와 css로 정의한 크기는 서로 다르다. 꼭 canvas 자체 width, height도 잘 설정해주어야 함.
// canvas.width = 100;
// canvas.height = 100;

// dpr이 2이상이라면, 아래와 같은 것이 필요.
/**
 * why?
 * 같은 픽셀이어도 해상도에 따라 픽셀을 구성하는 개수가 달라짐. 그래서 width와 height에 곱해준 뒤 scale을 up해주어야 한다.
 * 이렇게 구현되면, 같은 300 * 300의 크기로 보이지만 확대를 해도 해상도가 깨지지 않게 된다.
 *
 */
// ctx.scale(dpr, dpr);

/**
 * 08. resize 다루기 [start]
 */
let canvasWidth;
let canvasHeight;
let particles;

function init() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';

  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  ctx.scale(dpr, dpr);

  particles = [];
  const TOTAL = canvasWidth / 80;

  for (let i = 0; i < TOTAL; i++) {
    // 0부터 각 캔버스 크기 사이에 랜덤한 x, y 값이 나오게 된다.
    const x = randomNumBetween(0, canvasWidth);
    const y = randomNumBetween(0, canvasHeight);
    // 반지름 50~100 사이 랜덤한 사이즈의 공으로 만듦
    const radius = randomNumBetween(50, 100);
    const vy = randomNumBetween(1, 5);
    const particle = new Particle(x, y, radius, vy);
    particles.push(particle);
  }
}

/**
 * 08. resize 다루기 [end]
 */

/**
 * 07. dat GUI 활용해보기 [start]
 */

const feGaussianBlur = document.querySelector('feGaussianBlur');
const feColorMatrix = document.querySelector('feColorMatrix');

const controls = new (function () {
  this.blurValue = 40;
  this.alphaChannel = 100;
  this.alphaOffset = -23;
  this.acc = 1.03;
})();

let gui = new dat.GUI();

const f1 = gui.addFolder('Gooey Effect');
const f2 = gui.addFolder('Particle Property');
f1.open();
f2.open();

f1.add(controls, 'blurValue', 0, 100).onChange((value) => {
  feGaussianBlur.setAttribute('stdDeviation', value);
});
f1.add(controls, 'alphaChannel', 1, 200).onChange((value) => {
  feColorMatrix.setAttribute(
    'values',
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`,
  );
});
f1.add(controls, 'alphaOffset', -40, 40).onChange((value) => {
  feColorMatrix.setAttribute(
    'values',
    `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`,
  );
});

f2.add(controls, 'acc', 1, 1.5, 0.01).onChange((value) => {
  particles.forEach((particle) => (particle.acc = value));
});

/**
 * dat GUI 활용해보기 [end]
 */

// ctx.fillRect(10, 10, 50, 50);

// [03. 파티클 그리기 - start]

ctx.beginPath();
ctx.arc(100, 100, 50, 0, (Math.PI / 180) * 360);
// ctx.arc(100, 100, 50, 0, (Math.PI / 180) * 180); // 반원 혹은 반 호
// ctx.stroke(); // 선을 그림
ctx.fillStyle = 'red'; // fill하기 전에 색깔을 지정할 수 있음
ctx.fill();
ctx.closePath();

// 여러 파티클을 각 위치에 만들어서 사용하기 위해 class로 만든다.
class Particle {
  constructor(x, y, radius, vy) {
    // instance 생성 및 초기화
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vy = vy; // y의 속도값
    this.acc = 1.02; // 중력 가속도 흉내내기. this.gravity or this.acc (acceleration)
    // 1이하의 값을 무한히 곱하면 속도가 0으로 수렴하므로 멈추게 된다.
    // 0.9 는 더 빠르고, 0.99는 더 느리게 멈춤. (마찰력 같은 느낌임)
  }

  update() {
    this.vy *= this.acc;
    this.y += this.vy; // 속도가 일정
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, (Math.PI / 180) * 360);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();
  }
}
/**
 * 03.파티클 그리기 [start]
 */
// const x = 100;
// const y = 100;
// const radius = 50;
// const particle = new Particle(x, y, radius);
/**
 * 03.파티클 그리기 [end]
 */

// const TOTAL = 15;
const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min;
};

// let particles = [];

// for (let i = 0; i < TOTAL; i++) {
//   // 0부터 각 캔버스 크기 사이에 랜덤한 x, y 값이 나오게 된다.
//   const x = randomNumBetween(0, canvasWidth);
//   const y = randomNumBetween(0, canvasHeight);
//   // 반지름 50~100 사이 랜덤한 사이즈의 공으로 만듦
//   const radius = randomNumBetween(50, 100);
//   const vy = randomNumBetween(1, 5);
//   const particle = new Particle(x, y, radius, vy);
//   particles.push(particle);
// }

// particle.draw();
// [03. 파티클 그리기 - end]

// [04. 애니메이션 시키기 - start]

//   x를 1px 이동시키기
//  단순히 1px씩 x를 이동하게 한다면, 모든 모니터에서 같은 시간에 같은 값을 이동시키려면 이 안에서 하면 안됨.

// fps (frame per second)
// 이와 비슷하게 1초에 requestAnimation을 몇번 실행 시킬까?
// 를 고민하면 된다.

/**
 * 모니터 주사율이 60hz인 경우,
 * 1초에 60번 실행.
 * 즉 약 16ms마다 requestAnimationFrame이 실행된다
 * 내 애니메이션의 목표 fps = 10으로 설정
 * = 1초에 10번 프레임을 찍어라
 * = 100ms마다 requestAnimationFrame이 실행되어야 함.
 * fps가 커야 조금 부드럽게 된다. (1초에 60번 찍어내는 것...)
 */

let interval = 1000 / 60;
let now, delta;
let then = Date.now();

// 무한으로 실행되는 애니메이션
function animate() {
  window.requestAnimationFrame(animate); // 모니터 주사율을 기반으로 횟수가 다르게 찍혀서 나온다. (일반 - 60프레임)

  //   60fps의 조건으로 애니메이션이 작동하도록 구현
  now = Date.now();
  delta = now - then;

  if (delta < interval) return;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // 매 프레임 마다 전체 캔버스를 지우고 다시 그린다.

  //   particle.y += 1;
  //   particle.draw();

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius;
      particle.x = randomNumBetween(0, canvasWidth);
      particle.radius = randomNumBetween(50, 100);
      particle.vy = randomNumBetween(1, 4);
    }
  });

  then = now - (delta % interval);
}

/**
 * 08. resize 다루기 [start]
 */
window.addEventListener('load', () => {
  init();
  animate();
});

window.addEventListener('resize', () => {
  init();
});

/**
 * 08. resize 다루기 [end]
 */
