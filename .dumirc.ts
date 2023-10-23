import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  alias: {
    'rc-select$': path.resolve('src'),
    'rc-select/es': path.resolve('src'),
  },
  favicons: ['https://avatars0.githubusercontent.com/u/9441414?s=200&v=4'],
  themeConfig: {
    name: 'Select',
    logo: 'https://avatars0.githubusercontent.com/u/9441414?s=200&v=4',
  },
});
