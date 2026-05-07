const { fromData } = require('./lib/paths.cjs');
const { readJson } = require('./lib/read-json.cjs');

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index >= 0 ? process.argv[index + 1] ?? '' : '';
}

const query = getArgValue('--query').trim().toLowerCase();
const data = readJson(fromData('repository', 'index.json'));

if (!query) {
  process.stdout.write(JSON.stringify(data));
  process.exit(0);
}

const filtered = data.documents.filter((document) => {
  const haystack = [
    document.title,
    document.type,
    document.path,
    document.time,
    document.size,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
});

process.stdout.write(JSON.stringify({ documents: filtered }));
