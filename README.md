# Taquería El Fili — menú digital

Página del menú a la que lleva el QR "Menú" del exhibidor. Es HTML estático: no necesita servidor ni base de datos.

## Cómo editarlo
- **Platillos, precios, enlaces y horario:** solo en `datos.js`.
- **Fotos / renders 3D:** súbelas a `img/` en formato `.webp`, cuadradas y de unos 600×600 px, y pon la ruta en el campo `foto` del platillo (ej. `"img/pastor.webp"`).
- **Temporada:** en `datos.js`, `temporada: "auto"` cambia sola según las fechas (Fiestas Patrias, Halloween, Día de Muertos, Navidad). También puedes fijar una.
- **Ver un tema sin cambiar nada:** abre la página con `#navidad`, `#halloween`, `#muertos` o `#patrias` al final de la dirección.
- Cuando los datos sean reales, cambia `modoDemo` a `false` para quitar el aviso y el selector de temas.

## Publicarlo
GitHub Pages es gratis en repositorios públicos (en privados necesita plan de pago). Settings → Pages → Deploy from branch → `main` / root.
Recomendado: un dominio propio (ej. `elfili.mx`) para que el QR impreso nunca cambie aunque cambie el hosting.
