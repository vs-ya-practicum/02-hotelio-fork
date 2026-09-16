import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        reporters: ['tree'],
        projects: [
            'services/booking-subgraph/tests/foundation/.ancillary/config/vitest.config.ts',
            'services/hotel-subgraph/tests/foundation/.ancillary/config/vitest.config.ts'
        ]
    }
});
