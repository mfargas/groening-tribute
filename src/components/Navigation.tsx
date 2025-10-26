'use client';

interface NavigationProps {
  currentSection: number;
  setCurrentSection: (section: number) => void;
}

export default function Navigation({ currentSection, setCurrentSection }: NavigationProps) {
  return (
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
  );
}

