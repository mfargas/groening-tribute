import type { Meta, StoryObj } from '@storybook/react';
import Disenchantment from '../components/Disenchantment';

const meta: Meta<typeof Disenchantment> = {
  title: 'Components/Disenchantment',
  component: Disenchantment,
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

