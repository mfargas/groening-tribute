import type { Meta, StoryObj } from '@storybook/react';
import Game from '../components/Game';

const meta: Meta<typeof Game> = {
  title: 'Components/Game',
  component: Game,
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
