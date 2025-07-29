import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import TheSimpsons from './components/TheSimpsons';
import Futurama from './components/Futurama';
import Disenchantment from './components/Disenchantment';
import Timeline from './components/Timeline';
import Game from './components/Game';
import './stylesheets/App.css';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);

      if (e.deltaY > 0 && currentSection < 5) {
        setCurrentSection(prev => prev + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        setCurrentSection(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSection, isScrolling]);

  useEffect(() => {
    const sectionsContainer = document.querySelector('.sections-container');
    if (sectionsContainer) {
      const translateX = -currentSection * 100;
      sectionsContainer.style.transform = `translateX(${translateX}vw)`;
    }
  }, [currentSection]);

  return (
    <div className="app">
      <nav className="navigation">
        <div className="nav-brand">Matt Groening</div>
        <div className="nav-links">
          <button
            className={`nav-link ${currentSection === 1 ? 'active' : ''}`}
            onClick={() => setCurrentSection(1)}
          >
            The Simpsons
          </button>
          <button
            className={`nav-link ${currentSection === 2 ? 'active' : ''}`}
            onClick={() => setCurrentSection(2)}
          >
            Futurama
          </button>
          <button
            className={`nav-link ${currentSection === 3 ? 'active' : ''}`}
            onClick={() => setCurrentSection(3)}
          >
            Disenchantment
          </button>
          <button
            className={`nav-link ${currentSection === 4 ? 'active' : ''}`}
            onClick={() => setCurrentSection(4)}
          >
            Timeline
          </button>
          <button
            className={`nav-link ${currentSection === 5 ? 'active' : ''}`}
            onClick={() => setCurrentSection(5)}
          >
            Game
          </button>
        </div>
      </nav>

      <div className="sections-container">
        <section className="section">
          <Hero />
        </section>

        <section className="section">
          <TheSimpsons />
        </section>

        <section className="section">
          <Futurama />
        </section>

        <section className="section">
          <Disenchantment />
        </section>

        <section className="section">
          <Timeline />
        </section>

        <section className="section">
          <Game />
        </section>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-dots">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`scroll-dot ${currentSection === index ? 'active' : ''}`}
              onClick={() => setCurrentSection(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
