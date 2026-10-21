export default {
  stories: ['../stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs'],
  framework: { name: '@storybook/html-vite', options: {} },
  core: { disableTelemetry: true },
};
