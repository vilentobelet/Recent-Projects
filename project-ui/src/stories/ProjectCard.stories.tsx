import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectCard } from "../components/ProjectCard";
import { projectByName, sampleProjects } from "./fixtures";

const meta = {
  title: "Project/ProjectCard",
  component: ProjectCard,
  parameters: { layout: "padded" },
  args: { project: projectByName("Fieldnode"), viewMode: "cards" },
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {};

export const FeaturedWithPassword: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState<"link" | "password" | null>(null);
    return (
      <div className="max-w-[560px]">
        <ProjectCard
          project={projectByName("Fieldnode - Design System")}
          passwordVisible={visible}
          copied={copied}
          onTogglePassword={() => setVisible((value) => !value)}
          onCopyPassword={() => setCopied("password")}
          onCopyLink={() => setCopied("link")}
        />
      </div>
    );
  },
};

export const Compact: Story = {
  args: { project: projectByName("Scholarsapp"), viewMode: "compact" },
};

export const CompactBoard: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-2.5">
      {sampleProjects.map((project) => (
        <ProjectCard key={project.id} project={project} viewMode="compact" />
      ))}
    </div>
  ),
};

export const TwoColumnBoard: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
      {sampleProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  ),
};
