import React from 'react';

const Biography = () => {
  return (
    <div className="biography">
      <div className="biography-header">
        <h2>Biography</h2>
        <p>The life and career of Matthew Abram Groening</p>
      </div>

      <div className="biography-content">
        <div className="bio-section">
          <h3>Early Life</h3>
          <p>
            Matthew Abram Groening was born on February 15, 1954, in Portland, Oregon. 
            He grew up in a middle-class family and developed an early interest in drawing 
            and cartooning. His father, Homer Groening, was a filmmaker and advertising 
            executive, while his mother, Margaret Ruth Groening, was a teacher.
          </p>
          <p>
            Groening attended Lincoln High School in Portland, where he began creating 
            cartoons for the school newspaper. He later enrolled at The Evergreen State 
            College in Olympia, Washington, graduating in 1977 with a degree in philosophy.
          </p>
        </div>

        <div className="bio-section">
          <h3>Early Career</h3>
          <p>
            After college, Groening moved to Los Angeles to pursue a career in writing. 
            He worked various odd jobs while developing his cartooning skills. In 1977, 
            he created his first comic strip, "Life in Hell," which featured anthropomorphic 
            rabbits and other characters dealing with everyday life's absurdities.
          </p>
          <p>
            "Life in Hell" gained a cult following and was eventually syndicated in 
            over 250 newspapers. The strip's success caught the attention of television 
            producers, leading to Groening's first foray into animation.
          </p>
        </div>

        <div className="bio-section">
          <h3>Breakthrough with The Simpsons</h3>
          <p>
            In 1987, Groening was approached by James L. Brooks to create animated 
            shorts for "The Tracey Ullman Show." Groening created a dysfunctional family 
            called the Simpsons, named after his own family members. The shorts became 
            so popular that they were spun off into their own series in 1989.
          </p>
          <p>
            "The Simpsons" became a cultural phenomenon, revolutionizing animated 
            television and becoming the longest-running American sitcom and animated 
            series. The show has won numerous awards and influenced countless other 
            animated series.
          </p>
        </div>

        <div className="bio-section">
          <h3>Continued Success</h3>
          <p>
            Following the success of "The Simpsons," Groening created "Futurama" in 1999, 
            a science fiction animated series that ran for seven seasons. In 2018, he 
            created "Disenchantment" for Netflix, marking his first project with a 
            streaming service.
          </p>
          <p>
            Throughout his career, Groening has received numerous awards and honors, 
            including Emmy Awards, a Peabody Award, and a star on the Hollywood Walk 
            of Fame. He was also named one of Time magazine's 100 most influential 
            people in 2007.
          </p>
        </div>

        <div className="bio-stats">
          <div className="stat-item">
            <span className="stat-number">1954</span>
            <span className="stat-label">Born in Portland, Oregon</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1977</span>
            <span className="stat-label">Created Life in Hell</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1989</span>
            <span className="stat-label">The Simpsons Premiered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1999</span>
            <span className="stat-label">Futurama Created</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">2018</span>
            <span className="stat-label">Disenchantment Released</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Biography; 