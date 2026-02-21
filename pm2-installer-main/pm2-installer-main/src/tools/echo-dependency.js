'use strict';

const pkg = require('../../package.json');

const [identifier, type] = process.argv.slice(2);

// Only allow known packages to be queried
const ALLOWED_PACKAGES = new Set(['pm2', 'pm2-logrotate']);

if (!ALLOWED_PACKAGES.has(identifier)) {
  console.error(`Invalid package: ${identifier}`);
  process.exit(1);
}

let dependencies = pkg.dependencies;

if (type === 'dev') {
  dependencies = pkg.devDependencies;
}

// Safe lookup (we already validated identifier)
const version = dependencies[identifier]?.replace(/\^|~/g, '');

if (!version) {
  console.error(`Package ${identifier} not found in ${type || 'dependencies'}`);
  process.exit(1);
}

console.log(`${identifier}@${version}`);
