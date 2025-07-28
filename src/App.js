import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Gallery from './components/Gallery';
import Footer from './components/Footer';
import './stylesheets/App.css';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;

      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 1000);

      if (e.deltaY > 0 && currentSection < 3) {
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
      const translateX = -(3 - currentSection) * 100;
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
        </div>
      </nav>

      <div className="sections-container">
        <section className="section hero-section">
          <Hero />
        </section>

        <section className="section timeline-section">
          <Timeline />
        </section>

        <section className="section gallery-section">
          <Gallery />
        </section>

        <section className="section footer-section">
          <Footer />
        </section>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-dots">
          {[0, 1, 2, 3].map((index) => (
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
