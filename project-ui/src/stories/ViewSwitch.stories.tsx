import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ViewSwitch } from "../components/ViewSwitch";
import type { ViewMode } from "../model";

const meta = {
  title: "Project/ViewSwitch",
  component: ViewSwitch,
} satisfies Meta<typeof ViewSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<ViewMode>("cards");
    return <ViewSwitch value={value} onChange={setValue} />;
  },
};
