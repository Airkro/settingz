import { readFileSync, statSync } from 'fs';
import { createRequire } from 'module';
import { isAbsolute, resolve } from 'path';
import { fileURLToPath } from 'url';

const CWD = process.cwd();

function isSafeError(error) {
  return (
    error.code === 'MODULE_NOT_FOUND' &&
    error.requireStack &&
    error.requireStack[0] === fileURLToPath(import.meta.url)
  );
}

const Require = createRequire(import.meta.url);

function normalizePath(moduleId, root = CWD) {
  return moduleId.startsWith('.')
    ? resolve(root, moduleId)
    : isAbsolute(moduleId)
    ? moduleId
    : Require.resolve(moduleId);
}

function isReachable(moduleId) {
  try {
    statSync(normalizePath(moduleId));

    return true;
  } catch {
    return false;
  }
}

function reaching(moduleId, fallback = {}) {
  try {
    return Require(normalizePath(moduleId));
  } catch (error) {
    if (isSafeError(error)) {
      return fallback;
    }

    throw error;
  }
}

function readJson(file) {
  try {
    const io = readFileSync(normalizePath(file), 'utf8');

    return JSON.parse(io);
  } catch {
    return {};
  }
}

function getPkg(path, fallback = {}) {
  const pkg = readJson('./package.json');

  if (path) {
    const { [path]: config = fallback } = pkg;

    return config;
  }

  return pkg;
}

function haveDependencies(name) {
  return name in getPkg('dependencies');
}

function haveDevDependencies(name) {
  return name in getPkg('devDependencies');
}

function haveLocalDependencies(name) {
  const { dependencies = {}, devDependencies = {} } = getPkg();

  return name in dependencies || name in devDependencies;
}

export {
  getPkg,
  haveDependencies,
  haveDevDependencies,
  haveLocalDependencies,
  isReachable,
  normalizePath,
  reaching,
  readJson,
};
