import { cwd } from 'node:process';
import { resolve } from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

import excluded from './excluded.js';

const root = cwd();
const excludedPaths = excluded(configDefaults.exclude);

export default defineConfig({
    resolve: {
        alias: {
            '@src': resolve(root, 'src'),
            '@tests': resolve(root, 'tests'),
            '@fixtures': resolve(root, 'tests/foundation/.ancillary/fixtures')
        }
    },
    test: {
        root,
        include: ['tests/**/*.test.ts'],
        cache: false,
        reporters: ['tree'],
        setupFiles: [resolve(root, 'tests/foundation/.ancillary/bootstrap/setup.ts')],
        exclude: excludedPaths,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.types.ts', 'src/database/migrations/**']
        }
    }
});
