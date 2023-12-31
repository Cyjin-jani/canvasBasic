import CanvasOption from './js/CanvasOption.js';
import Particle from './js/Particle.js';
import { randomNumBetween } from './js/utils.js';

class Canvas extends CanvasOption {
  constructor() {
    super();

    this.particles = [];
  }
  init() {
    this.canvasWidth = innerWidth;
    this.canvasHeight = innerHeight;
    this.canvas.width = this.canvasWidth * this.dpr;
    this.canvas.height = this.canvasHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);

    this.canvas.style.width = this.canvasWidth + 'px';
    this.canvas.style.height = this.canvasHeight + 'px';

    this.createParticles();
  }

  createParticles() {
    const PARTICLE_NUM = 2000;
    const x = randomNumBetween(0, this.canvasWidth);
    const y = randomNumBetween(0, this.canvasHeight);

    for (let index = 0; index < PARTICLE_NUM; index++) {
      const vx = randomNumBetween(-5, 5);
      const vy = randomNumBetween(-5, 5);
      this.particles.push(new Particle(x, y, vx, vy));
    }
  }

  render() {
    let now, delta;
    let then = Date.now();

    const frame = () => {
      requestAnimationFrame(frame);
      now = Date.now();
      delta = now - then;
      if (delta < this.interval) return;

      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

      this.particles.forEach((particle, idx) => {
        particle.update();
        particle.draw();

        if (particle.opacity < 0) {
          this.particles.splice(idx, 1);
        }
      });

      then = now - (delta % this.interval);
    };
    requestAnimationFrame(frame);
  }
}

const canvas = new Canvas();

window.addEventListener('load', () => {
  canvas.init();
  canvas.render();
});

window.addEventListener('resize', () => {
  canvas.init();
});
