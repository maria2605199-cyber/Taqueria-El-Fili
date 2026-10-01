/*
  DATOS DEL MENÚ — este es el único archivo que necesitas editar día a día.

  - Cambia precios, platillos, enlaces y la temporada aquí.
  - No toques index.html salvo para cambiar el diseño.
  - Las fotos van en la carpeta /img (ej. "img/pastor.webp"). Si un platillo
    no tiene foto, se muestra un recuadro de color con su inicial.

  TEMPORADA:
    "auto"       → cambia sola según la fecha (ver fechas en "temporadas")
    "normal" | "patrias" | "halloween" | "muertos" | "navidad" → fija una
  Para enseñar un tema sin cambiar nada, abre la página con #navidad,
  #halloween, #muertos o #patrias al final de la dirección.
*/
window.TAQUERIA = {
  negocio: {
    nombre: "Taquería El Fili",
    lema: "De Guamúchil",
    direccion: "Calle Ejemplo 123, Col. Centro",           // EJEMPLO: poner la real
    // Horario por día (0 = domingo … 6 = sábado). null = cerrado.
    horario: {
      0: ["18:00", "02:00"], 1: null, 2: ["18:00", "01:00"], 3: ["18:00", "01:00"],
      4: ["18:00", "01:00"], 5: ["18:00", "03:00"], 6: ["18:00", "03:00"]
    },
    horarioTexto: "Mar a jue 6 pm – 1 am · Vie y sáb 6 pm – 3 am · Dom 6 pm – 2 am",
    telefono: "55 0000 0000"                               // EJEMPLO
  },

  // Enlaces del QR. Deja "" en los que todavía no existan y no se mostrarán.
  enlaces: {
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
    facebook: "https://www.facebook.com/",                 // no viene en el boceto del exhibidor; aquí sí se muestra
    maps: "https://maps.google.com/",
    resena: "https://search.google.com/local/writereview?placeid=",  // completar con el Place ID
    whatsapp: "https://wa.me/"                             // completar: "https://wa.me/52 + número a 10 dígitos"
  },

  // true = muestra el aviso "precios de ejemplo" y el selector de temas.
  // Cámbialo a false cuando el menú tenga los datos reales.
  modoDemo: true,

  temporada: "auto",

  temporadas: {
    normal:    { nombre: "Menú de la casa" },
    patrias:   { nombre: "¡Viva México!",        desde: "09-01", hasta: "09-16",
                 especiales: [
                   { nombre: "Orden tricolor", descripcion: "3 tacos: pastor con salsa verde, bistec con cebolla y suadero con salsa roja.", precio: 75, foto: "" }
                 ] },
    halloween: { nombre: "Noche de Brujas",      desde: "10-20", hasta: "10-31",
                 especiales: [
                   { nombre: "Taco del Chamuco", descripcion: "Pastor con salsa de habanero tatemado. Solo para valientes.", precio: 32, foto: "", tags: ["picante"] },
                   { nombre: "Agua de jamaica embrujada", descripcion: "Jamaica con chamoy y escarchado de chile.", precio: 35, foto: "" }
                 ] },
    muertos:   { nombre: "Día de Muertos",       desde: "11-01", hasta: "11-02",
                 especiales: [
                   { nombre: "Orden de la Catrina", descripcion: "5 tacos surtidos con consomé y pan de muerto de cortesía.", precio: 120, foto: "" }
                 ] },
    navidad:   { nombre: "Menú Navideño",        desde: "12-01", hasta: "01-06",
                 especiales: [
                   { nombre: "Taco de bacalao", descripcion: "Bacalao a la vizcaína en tortilla hecha a mano. Solo en temporada.", precio: 45, foto: "" },
                   { nombre: "Ponche de frutas", descripcion: "Caliente, con caña, tejocote y guayaba.", precio: 35, foto: "" }
                 ] }
  },

  // MENÚ — precios de EJEMPLO, reemplazar por los reales.
  categorias: [
    {
      id: "tacos", nombre: "Tacos",
      nota: "Tortilla de maíz. Cebolla, cilantro y salsas de la casa incluidas.",
      platillos: [
        { nombre: "Pastor", descripcion: "Del trompo, con piña.", precio: 18, foto: "", tags: ["favorito"] },
        { nombre: "Suadero", descripcion: "Suave y dorado en el comal.", precio: 20, foto: "" },
        { nombre: "Bistec", descripcion: "Res asada al carbón.", precio: 22, foto: "" },
        { nombre: "Campechano", descripcion: "Bistec con longaniza.", precio: 24, foto: "" },
        { nombre: "Tripa", descripcion: "Dorada o suave, tú decides.", precio: 25, foto: "" }
      ]
    },
    {
      id: "especialidades", nombre: "Especialidades",
      platillos: [
        { nombre: "Gringa", descripcion: "Tortilla de harina, queso gratinado y pastor.", precio: 55, foto: "", tags: ["favorito"] },
        { nombre: "Volcán", descripcion: "Tostada con queso gratinado y la carne que elijas.", precio: 35, foto: "" },
        { nombre: "Alambre", descripcion: "Bistec, tocino, pimiento, cebolla y queso. Con tortillas.", precio: 110, foto: "" },
        { nombre: "Quesadilla con carne", descripcion: "Maíz o harina.", precio: 45, foto: "" }
      ]
    },
    {
      id: "bebidas", nombre: "Bebidas",
      platillos: [
        { nombre: "Agua de horchata", descripcion: "Vaso de 1 litro.", precio: 35, foto: "" },
        { nombre: "Agua de jamaica", descripcion: "Vaso de 1 litro.", precio: 35, foto: "" },
        { nombre: "Refresco", descripcion: "Botella de vidrio.", precio: 28, foto: "" }
      ]
    },
    {
      id: "extras", nombre: "Extras",
      platillos: [
        { nombre: "Queso extra", descripcion: "", precio: 12, foto: "" },
        { nombre: "Cebollitas asadas", descripcion: "Orden.", precio: 20, foto: "" },
        { nombre: "Consomé", descripcion: "Taza.", precio: 25, foto: "", tags: ["nuevo"] }
      ]
    }
  ]
};
