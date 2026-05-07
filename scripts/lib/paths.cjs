const path = require('path');
const fs = require('fs');

const repoRoot = path.resolve(__dirname, '..', '..');
const configuredDataRoot = process.env.LOGISYNC_DATA_ROOT;
const containerDataRoot = '/files';

const dataRoot = configuredDataRoot
  ? path.resolve(configuredDataRoot)
  : fs.existsSync(containerDataRoot)
    ? containerDataRoot
    : path.join(repoRoot, 'data');

function fromData(...segments) {
  return path.join(dataRoot, ...segments);
}

function toProjectRelative(targetPath) {
  if (targetPath.startsWith(containerDataRoot)) {
    return path.join('data', path.relative(containerDataRoot, targetPath)).replace(/\\/g, '/');
  }

  return path.relative(repoRoot, targetPath).replace(/\\/g, '/');
}

module.exports = {
  repoRoot,
  dataRoot,
  fromData,
  toProjectRelative,
};
