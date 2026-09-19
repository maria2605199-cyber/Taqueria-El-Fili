const fs = require('fs');
const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { generarRespuesta } = require('./lib/respuestas');

const configPath = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  console.log('Escanea este codigo QR con el WhatsApp del negocio:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log(`Bot de ${config.negocio.nombre} listo y conectado.`);
});

client.on('message', async (message) => {
  if (message.isStatus || message.from === 'status@broadcast') return;

  try {
    const respuesta = generarRespuesta(message.body || '', config);
    await message.reply(respuesta);
  } catch (error) {
    console.error('Error al responder mensaje:', error);
  }
});

client.initialize();
