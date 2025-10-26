import type { Meta, StoryObj } from '@storybook/react';
import Navigation from '../components/Navigation';

const meta: Meta<typeof Navigation> = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    currentSection: {
      control: { type: 'number', min: 0, max: 5 },
    },
    setCurrentSection: {
      action: 'setCurrentSection',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentSection: 0,
    setCurrentSection: () => {},
  },
};

export const WithActiveSection: Story = {
  args: {
    currentSection: 2,
    setCurrentSection: () => {},
  },
};

