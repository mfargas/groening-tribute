'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from '../engine/GameEngine';
import { CanvasRenderer } from '../engine/CanvasRenderer';
import { CharacterManager } from '../data/CharacterManager';
import { PhysicsObject, GameConfig, GameState } from '../types/game';
import { CharacterData } from '../data/CharacterManager';
import { CollisionObject, CollisionWorkerResponse } from '../workers/collisionWorker';

interface GroeningVerseArcadeProps {
  width?: number;
  height?: number;
  onGameStateChange?: (gameState: GameState) => void;
  onScoreUpdate?: (score: number) => void;
}

export const GroeningVerseArcade: React.FC<GroeningVerseArcadeProps> = ({
  width = 800,
  height = 600,
  onGameStateChange,
  onScoreUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const characterManagerRef = useRef<CharacterManager | null>(null);
  const collisionWorkerRef = useRef<Worker | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentCharacter, setCurrentCharacter] = useState<CharacterData | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    frameTime: 0,
    renderTime: 0,
    physicsTime: 0,
  });

  // Initialize the game
  useEffect(() => {
    const initializeGame = async () => {
      if (!canvasRef.current) return;

      try {
        // Initialize character manager
        characterManagerRef.current = new CharacterManager();
        const defaultCharacter = characterManagerRef.current.getCurrentCharacter();
        setCurrentCharacter(defaultCharacter || null);

        // Initialize game engine
        const config: GameConfig = {
          targetFPS: 60,
          canvasWidth: width,
          canvasHeight: height,
          physics: {
            gravity: 980, // pixels per second squared
            friction: 0.95,
            bounce: 0.7,
          },
          rendering: {
            enableDoubleBuffering: true,
            enableObjectPooling: true,
            maxParticles: 1000,
          },
        };

        gameEngineRef.current = new GameEngine(config);

        // Initialize canvas renderer
        rendererRef.current = new CanvasRenderer(canvasRef.current, width, height);

        // Load sprite atlases
        await loadSpriteAtlases();

        // Initialize collision worker
        initializeCollisionWorker();

        // Create initial game objects
        createInitialObjects();

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initializeGame();

    return () => {
      cleanup();
    };
  }, [width, height]);

  // Game loop
  useEffect(() => {
    if (!isInitialized || !gameEngineRef.current || !rendererRef.current) return;

    const gameLoop = (timestamp: number) => {
      if (!gameEngineRef.current || !rendererRef.current) return;

      // Update game engine
      const objects = gameEngineRef.current.getAllPhysicsObjects();
      const currentGameState = gameEngineRef.current.getGameState();
      const metrics = gameEngineRef.current.getPerformanceMetrics();

      // Update collision detection via worker
      updateCollisionDetection(objects);

      // Render frame
      rendererRef.current.render(objects, timestamp);

      // Update state
      setGameState(currentGameState);
      setPerformanceMetrics(metrics);

      // Notify parent components
      onGameStateChange?.(currentGameState);
      onScoreUpdate?.(currentGameState.score);

      // Continue loop
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized, onGameStateChange, onScoreUpdate]);

  const loadSpriteAtlases = async () => {
    if (!rendererRef.current) return;

    try {
      // Load character sprites
      await rendererRef.current.loadSpriteAtlas(
        'characters',
        '/sprites/characters.png',
        {
          player_idle: { x: 0, y: 0, width: 32, height: 32, duration: 1000 },
          player_walk: { x: 32, y: 0, width: 32, height: 32, duration: 800 },
          enemy_idle: { x: 64, y: 0, width: 32, height: 32, duration: 1000 },
          collectible: { x: 96, y: 0, width: 16, height: 16, duration: 500 },
        }
      );
    } catch (error) {
      console.warn('Failed to load sprite atlases:', error);
    }
  };

  const initializeCollisionWorker = () => {
    try {
      collisionWorkerRef.current = new Worker(
        new URL('../workers/collisionWorker.ts', import.meta.url),
        { type: 'module' }
      );

      collisionWorkerRef.current.onmessage = (event: MessageEvent<CollisionWorkerResponse>) => {
        const { collisions, processingTime } = event.data;
        
        // Process collision results
        collisions.forEach(({ obj1, obj2 }) => {
          if (gameEngineRef.current) {
            const physicsObj1 = gameEngineRef.current.getPhysicsObject(obj1.id);
            const physicsObj2 = gameEngineRef.current.getPhysicsObject(obj2.id);
            
            if (physicsObj1 && physicsObj2) {
              // Handle collision in game engine
              gameEngineRef.current.addEvent({
                type: 'collision',
                timestamp: performance.now(),
                data: {
                  obj1: obj1.id,
                  obj2: obj2.id,
                  obj1Type: obj1.type,
                  obj2Type: obj2.type,
                },
              });
            }
          }
        });
      };
    } catch (error) {
      console.warn('Failed to initialize collision worker:', error);
    }
  };

  const updateCollisionDetection = (objects: PhysicsObject[]) => {
    if (!collisionWorkerRef.current) return;

    const collisionObjects: CollisionObject[] = objects.map(obj => ({
      id: obj.id,
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      type: obj.type,
    }));

    collisionWorkerRef.current.postMessage({
      type: 'updateObjects',
      objects: collisionObjects,
    });

    collisionWorkerRef.current.postMessage({
      type: 'checkCollisions',
      timestamp: performance.now(),
    });
  };

  const createInitialObjects = () => {
    if (!gameEngineRef.current || !currentCharacter) return;

    // Create player
    const player: PhysicsObject = {
      id: 'player',
      x: width / 2 - 16,
      y: height - 100,
      width: 32,
      height: 32,
      velocityX: 0,
      velocityY: 0,
      mass: 1,
      type: 'player',
    };

    gameEngineRef.current.addPhysicsObject(player);

    // Create some initial collectibles
    for (let i = 0; i < 5; i++) {
      const collectible: PhysicsObject = {
        id: `collectible_${i}`,
        x: Math.random() * (width - 16),
        y: Math.random() * (height - 16),
        width: 16,
        height: 16,
        velocityX: 0,
        velocityY: 0,
        mass: 0.1,
        type: 'collectible',
      };

      gameEngineRef.current.addPhysicsObject(collectible);
    }
  };

  const cleanup = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.stop();
    }
    
    if (collisionWorkerRef.current) {
      collisionWorkerRef.current.terminate();
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Game controls
  const startGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.start();
    }
  }, []);

  const pauseGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.pause();
    }
  }, []);

  const stopGame = useCallback(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.stop();
    }
  }, []);

  const switchCharacter = useCallback((characterId: string) => {
    if (characterManagerRef.current) {
      const success = characterManagerRef.current.setCurrentCharacter(characterId);
      if (success) {
        const newCharacter = characterManagerRef.current.getCurrentCharacter();
        setCurrentCharacter(newCharacter || null);
      }
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameEngineRef.current) return;

      const player = gameEngineRef.current.getPhysicsObject('player');
      if (!player) return;

      const speed = currentCharacter?.stats.speed || 3;
      const moveSpeed = speed * 100; // pixels per second

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          player.velocityX = -moveSpeed;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          player.velocityX = moveSpeed;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          player.velocityY = -moveSpeed;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          player.velocityY = moveSpeed;
          break;
        case ' ':
          event.preventDefault();
          pauseGame();
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!gameEngineRef.current) return;

      const player = gameEngineRef.current.getPhysicsObject('player');
      if (!player) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ArrowRight':
        case 'd':
        case 'D':
          player.velocityX = 0;
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ArrowDown':
        case 's':
        case 'S':
          player.velocityY = 0;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentCharacter, pauseGame]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing Groening-Verse Arcade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-300 rounded-lg"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Game UI Overlay */}
      <div className="absolute top-4 left-4 text-white">
        <div className="bg-black bg-opacity-50 p-2 rounded">
          <div>Score: {gameState?.score || 0}</div>
          <div>Lives: {gameState?.lives || 3}</div>
          <div>Level: {gameState?.level || 1}</div>
          <div>Time: {Math.ceil(gameState?.timeRemaining || 0)}</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="absolute top-4 right-4 text-white">
        <div className="bg-black bg-opacity-50 p-2 rounded text-xs">
          <div>FPS: {Math.round(performanceMetrics.fps)}</div>
          <div>Frame: {performanceMetrics.frameTime.toFixed(1)}ms</div>
        </div>
      </div>

      {/* Character Info */}
      {currentCharacter && (
        <div className="absolute bottom-4 left-4 text-white">
          <div className="bg-black bg-opacity-50 p-2 rounded">
            <div className="font-bold">{currentCharacter.name}</div>
            <div className="text-sm">{currentCharacter.archetype}</div>
            <div className="text-xs">{currentCharacter.description}</div>
          </div>
        </div>
      )}

      {/* Game Controls */}
      <div className="absolute bottom-4 right-4">
        <div className="flex gap-2">
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            Start
          </button>
          <button
            onClick={pauseGame}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
          >
            Pause
          </button>
          <button
            onClick={stopGame}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
};
