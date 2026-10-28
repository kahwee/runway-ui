export default {
  stories: ["../stories/**/*.stories.@(js|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/html-vite", options: {} },
  core: { disableTelemetry: true },
};
