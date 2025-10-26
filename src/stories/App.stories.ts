import type { Meta, StoryObj } from '@storybook/react';
import Hero from '../components/Hero';
import TheSimpsons from '../components/TheSimpsons';
import Futurama from '../components/Futurama';
import Disenchantment from '../components/Disenchantment';
import Timeline from '../components/Timeline';
import Game from '../components/Game';
import Navigation from '../components/Navigation';
import ScrollIndicator from '../components/ScrollIndicator';
import '../styles/App.css';

const meta: Meta<typeof Hero> = {
  title: 'App/Complete App',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
