import React, { useEffect, useRef } from 'react';

const Futurama = () => {
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
    <div className="section hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <h1 ref={titleRef} className="hero-title">
          Futurama
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          A sci-fi comedy set in the year 3000
        </p>
        
        <div className="hero-description">
          <p>
            "Futurama" is an American animated science fiction sitcom created by Matt 
            Groening and developed by Groening and David X. Cohen for the Fox Broadcasting 
            Company. The series follows the adventures of Philip J. Fry, a 20th-century 
            pizza delivery boy who is accidentally frozen and wakes up 1,000 years later.
          </p>
          <p>
            Set in New New York in the year 3000, the show combines science fiction 
            elements with comedy, featuring a diverse cast of characters including robots, 
            aliens, and mutants. The series is known for its clever writing, scientific 
            accuracy, and emotional depth.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">7</span>
            <span className="stat-label">Seasons</span>
          </div>
          <div className="stat">
            <span className="stat-number">140</span>
            <span className="stat-label">Episodes</span>
          </div>
          <div className="stat">
            <span className="stat-number">1999</span>
            <span className="stat-label">Premiere Year</span>
          </div>
          <div className="stat">
            <span className="stat-number">2013</span>
            <span className="stat-label">Final Season</span>
          </div>
          <div className="stat">
            <span className="stat-number">3000</span>
            <span className="stat-label">Setting Year</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Futurama; 