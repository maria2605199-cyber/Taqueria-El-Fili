const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { generarRespuesta, detectarIntencion } = require('./lib/respuestas');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

const casos = [
  { mensaje: 'Hola, cual es el numero de cuenta para depositar?', esperado: 'deposito' },
  { mensaje: 'Me pueden pasar la CLABE para transferencia', esperado: 'deposito' },
  { mensaje: 'Tienen menu digital?', esperado: 'menu' },
  { mensaje: 'Quiero ver la carta', esperado: 'menu' },
  { mensaje: 'Necesito factura de mi compra', esperado: 'factura' },
  { mensaje: 'Buenas tardes', esperado: null },
];

let fallos = 0;
for (const caso of casos) {
  const intencion = detectarIntencion(caso.mensaje);
  try {
    assert.strictEqual(intencion, caso.esperado);
    console.log(`OK: "${caso.mensaje}" -> ${intencion}`);
  } catch (error) {
    fallos += 1;
    console.error(`FALLO: "${caso.mensaje}" -> esperado ${caso.esperado}, obtuvo ${intencion}`);
  }
}

const respuestaCuenta = generarRespuesta('cual es la cuenta', config);
assert.ok(respuestaCuenta.includes(config.depositos.numeroCuenta));

const respuestaMenu = generarRespuesta('menu porfa', config);
assert.ok(respuestaMenu.includes(config.menuDigital.enlace));

const respuestaFactura = generarRespuesta('quiero mi factura', config);
assert.ok(respuestaFactura.includes(config.facturacion.rfc));

const respuestaDefault = generarRespuesta('hola', config);
assert.strictEqual(respuestaDefault, config.mensajeNoEntendido);

if (fallos > 0) {
  console.error(`${fallos} caso(s) fallaron.`);
  process.exit(1);
}

console.log('Todas las pruebas pasaron.');
