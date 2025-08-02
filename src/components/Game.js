import React, { useState, useEffect, useRef, useMemo } from 'react';
import './Game.css';
import pcWalkDown from '../img/pc-walk-down.png';

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
    isPlaying: false,
    collectiblesCollected: 0,
    totalCollectibles: 5,
    allCollectiblesFound: false
  });

  const [collectibles, setCollectibles] = useState([
    { id: 1, x: 100, y: 100, type: 'donut', collected: false },
    { id: 2, x: 300, y: 200, type: 'slurm', collected: false },
    { id: 3, x: 500, y: 150, type: 'beer', collected: false },
    { id: 4, x: 200, y: 350, type: 'duff', collected: false },
    { id: 5, x: 600, y: 300, type: 'krusty', collected: false }
  ]);

  const [obstacles, setObstacles] = useState([
    { id: 1, x: 150, y: 150, width: 40, height: 40, type: 'rock' },
    { id: 2, x: 400, y: 250, width: 60, height: 30, type: 'log' },
    { id: 3, x: 650, y: 100, width: 50, height: 50, type: 'bush' }
  ]);

  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);

  // Character sprites (8-bit style) - memoized to prevent re-creation
  const characters = useMemo(() => ({
    marge: {
      name: 'Marge Simpson',
      color: '#4CAF50',
      sprite: '👩‍🦱',
      speed: 3,
      ability: 'Maternal Instinct - Collects items from further away',
      spriteImage: null,
      spriteSheet: null
    },
    leela: {
      name: 'Leela',
      color: '#00BCD4',
      sprite: '👁️',
      speed: 4,
      ability: 'Cyclops Vision - Sees through obstacles',
      spriteImage: null,
      spriteSheet: null
    },
    bean: {
      name: 'Princess Bean',
      color: '#8B0000',
      sprite: '👸',
      speed: 2,
      ability: 'Royal Charm - Items give bonus points',
      spriteImage: null,
      spriteSheet: null
    }
  }), []);

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
      img.src = pcWalkDown;
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
        const char = characters[player.character];
        const totalFrames = char.totalFrames || 2; // Default to 2 frames if not loaded yet
        newPlayer.animationFrame = (player.animationFrame + 1) % totalFrames;
        newPlayer.lastMoveTime = currentTime;
        newPlayer.isMoving = true;

        // Movement doesn't give points - only accomplishments do
      } else if (!moved) {
        newPlayer.isMoving = false;
        newPlayer.animationFrame = 0;
      }

      setPlayer(newPlayer);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, gameState.isPlaying, characters]);

  // Game loop - removed automatic score increment
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const gameLoop = () => {
      // Game loop can be used for other periodic updates if needed
      // Score is now only earned through collectibles and other actions
    };

    gameLoopRef.current = setInterval(gameLoop, 100);
    return () => clearInterval(gameLoopRef.current);
  }, [gameState.isPlaying]);

  // Check for collectibles and obstacles
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const checkCollisions = () => {
      const char = characters[player.character];
      const spriteWidth = char.spriteWidth || 32;
      const spriteHeight = char.spriteHeight || 32;

      // Check collectibles
      setCollectibles(prev => prev.map(collectible => {
        if (!collectible.collected) {
          const distance = Math.sqrt(
            Math.pow(player.x - collectible.x, 2) +
            Math.pow(player.y - collectible.y, 2)
          );

          // Character-specific collection ranges and bonuses
          let collectionRange = 30;
          let scoreBonus = 50;

          if (player.character === 'marge') {
            collectionRange = 40; // Maternal instinct - longer range
          } else if (player.character === 'bean') {
            scoreBonus = 75; // Royal charm - bonus points
          }

          if (distance < collectionRange) {
            const newCollectiblesCollected = gameState.collectiblesCollected + 1;
            let finalScoreBonus = scoreBonus;

            // Bonus for completing all collectibles
            if (newCollectiblesCollected === gameState.totalCollectibles) {
              finalScoreBonus += 200; // Completion bonus
              setGameState(prevState => ({
                ...prevState,
                allCollectiblesFound: true
              }));
            }

            setGameState(prevState => ({
              ...prevState,
              score: prevState.score + finalScoreBonus,
              collectiblesCollected: newCollectiblesCollected
            }));
            return { ...collectible, collected: true };
          }
        }
        return collectible;
      }));
    };

    const collisionInterval = setInterval(checkCollisions, 100);
    return () => clearInterval(collisionInterval);
  }, [player, gameState.isPlaying, characters]);

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
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(collectible.x, collectible.y, 8, 0, 2 * Math.PI);
        ctx.fill();

        // Draw collectible type
        ctx.fillStyle = '#fff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(collectible.type.charAt(0).toUpperCase(), collectible.x, collectible.y + 3);
      }
    });

    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

      // Draw obstacle type
      ctx.fillStyle = '#fff';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(obstacle.type, obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2 + 2);
    });

    // Draw character name
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(char.name, player.x, player.y + 25);
  }, [player, characters, collectibles, obstacles]);

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
      { id: 1, x: 100, y: 100, type: 'donut', collected: false },
      { id: 2, x: 300, y: 200, type: 'slurm', collected: false },
      { id: 3, x: 500, y: 150, type: 'beer', collected: false },
      { id: 4, x: 200, y: 350, type: 'duff', collected: false },
      { id: 5, x: 600, y: 300, type: 'krusty', collected: false }
    ]);
  };

  const stopGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }));
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
  };

  const switchCharacter = (character) => {
    setPlayer(prev => ({ ...prev, character }));
    // Character switching is free - no points for just switching
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
        <span>Collectibles: {gameState.collectiblesCollected}/{gameState.totalCollectibles}</span>
        <span>Position: ({player.x}, {player.y})</span>
      </div>

      <div className="character-ability">
        <strong>Ability:</strong> {characters[player.character].ability}
      </div>

      {gameState.allCollectiblesFound && (
        <div className="completion-celebration">
          🎉 <strong>ALL COLLECTIBLES FOUND!</strong> 🎉
          <br />
          <small>You've completed the tribute collection!</small>
        </div>
      )}

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
          <li><strong>Collect items</strong> from Matt Groening's shows (donuts, slurm, beer, duff, krusty)</li>
          <li><strong>Switch between characters</strong> from different shows</li>
          <li><strong>Explore</strong> the tribute site in a fun, interactive way</li>
          <li><strong>Score points</strong> by collecting items and moving around</li>
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