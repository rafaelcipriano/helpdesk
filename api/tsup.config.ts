import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src',
    '!src/specs', 
    '!src/types',
  ],
  clean: true,
});
