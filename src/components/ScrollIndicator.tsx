'use client';

interface ScrollIndicatorProps {
  currentSection: number;
  setCurrentSection: (section: number) => void;
}

export default function ScrollIndicator({ currentSection, setCurrentSection }: ScrollIndicatorProps) {
  return (
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
  );
}

