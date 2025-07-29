import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Game.css';

const Game = () => {
  const [player, setPlayer] = useState({
    x: 50,
    y: 50,
    character: 'marge', // marge, leela, bean
    direction: 'right',
    isMoving: false,
    animationFrame: 0,
    lastMoveTime: 0
  });

  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    isPlaying: false
  });

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Character sprites (8-bit style) - memoized to prevent re-creation
  const characters = useMemo(() => ({
    marge: {
      name: 'Marge Simpson',
      color: '#4CAF50',
      sprite: '👩‍🦱',
      speed: 3,
      spriteImage: null,
      spriteSheet: null
    },
    leela: {
      name: 'Leela',
      color: '#00BCD4',
      sprite: '👁️',
      speed: 4,
      spriteImage: null,
      spriteSheet: null
    },
    bean: {
      name: 'Princess Bean',
      color: '#8B0000',
      sprite: '👸',
      speed: 2,
      spriteImage: null,
      spriteSheet: null
    }
  }), []);

  // Load sprite sheet
  useEffect(() => {
    const loadSpriteSheet = () => {
      const img = new Image();
      img.onload = () => {
        // Update sprite sheet for all characters
        characters.marge.spriteSheet = img;
        characters.leela.spriteSheet = img;
        characters.bean.spriteSheet = img;
      };
      img.src = '/src/img/pc-walk-down.png';
    };
    loadSpriteSheet();
  }, [characters]);

  // Game controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameState.isPlaying) return;

      const newPlayer = { ...player };
      const currentTime = Date.now();
      let moved = false;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          newPlayer.y = Math.max(0, player.y - characters[player.character].speed);
          newPlayer.direction = 'up';
          moved = true;
          break;
        case 'ArrowDown':
        case 's':
          newPlayer.y = Math.min(400, player.y + characters[player.character].speed);
          newPlayer.direction = 'down';
          moved = true;
          break;
        case 'ArrowLeft':
        case 'a':
          newPlayer.x = Math.max(0, player.x - characters[player.character].speed);
          newPlayer.direction = 'left';
          moved = true;
          break;
        case 'ArrowRight':
        case 'd':
          newPlayer.x = Math.min(750, player.x + characters[player.character].speed);
          newPlayer.direction = 'right';
          moved = true;
          break;
        case '1':
          newPlayer.character = 'marge';
          break;
        case '2':
          newPlayer.character = 'leela';
          break;
        case '3':
          newPlayer.character = 'bean';
          break;
        default:
          return;
      }

      // Update animation frame if moved
      if (moved && currentTime - player.lastMoveTime > 150) {
        newPlayer.animationFrame = (player.animationFrame + 1) % 4;
        newPlayer.lastMoveTime = currentTime;
        newPlayer.isMoving = true;
      } else if (!moved) {
        newPlayer.isMoving = false;
        newPlayer.animationFrame = 0;
      }

      setPlayer(newPlayer);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, gameState.isPlaying, characters]);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const gameLoop = () => {
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1
      }));
    };

    gameLoopRef.current = setInterval(gameLoop, 100);
    return () => clearInterval(gameLoopRef.current);
  }, [gameState.isPlaying]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 800, 450);

    // Draw background grid (8-bit style)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 450);
      ctx.stroke();
    }
    for (let y = 0; y < 450; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Draw player sprite
    const char = characters[player.character];

    if (char.spriteSheet) {
      // Draw sprite sheet with animation
      const spriteWidth = 32;
      const spriteHeight = 32;
      const frameX = player.animationFrame * spriteWidth;
      const frameY = 0; // Assuming it's a horizontal sprite sheet

      ctx.drawImage(
        char.spriteSheet,
        frameX, frameY, spriteWidth, spriteHeight,
        player.x - 16, player.y - 16, spriteWidth, spriteHeight
      );
    } else {
      // Fallback to emoji sprite
      ctx.fillStyle = char.color;
      ctx.font = '32px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(char.sprite, player.x, player.y);
    }

    // Draw character name
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(char.name, player.x, player.y + 25);
  }, [player, characters]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, score: 0 }));
  };

  const stopGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const switchCharacter = (character) => {
    setPlayer(prev => ({ ...prev, character }));
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h2>8-Bit Character Adventure</h2>
        <p>Explore the tribute world with Matt Groening's iconic characters!</p>
      </div>

      <div className="game-controls">
        <button
          className={`char-btn ${player.character === 'marge' ? 'active' : ''}`}
          onClick={() => switchCharacter('marge')}
          style={{ backgroundColor: characters.marge.color }}
        >
          Marge
        </button>
        <button
          className={`char-btn ${player.character === 'leela' ? 'active' : ''}`}
          onClick={() => switchCharacter('leela')}
          style={{ backgroundColor: characters.leela.color }}
        >
          Leela
        </button>
        <button
          className={`char-btn ${player.character === 'bean' ? 'active' : ''}`}
          onClick={() => switchCharacter('bean')}
          style={{ backgroundColor: characters.bean.color }}
        >
          Bean
        </button>
      </div>

      <div className="game-stats">
        <span>Score: {gameState.score}</span>
        <span>Character: {characters[player.character].name}</span>
        <span>Position: ({player.x}, {player.y})</span>
      </div>

      <div className="game-area">
        <canvas
          ref={canvasRef}
          width={800}
          height={450}
          className="game-canvas"
        />

        {!gameState.isPlaying && (
          <div className="game-overlay">
            <button onClick={startGame} className="start-btn">
              Start Game
            </button>
          </div>
        )}

        {gameState.isPlaying && (
          <button onClick={stopGame} className="stop-btn">
            Stop Game
          </button>
        )}
      </div>

      <div className="game-instructions">
        <h3>Game Concept:</h3>
        <p>This is an <strong>interactive tribute game</strong> where you can:</p>
        <ul>
          <li><strong>Move around</strong> in an 8-bit style world</li>
          <li><strong>Switch between characters</strong> from different shows</li>
          <li><strong>Explore</strong> the tribute site in a fun, interactive way</li>
          <li><strong>Collect points</strong> while moving around</li>
        </ul>
        <h3>Controls:</h3>
        <ul>
          <li><strong>Movement:</strong> WASD or Arrow Keys</li>
          <li><strong>Switch Characters:</strong> Press 1 (Marge), 2 (Leela), 3 (Bean)</li>
          <li><strong>Start/Stop:</strong> Click the buttons</li>
        </ul>
      </div>
    </div>
  );
};

export default Game; 