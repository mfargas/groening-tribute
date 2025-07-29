import React, { useEffect, useRef } from 'react';

const TheSimpsons = () => {
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
          The Simpsons
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          The longest-running American animated series and cultural phenomenon
        </p>
        
        <div className="hero-description">
          <p>
            "The Simpsons" is an American animated sitcom created by Matt Groening for 
            the Fox Broadcasting Company. The series is a satirical depiction of American 
            life, epitomized by the Simpson family, which consists of Homer, Marge, Bart, 
            Lisa, and Maggie.
          </p>
          <p>
            The show is set in the fictional town of Springfield and lampoons many aspects 
            of American culture, society, and television itself. Since its debut on December 
            17, 1989, it has become the longest-running American sitcom and animated series.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">35+</span>
            <span className="stat-label">Seasons</span>
          </div>
          <div className="stat">
            <span className="stat-number">750+</span>
            <span className="stat-label">Episodes</span>
          </div>
          <div className="stat">
            <span className="stat-number">34</span>
            <span className="stat-label">Emmy Awards</span>
          </div>
          <div className="stat">
            <span className="stat-number">1989</span>
            <span className="stat-label">Premiere Year</span>
          </div>
          <div className="stat">
            <span className="stat-number">100+</span>
            <span className="stat-label">Countries</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheSimpsons; 