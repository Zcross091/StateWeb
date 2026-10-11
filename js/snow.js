/**
 * Whiteout Survival State 266 - Atmospheric Canvas Engine
 * Simulates gentle blizzard snowflakes and ascending furnace embers.
 * High-performance, low CPU overhead, automatically throttled when not visible.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('snow-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let isRunning = true;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Particle configuration
  const MAX_SNOW = Math.min(100, Math.floor(window.innerWidth / 15));
  const MAX_EMBERS = Math.min(25, Math.floor(window.innerWidth / 60));

  const snowflakes = [];
  const embers = [];

  class Snowflake {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.radius = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.opacity = Math.random() * 0.6 + 0.25;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.5;
      this.y += this.speedY;

      if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 240, 255, ${this.opacity})`;
      ctx.shadowBlur = this.radius > 2 ? 4 : 0;
      ctx.shadowColor = 'rgba(180, 225, 255, 0.7)';
      ctx.fill();
    }
  }

  class Ember {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 1.8 + 0.6;
      this.speedY = -(Math.random() * 1.4 + 0.7);
      this.speedX = Math.random() * 0.6 - 0.3;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.hue = Math.floor(Math.random() * 30 + 18); // 18-48: orange to golden amber
      this.pulse = Math.random() * Math.PI;
    }

    update() {
      this.pulse += 0.04;
      this.x += this.speedX + Math.sin(this.pulse) * 0.4;
      this.y += this.speedY;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
      }
    }

    draw() {
      const currentOpacity = this.opacity * (0.6 + 0.4 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 60%, ${currentOpacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 0.8)`;
      ctx.fill();
    }
  }

  // Populate particles
  for (let i = 0; i < MAX_SNOW; i++) {
    snowflakes.push(new Snowflake());
  }
  for (let i = 0; i < MAX_EMBERS; i++) {
    embers.push(new Ember());
  }

  function render() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // Draw embers first (in background depth)
    for (let i = 0; i < embers.length; i++) {
      embers[i].update();
      embers[i].draw();
    }

    // Draw snowflakes
    for (let i = 0; i < snowflakes.length; i++) {
      snowflakes[i].update();
      snowflakes[i].draw();
    }

    // Reset shadow blur for other renders
    ctx.shadowBlur = 0;

    animationFrameId = requestAnimationFrame(render);
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize, { passive: true });

  // Start loop
  render();

  // Expose toggle API to window
  window.Atmosphere = {
    toggle: function () {
      isRunning = !isRunning;
      if (isRunning) {
        render();
      } else {
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, width, height);
      }
      return isRunning;
    },
    isActive: function () {
      return isRunning;
    }
  };
})();
