import { PhysicsObject, SpriteAtlas, AnimationFrame, PerformanceMetrics } from '../types/game';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;
  private spriteAtlases: Map<string, SpriteAtlas> = new Map();
  private objectPool: Map<string, PhysicsObject[]> = new Map();
  private particlePool: Particle[] = [];
  private maxParticles: number = 1000;

  constructor(canvas: HTMLCanvasElement, width: number, height: number) {
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;

    // Create offscreen canvas for double buffering
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d')!;

    // Initialize object pools
    this.initializeObjectPools();
  }

  private initializeObjectPools(): void {
    // Initialize particle pool
    for (let i = 0; i < this.maxParticles; i++) {
      this.particlePool.push(new Particle());
    }
  }

  // Load sprite atlas
  async loadSpriteAtlas(name: string, imagePath: string, frameData: Record<string, AnimationFrame>): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.spriteAtlases.set(name, {
          image: img,
          frames: frameData,
        });
        resolve();
      };
      img.onerror = reject;
      img.src = imagePath;
    });
  }

  // Main render method
  render(objects: PhysicsObject[], deltaTime: number): void {
    const startTime = performance.now();

    // Clear offscreen canvas
    this.offscreenCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background
    this.renderBackground();

    // Render all objects
    objects.forEach((obj) => {
      this.renderObject(obj, deltaTime);
    });

    // Render particles
    this.renderParticles(deltaTime);

    // Render UI overlay
    this.renderUI();

    // Copy offscreen canvas to main canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.offscreenCanvas, 0, 0);

    const renderTime = performance.now() - startTime;
    this.updatePerformanceMetrics(renderTime);
  }

  private renderBackground(): void {
    // Create gradient background
    const gradient = this.offscreenCtx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    
    this.offscreenCtx.fillStyle = gradient;
    this.offscreenCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add grid pattern
    this.offscreenCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    this.offscreenCtx.lineWidth = 1;
    
    for (let x = 0; x < this.canvas.width; x += 50) {
      this.offscreenCtx.beginPath();
      this.offscreenCtx.moveTo(x, 0);
      this.offscreenCtx.lineTo(x, this.canvas.height);
      this.offscreenCtx.stroke();
    }
    
    for (let y = 0; y < this.canvas.height; y += 50) {
      this.offscreenCtx.beginPath();
      this.offscreenCtx.moveTo(0, y);
      this.offscreenCtx.lineTo(this.canvas.width, y);
      this.offscreenCtx.stroke();
    }
  }

  private renderObject(obj: PhysicsObject, deltaTime: number): void {
    this.offscreenCtx.save();

    // Apply object-specific rendering
    switch (obj.type) {
      case 'player':
        this.renderPlayer(obj, deltaTime);
        break;
      case 'enemy':
        this.renderEnemy(obj, deltaTime);
        break;
      case 'collectible':
        this.renderCollectible(obj, deltaTime);
        break;
      case 'obstacle':
        this.renderObstacle(obj, deltaTime);
        break;
    }

    this.offscreenCtx.restore();
  }

  private renderPlayer(obj: PhysicsObject, deltaTime: number): void {
    // Render player with character-specific sprite
    const atlas = this.spriteAtlases.get('characters');
    if (atlas) {
      const frame = atlas.frames['player_idle'];
      this.offscreenCtx.drawImage(
        atlas.image,
        frame.x, frame.y, frame.width, frame.height,
        obj.x, obj.y, obj.width, obj.height
      );
    } else {
      // Fallback rendering
      this.offscreenCtx.fillStyle = '#4CAF50';
      this.offscreenCtx.fillRect(obj.x, obj.y, obj.width, obj.height);
    }

    // Add glow effect
    this.offscreenCtx.shadowColor = '#4CAF50';
    this.offscreenCtx.shadowBlur = 10;
    this.offscreenCtx.fillStyle = 'rgba(76, 175, 80, 0.3)';
    this.offscreenCtx.fillRect(obj.x - 5, obj.y - 5, obj.width + 10, obj.height + 10);
  }

  private renderEnemy(obj: PhysicsObject, deltaTime: number): void {
    // Render enemy with pulsing effect
    const pulse = Math.sin(deltaTime * 0.01) * 0.2 + 0.8;
    this.offscreenCtx.fillStyle = `rgba(244, 67, 54, ${pulse})`;
    this.offscreenCtx.fillRect(obj.x, obj.y, obj.width, obj.height);

    // Add danger indicator
    this.offscreenCtx.strokeStyle = '#f44336';
    this.offscreenCtx.lineWidth = 2;
    this.offscreenCtx.strokeRect(obj.x, obj.y, obj.width, obj.height);
  }

  private renderCollectible(obj: PhysicsObject, deltaTime: number): void {
    // Render collectible with rotation and glow
    const rotation = deltaTime * 0.005;
    this.offscreenCtx.save();
    this.offscreenCtx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
    this.offscreenCtx.rotate(rotation);
    
    this.offscreenCtx.fillStyle = '#FFD700';
    this.offscreenCtx.shadowColor = '#FFD700';
    this.offscreenCtx.shadowBlur = 15;
    this.offscreenCtx.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
    
    this.offscreenCtx.restore();
  }

  private renderObstacle(obj: PhysicsObject, deltaTime: number): void {
    // Render obstacle with static appearance
    this.offscreenCtx.fillStyle = '#795548';
    this.offscreenCtx.fillRect(obj.x, obj.y, obj.width, obj.height);
    
    // Add texture
    this.offscreenCtx.strokeStyle = '#5D4037';
    this.offscreenCtx.lineWidth = 1;
    this.offscreenCtx.strokeRect(obj.x, obj.y, obj.width, obj.height);
  }

  private renderParticles(deltaTime: number): void {
    this.particlePool.forEach((particle) => {
      if (particle.active) {
        particle.update(deltaTime);
        this.offscreenCtx.save();
        this.offscreenCtx.globalAlpha = particle.alpha;
        this.offscreenCtx.fillStyle = particle.color;
        this.offscreenCtx.fillRect(particle.x, particle.y, particle.size, particle.size);
        this.offscreenCtx.restore();
      }
    });
  }

  private renderUI(): void {
    // Render UI elements like score, lives, etc.
    this.offscreenCtx.fillStyle = 'white';
    this.offscreenCtx.font = '16px Arial';
    this.offscreenCtx.fillText('Score: 0', 10, 30);
    this.offscreenCtx.fillText('Lives: 3', 10, 50);
    this.offscreenCtx.fillText('Level: 1', 10, 70);
  }

  // Particle system
  createParticle(x: number, y: number, color: string): void {
    const particle = this.particlePool.find(p => !p.active);
    if (particle) {
      particle.reset(x, y, color);
    }
  }

  // Performance monitoring
  private updatePerformanceMetrics(renderTime: number): void {
    // This would be connected to the main performance monitoring system
  }

  // Utility methods
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.offscreenCanvas.width = width;
    this.offscreenCanvas.height = height;
  }
}

// Particle class for the particle system
class Particle {
  x: number = 0;
  y: number = 0;
  velocityX: number = 0;
  velocityY: number = 0;
  size: number = 2;
  alpha: number = 1;
  color: string = '#ffffff';
  life: number = 1000;
  maxLife: number = 1000;
  active: boolean = false;

  reset(x: number, y: number, color: string): void {
    this.x = x;
    this.y = y;
    this.velocityX = (Math.random() - 0.5) * 200;
    this.velocityY = (Math.random() - 0.5) * 200;
    this.size = Math.random() * 4 + 1;
    this.alpha = 1;
    this.color = color;
    this.life = this.maxLife;
    this.active = true;
  }

  update(deltaTime: number): void {
    this.x += this.velocityX * deltaTime / 1000;
    this.y += this.velocityY * deltaTime / 1000;
    this.life -= deltaTime;
    this.alpha = this.life / this.maxLife;
    
    if (this.life <= 0) {
      this.active = false;
    }
  }
}
