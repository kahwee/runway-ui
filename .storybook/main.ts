export default {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: { name: "@storybook/html-vite", options: {} },
  core: { disableTelemetry: true },
  // Every generated asset must survive the /runway-ui/storybook/ Pages prefix.
  viteFinal: async (config) => ({ ...config, base: "./" }),
};
