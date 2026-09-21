import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
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
    // Compiled with the classic JSX transform (see tsconfig.iife.json), not
    // the automatic one the rest of the project uses: this bundle is meant
    // to be dropped in via a plain <script> tag, so it has to work with
    // whatever React major the host page happens to have loaded. Classic
    // JSX calls React.createElement on that runtime-provided global, so it
    // always matches whatever reconciler is actually present. The
    // automatic runtime instead bundles react/jsx-runtime's own element
    // construction as compiled here, tied to this repo's installed React
    // version (its element tag changed between majors, e.g. React 19 uses
    // Symbol.for("react.transitional.element") where 18 uses
    // Symbol.for("react.element")) — that broke this exact bundle against
    // the React 18 UMD build index.html loads, producing a blank page.
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
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.iife.json',
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
