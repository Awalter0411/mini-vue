import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript';
import sourcemaps from 'rollup-plugin-sourcemaps';
export default {
  input: './packages/vue/src/index.ts',
  plugins: [
    resolve(),
    typescript(),
    sourcemaps()
  ],
  output: [
    {
      file: path.resolve(__dirname, 'dist', 'mini-vue.cjs.js'),
      format: 'cjs'
    },
    {
      file: path.resolve(__dirname, 'dist', 'mini-vue.esm.js'),
      format: 'esm'
    },
    {
      file: path.resolve(__dirname, 'dist', 'mini-vue.global.js'),
      format: 'iife'
    }
  ]
};