'use strict';

const { resolve } = require('path');
const { readFileSync } = require('fs');

const CWD = process.cwd();

function isSafeError(error) {
  return (
    error.code === 'MODULE_NOT_FOUND' &&
    error.requireStack &&
    error.requireStack[0] === __filename
  );
}

function normalize(moduleId) {
  return moduleId.startsWith('.') ? resolve(CWD, moduleId) : moduleId;
}

function isReachable(moduleId) {
  try {
    require.resolve(normalize(moduleId));
    return true;
  } catch (error) {
    if (isSafeError(error)) {
      return false;
    }
    throw error;
  }
}

function reaching(moduleId, fallback = {}) {
  try {
    return require(normalize(moduleId));
  } catch (error) {
    if (isSafeError(error)) {
      return fallback;
    }
    throw error;
  }
}

function readJson(file) {
  try {
    const io = readFileSync(file, 'utf-8');
    return JSON.parse(io);
  } catch {
    return {};
  }
}

function getPkg(path, fallback = {}) {
  const pkg = readJson(normalize('./package.json'));
  if (path) {
    const { [path]: config = fallback } = pkg;
    return config;
  }
  return pkg;
}

module.exports = { isReachable, reaching, getPkg };
