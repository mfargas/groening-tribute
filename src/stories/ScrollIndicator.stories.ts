import type { Meta, StoryObj } from '@storybook/react';
import ScrollIndicator from '../components/ScrollIndicator';

const meta: Meta<typeof ScrollIndicator> = {
  title: 'Components/ScrollIndicator',
  component: ScrollIndicator,
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
    currentSection: 3,
    setCurrentSection: () => {},
  },
};

