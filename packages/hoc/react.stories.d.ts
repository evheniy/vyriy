import type { StoryObj } from '@storybook/react-webpack5';
declare const meta: {
    title: string;
    component: import("react").ComponentType<object>;
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Example: Story;
