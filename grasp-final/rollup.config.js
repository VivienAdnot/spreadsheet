import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';

const extensions = ['.ts', '.js'];

const preventTreeShakingPlugin = () => {
  return {
    name: 'no-treeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not treeshake entry points, as we're not exporting anything in App Scripts
        return { id, moduleSideEffects: 'no-treeshake' };
      }
      return null;
    },
  };
};

export default {
  input: './src/index.ts',
  output: {
    dir: 'build',
    format: 'es',
    compact: true,
  },
  plugins: [
    copy({
      targets: [
        { src: './src/**/*.html', dest: 'build' }
      ]
    }),
    preventTreeShakingPlugin(),
    nodeResolve({
      extensions,
      mainFields: ['jsnext:main', 'main'],
    }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'runtime',
      skipPreflightCheck: true,
      compact: true,
    })
  ],
};
