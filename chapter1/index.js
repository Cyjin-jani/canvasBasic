const canvas = document.querySelector('canvas');
// canvas는 기본적으로 width 300, height 150으로 그려짐. (크기 조정 x인 경우에)
console.log('🚀 ~ file: index.js:2 ~ canvas:', canvas);

const ctx = canvas.getContext('2d');
console.log('🚀 ~ file: index.js:5 ~ ctx:', ctx);
console.log('dpr', window.devicePixelRatio);
const dpr = window.devicePixelRatio;

const canvasWidth = 300;
const canvasHeight = 300;

canvas.style.width = canvasWidth + 'px';
canvas.style.height = canvasHeight + 'px';

canvas.width = canvasWidth * dpr;
canvas.height = canvasHeight * dpr;
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
ctx.scale(dpr, dpr);

ctx.fillRect(10, 10, 50, 50);

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
