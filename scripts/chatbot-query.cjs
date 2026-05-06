const { fromData } = require('./lib/paths.cjs');
const { readJson } = require('./lib/read-json.cjs');

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index >= 0 ? process.argv[index + 1] ?? '' : '';
}

const question = getArgValue('--question').trim().toLowerCase();
const knowledge = readJson(fromData('chatbot', 'knowledge.json'));

let answer = 'No encontre suficiente contexto local para responder con precision.';

if (question.includes('semana 3') || question.includes('stock')) {
  answer = 'La Semana 3 muestra demanda de 4,800 unidades frente a 2,000 de inventario. La ruptura estimada es de 2,800 unidades.';
} else if (question.includes('proveedor') || question.includes('semiconductores')) {
  answer = 'GlobalTech Solutions aparece como la opcion con mayor confianza para Semiconductores A con 98%.';
} else if (question.includes('flujo') || question.includes('operativo')) {
  answer = 'El flujo operativo mantiene 98.4% de sincronizacion de inventario y 96.5% de SLA de entregas.';
} else if (Array.isArray(knowledge.context) && knowledge.context.length > 0) {
  answer = knowledge.context.join(' ');
}

process.stdout.write(JSON.stringify({ answer }));
