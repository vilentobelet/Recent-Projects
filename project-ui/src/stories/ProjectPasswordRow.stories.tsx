import { useState, type CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectPasswordRow } from "../components/ProjectPasswordRow";

const meta = {
  title: "Project/ProjectPasswordRow",
  component: ProjectPasswordRow,
} satisfies Meta<typeof ProjectPasswordRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);
    return (
      <div className="max-w-md" style={{ "--card-accent": "#f97316", "--card-soft": "rgba(249,115,22,.12)" } as CSSProperties}>
        <ProjectPasswordRow password="demo-access" visible={visible} copied={copied} onToggleVisible={() => setVisible((value) => !value)} onCopy={() => setCopied(true)} />
      </div>
    );
  },
};

export const Compact: Story = {
  render: function Render() {
    const [visible, setVisible] = useState(false);
    return (
      <div className="max-w-md" style={{ "--card-accent": "#f97316", "--card-soft": "rgba(249,115,22,.12)" } as CSSProperties}>
        <ProjectPasswordRow layout="compact" password="demo-access" visible={visible} copied={false} onToggleVisible={() => setVisible((value) => !value)} onCopy={() => undefined} />
      </div>
    );
  },
};
