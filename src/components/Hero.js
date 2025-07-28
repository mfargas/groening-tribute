import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;

    if (title && subtitle) {
      title.style.opacity = '0';
      title.style.transform = 'translateY(30px)';
      subtitle.style.opacity = '0';
      subtitle.style.transform = 'translateY(30px)';

      setTimeout(() => {
        title.style.transition = 'all 0.8s ease-out';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 300);

      setTimeout(() => {
        subtitle.style.transition = 'all 0.8s ease-out';
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 600);
    }
  }, []);

  return (
    <div className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Matthew Groening
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          Creator of The Simpsons, Futurama, and Disenchantment
        </p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">35+</span>
            <span className="stat-label">Years</span>
          </div>
          <div className="stat">
            <span className="stat-number">3</span>
            <span className="stat-label">Iconic Shows</span>
          </div>
          <div className="stat">
            <span className="stat-number">750+</span>
            <span className="stat-label">Episodes</span>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-arrow"></div>
        <span>Scroll to explore</span>
      </div>
    </div>
  );
};

export default Hero; 