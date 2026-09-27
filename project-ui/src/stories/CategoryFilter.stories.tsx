import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CategoryFilter } from "../components/CategoryFilter";

const categories = ["All", "B2B", "Design System", "Saas", "EdTech", "AI", "Dashboard", "Web app"];

const meta = {
  title: "Project/CategoryFilter",
  component: CategoryFilter,
} satisfies Meta<typeof CategoryFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [selected, setSelected] = useState("All");
    return <CategoryFilter categories={categories} selected={selected} onSelect={setSelected} />;
  },
};
