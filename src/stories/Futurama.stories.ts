import type { Meta, StoryObj } from '@storybook/react';
import Futurama from '../components/Futurama';

const meta: Meta<typeof Futurama> = {
  title: 'Components/Futurama',
  component: Futurama,
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

