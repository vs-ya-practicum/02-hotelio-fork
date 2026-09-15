import { cwd } from 'node:process';
import { resolve } from 'node:path';
import { configDefaults, defineConfig } from 'vitest/config';

import _excluded from './excluded.mts';

const root = cwd();
const excluded = _excluded(configDefaults.exclude);

export default defineConfig({
    resolve: {
        alias: {
            '@src': resolve(root, 'src'),
            '@tests': resolve(root, 'tests'),
            '@fixtures': resolve(root, 'tests/foundation/.ancillary/fixtures'),
            '@embeddable-rag/shared-kernel': resolve(root, '../../90-shared-kernel/src/index.ts')
        }
    },
    test: {
        root,
        include: ['tests/**/*.test.ts'],
        cache: false,
        reporters: ['tree'],
        setupFiles: [resolve(root, 'tests/foundation/.ancillary/bootstrap/setup.ts')],
        exclude: excluded,
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.types.ts', 'src/database/migrations/**']
        }
    }
});
