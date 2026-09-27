import type { Meta, StoryObj } from "@storybook/react";
import { BoardHeader } from "../components/BoardHeader";

const meta = {
  title: "Project/BoardHeader",
  component: BoardHeader,
  args: { productCount: 10 },
} satisfies Meta<typeof BoardHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loaded: Story = {};
export const Loading: Story = { args: { loading: true, productCount: 0 } };
