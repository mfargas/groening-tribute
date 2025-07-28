import React from 'react';

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Matt Groening</h3>
          <p>
            Matthew Abram Groening is an American cartoonist, writer, producer, and animator. 
            He is the creator of the comic strip Life in Hell and the television series 
            The Simpsons, Futurama, and Disenchantment.
          </p>
        </div>

        <div className="footer-section">
          <h3>Notable Achievements</h3>
          <ul>
            <li>Emmy Award winner</li>
            <li>Peabody Award recipient</li>
            <li>Hollywood Walk of Fame star</li>
            <li>Time 100 Most Influential People</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Quick Facts</h3>
          <ul>
            <li>Born: February 15, 1954</li>
            <li>Birthplace: Portland, Oregon</li>
            <li>Education: The Evergreen State College</li>
            <li>First Comic: Life in Hell (1977)</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Connect</h3>
          <div className="social-links">
            <a href="https://en.wikipedia.org/wiki/Matt_Groening" target="_blank" rel="noopener noreferrer">
              Wikipedia
            </a>
            <a href="https://www.imdb.com/name/nm0001311/" target="_blank" rel="noopener noreferrer">
              IMDb
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Matt Groening Tribute. This is a fan-made tribute site.</p>
        <p>All images and content belong to their respective owners.</p>
      </div>
    </div>
  );
};

export default Footer;
