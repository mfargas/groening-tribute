import React, { useEffect, useRef } from 'react';

const Disenchantment = () => {
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
          Disenchantment
        </h1>
        <p ref={subtitleRef} className="hero-subtitle">
          A fantasy comedy series on Netflix
        </p>
        
        <div className="hero-description">
          <p>
            "Disenchantment" is an American animated fantasy sitcom created by Matt 
            Groening for Netflix. The series follows the misadventures of Bean, a 
            rebellious and alcoholic princess, her naive elf companion Elfo, and her 
            personal demon Luci.
          </p>
          <p>
            Set in the medieval fantasy kingdom of Dreamland, the show combines fantasy 
            elements with Groening's signature humor and social commentary. Unlike his 
            previous shows, "Disenchantment" features a serialized story format with 
            ongoing plotlines and character development.
          </p>
        </div>

        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">4</span>
            <span className="stat-label">Parts</span>
          </div>
          <div className="stat">
            <span className="stat-number">40</span>
            <span className="stat-label">Episodes</span>
          </div>
          <div className="stat">
            <span className="stat-number">2018</span>
            <span className="stat-label">Premiere Year</span>
          </div>
          <div className="stat">
            <span className="stat-number">Netflix</span>
            <span className="stat-label">Platform</span>
          </div>
          <div className="stat">
            <span className="stat-number">Fantasy</span>
            <span className="stat-label">Genre</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disenchantment; 