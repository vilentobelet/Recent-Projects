import type { Preview } from "@storybook/react";
import "../src/styles.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "board",
      values: [{ name: "board", value: "#111111" }],
    },
    controls: { matchers: { color: /(background|color)$/i } },
    layout: "padded",
  },
};

export default preview;
