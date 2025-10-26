'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import SideNav from './SideNav';
import './Game.css';
import './SideNav.css';

interface Character {
  name: string;
  color: string;
  sprite: string;
  speed: number;
  ability: string;
  spriteImage: HTMLImageElement | null;
  spriteSheet: HTMLImageElement | null;
  spriteWidth: number;
  spriteHeight: number;
  totalFrames: number;
  currentFrame: number;
  frameDelay: number;
}

type CharacterKey = 'marge' | 'leela' | 'bean';

const Game = () => {
  const [player, setPlayer] = useState({
    x: 50,
    y: 50,
    character: 'marge' as CharacterKey, // marge, leela, bean
    direction: 'right',
    isMoving: false,
    animationFrame: 0,
    lastMoveTime: 0
  });

  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    isPlaying: false,
    collectiblesCollected: 0,
    totalCollectibles: 5,
    allCollectiblesFound: false
  });

  const [collectibles, setCollectibles] = useState([
    { id: 1, x: 0.1, y: 0.1, type: 'donut', collected: false }, // Relative positions (0-1)
    { id: 2, x: 0.3, y: 0.2, type: 'slurm', collected: false },
    { id: 3, x: 0.5, y: 0.15, type: 'beer', collected: false },
    { id: 4, x: 0.2, y: 0.35, type: 'duff', collected: false },
    { id: 5, x: 0.6, y: 0.3, type: 'krusty', collected: false }
  ]);

  const [obstacles, setObstacles] = useState([
    { id: 1, x: 0.2, y: 0.2, width: 0.04, height: 0.04, type: 'rock' }, // Relative positions and sizes
    { id: 2, x: 0.5, y: 0.35, width: 0.06, height: 0.03, type: 'log' },
    { id: 3, x: 0.75, y: 0.15, width: 0.05, height: 0.05, type: 'bush' }
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const keys = useRef<Record<string, boolean>>({});
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 0,
    frameTime: 0,
    lastFpsUpdate: 0,
    frameCount: 0
  });

  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'ability' | 'cultural';
    title: string;
    content: string;
    timestamp: number;
  }>>([]);

  const [announcements, setAnnouncements] = useState<string>('');
  const [notificationsShown, setNotificationsShown] = useState(false);
  const [notificationCounter, setNotificationCounter] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Character sprites (8-bit style) - memoized to prevent re-creation
  const characters = useMemo((): Record<CharacterKey, Character> => ({
    marge: {
      name: 'Marge Simpson',
      color: '#4CAF50',
      sprite: '👩‍🦱',
      speed: 3,
      ability: 'Maternal Instinct - Collects items from 40% further away (1980s-1990s family values)',
      spriteImage: null as HTMLImageElement | null,
      spriteSheet: null as HTMLImageElement | null,
      spriteWidth: 32,
      spriteHeight: 32,
      totalFrames: 4,
      currentFrame: 0,
      frameDelay: 0
    },
    leela: {
      name: 'Leela Turanga',
      color: '#00BCD4',
      sprite: '👁️',
      speed: 4,
      ability: 'Cyclops Vision - Sees through obstacles (1990s-2000s sci-fi warrior)',
      spriteImage: null as HTMLImageElement | null,
      spriteSheet: null as HTMLImageElement | null,
      spriteWidth: 32,
      spriteHeight: 32,
      totalFrames: 4,
      currentFrame: 0,
      frameDelay: 0
    },
    bean: {
      name: 'Princess Bean',
      color: '#8B0000',
      sprite: '👸',
      speed: 2,
      ability: 'Royal Charm - Items give 50% bonus points (2010s-Present anti-princess)',
      spriteImage: null as HTMLImageElement | null,
      spriteSheet: null as HTMLImageElement | null,
      spriteWidth: 32,
      spriteHeight: 32,
      totalFrames: 4,
      currentFrame: 0,
      frameDelay: 0
    }
  }), []);

  // Show notification popup
  const showNotification = (type: 'ability' | 'cultural', title: string, content: string) => {
    console.log('showNotification called:', { type, title, content });
    const newId = `notification-${Date.now()}-${notificationCounter}`;
    setNotificationCounter(prev => prev + 1);
    
    const notification = {
      id: newId,
      type,
      title,
      content,
      timestamp: notificationCounter // Use counter instead of Date.now()
    };
    
    console.log('Adding notification:', notification);
    setNotifications(prev => {
      const newNotifications = [...prev, notification];
      console.log('Updated notifications:', newNotifications);
      return newNotifications;
    });
    
    // Announce to screen readers
    const announcement = `${title}: ${content}`;
    setAnnouncements(announcement);
    
    // Auto-remove after 15 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 15000);
  };

  // Close notification manually
  const closeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Load sprite sheet
  useEffect(() => {
    const loadSpriteSheet = () => {
      const img = new Image();
      img.onload = () => {
        // Calculate sprite dimensions based on the actual image
        const totalFrames = 2; // pc-walk-down.png has 2 frames
        const frameWidth = img.width / totalFrames;
        const frameHeight = img.height;

        // Update sprite sheet and dimensions for all characters
        characters.marge.spriteSheet = img;
        characters.marge.spriteWidth = frameWidth;
        characters.marge.spriteHeight = frameHeight;
        characters.marge.totalFrames = totalFrames;

        characters.leela.spriteSheet = img;
        characters.leela.spriteWidth = frameWidth;
        characters.leela.spriteHeight = frameHeight;
        characters.leela.totalFrames = totalFrames;

        characters.bean.spriteSheet = img;
        characters.bean.spriteWidth = frameWidth;
        characters.bean.spriteHeight = frameHeight;
        characters.bean.totalFrames = totalFrames;
      };
      img.src = '/pc-walk-down.png';
    };
    loadSpriteSheet();
  }, [characters]);

  // Optimized input handling for <16ms latency
  useEffect(() => {
    let lastInputTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;
      
      const currentTime = performance.now();
      const inputLatency = currentTime - lastInputTime;
      
      // Prevent duplicate key events
      if (keys.current[e.key]) return;
      keys.current[e.key] = true;

      // Immediate response for character switching (no movement delay)
      if (['1', '2', '3'].includes(e.key)) {
        const characterMap = { '1': 'marge', '2': 'leela', '3': 'bean' } as const;
        setPlayer(prev => ({ ...prev, character: characterMap[e.key as keyof typeof characterMap] }));
        return;
      }

      // Movement with optimized delta time calculation
      const deltaTime = Math.min(inputLatency, 16); // Cap at 16ms for consistent movement
      const speed = characters[player.character].speed * (deltaTime / 16); // Normalize to 60fps

      setPlayer(prev => {
        const newPlayer = { ...prev };
        let moved = false;

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            newPlayer.y = Math.max(0, prev.y - speed);
            newPlayer.direction = 'up';
            moved = true;
            break;
          case 'ArrowDown':
          case 's':
            newPlayer.y = Math.min(400, prev.y + speed);
            newPlayer.direction = 'down';
            moved = true;
            break;
          case 'ArrowLeft':
          case 'a':
            newPlayer.x = Math.max(0, prev.x - speed);
            newPlayer.direction = 'left';
            moved = true;
            break;
          case 'ArrowRight':
          case 'd':
            newPlayer.x = Math.min(750, prev.x + speed);
            newPlayer.direction = 'right';
            moved = true;
            break;
        }

        if (moved) {
          const char = characters[newPlayer.character];
          newPlayer.animationFrame = (prev.animationFrame + 1) % (char.totalFrames || 2);
          newPlayer.isMoving = true;
          newPlayer.lastMoveTime = currentTime;
        }

        return newPlayer;
      });

      lastInputTime = currentTime;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
      
      // Stop movement when key is released
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        setPlayer(prev => ({ ...prev, isMoving: false, animationFrame: 0 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('keyup', handleKeyUp, { passive: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState.isPlaying, characters]);

  // Basic performance monitoring that runs always
  useEffect(() => {
    let animationId: number;
    
    const monitorPerformance = (currentTime: number) => {
      setPerformanceMetrics(prevMetrics => {
        const deltaTime = currentTime - (prevMetrics.lastFpsUpdate || currentTime);
        const newMetrics = { ...prevMetrics };
        
        if (deltaTime > 0) {
          newMetrics.frameTime = deltaTime;
          newMetrics.frameCount++;
          
          // Update FPS every second
          if (currentTime - (newMetrics.lastFpsUpdate || 0) > 1000) {
            newMetrics.fps = Math.round((newMetrics.frameCount * 1000) / (currentTime - (newMetrics.lastFpsUpdate || currentTime)));
            newMetrics.frameCount = 0;
            newMetrics.lastFpsUpdate = currentTime;
          }
        }
        
        return newMetrics;
      });
      
      animationId = requestAnimationFrame(monitorPerformance);
    };
    
    animationId = requestAnimationFrame(monitorPerformance);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []); // Run always, not just when game is playing

  // Game loop with integrated collision detection
  useEffect(() => {
    if (!gameState.isPlaying || !isClient) return;

    console.log('Game loop started');

    const gameLoop = () => {
      // Get current canvas dimensions
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const canvasWidth = canvas.clientWidth;
      const canvasHeight = canvas.clientHeight;
      const playerSize = 32;

      // Update player position based on input
      setPlayer(prevPlayer => {
        const newPlayer = { ...prevPlayer };
        const speed = 3;
        const deltaTime = 1; // Simplified for now

        if (keys.current.w || keys.current.ArrowUp) {
          newPlayer.y = Math.max(0, newPlayer.y - speed * deltaTime);
        }
        if (keys.current.s || keys.current.ArrowDown) {
          newPlayer.y = Math.min(canvasHeight - playerSize, newPlayer.y + speed * deltaTime);
        }
        if (keys.current.a || keys.current.ArrowLeft) {
          newPlayer.x = Math.max(0, newPlayer.x - speed * deltaTime);
        }
        if (keys.current.d || keys.current.ArrowRight) {
          newPlayer.x = Math.min(canvasWidth - playerSize, newPlayer.x + speed * deltaTime);
        }

        return newPlayer;
      });

      // Check collisions with collectibles
      setCollectibles(prev => prev.map(collectible => {
        if (!collectible.collected) {
          // Convert relative positions to absolute positions
          const collectibleX = collectible.x * canvasWidth;
          const collectibleY = collectible.y * canvasHeight;
          
          const distance = Math.sqrt(
            Math.pow(player.x - collectibleX, 2) +
            Math.pow(player.y - collectibleY, 2)
          );

          // Character-specific collection ranges (relative to canvas size)
          let collectionRange = Math.min(canvasWidth, canvasHeight) * 0.05; // 5% of smaller dimension
          if (player.character === 'marge') {
            collectionRange = Math.min(canvasWidth, canvasHeight) * 0.07; // 7% for Marge
          }

          if (distance < collectionRange) {
            console.log('Collection detected!', { 
              collectible, 
              distance, 
              collectionRange, 
              playerPos: { x: player.x, y: player.y },
              collectiblePos: { x: collectibleX, y: collectibleY }
            });
            
            // Update game state
            setGameState(prevState => {
              const newCollectiblesCollected = prevState.collectiblesCollected + 1;
              let finalScoreBonus = player.character === 'bean' ? 75 : 50;

              // Show notifications for first collectible (only once per game session)
              if (newCollectiblesCollected === 1 && !notificationsShown) {
                console.log('Showing notifications for first collectible');
                setNotificationsShown(true);
                const char = characters[player.character];
                showNotification('ability', '💡 Ability', char.ability);
                
                // Show cultural context notification after a short delay
                setTimeout(() => {
                  const culturalContext = player.character === 'marge' 
                    ? 'Maternal archetype from 1980s-1990s animation - traditional family values with hidden depths'
                    : player.character === 'leela'
                    ? 'Warrior archetype from 1990s-2000s sci-fi - strong female leader breaking gender barriers'
                    : 'Rebel archetype from 2010s-Present - anti-princess rejecting traditional femininity';
                  showNotification('cultural', '❓ Cultural Context', culturalContext);
                }, 1000);
              }

              // Bonus for completing all collectibles
              if (newCollectiblesCollected === prevState.totalCollectibles) {
                finalScoreBonus += 200;
              }

              return {
                ...prevState,
                score: prevState.score + finalScoreBonus,
                collectiblesCollected: newCollectiblesCollected,
                allCollectiblesFound: newCollectiblesCollected === prevState.totalCollectibles
              };
            });

            return { ...collectible, collected: true };
          }
        }
        return collectible;
      }));
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, player, characters, notificationsShown, isClient]);

  // Render game
  useEffect(() => {
    if (!isClient) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas internal dimensions to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background grid (8-bit style)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvasWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvasHeight; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Draw player sprite
    const char = characters[player.character];

    if (char.spriteSheet) {
      // Draw sprite sheet with animation using actual dimensions
      const spriteWidth = char.spriteWidth || 32;
      const spriteHeight = char.spriteHeight || 32;
      const frameX = player.animationFrame * spriteWidth;
      const frameY = 0; // Horizontal sprite sheet

      ctx.drawImage(
        char.spriteSheet,
        frameX, frameY, spriteWidth, spriteHeight,
        player.x - spriteWidth / 2, player.y - spriteHeight / 2, spriteWidth, spriteHeight
      );
    } else {
      // Fallback to emoji sprite
      ctx.fillStyle = char.color;
      ctx.font = '32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(char.sprite, player.x, player.y);
    }

    // Draw collectibles
    collectibles.forEach(collectible => {
      if (!collectible.collected) {
        // Convert relative positions to absolute positions
        const x = collectible.x * canvasWidth;
        const y = collectible.y * canvasHeight;
        
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw collectible type
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(collectible.type.charAt(0).toUpperCase(), x, y + 3);
      }
    });

    // Draw obstacles with character-specific effects
    obstacles.forEach(obstacle => {
      // Convert relative positions and sizes to absolute
      const x = obstacle.x * canvasWidth;
      const y = obstacle.y * canvasHeight;
      const width = obstacle.width * canvasWidth;
      const height = obstacle.height * canvasHeight;
      
      // Leela's Cyclops Vision: Make obstacles semi-transparent
      if (player.character === 'leela') {
        ctx.globalAlpha = 0.3; // See through obstacles
      } else {
        ctx.globalAlpha = 1.0; // Normal opacity
      }
      
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, width, height);

      // Draw obstacle type
      ctx.fillStyle = '#fff';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obstacle.type, x + width / 2, y + height / 2 + 2);
      
      // Reset alpha
      ctx.globalAlpha = 1.0;
    });

    // Draw character name
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(char.name, player.x, player.y + 25);
  }, [player, characters, collectibles, obstacles, isClient]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      score: 0,
      collectiblesCollected: 0,
      allCollectiblesFound: false
    }));
    // Reset collectibles
    setCollectibles([
      { id: 1, x: 0.1, y: 0.1, type: 'donut', collected: false },
      { id: 2, x: 0.3, y: 0.2, type: 'slurm', collected: false },
      { id: 3, x: 0.5, y: 0.15, type: 'beer', collected: false },
      { id: 4, x: 0.2, y: 0.35, type: 'duff', collected: false },
      { id: 5, x: 0.6, y: 0.3, type: 'krusty', collected: false }
    ]);
    // Reset notifications flag
    setNotificationsShown(false);
    // Clear any existing notifications
    setNotifications([]);
    // Don't reset notification counter - keep it incrementing to avoid duplicate keys
  };

  const stopGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const switchCharacter = (character: CharacterKey) => {
    setPlayer(prev => ({ ...prev, character }));
    // Character switching is free - no points for just switching
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>🕹️ GROENING-VERSE ARCADE</h2>
        <p>Experience Matt Groening&apos;s iconic female characters through interactive gameplay!</p>
      </div>
      
      <div className="arcade-layout">
        <div className="game-main-area">
          <div className="game-area">
            <canvas
              ref={canvasRef}
              className="game-canvas"
            />

            {!gameState.isPlaying && (
              <div className="game-overlay"></div>
            )}

            {!gameState.isPlaying && (
              <button 
                onClick={startGame} 
                className="start-btn"
                aria-label="Start the Groening-Verse Arcade game"
                title="Click to begin playing the arcade game"
              >
                INSERT COIN TO START
              </button>
            )}

            {gameState.isPlaying && (
              <button 
                onClick={stopGame} 
                className="stop-btn"
                aria-label="Stop the current game"
                title="Click to stop the current game"
              >
                STOP GAME
              </button>
            )}
          </div>
          
          <div className="game-stats-bottom" role="status" aria-label="Game statistics">
            <div className="stats-left">
              <span aria-label={`Current score: ${gameState.score}`}>SCORE: {gameState.score}</span>
              <span aria-label={`Current character: ${characters[player.character].name}`}>CHAR: {characters[player.character].name.toUpperCase()}</span>
              <span aria-label={`Collectibles collected: ${gameState.collectiblesCollected} out of ${gameState.totalCollectibles}`}>ITEMS: {gameState.collectiblesCollected}/{gameState.totalCollectibles}</span>
            </div>
            <div className="stats-right">
              <span 
                className="performance-metric"
                aria-label={`Performance metrics: ${performanceMetrics.fps || 0} frames per second, ${performanceMetrics.frameTime ? performanceMetrics.frameTime.toFixed(1) : '0.0'} milliseconds per frame`}
              >
                FPS: {performanceMetrics.fps || 0} | 
                FRAME: {performanceMetrics.frameTime ? performanceMetrics.frameTime.toFixed(1) : '0.0'}ms
                {!gameState.isPlaying && <span style={{color: '#666'}}> (Start game to see live metrics)</span>}
              </span>
              <button 
                onClick={() => console.log('Performance Metrics:', performanceMetrics)}
                className="debug-btn"
                aria-label="Log performance metrics to console"
                title="Debug: Log performance data to browser console"
              >
                DEBUG
              </button>
            </div>
          </div>
        </div>
        
        <div className="arcade-sidebar">
          <div className="character-selector" role="group" aria-label="Character selection">
            <h3>SELECT CHARACTER</h3>
            <div className="character-buttons">
              <button
                onClick={() => switchCharacter('marge')}
                className={`char-btn ${player.character === 'marge' ? 'active' : ''}`}
                style={{ backgroundColor: player.character === 'marge' ? '#4CAF50' : '#333' }}
                aria-pressed={player.character === 'marge'}
                aria-label={`Select Marge Simpson character. ${player.character === 'marge' ? 'Currently selected.' : ''} Ability: Maternal Instinct - collects items from further away.`}
                title="Switch to Marge Simpson (Key: 1)"
              >
                <div className="char-icon">👩‍🦱</div>
                <div className="char-name">MARGE SIMPSON</div>
                <div className="char-ability">Maternal Instinct</div>
              </button>
              <button
                onClick={() => switchCharacter('leela')}
                className={`char-btn ${player.character === 'leela' ? 'active' : ''}`}
                style={{ backgroundColor: player.character === 'leela' ? '#00BCD4' : '#333' }}
                aria-pressed={player.character === 'leela'}
                aria-label={`Select Leela character. ${player.character === 'leela' ? 'Currently selected.' : ''} Ability: Cyclops Vision - sees through obstacles.`}
                title="Switch to Leela (Key: 2)"
              >
                <div className="char-icon">👁️</div>
                <div className="char-name">LEELA TURANGA</div>
                <div className="char-ability">Cyclops Vision</div>
              </button>
              <button
                onClick={() => switchCharacter('bean')}
                className={`char-btn ${player.character === 'bean' ? 'active' : ''}`}
                style={{ backgroundColor: player.character === 'bean' ? '#8B0000' : '#333' }}
                aria-pressed={player.character === 'bean'}
                aria-label={`Select Princess Bean character. ${player.character === 'bean' ? 'Currently selected.' : ''} Ability: Royal Charm - bonus points for collectibles.`}
                title="Switch to Princess Bean (Key: 3)"
              >
                <div className="char-icon">👑</div>
                <div className="char-name">PRINCESS BEAN</div>
                <div className="char-ability">Royal Charm</div>
              </button>
            </div>
          </div>
          
          <div className="arcade-controls">
            <h3>CONTROLS</h3>
            <div className="control-instructions">
              <div className="control-row">
                <span className="control-key">WASD</span>
                <span className="control-desc">MOVE</span>
              </div>
              <div className="control-row">
                <span className="control-key">1-3</span>
                <span className="control-desc">CHARACTER</span>
              </div>
              <div className="control-row">
                <span className="control-key">SPACE</span>
                <span className="control-desc">START/STOP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {gameState.allCollectiblesFound && (
        <div className="completion-celebration">
          🎉 <strong>ALL COLLECTIBLES FOUND!</strong> 🎉
          <br />
          <small>You&apos;ve completed the tribute collection!</small>
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
        role="status"
      >
        {announcements}
      </div>

      {/* Notifications */}
      <div className="notifications-container" role="region" aria-label="Game notifications">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type}`}
            role="alert"
            aria-labelledby={`notification-title-${notification.id}`}
            aria-describedby={`notification-content-${notification.id}`}
          >
            <div className="notification-header">
              <span 
                id={`notification-title-${notification.id}`}
                className="notification-icon"
              >
                {notification.title}
              </span>
              <button
                className="notification-close"
                onClick={() => closeNotification(notification.id)}
                aria-label={`Close ${notification.title} notification`}
                title="Close notification"
              >
                ×
              </button>
            </div>
            <div 
              id={`notification-content-${notification.id}`}
              className="notification-content"
            >
              {notification.content}
            </div>
          </div>
        ))}
      </div>

      <SideNav />
    </div>
  );
};

export default Game; 