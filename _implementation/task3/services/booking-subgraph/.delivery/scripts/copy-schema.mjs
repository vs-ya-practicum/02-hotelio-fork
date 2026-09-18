import { cpSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const sourceDirectory = fileURLToPath(new URL('../../src/schema/', import.meta.url));
const destinationDirectory = fileURLToPath(new URL('../.builds/dist/src/schema/', import.meta.url));

mkdirSync(destinationDirectory, { recursive: true });
cpSync(sourceDirectory, destinationDirectory, { recursive: true });
