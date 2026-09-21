import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts';
import { createRequire } from 'node:module';

const packageJson = createRequire(import.meta.url)('./package.json');

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
        name: 'react-mobile-keyboard-opener',
        exports: 'named',
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
      postcss(),
      terser(),
    ],
  },
  {
    input: 'src/iife.tsx',
    // react-mobile-keyboard-opener's peer deps (react, react-dom) stay
    // external so consumers provide their own UMD-style globals, but
    // react/jsx-runtime is deliberately left out of that list: with the
    // automatic JSX runtime, every JSX element compiles to a call into
    // react/jsx-runtime, and unlike `react`/`react-dom` there's no browser
    // global for it to resolve to at runtime — so it's bundled here
    // instead, and internally still resolves to the externalized `react`
    // global for the pieces it needs.
    external: ['react', 'react-dom', 'react-dom/client'],
    output: [
      {
        file: packageJson.main.replace('cjs', 'iife'),
        format: 'iife',
        sourcemap: true,
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'reactDom',
          'react-dom/client': 'reactDom',
        },
      },
    ],
    plugins: [
      // react/jsx-runtime branches on process.env.NODE_ENV at its own
      // module scope; without this, that branch (and the react-server dev
      // build it selects) survives bundling untouched, since Rollup has no
      // way to know its value on its own.
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationDir: undefined,
      }),
      postcss(),
      terser(),
    ],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: [/\.css$/],
    plugins: [dts()],
  },
];
