# Bot de WhatsApp - Taqueria El Fili

Responde automaticamente a los clientes por WhatsApp cuando preguntan:

- El **numero de cuenta / CLABE** para depositos.
- El **menu digital**.
- Como pedir su **factura**.

Cualquier otro mensaje recibe un aviso de que un encargado atendera pronto.

## Como funciona

El bot usa la libreria [whatsapp-web.js](https://wwebjs.dev/), que conecta con el WhatsApp normal
del negocio escaneando un codigo QR (igual que WhatsApp Web). No necesita la API oficial de Meta ni
un costo por mensaje, pero requiere que el telefono o la computadora donde se corre se quede
conectado a internet.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior.
- Un numero de WhatsApp del negocio (puede ser el que ya usan) con la app instalada en un celular.

## Instalacion

```bash
cd whatsapp-bot
npm install
```

## Configuracion

Antes de usarlo, edita `config.json` con los datos reales del negocio:

- `depositos`: banco, numero de cuenta, CLABE y titular.
- `menuDigital`: mensaje y enlace (o imagen) del menu digital.
- `facturacion`: RFC, razon social, regimen fiscal e instrucciones para pedir factura.
- `mensajeNoEntendido`: lo que responde el bot cuando no reconoce la pregunta.

No hace falta tocar el codigo, solo este archivo.

## Ejecutar el bot

```bash
npm start
```

La primera vez aparecera un codigo QR en la terminal:

1. Abre WhatsApp en el celular del negocio.
2. Ve a **Configuracion > Dispositivos vinculados > Vincular un dispositivo**.
3. Escanea el codigo QR que se muestra en la terminal.

Una vez conectado, el bot queda escuchando y respondiendo mensajes automaticamente mientras el
proceso siga corriendo. Para mantenerlo activo 24/7 se recomienda correrlo en un servidor o
computadora que no se apague (por ejemplo con `pm2` o un servicio en la nube).

## Pruebas

Para verificar que el bot detecta bien las preguntas sin necesidad de conectarse a WhatsApp:

```bash
npm test
```

## Estructura

- `index.js`: conecta con WhatsApp y responde los mensajes.
- `lib/respuestas.js`: logica para detectar la intencion del mensaje y armar la respuesta.
- `config.json`: datos del negocio (edita aqui la informacion real).
- `test.js`: pruebas de la logica de respuestas.
