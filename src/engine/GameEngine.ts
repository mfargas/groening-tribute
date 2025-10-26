import { GameState, PhysicsObject, GameEvent, Vector2D, BoundingBox, GameConfig, PerformanceMetrics } from '../types/game';

export class GameEngine {
  private gameState: GameState;
  private physicsObjects: Map<string, PhysicsObject> = new Map();
  private gameEvents: GameEvent[] = [];
  private config: GameConfig;
  private performanceMetrics: PerformanceMetrics;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;

  constructor(config: GameConfig) {
    this.config = config;
    this.gameState = {
      score: 0,
      level: 1,
      lives: 3,
      timeRemaining: 120, // 2 minutes
      isPlaying: false,
      isPaused: false,
      currentCharacter: 'marge',
    };
    this.performanceMetrics = {
      fps: 0,
      frameTime: 0,
      renderTime: 0,
      physicsTime: 0,
      memoryUsage: 0,
    };
  }

  // Core game loop
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.gameState.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    this.isRunning = false;
    this.gameState.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause(): void {
    this.gameState.isPaused = !this.gameState.isPaused;
  }

  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update performance metrics
    this.updatePerformanceMetrics(deltaTime);

    if (!this.gameState.isPaused) {
      // Update physics
      const physicsStart = performance.now();
      this.updatePhysics(deltaTime);
      this.performanceMetrics.physicsTime = performance.now() - physicsStart;

      // Update game logic
      this.updateGameLogic(deltaTime);

      // Process events
      this.processEvents();
    }

    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private updatePhysics(deltaTime: number): void {
    const deltaSeconds = deltaTime / 1000;

    this.physicsObjects.forEach((obj) => {
      // Apply gravity
      if (obj.type !== 'player') {
        obj.velocityY += this.config.physics.gravity * deltaSeconds;
      }

      // Apply friction
      obj.velocityX *= this.config.physics.friction;
      obj.velocityY *= this.config.physics.friction;

      // Update position
      obj.x += obj.velocityX * deltaSeconds;
      obj.y += obj.velocityY * deltaSeconds;

      // Boundary collision
      this.handleBoundaryCollision(obj);
    });

    // Check collisions between objects
    this.checkCollisions();
  }

  private handleBoundaryCollision(obj: PhysicsObject): void {
    const canvas = this.config.canvasWidth;
    const canvasHeight = this.config.canvasHeight;

    // Left/Right boundaries
    if (obj.x < 0) {
      obj.x = 0;
      obj.velocityX *= -this.config.physics.bounce;
    } else if (obj.x + obj.width > canvas) {
      obj.x = canvas - obj.width;
      obj.velocityX *= -this.config.physics.bounce;
    }

    // Top/Bottom boundaries
    if (obj.y < 0) {
      obj.y = 0;
      obj.velocityY *= -this.config.physics.bounce;
    } else if (obj.y + obj.height > canvasHeight) {
      obj.y = canvasHeight - obj.height;
      obj.velocityY *= -this.config.physics.bounce;
      
      // If it's an enemy or obstacle, remove it
      if (obj.type === 'enemy' || obj.type === 'obstacle') {
        this.removePhysicsObject(obj.id);
      }
    }
  }

  private checkCollisions(): void {
    const objects = Array.from(this.physicsObjects.values());
    
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        const obj1 = objects[i];
        const obj2 = objects[j];
        
        if (this.isColliding(obj1, obj2)) {
          this.handleCollision(obj1, obj2);
        }
      }
    }
  }

  private isColliding(obj1: PhysicsObject, obj2: PhysicsObject): boolean {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  private handleCollision(obj1: PhysicsObject, obj2: PhysicsObject): void {
    // Create collision event
    this.addEvent({
      type: 'collision',
      timestamp: performance.now(),
      data: {
        obj1: obj1.id,
        obj2: obj2.id,
        obj1Type: obj1.type,
        obj2Type: obj2.type,
      },
    });

    // Handle specific collision types
    if (obj1.type === 'player' && obj2.type === 'collectible') {
      this.handleCollectibleCollision(obj1, obj2);
    } else if (obj1.type === 'player' && obj2.type === 'enemy') {
      this.handleEnemyCollision(obj1, obj2);
    }
  }

  private handleCollectibleCollision(player: PhysicsObject, collectible: PhysicsObject): void {
    this.gameState.score += 100;
    this.removePhysicsObject(collectible.id);
    
    this.addEvent({
      type: 'collect',
      timestamp: performance.now(),
      data: {
        collectibleId: collectible.id,
        score: 100,
      },
    });
  }

  private handleEnemyCollision(player: PhysicsObject, enemy: PhysicsObject): void {
    this.gameState.lives--;
    this.removePhysicsObject(enemy.id);
    
    if (this.gameState.lives <= 0) {
      this.addEvent({
        type: 'gameOver',
        timestamp: performance.now(),
        data: {},
      });
      this.stop();
    }
  }

  private updateGameLogic(deltaTime: number): void {
    // Update timer
    this.gameState.timeRemaining -= deltaTime / 1000;
    
    if (this.gameState.timeRemaining <= 0) {
      this.addEvent({
        type: 'gameOver',
        timestamp: performance.now(),
        data: {},
      });
      this.stop();
    }

    // Check for level up
    if (this.gameState.score > 0 && this.gameState.score % 1000 === 0) {
      this.gameState.level++;
      this.addEvent({
        type: 'levelUp',
        timestamp: performance.now(),
        data: {
          newLevel: this.gameState.level,
        },
      });
    }
  }

  private processEvents(): void {
    // Process events and clear the queue
    this.gameEvents.forEach((event) => {
      // Event processing logic can be extended here
      console.log('Game Event:', event);
    });
    this.gameEvents = [];
  }

  private updatePerformanceMetrics(deltaTime: number): void {
    this.frameCount++;
    this.performanceMetrics.frameTime = deltaTime;
    this.performanceMetrics.fps = 1000 / deltaTime;
    
    // Update memory usage (if available)
    if ('memory' in performance) {
      this.performanceMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
  }

  // Public API methods
  addPhysicsObject(obj: PhysicsObject): void {
    this.physicsObjects.set(obj.id, obj);
  }

  removePhysicsObject(id: string): void {
    this.physicsObjects.delete(id);
  }

  getPhysicsObject(id: string): PhysicsObject | undefined {
    return this.physicsObjects.get(id);
  }

  getAllPhysicsObjects(): PhysicsObject[] {
    return Array.from(this.physicsObjects.values());
  }

  addEvent(event: GameEvent): void {
    this.gameEvents.push(event);
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  updateGameState(updates: Partial<GameState>): void {
    this.gameState = { ...this.gameState, ...updates };
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  // Utility methods
  createVector(x: number, y: number): Vector2D {
    return { x, y };
  }

  createBoundingBox(x: number, y: number, width: number, height: number): BoundingBox {
    return { x, y, width, height };
  }

  distance(obj1: PhysicsObject, obj2: PhysicsObject): number {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
