'use strict';

const path = require('path');
const process = require('process');
const { execSync } = require('child_process');

// Load all the ENV values we need

function installDirectory() {
  const key = 'PM2_INSTALL_DIRECTORY';

  let value = process.env[key];
  if (value) return value;

  try {
    const prefix = execSync('npm config get prefix --global').toString().trim();
    value = path.join(prefix, 'node_modules', 'pm2');

    console.warn(`$env:${key} is blank, assuming "${value}"`);
    process.env[key] = value;

    return value;
  } catch (err) {
    throw new Error('Failed to resolve PM2 install directory: ' + err.message);
  }
}

function homeDirectory() {

  const key = 'PM2_HOME';

  let value = process.env[key];

  if (value !== undefined && value !== '') {
    return value;
  }

  value = `C:\\ProgramData\\pm2\\home\\`;

  console.warn(`$env:${key} is blank, assuming "${value}"`);

  process.env[key] = value;

  return value;
}

function serviceDirectory() {

  const key = 'PM2_SERVICE_DIRECTORY';

  let value = process.env[key];

  if (value !== undefined && value !== '') {
    // console.log(`$env:${key} is: ${value}`);
    return value;
  }

  value = `C:\\ProgramData\\pm2\\service\\`;

  console.warn(`$env:${key} is blank, assuming "${value}"`);

  process.env[key] = value;

  return value;
}

// Figure out where this service is installed

const PM2_SERVICE_DIRECTORY = serviceDirectory();

// Discern the location of the PM2_HOME directory

const PM2_HOME = homeDirectory();

// Acquire a reference to the global pm2 installation

const PM2_INSTALL_DIRECTORY = installDirectory();

module.exports = { PM2_HOME, PM2_INSTALL_DIRECTORY, PM2_SERVICE_DIRECTORY };
