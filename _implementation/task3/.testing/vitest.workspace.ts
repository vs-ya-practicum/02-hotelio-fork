import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        cache: false,
        coverage: {
            provider: 'v8',
            include: [
                'services/booking-subgraph/src/**/*.ts',
                'services/hotel-subgraph/src/**/*.ts',
                'services/gateway/src/**/*.ts'
            ],
            reportsDirectory: '.testing/.coverage'
        },
        reporters: ['tree'],
        projects: [
            'services/booking-subgraph/tests/foundation/.ancillary/config/vitest.config.ts',
            'services/hotel-subgraph/tests/foundation/.ancillary/config/vitest.config.ts',
            'services/gateway/tests/foundation/.ancillary/config/vitest.config.ts'
        ]
    }
});
