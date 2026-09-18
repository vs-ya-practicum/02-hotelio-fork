/**
 * Set TEST_INCLUDE=.examples,.explorations to include tests from normally excluded folders.
 */
export default function excluded(defaults: string[]) {
    const base = [...defaults];
    const additional = ['tests/e2e/*', '**/examples', '**/explorations', '**/integration'];
    const toInclude = process.env.TEST_INCLUDE?.split(',') || [];

    const excluded = additional.filter((_additional: string) => {
        return !toInclude.some((_toInclude: string) => {
            return _additional.includes(_toInclude);
        });
    });

    console.log(`[INFO] Additionally excluded test folders "${excluded.toString()}"`);
    console.log('[INFO] Run "npx cross-env TEST_INCLUDE=<folder-a,folder-b,name-part> npm run test:foundation" to include tests from the normally excluded folders.');

    return base.concat(excluded);
}
