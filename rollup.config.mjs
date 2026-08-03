import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { rmSync } from 'node:fs';
import { execSync } from 'node:child_process';

/** Очистка dist перед сборкой, чтобы не тащить старое дерево tsc */
function clearDist() {
    return {
        name: 'clear-dist',
        buildStart() {
            rmSync('dist', { recursive: true, force: true });
        },
    };
}

/** В watch-режиме копируем бандл в локальный Screeps после каждой сборки */
function deployOnWatch() {
    return {
        name: 'deploy-on-watch',
        writeBundle() {
            if (!process.env.ROLLUP_WATCH) return;
            try {
                execSync('node deploy.js', { stdio: 'inherit' });
            } catch {
                // deploy.js сам печатает ошибку (.env / путь); watch не рвём
            }
        },
    };
}

/** @type {import('rollup').RollupOptions} */
export default {
    input: 'src/main.ts',
    output: {
        file: 'dist/main.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
    },
    plugins: [
        clearDist(),
        resolve({ preferBuiltins: false }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            filterRoot: 'src',
            exclude: ['**/*.test.ts', 'tests/**'],
            compilerOptions: {
                // rollup эмитит бандл; tsconfig noEmit — только для tsc --noEmit
                noEmit: false,
                declaration: false,
                declarationMap: false,
            },
        }),
        deployOnWatch(),
    ],
};
