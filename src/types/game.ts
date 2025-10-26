import { z } from 'zod';

// Character Archetype Schema
export const CharacterArchetypeSchema = z.enum(['maternal', 'warrior', 'rebel']);

// Character Stats Schema
export const CharacterStatsSchema = z.object({
  speed: z.number().min(0).max(10),
  strength: z.number().min(0).max(10),
  agility: z.number().min(0).max(10),
  intelligence: z.number().min(0).max(10),
  specialAbility: z.string(),
  specialCooldown: z.number().min(0),
});

// Character Schema
export const CharacterSchema = z.object({
  id: z.string(),
  name: z.string(),
  archetype: CharacterArchetypeSchema,
  stats: CharacterStatsSchema,
  spriteSheet: z.string(),
  animations: z.record(z.string(), z.object({
    frames: z.number(),
    duration: z.number(),
    loop: z.boolean(),
  })),
  abilities: z.array(z.object({
    name: z.string(),
    description: z.string(),
    cooldown: z.number(),
    effect: z.string(),
  })),
});

// Game State Schema
export const GameStateSchema = z.object({
  score: z.number(),
  level: z.number(),
  lives: z.number(),
  timeRemaining: z.number(),
  isPlaying: z.boolean(),
  isPaused: z.boolean(),
  currentCharacter: z.string(),
});

// Physics Object Schema
export const PhysicsObjectSchema = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  velocityX: z.number(),
  velocityY: z.number(),
  mass: z.number(),
  type: z.enum(['player', 'enemy', 'collectible', 'obstacle']),
});

// Game Event Schema
export const GameEventSchema = z.object({
  type: z.enum(['collision', 'collect', 'ability', 'levelUp', 'gameOver']),
  timestamp: z.number(),
  data: z.record(z.any()),
});

// Export types
export type CharacterArchetype = z.infer<typeof CharacterArchetypeSchema>;
export type CharacterStats = z.infer<typeof CharacterStatsSchema>;
export type Character = z.infer<typeof CharacterSchema>;
export type GameState = z.infer<typeof GameStateSchema>;
export type PhysicsObject = z.infer<typeof PhysicsObjectSchema>;
export type GameEvent = z.infer<typeof GameEventSchema>;

// Additional types for the engine
export interface Vector2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AnimationFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  duration: number;
}

export interface SpriteAtlas {
  image: HTMLImageElement;
  frames: Record<string, AnimationFrame>;
}

export interface GameConfig {
  targetFPS: number;
  canvasWidth: number;
  canvasHeight: number;
  physics: {
    gravity: number;
    friction: number;
    bounce: number;
  };
  rendering: {
    enableDoubleBuffering: boolean;
    enableObjectPooling: boolean;
    maxParticles: number;
  };
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  renderTime: number;
  physicsTime: number;
  memoryUsage: number;
}
