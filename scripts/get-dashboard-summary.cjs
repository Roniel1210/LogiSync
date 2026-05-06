const { fromData } = require('./lib/paths.cjs');
const { readJson } = require('./lib/read-json.cjs');

process.stdout.write(JSON.stringify(readJson(fromData('dashboard', 'summary.json'))));
