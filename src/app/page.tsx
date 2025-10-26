'use client';

import React from 'react';
import Game from '../components/Game';
import '../styles/App.css';

export default function Home() {
  return (
    <div className="app">
      <div className="sections-container">
        <section className="section">
          <Game />
        </section>
      </div>
    </div>
  );
}