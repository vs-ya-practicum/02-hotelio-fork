import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { configDefaults, defineProject } from 'vitest/config';

const configurationDirectory = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(configurationDirectory, '../../../..');
const testsRoot = resolve(packageRoot, 'tests');

export default defineProject({
    resolve: {
        alias: {
            '@fixtures': resolve(testsRoot, 'foundation/.ancillary/fixtures')
        }
    },
    test: {
        root: packageRoot,
        name: 'hotel-subgraph-e2e',
        include: ['tests/e2e/**/*.test.ts'],
        exclude: configDefaults.exclude,
        cache: false
    }
});
