import type { Meta, StoryObj } from "@storybook/react";
import { ProjectCardSkeleton, ProjectCardSkeletonGrid } from "../components/ProjectCardSkeleton";

const meta = {
  title: "Project/ProjectCardSkeleton",
  component: ProjectCardSkeleton,
  parameters: { layout: "padded" },
  args: { viewMode: "cards" },
} satisfies Meta<typeof ProjectCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
  render: () => (
    <div className="max-w-[560px]">
      <ProjectCardSkeleton viewMode="cards" />
    </div>
  ),
};

export const Compact: Story = {
  args: { viewMode: "compact" },
};

export const TwoColumnBoard: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      <ProjectCardSkeletonGrid viewMode="cards" count={4} />
    </div>
  ),
};
