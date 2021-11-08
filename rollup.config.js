
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    name: 'vite-plugin-resolver',
    file: 'dist/index.js',
    format: 'umd'
  },
  plugins: [
    typescript()
  ]
};