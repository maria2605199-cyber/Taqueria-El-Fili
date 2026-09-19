const KEYWORDS = {
  deposito: ['cuenta', 'deposito', 'depósito', 'transferencia', 'clabe', 'pago', 'pagar'],
  menu: ['menu', 'menú', 'carta', 'que venden', 'qué venden', 'productos'],
  factura: ['factura', 'facturar', 'facturacion', 'facturación', 'cfdi'],
};

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function detectarIntencion(mensaje) {
  const texto = normalizar(mensaje || '');
  for (const [intencion, palabras] of Object.entries(KEYWORDS)) {
    if (palabras.some((palabra) => texto.includes(normalizar(palabra)))) {
      return intencion;
    }
  }
  return null;
}

function respuestaDeposito(config) {
  const { banco, numeroCuenta, clabe, titular } = config.depositos;
  return (
    `Puedes depositar o transferir a:\n\n` +
    `Banco: ${banco}\n` +
    `Cuenta: ${numeroCuenta}\n` +
    `CLABE: ${clabe}\n` +
    `Titular: ${titular}\n\n` +
    `Por favor envianos tu comprobante despues de depositar.`
  );
}

function respuestaMenu(config) {
  const { mensaje, enlace } = config.menuDigital;
  return `${mensaje}\n${enlace}`;
}

function respuestaFactura(config) {
  const { rfc, razonSocial, regimenFiscal, instrucciones } = config.facturacion;
  return (
    `Con gusto te ayudamos con tu factura.\n\n` +
    `${instrucciones}\n\n` +
    `Nuestros datos fiscales:\n` +
    `RFC: ${rfc}\n` +
    `Razon social: ${razonSocial}\n` +
    `Regimen fiscal: ${regimenFiscal}`
  );
}

function generarRespuesta(mensaje, config) {
  const intencion = detectarIntencion(mensaje);
  switch (intencion) {
    case 'deposito':
      return respuestaDeposito(config);
    case 'menu':
      return respuestaMenu(config);
    case 'factura':
      return respuestaFactura(config);
    default:
      return config.mensajeNoEntendido;
  }
}

module.exports = { generarRespuesta, detectarIntencion };
