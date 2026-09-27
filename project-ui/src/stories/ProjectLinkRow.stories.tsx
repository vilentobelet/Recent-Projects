import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectLinkRow } from "../components/ProjectLinkRow";
import { catalogLink } from "./fixtures";

const meta = {
  title: "Project/ProjectLinkRow",
  component: ProjectLinkRow,
} satisfies Meta<typeof ProjectLinkRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Site: Story = {
  render: function Render() {
    const [copied, setCopied] = useState(false);
    return (
      <div className="max-w-lg" style={{ "--card-accent": "#f97316", "--card-soft": "rgba(249,115,22,.12)" } as CSSProperties}>
        <ProjectLinkRow link={catalogLink("site")} copied={copied} onCopy={() => setCopied(true)} />
      </div>
    );
  },
};

export const Figma: Story = {
  render: () => (
    <div className="max-w-lg" style={{ "--card-accent": "#f97316", "--card-soft": "rgba(249,115,22,.12)" } as CSSProperties}>
      <ProjectLinkRow link={catalogLink("figma")} copied={false} onCopy={() => undefined} />
    </div>
  ),
};
