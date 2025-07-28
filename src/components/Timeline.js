import React, { useState } from 'react';
import EarlyLife from './TimelineContent/LifeNHell';
import TheSimpsons from './TimelineContent/TheSimpsons';
import TracyUlman from './TimelineContent/TracyUlman';
import Futurama from './TimelineContent/Futurama';

const Timeline = () => {
  const [activeTab, setActiveTab] = useState(0);

  const timelineData = [
    {
      id: 0,
      title: "Early Life",
      year: "1954-1985",
      component: <EarlyLife />,
      color: "#FF6B35"
    },
    {
      id: 1,
      title: "The Tracey Ullman Show",
      year: "1987-1989",
      component: <TracyUlman />,
      color: "#4ECDC4"
    },
    {
      id: 2,
      title: "The Simpsons",
      year: "1989-Present",
      component: <TheSimpsons />,
      color: "#FFD93D"
    },
    {
      id: 3,
      title: "Futurama",
      year: "1999-2013",
      component: <Futurama />,
      color: "#6C5CE7"
    },
    {
      id: 4,
      title: "Disenchantment",
      year: "2018-Present",
      component: (
        <div>
          <h3>Disenchantment</h3>
          <p>
            2018: Created Disenchantment, his first project with a serialized story format 
            serving a chronological narrative. This is Groening's first project to air on a 
            streaming service, Netflix.
          </p>
        </div>
      ),
      color: "#A8E6CF"
    }
  ];

  return (
    <div className="timeline">
      <div className="timeline-header">
        <h2>Career Timeline</h2>
        <p>Explore the journey of Matt Groening's creative evolution</p>
      </div>

      <div className="timeline-container">
        <div className="timeline-tabs">
          {timelineData.map((item, index) => (
            <button
              key={item.id}
              className={`timeline-tab ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
              style={{ '--tab-color': item.color }}
            >
              <div className="tab-content">
                <span className="tab-year">{item.year}</span>
                <span className="tab-title">{item.title}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="timeline-content">
          <div className="content-wrapper">
            {timelineData[activeTab].component}
          </div>
        </div>
      </div>

      <div className="timeline-progress">
        <div 
          className="progress-bar" 
          style={{ width: `${((activeTab + 1) / timelineData.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Timeline; 