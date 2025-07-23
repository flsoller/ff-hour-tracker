<template>
  <div class="particle-background">
    <canvas ref="canvas" class="particle-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let animationId: number | null = null;
let particles: Particle[] = [];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

/**
 * Creates a new particle with random position, velocity, and lifespan
 * @returns {Particle} A new particle object with initial properties
 */
function createParticle(): Particle {
  return {
    x: Math.random() * (canvas.value?.width || 0),
    y: Math.random() * (canvas.value?.height || 0),
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    life: 0,
    maxLife: Math.random() * 300 + 100,
  };
}

/**
 * Updates all particles by moving them and checking for lifecycle or boundary conditions
 * Replaces particles that have exceeded their lifespan or moved outside canvas bounds
 */
function updateParticles() {
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    if (
      particle.life > particle.maxLife
      || particle.x < 0 || particle.x > (canvas.value?.width || 0)
      || particle.y < 0 || particle.y > (canvas.value?.height || 0)
    ) {
      particles[index] = createParticle();
    }
  });
}

/**
 * Renders the particle system on the canvas
 * Draws the gradient background, particles, and connecting lines between nearby particles
 */
function drawParticles() {
  if (!ctx || !canvas.value) return;

  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  // Draw gradient background
  const gradient = ctx.createLinearGradient(
    0,
    0,
    canvas.value.width,
    canvas.value.height,
  );
  gradient.addColorStop(0, "rgba(13, 13, 13, 0.95)");
  gradient.addColorStop(0.5, "rgba(25, 25, 50, 0.9)");
  gradient.addColorStop(1, "rgba(13, 13, 13, 0.95)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

  // Draw particles
  particles.forEach(particle => {
    const alpha = 1 - (particle.life / particle.maxLife);
    ctx!.beginPath();
    ctx!.arc(particle.x, particle.y, 1, 0, Math.PI * 2);
    ctx!.fillStyle = `rgba(100, 150, 255, ${alpha * 0.8})`;
    ctx!.fill();
  });

  // Draw connecting lines
  particles.forEach((particleA, indexA) => {
    particles.slice(indexA + 1).forEach(particleB => {
      const dx = particleA.x - particleB.x;
      const dy = particleA.y - particleB.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const alpha = (1 - distance / 120) * 0.3;
        const alphaA = 1 - (particleA.life / particleA.maxLife);
        const alphaB = 1 - (particleB.life / particleB.maxLife);
        const finalAlpha = alpha * Math.min(alphaA, alphaB);

        ctx!.beginPath();
        ctx!.moveTo(particleA.x, particleA.y);
        ctx!.lineTo(particleB.x, particleB.y);
        ctx!.strokeStyle = `rgba(100, 150, 255, ${finalAlpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      }
    });
  });
}

/**
 * Main animation loop that updates and renders particles
 * Schedules the next frame using requestAnimationFrame for smooth animation
 */
function animate() {
  updateParticles();
  drawParticles();
  animationId = requestAnimationFrame(animate);
}

/**
 * Handles window resize events by adjusting canvas dimensions and recreating particles
 * Ensures the particle system adapts to the new viewport size
 */
function resizeCanvas() {
  if (!canvas.value) return;

  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;

  // Recreate particles for new dimensions
  particles = Array.from({ length: 80 }, () => createParticle());
}

onMounted(() => {
  if (!canvas.value) return;

  ctx = canvas.value.getContext("2d");
  if (!ctx) return;

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  animate();
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener("resize", resizeCanvas);
});
</script>

<style lang="scss" scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
