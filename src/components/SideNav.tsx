'use client';

import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label={`Close ${title} modal`}
            title="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

const SideNav: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <nav className="side-nav" role="navigation" aria-label="Game information">
        <button 
          className="nav-item" 
          onClick={() => openModal('technical')}
          aria-label="Open Technical Achievement information"
          title="View technical achievements and performance metrics"
        >
          <span className="nav-icon" aria-hidden="true">⚡</span>
          <span className="nav-label">Technical</span>
        </button>
        <button 
          className="nav-item" 
          onClick={() => openModal('cultural')}
          aria-label="Open Cultural Narrative Design information"
          title="View cultural context and character evolution"
        >
          <span className="nav-icon" aria-hidden="true">🎭</span>
          <span className="nav-label">Cultural</span>
        </button>
        <button 
          className="nav-item" 
          onClick={() => openModal('architecture')}
          aria-label="Open Modular Architecture information"
          title="View technical architecture and design patterns"
        >
          <span className="nav-icon" aria-hidden="true">🏗️</span>
          <span className="nav-label">Architecture</span>
        </button>
        <button 
          className="nav-item" 
          onClick={() => openModal('controls')}
          aria-label="Open Game Controls information"
          title="View game controls and character abilities"
        >
          <span className="nav-icon" aria-hidden="true">🎮</span>
          <span className="nav-label">Controls</span>
        </button>
      </nav>

      <Modal isOpen={activeModal === 'technical'} onClose={closeModal} title="Technical Achievement">
        <div className="modal-section">
          <h3>60 FPS Gameplay in React</h3>
          <p>This arcade demonstrates <strong>60 FPS gameplay in React</strong> with <strong>&lt;16ms input latency</strong> through:</p>
          <ul>
            <li><strong>requestAnimationFrame</strong> - Synchronized with browser refresh rate</li>
            <li><strong>Optimized Input Handling</strong> - Passive event listeners with key state tracking</li>
            <li><strong>Delta Time Normalization</strong> - Consistent movement regardless of frame rate</li>
            <li><strong>Performance Monitoring</strong> - Real-time FPS and frame time tracking</li>
          </ul>
          
          <h3>Performance Metrics</h3>
          <p>Look for the <strong>green performance box</strong> in the game stats section showing:</p>
          <ul>
            <li><strong>FPS</strong> - Frames per second (targeting 60)</li>
            <li><strong>Frame Time</strong> - Individual frame rendering time (targeting &lt;16ms)</li>
          </ul>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'cultural'} onClose={closeModal} title="Cultural Narrative Design">
        <div className="modal-section">
          <h3>Evolution of Female Representation</h3>
          <p>Each character represents a different era of female representation in Matt Groening&apos;s animation:</p>
          
          <div className="character-era">
            <h4>Marge Simpson (1980s-1990s)</h4>
            <p><strong>Maternal Archetype</strong> - Traditional family values with hidden depths</p>
            <p><strong>Gameplay</strong>: Collects items from 40% further away (maternal instinct)</p>
          </div>
          
          <div className="character-era">
            <h4>Leela (1990s-2000s)</h4>
            <p><strong>Warrior Archetype</strong> - Strong female leader breaking gender barriers</p>
            <p><strong>Gameplay</strong>: Sees through obstacles (cyclops vision - they become transparent)</p>
          </div>
          
          <div className="character-era">
            <h4>Princess Bean (2010s-Present)</h4>
            <p><strong>Rebel Archetype</strong> - Anti-princess rejecting traditional femininity</p>
            <p><strong>Gameplay</strong>: Gets 50% bonus points (royal charm)</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'architecture'} onClose={closeModal} title="Modular Architecture">
        <div className="modal-section">
          <h3>Bridging React & Real-time Rendering</h3>
          <p>This project demonstrates a modular architecture bridging front-end component systems and real-time rendering pipelines:</p>
          
          <h4>Component-Based Game State</h4>
          <p>React state management for game logic and UI updates</p>
          
          <h4>Canvas Rendering Pipeline</h4>
          <p>Direct canvas manipulation for high-performance graphics</p>
          
          <h4>Memoized Character Data</h4>
          <p>Optimized character system with cultural context using React&apos;s useMemo</p>
          
          <h4>Performance-First Design</h4>
          <p>Technical optimization without sacrificing React&apos;s component benefits</p>
          
          <h4>Separation of Concerns</h4>
          <p>Game logic, rendering, and UI are cleanly separated for maintainability</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'controls'} onClose={closeModal} title="Game Controls">
        <div className="modal-section">
          <h3>Movement Controls</h3>
          <ul>
            <li><strong>WASD</strong> or <strong>Arrow Keys</strong> - Move character (optimized for &lt;16ms response)</li>
            <li><strong>Character Switching</strong> - Press 1 (Marge), 2 (Leela), 3 (Bean)</li>
            <li><strong>Start/Stop</strong> - Click the game buttons</li>
          </ul>
          
          <h3>Character Abilities</h3>
          <ul>
            <li><strong>Marge</strong> - Maternal Instinct: Collect items from further away</li>
            <li><strong>Leela</strong> - Cyclops Vision: See through obstacles</li>
            <li><strong>Bean</strong> - Royal Charm: Bonus points for collectibles</li>
          </ul>
          
          <h3>Gameplay</h3>
          <ul>
            <li>Collect items from Matt Groening&apos;s shows (donuts, slurm, beer, duff, krusty)</li>
            <li>Switch between characters to experience different abilities</li>
            <li>Score points by collecting items and completing objectives</li>
          </ul>
        </div>
      </Modal>
    </>
  );
};

export default SideNav;
