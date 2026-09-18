import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { configDefaults, defineProject } from 'vitest/config';

import _excluded from '../../../../../../.testing/excluded.workspace.js';

const configurationDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(configurationDirectory, '../../../..');
const testsRoot = resolve(packageRoot, 'tests');
const excluded = _excluded(configDefaults.exclude);

export default defineProject({
    resolve: {
        alias: {
            '@src': resolve(packageRoot, 'src'),
            '@tests': testsRoot,
            '@fixtures': resolve(testsRoot, 'foundation/.ancillary/fixtures')
        }
    },
    test: {
        root: packageRoot,
        name: 'booking-subgraph',
        include: ['tests/**/*.test.ts'],
        exclude: excluded,
        setupFiles: [resolve(testsRoot, 'foundation/.ancillary/bootstrap/setup.ts')]
    }
});
