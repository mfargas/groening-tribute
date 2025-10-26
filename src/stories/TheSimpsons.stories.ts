import type { Meta, StoryObj } from '@storybook/react';
import TheSimpsons from '../components/TheSimpsons';

const meta: Meta<typeof TheSimpsons> = {
  title: 'Components/TheSimpsons',
  component: TheSimpsons,
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
