import type { Meta, StoryObj } from '@storybook/react';
import { GroeningVerseArcade } from '../game/GroeningVerseArcade';
import { GameState } from '../types/game';

const meta: Meta<typeof GroeningVerseArcade> = {
  title: 'Game/GroeningVerseArcade',
  component: GroeningVerseArcade,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Groening-Verse Arcade

A browser-based arcade experience featuring Matt Groening's iconic female characters. This component demonstrates:

- **60 FPS Gameplay**: Achieved through Canvas API and optimized rendering
- **Web Worker Collision Detection**: Offloaded physics calculations to prevent main thread blocking
- **Data-Driven Character System**: Characters defined with Zod validation and cultural context
- **Performance Monitoring**: Real-time FPS and frame time tracking
- **Accessibility**: Full keyboard navigation and reduced motion support

## Technical Architecture

- **Game Engine**: TypeScript-based physics and game state management
- **Canvas Renderer**: Double-buffered rendering with object pooling
- **Character Manager**: Data-driven character system with cultural analysis
- **Web Workers**: Spatial partitioning for collision detection
- **Performance**: Optimized for 60 FPS on mid-range devices

## Cultural Context

Each character represents a different era of female representation in animation:

- **Marge Simpson (Maternal)**: 1980s-1990s traditional maternal figure
- **Leela (Warrior)**: 1990s-2000s strong female leader
- **Princess Bean (Rebel)**: 2010s-Present anti-princess archetype
        `,
      },
    },
  },
  argTypes: {
    width: {
      control: { type: 'number', min: 400, max: 1200 },
      description: 'Canvas width in pixels',
    },
    height: {
      control: { type: 'number', min: 300, max: 800 },
      description: 'Canvas height in pixels',
    },
    onGameStateChange: {
      action: 'gameStateChange',
      description: 'Callback fired when game state changes',
    },
    onScoreUpdate: {
      action: 'scoreUpdate',
      description: 'Callback fired when score updates',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 800,
    height: 600,
  },
};

export const SmallCanvas: Story = {
  args: {
    width: 400,
    height: 300,
  },
  parameters: {
    docs: {
      description: {
        story: 'Small canvas size for mobile or embedded use cases.',
      },
    },
  },
};

export const LargeCanvas: Story = {
  args: {
    width: 1200,
    height: 800,
  },
  parameters: {
    docs: {
      description: {
        story: 'Large canvas size for desktop or full-screen experiences.',
      },
    },
  },
};

export const WithCallbacks: Story = {
  args: {
    width: 800,
    height: 600,
    onGameStateChange: (gameState: GameState) => {
      console.log('Game State Changed:', gameState);
    },
    onScoreUpdate: (score: number) => {
      console.log('Score Updated:', score);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with callback functions for game state and score updates.',
      },
    },
  },
};

// Interactive story for testing
export const Interactive: Story = {
  args: {
    width: 800,
    height: 600,
  },
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Testing

Use the following controls to test the arcade:

### Keyboard Controls
- **WASD** or **Arrow Keys**: Move character
- **Space**: Pause/Resume game

### Game Features
- **Character Switching**: Each character has unique abilities
- **Collision Detection**: Real-time physics with Web Workers
- **Performance Monitoring**: FPS counter in top-right corner
- **Cultural Context**: Each character represents different animation eras

### Performance Notes
- Target: 60 FPS gameplay
- Collision detection runs in Web Worker
- Double-buffered rendering for smooth animation
- Object pooling to reduce garbage collection
        `,
      },
    },
  },
};
