import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        reporters: ['tree'],
        projects: [
            'booking-subgraph/tests/foundation/.ancillary/config/vitest.config.ts'
        ]
    }
});
