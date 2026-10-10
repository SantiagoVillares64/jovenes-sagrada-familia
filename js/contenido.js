/* =====================================================================
   CONTENIDO EDITABLE — Jóvenes Sagrada Familia (versión con varias páginas)
   ---------------------------------------------------------------------
   Todas las páginas toman sus datos de este archivo.
   - Todo texto va entre comillas "así" y cada elemento de una lista termina con coma ,
   - inscripcion.estado: "abierta", "cerrada" o "proximamente"
   - aCompletar: secciones que todavía no tienen contenido (se muestran como recuadro punteado).
     Cuando tengan el texto, borrá la línea.
   ===================================================================== */

window.CONTENIDO = {

  /* ---------- Contacto ---------- */
  secretaria: {
    nombre: "Secretaría parroquial",
    telefono: "+54 9 11 3692-1028",
    whatsapp: "https://wa.me/5491136921028"
  },
  redes: {
    instagram: "https://www.instagram.com/sagradafamilia.joven/",
    instagramUsuario: "@sagradafamilia.joven",
    youtube: "https://www.youtube.com/@sagradafamilianordelta",
    spotify: "https://open.spotify.com/user/31kry2pjk37t4h5nuiknzpfggs5q",
    email: "sagradafamiliajoven@gmail.com"
  },

  /* ---------- Inicio ---------- */
  inicio: {
    eyebrow: "Parroquia Sagrada Familia · Nordelta",
    titulo: "Jóvenes Sagrada Familia",
    bajada: "Una comunidad para encontrarte con Jesús, con otros y con vos mismo. Grupos desde 3er año hasta la universidad, misiones, adoración y misa de jóvenes.",
    imagen: "img/hero-iglesia.jpg",
    frase: "Juntos celebramos la fe, adoramos al Señor, misionamos anunciando a Jesús y queremos ser solidarios con los que más lo necesitan.",
    quienesSomos: "Sagrada Familia es una comunidad que reúne a niños, jóvenes, adultos y mayores. Como una familia animada por el Espíritu, estamos en constante crecimiento y queremos vivirlo con humildad y servicio."
  },

  avisoInscripciones:
    "FARO, HPP y Puente a María tienen la inscripción abierta. Confirmación y Post-Confirmación abren en julio 2027: seguinos en Instagram para enterarte primero.",

  /* ---------- Grupos ----------
     pagina: nombre del archivo de la página del grupo
     inicio / fin: dónde empieza y termina la barra en la línea de edades.
       1 = principio de 3er año, 2 = 4to, 3 = 5to, 4 = 6to, 5 = facultad, 6 = final. Usá .5 para "mitad de año".
     ciclo: aparece en la ficha del grupo
     siguiente: grupos que se recomiendan como próxima etapa */
  grupos: [
    {
      id: "faro", pagina: "faro.html",
      nombre: "FARO", subtitulo: "Pre-confirmación",
      edades: "De mediados de 3er año a 4to año", edadesCorto: "3er y 4to año", inicio: 1.5, fin: 2.5, ciclo: "De agosto a junio",
      cuando: "Lunes a jueves · 17:30 a 19:30",
      color: "#a8894f",
      logo: "img/logo-faro.png",
      imagen: "img/faro-foto-principal.jpg",
      imagenCard: "img/faro-grupo-parque.jpg",
      resumen: "Como un faro en medio del mar: una luz que orienta en medio de las dudas, los miedos y las preguntas propias de la edad.",
      texto: [
        "FARO es una propuesta para chicos que busca generar un espacio de encuentro, pertenencia y crecimiento personal. A través de juegos, dinámicas, vínculos y momentos compartidos, buscamos que cada uno pueda conocerse mejor, encontrar su lugar y empezar a descubrir el amor de Jesús.",
        "Nace del deseo de acompañar a los chicos en una etapa clave de sus vidas: que cada uno descubra que es valioso, que tiene un lugar al que pertenece y que no está solo, porque siempre hay una luz que lo guía."
      ],
      pilares: { titulo: "Lo que vivimos", items: ["Juegos", "Dinámicas", "Amistad", "Pertenencia", "Reflexión", "Oración"] },
      encuentro: {
        titulo: "Cómo es un encuentro",
        eyebrow: "Los encuentros",
        texto: [
          "Los encuentros de FARO son espacios para compartir, divertirse, conocer gente y crecer juntos. Cada encuentro tiene una temática diferente que vamos trabajando a través de juegos, desafíos, dinámicas grupales y momentos para reflexionar.",
          "También hay espacios para compartir lo que pensamos y sentimos, escuchar a los demás y descubrir cómo Jesús se hace presente en nuestra vida cotidiana.",
          "No todos los encuentros son iguales, pero todos forman parte de un mismo camino: conocernos mejor, construir vínculos, encontrar nuestro lugar y acercarnos cada vez más a Jesús."
        ],
        datos: [
          { n: "Semanal", t: "Un encuentro por semana, de 17:30 a 19:30" },
          { n: "4", t: "convivencias durante el año" },
          { n: "1", t: "campamento" }
        ]
      },
      preguntas: [
        { p: "¿A qué edades está dirigido?", r: "FARO está pensado para chicos y chicas desde mediados de 3er año hasta 4to año de secundaria." },
        { p: "¿Es obligatorio hacer FARO para recibir la Confirmación?", r: "No, FARO no es un requisito obligatorio para recibir la Confirmación. Es una propuesta para quienes quieran empezar a acercarse más a Jesús, conocerse mejor y compartir un camino de fe con otros chicos de su edad." },
        { p: "¿FARO es catequesis?", r: "No, FARO no es catequesis. Es un espacio de encuentro en el que, a través de experiencias compartidas, buscamos crecer personalmente, construir vínculos y acercarnos a Jesús." },
        { p: "¿Cuánto dura FARO?", r: "El ciclo de FARO se desarrolla a lo largo del año, desde agosto hasta junio, con encuentros semanales y actividades especiales que nos permiten compartir y profundizar el camino que hacemos juntos." },
        { p: "¿Cuándo y dónde son los encuentros?", r: "Los encuentros son de 17:30 a 19:30, el día que estés anotado. Se realizan en Sagrada Familia Nordelta, aunque algunas actividades pueden tener otra sede, que se avisa con anticipación." },
        { p: "¿Hay convivencias y campamento?", r: "¡Sí! Durante el año tenemos cuatro convivencias y un campamento. Dos convivencias marcan el inicio y el cierre del recorrido, y las otras dos nos permiten compartir experiencias especiales durante el año. Además, el campamento es una oportunidad para convivir, fortalecer los vínculos y vivir FARO de una manera diferente." },
        { p: "¿Cómo me inscribo? ¿Hay cupos?", r: "Las inscripciones se hacen con el formulario de esta página, que también está en nuestro Instagram. Como los grupos tienen cupos limitados, te recomendamos estar atento a las fechas de inscripción y a nuestras redes para conocer las novedades." }
      ],
      inscripcion: { estado: "abierta", link: "https://forms.gle/thcqj2fb6V5dGEs28", texto: "Anotarme en FARO" },
      siguiente: ["confirmacion"],
      aCompletar: []
    },
    {
      id: "confirmacion", pagina: "confirmacion.html",
      nombre: "Confirmación", subtitulo: "Confir",
      edades: "4to y 5to año", inicio: 2.5, fin: 3.5, ciclo: "De mitad de año a mitad de año",
      cuando: "Hay grupos de lunes a jueves",
      color: "#7d3434",
      imagen: "img/confir-encuentro.jpg",
      imagenCard: "img/confir-velas.jpg",
      resumen: "Un año para descubrir que fuimos elegidos y prepararnos para recibir el Espíritu Santo.",
      texto: [
        "“No son ustedes los que me eligieron a mí, sino yo el que los eligió a ustedes” (Jn 15,16). Empezamos por conocernos: quiénes somos, en qué creemos, nuestra familia y nuestros amigos. Desde ahí nos encontramos con Jesús en la oración, la Misa, los sacramentos y María.",
        "En la segunda etapa vivimos la Cuaresma y la Pascua, y profundizamos en el perdón, el Espíritu Santo, la Palabra de Dios y la misión, hasta recibir el sacramento de la Confirmación. Cada grupo es chico y lo acompañan coordinadores."
      ],
      encuentro: {
        titulo: "Cómo es un encuentro",
        pasos: [
          "Oración de inicio al Espíritu Santo",
          "Té y charla: la buena y la mala de la semana",
          "Dinámicas que van ganando profundidad",
          "Compartida y tema del día",
          "Oración de cierre, muchas veces frente al Santísimo",
          "Un propósito para trabajar durante la semana"
        ]
      },
      temas: {
        titulo: "Algunos temas que recorremos",
        nota: "Y muchos más que se descubren en el camino.",
        items: ["¿Quién soy?", "Familia y amigos", "Jesús", "Libertad", "Oración", "María", "Espíritu Santo", "Misión"]
      },
      inscripcion: { estado: "cerrada", link: "", texto: "Formulario de inscripción" },
      testimonios: [
        { texto: "El retiro de Confirmación me hizo conocer a Dios de un modo distinto.", nombre: "Mateo", anio: "2025" },
        { texto: "Llegué conociendo al Espíritu Santo, pero sin entenderlo en profundidad. Así me pude dar cuenta de cómo verlo en el día a día y en mi vida.", nombre: "Olivia", anio: "2026" }
      ],
      siguiente: ["post"],
      aCompletar: ["Preguntas frecuentes de Confirmación (requisitos, fecha del sacramento, padrinos)"]
    },
    {
      id: "post", pagina: "post.html",
      nombre: "Post", subtitulo: "Post-confirmación",
      edades: "5to y 6to año", inicio: 3.5, fin: 4.5, ciclo: "De mitad de año a mitad de año",
      cuando: "Hay grupos de lunes a jueves",
      color: "#4e5f58",
      imagen: "img/post-consagracion-2.jpg",
      imagenCard: "img/post-consagracion-3.jpg",
      resumen: "Un camino para sumergirnos cada vez más en el amor de Dios y elegirlo en las decisiones de todos los días.",
      texto: [
        "Post es un espacio donde no solo empezamos a conocer a Dios un poco más, sino también a elegirlo en las decisiones de todos los días, dejándolo entrar en cada etapa de nuestra vida.",
        "Porque, al final, ese es el camino de Post: con María, a través de María, hacia Dios."
      ],
      etapas: {
        titulo: "El camino de Post",
        pasos: true,
        lista: [
          { nombre: "Afectiva", temas: ["Contemplamos nuestra propia historia y nuestra afectividad. Aprendemos a mirarnos con los ojos con los que Dios nos mira."] },
          { nombre: "Formativa", temas: ["Nos formamos en la fe, porque nadie puede amar lo que no conoce, para que la fe transforme la vida cotidiana."] },
          { nombre: "Contemplativa", temas: ["Culmina con la consagración a María: recibimos a María, el regalo que Jesús nos dejó desde la cruz, para aprender a amarlo de la mejor manera."] }
        ]
      },
      inscripcion: { estado: "cerrada", link: "", texto: "Formulario de inscripción" },
      siguiente: ["hpp", "puente"],
      siguienteTitulo: "¿Terminaste Post? ¿Qué sigue?",
      siguienteTexto: "Post termina a mitad de 6to año, y ahí arranca HPP: un espacio para tus preguntas sobre qué estudiar, quién sos y hacia dónde vas. Y si querés salir a misionar, sumate a Puente a María.",
      testimonios: [
        { texto: "Con Post aprendí a llevar a Dios a la vida diaria. Me llevo muchas cosas nuevas, además de muchos amigos y personas increíbles.", nombre: "Felipe", anio: "2023" },
        { texto: "Una nueva manera de conocer a la Virgen: descubrí su amor y me dejé sorprender.", nombre: "Trinidad", anio: "2023" }
      ],
      aCompletar: []
    },
    {
      id: "hpp", pagina: "hpp.html",
      nombre: "HPP", subtitulo: "Herramientas para perseverar",
      edades: "2da mitad de 6to y 1ra mitad de facultad", edadesCorto: "6to año y facultad",inicio: 4.5, fin: 5.5, ciclo: "De mitad de año a mitad de año",
      cuando: "Lunes de 18 a 20 h",
      color: "#5b6f6c",
      logo: "img/logo-hpp.png",
      imagen: "img/hpp-herramientas.jpg",
      imagenCard: "img/hpp-ronda-afuera.jpg",   /* foto de la tarjeta en el inicio */
      resumen: "Una relación personal con Jesús: no una fe de un momento, sino un vínculo que se elige y se sostiene día a día.",
      texto: [
        "HPP es para quienes terminaron Post: acompaña la segunda mitad de 6to año y la primera mitad de la facultad, una etapa llena de preguntas sobre qué estudiar, quiénes somos y hacia dónde vamos.",
        "Conocer a Jesús también es animarse a preguntar: por eso hay espacio para las dudas, para entender lo que creemos y abrazar lo que no entendemos.",
        "Esas herramientas no se guardan: se ponen al servicio de los demás, como nació HPP, en una misión. Se trata de construir sobre roca firme, para que cuando venga el viento y la lluvia, no se caiga."
      ],
      pilares: { titulo: "Tu caja de herramientas", items: ["Oración", "Sacramentos", "Espacio para las dudas", "Formación", "Misión", "Comunidad"] },
      encuentro: {
        titulo: "Cómo es un encuentro",
        ordenado: false,
        intro: "Cada lunes compartimos en comunidad para aprender a perseverar.",
        pasos: ["Oración", "Hacernos preguntas", "Debatir", "Compartir con la comunidad"]
      },
      inscripcion: { estado: "abierta", link: "https://forms.gle/4aaRxfpfcDT8MYWY6", texto: "Anotarme en HPP" },
      testimonios: [
        { texto: "Es venir a pasar un rato con amigos, perseverar con Jesús y seguir creciendo.", nombre: "Martina, Mateo y Ro", anio: "2026" },
        { texto: "Es el lugar perfecto para prepararse para lo que viene en el futuro.", nombre: "Sofía", anio: "" }
      ],
      patronos: ["carlo-acutis", "pier-giorgio-frassati"],
      siguiente: ["puente", "nazaret"]
    },
    {
      id: "puente", pagina: "puente-a-maria.html",
      nombre: "Puente a María", subtitulo: "Misión semana a semana",
      edades: "5to año en adelante", inicio: 3, fin: 6,
      cuando: "Sábados de 10 a 12 · Barrio Las Tunas",
      color: "#26342f",
      imagen: "img/puente-mision.jpg",
      imagenCard: "img/puente-catequesis.jpg",
      resumen: "Un grupo misionero que, como María, la primera misionera, lleva a Jesús a los lugares donde más se necesita.",
      texto: [
        "Caminamos juntos llevando a Jesús a donde hay soledad, angustia y falta de Dios, y en el camino también nos encontramos con Él. María nos ayuda a llegar a esos lugares y a abrir esas puertas.",
        "Todos los sábados, de 10 a 12, vamos al barrio Las Tunas a dar catequesis a los más chiquitos. Todo lo sostenemos en la oración por las personas que vamos conociendo."
      ],
      pilares: { titulo: "Qué hacemos", items: ["Catequesis", "Misiones", "Obras de misericordia", "Campaña de frío", "Oración"] },
      destacado: {
        eyebrow: "Misión de Semana Santa",
        titulo: "Puente Solidario",
        texto: "Cada año, en Semana Santa, el grupo de Puente a María organiza una misión especial para llevar a Jesús y acompañar a quienes más lo necesitan.",
        imagen: "img/puente-solidario.jpg",
        logo: "img/logo-puente-blanco.png",
        reel: "DXKXWXdEUvg"
      },
      inscripcion: { estado: "abierta", link: "https://chat.whatsapp.com/IUHhi1j89nHHS03XPLCAtJ", texto: "Sumarme por WhatsApp", nota: "Escribinos por WhatsApp y te contamos cómo sumarte a la misión." },
      siguiente: ["nazaret"],
      aCompletar: []
    },
    {
      id: "nazaret", pagina: "nazaret.html",
      nombre: "Nazaret", subtitulo: "Naza",
      edades: "Universitarios y profesionales", inicio: 5, fin: 6,
      cuando: "Cada 15 días a las 21 h",
      color: "#94735e",
      logo: "img/logo-nazaret.png",
      imagen: "img/capilla.jpg",
      resumen: "Volver a lo esencial: un espacio para seguir creciendo y madurando en la fe.",
      texto: [
        "Nazaret es volver a ese lugar sencillo donde Jesús eligió vivir, a ese primer encuentro personal que cada uno tuvo con Él, para fortalecerlo y dejar que siga transformando nuestra vida.",
        "Crecer en la fe también implica animarse a preguntar por qué creemos lo que creemos y cómo vivirlo en lo cotidiano: ir alineando nuestras decisiones, nuestros vínculos y nuestro proyecto de vida con aquello que profesamos."
      ],
      pilares: { titulo: "Cada encuentro", items: ["Charlas", "Oración", "Lectio Divina", "Espacio para preguntarnos"] },
      encuentro: {
        titulo: "Cómo es un encuentro",
        texto: [
          "Un encuentro típico de Nazaret tiene momentos de aprendizaje y formación, momentos de oración y tiempo para conocer a los jóvenes de la comunidad.",
          "Muchas veces cerramos comiendo todos juntos en algún bar."
        ]
      },
      inscripcion: { estado: "abierta", link: "https://chat.whatsapp.com/BzJwheCR3UACV0sc8wGzNa", texto: "Sumarme al grupo de WhatsApp", nota: "Sumate al grupo de WhatsApp y enterate de cada encuentro." },
      siguiente: ["puente"]
    }
  ],

  /* ---------- Carrusel de fotos (inicio) ---------- */
  carrusel: [
    { foto: "img/faro-bandera-capilla.jpg", texto: "FARO · Levántate y sígueme", link: "faro.html" },
    { foto: "img/puente-mision.jpg", texto: "Misión en Las Tunas", link: "puente-a-maria.html" },
    { foto: "img/post-consagracion-3.jpg", texto: "Consagración a María", link: "post.html" },
    { foto: "img/confir-velas.jpg", texto: "Confirmación", link: "confirmacion.html" },
    { foto: "img/faro-atardecer.jpg", texto: "FARO al atardecer", link: "faro.html" },
    { foto: "img/hpp-ronda-afuera.jpg", texto: "HPP", link: "hpp.html" },
    { foto: "img/puente-catequesis.jpg", texto: "Catequesis con Puente a María", link: "puente-a-maria.html" },
    { foto: "img/parroquia-jovenes.jpg", texto: "Comunidad joven", link: "index.html#encuentros" },
    { foto: "img/faro-bandera-manos.jpg", texto: "FARO", link: "faro.html" },
    { foto: "img/post-consagracion-2.jpg", texto: "Post", link: "post.html" },
    { foto: "img/confir-testimonio.jpg", texto: "Encuentro de Confirmación", link: "confirmacion.html" },
    { foto: "img/hpp-santos.jpg", texto: "HPP", link: "hpp.html" },
    { foto: "img/bautismo.jpg", texto: "Bautismo", link: "sumate.html#sacramentos" },
    { foto: "img/puente-solidario.jpg", texto: "Dar de comer al hambriento", link: "puente-a-maria.html" },
    { foto: "img/coordis.jpg", texto: "Coordinadores", link: "sumate.html" },
    { foto: "img/faro-grupo-iglesia.jpg", texto: "FARO", link: "faro.html" },
    { foto: "img/adoracion.jpg", texto: "Adoración", link: "horarios.html" }
  ],

  /* ---------- Reels de Instagram ----------
     grupo: aparece en la página de ese grupo. reelsIncrustados: true = se ve dentro de la página */
  reelsIncrustados: true,
  reels: [
    { id: "DdKT-lTvwJq", titulo: "FARO", grupo: "faro", foto: "img/faro-atardecer.jpg", color: "#a8894f" },
    { id: "DRdYqaDDc6V", titulo: "Campamento de Confirmación", grupo: "confirmacion", foto: "img/confir-grupo.jpg", color: "#7d3434" },
    { id: "Da0Z6j-xEGr", titulo: "Post", grupo: "post", foto: "img/post-consagracion-1.jpg", color: "#4e5f58" },
    { id: "DRPflt7jdZE", titulo: "Retiro de Post", grupo: "post", foto: "img/faro-noche.jpg", color: "#4e5f58" },
    { id: "Da3M48Qxe2j", titulo: "HPP", grupo: "hpp", foto: "img/hpp-ronda-noche.jpg", color: "#5b6f6c" },
    { id: "DZVOkl8R4U-", titulo: "Un finde de Puente a María", grupo: "puente", foto: "img/puente-mision.jpg", color: "#26342f" },
    { id: "DatyVp5NbB1", titulo: "Campaña de frío", grupo: "puente", foto: "img/puente-hogar.jpg", color: "#26342f" },
    { id: "DXKXWXdEUvg", titulo: "Misión de Semana Santa", grupo: "puente", foto: "img/puente-solidario.jpg", color: "#26342f" },
    { id: "DeIP5vQR1-9", titulo: "Peregrinación a Luján", foto: "img/iglesia-dia.jpg", color: "#94735e" },
    { id: "DQ7uwQuDYNs", titulo: "Miércoles de adoración", foto: "img/capilla.jpg", color: "#1d2623" }
  ],

  /* ---------- Encuentros abiertos a todos ---------- */
  encuentros: [
    { titulo: "Misa de jóvenes", cuando: "Domingos · 20:15 h", detalle: "La misa de la comunidad joven. Vení con tu grupo o solo." },
    { titulo: "Adoración", cuando: "Miércoles · 21:30 h", detalle: "Un rato de silencio frente a Jesús Eucaristía.", reel: "DQ7uwQuDYNs" },
    { titulo: "Adoración y pizzas", cuando: "Primer miércoles de cada mes · 20:30 h", detalle: "Para jóvenes de todas las edades." },
    { titulo: "Adoración perpetua", cuando: "Todos los días", detalle: "El Santísimo está expuesto siempre. Si querés comprometerte con un horario semanal, escribí al +54 9 11 5573-9998.", link: "https://wa.me/5491155739998", linkTexto: "Anotarme por WhatsApp" }
  ],

  /* ---------- Horarios ---------- */
  misas: [
    { dia: "Lunes a viernes", horas: "9:00" },
    { dia: "Sábados", horas: "19:00" },
    { dia: "Domingos", horas: "11:00 · 19:00 · 20:15 (jóvenes)" }
  ],
  confesiones: [
    { dia: "Lunes a viernes", horas: "Con cita previa a la secretaría: +54 9 11 3692-1028" },
    { dia: "Sábados y domingos", horas: "30 minutos antes de cada misa, sin cita" }
  ],

  /* ---------- Peregrinación a Luján (bloque destacado del inicio) ---------- */
  lujan: {
    titulo: "Peregrinación a Luján",
    cuando: "Una vez al año · primer fin de semana de octubre",
    texto: "Salimos el sábado a la mañana y caminamos hasta la madrugada para llegar a los pies de la Virgen de Luján. Cada uno elige su trayecto según cuánto quiera caminar.",
    proxima: "Sábado 2 de octubre de 2027",
    reel: "DeIP5vQR1-9",
    trayectos: [
      { desde: "Liniers", km: 63 },
      { desde: "Moreno", km: 35 },
      { desde: "General Rodríguez", km: 19 }
    ]
  },

  /* ---------- Calendario ----------
     OPCIÓN A (recomendada): una planilla de Google Sheets publicada como CSV.
       Columnas: fecha | hasta | hora | titulo | grupo | detalle | link
       fecha: 2027-03-21 (o 2027-07 si todavía no hay día). grupo: faro, confirmacion, post, hpp, puente, nazaret o todos.
       Pegá acá el link de "Publicar en la Web → CSV". Si queda vacío, se usan los eventos de abajo.
     OPCIÓN B: escribir los eventos directamente en la lista "eventos". */
  calendario: {
    hojaCSV: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRFVaf4x4IT6NnYj4i9_T0njw6bXeQMSg2YOT8foehxXFlN8ekqdOGv1f9N68uugXrLU3PFiVtuyHSm/pub?output=csv",
    /* Si la planilla no carga (sin internet, link roto), se muestran estos eventos de respaldo: */
    eventos: [
      { fecha: "2027-03-21", hasta: "2027-03-28", titulo: "Semana Santa · Misión Puente Solidario", grupo: "puente", detalle: "Fechas exactas de la misión a confirmar." },
      { fecha: "2027-07", titulo: "Abren las inscripciones a Confirmación y Post", grupo: "todos", detalle: "Seguinos en Instagram para enterarte del día." },
      { fecha: "2027-10-02", hora: "Sábado a la mañana", titulo: "Peregrinación a Luján", grupo: "todos", detalle: "Trayectos desde Liniers (63 km), Moreno (35 km) y General Rodríguez (19 km)." }
    ],
    /* Eventos que se repiten solos. regla:
         "primer-miercoles" (o primer-lunes, primer-martes, …) → todos los meses
         "cada-domingo" (o cada-lunes, …) → todas las semanas. Con excepto: "primer" saltea la primera del mes.
         semanal: true → se muestra más suave y no aparece en "Próximos eventos" del inicio
         "nochebuena" → 24 de diciembre · "navidad" → 25 de diciembre
         "sagrada-familia" → domingo después de Navidad (30/12 si Navidad cae domingo) */
    recurrentes: [
      { titulo: "Misa de jóvenes", regla: "cada-domingo", hora: "20:15", grupo: "todos", semanal: true, detalle: "La misa de la comunidad joven. Vení con tu grupo o solo." },
      { titulo: "Misión de Puente a María", regla: "cada-sabado", hora: "10:00 a 12:00", grupo: "puente", semanal: true, detalle: "Catequesis con los chicos del barrio Las Tunas." },
      { titulo: "Adoración de jóvenes", regla: "cada-miercoles", excepto: "primer", hora: "21:30", grupo: "todos", semanal: true, detalle: "Un rato de silencio frente a Jesús Eucaristía. El primer miércoles del mes es Adoración y pizzas, a las 20:30." },
      { titulo: "Misa de Nochebuena", regla: "nochebuena", hora: "20:00", grupo: "todos", detalle: "Horario de 2025: confirmalo en Instagram antes de venir." },
      { titulo: "Navidad · Misas", regla: "navidad", hora: "11:00 · 20:00 · 21:15", grupo: "todos", detalle: "Horarios de 2025: confirmalos en Instagram antes de venir." },
      { titulo: "Solemnidad de la Sagrada Familia", regla: "sagrada-familia", grupo: "todos", detalle: "La fiesta patronal de nuestra parroquia." },
      { titulo: "Adoración y pizzas", regla: "primer-miercoles", hora: "20:30", grupo: "todos", detalle: "Para jóvenes de todas las edades." }
    ]
  },

  /* ---------- Sacramentos (página Sumate) ---------- */
  sacramentos: {
    titulo: "¿Necesitás bautizarte o tomar la Comunión?",
    texto: "Nunca es tarde. Si todavía no recibiste el Bautismo, la Primera Comunión o la Confirmación, consultá en la secretaría y te orientamos sobre cómo prepararte.",
    imagen: "img/bautismo.jpg"
  },

  /* ---------- Ranking parroquial de los juegos ----------
     url: la dirección de la aplicación web de Google Apps Script (ver herramientas/ranking/LEEME.md).
     pedirUsuario: el texto que ve quien todavía no tiene código.
     Vacío = el ranking aparece como "muy pronto". */
  ranking: {
    url: "https://script.google.com/macros/s/AKfycbwHWJrFhnWdO1au2H4ADRgBqy7zVptiTgfRi7DL_79QJ0Hy_t97QdX7yxGT2ffMsAB4og/exec",
    pedirUsuario: "¿Querés tu propio usuario? Pedíselo a Pola."
  },

  /* ---------- Biblioteca (página Recursos) ----------
     pilar: espiritual, intelectual, humano, apostolico
     formato: Lectura, Podcast, Video, App, Curso, Música, Peli o serie
     nivel: Inicial, Intermedio, Profundo */
  biblioteca: {
    pilares: [
      { id: "espiritual", nombre: "Espiritual", detalle: "Oración y vida interior", color: "#4e5f58" },
      { id: "intelectual", nombre: "Intelectual", detalle: "Apologética y doctrina", color: "#2b3a55" },
      { id: "humano", nombre: "Humano-afectivo", detalle: "Virtudes y afectividad", color: "#7d3434" },
      { id: "apostolico", nombre: "Apostólico-moral", detalle: "Evangelización y misión", color: "#94735e" }
    ],
    recursos: [
      { titulo: "La Biblia", detalle: "El Libro del Pueblo de Dios, la traducción argentina, online.", pilar: "espiritual", formato: "Lectura", nivel: "Inicial", link: "https://www.vatican.va/archive/ESL0506/_INDEX.HTM" },
      { titulo: "Homilías del P. Checo Avellaneda", detalle: "Las homilías del P. Carlos «Checo» Avellaneda, para escuchar durante la semana.", pilar: "espiritual", formato: "Podcast", nivel: "Inicial", link: "https://open.spotify.com/show/2DADjzHFdNqdzIujKSP4UG" },
      /* links: varios botones en la misma tarjeta. Los que tengan url vacía no se muestran. */
      { titulo: "Homilías del P. Augusto Zampini", detalle: "Las homilías completas en YouTube y los mejores momentos en clips cortos.", pilar: "espiritual", formato: "Video", nivel: "Inicial",
        links: [
          { texto: "Ver completas en YouTube", url: "https://www.youtube.com/@sagradafamilianordelta/streams" },
          { texto: "Clips en Instagram", url: "https://www.instagram.com/sagradafamilia.joven/" }
        ] },
      { titulo: "YouTube de la parroquia", detalle: "Charlas, celebraciones y contenido de Sagrada.", pilar: "espiritual", formato: "Video", nivel: "Inicial", link: "https://www.youtube.com/@sagradafamilianordelta" },
      { titulo: "Compendio del Catecismo", detalle: "Lo esencial de la fe en preguntas y respuestas.", pilar: "intelectual", formato: "Lectura", nivel: "Inicial", link: "https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html" },
      { titulo: "Catecismo de la Iglesia Católica", detalle: "Para entender lo que creemos, tema por tema.", pilar: "intelectual", formato: "Lectura", nivel: "Profundo", link: "https://www.vatican.va/archive/catechism_sp/index_sp.html" },
      { titulo: "Teología del cuerpo", detalle: "Podcast hecho por una integrante de la comunidad sobre la afectividad, el cuerpo y el amor según el plan de Dios.", pilar: "humano", formato: "Podcast", nivel: "Intermedio", link: "https://open.spotify.com/show/4ihEBBGlMCjeEzCgCfQCkY" },
      { titulo: "Christus vivit", detalle: "La carta del Papa Francisco a los jóvenes (2019).", pilar: "apostolico", formato: "Lectura", nivel: "Intermedio", link: "https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20190325_christus-vivit.html" },
      { titulo: "Evangelio del día", detalle: "Las lecturas de la misa de hoy con un breve comentario, de Vatican News.", pilar: "espiritual", formato: "Lectura", nivel: "Inicial", link: "https://www.vaticannews.va/es/evangelio-de-hoy.html" },
      { titulo: "Horarios de Misa", detalle: "App gratuita para encontrar misas, confesiones y adoración cerca tuyo cuando estás en otro lado. Más de 130.000 iglesias en todo el mundo.", pilar: "espiritual", formato: "App", nivel: "Inicial", link: "https://horariosdemisa.com/" },
      { titulo: "Hallow", detalle: "App para rezar: rosario, meditaciones guiadas, examen de conciencia y planes de oración. Tiene versión en español.", pilar: "espiritual", formato: "App", nivel: "Inicial", link: "https://hallow.com/es/" },
      { titulo: "Dilexit nos", detalle: "Carta del Papa Francisco sobre el amor del Corazón de Jesús (2024).", pilar: "espiritual", formato: "Lectura", nivel: "Intermedio", link: "https://www.vatican.va/content/francesco/es/encyclicals/documents/20241024-enciclica-dilexit-nos.html" },
      { titulo: "Gaudete et exsultate", detalle: "El llamado a la santidad en el mundo de hoy, en la vida de todos los días (Francisco, 2018).", pilar: "espiritual", formato: "Lectura", nivel: "Intermedio", link: "https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20180319_gaudete-et-exsultate.html" },
      { titulo: "Deus caritas est", detalle: "«Dios es amor»: qué es el amor cristiano y cómo se vive (Benedicto XVI, 2005).", pilar: "intelectual", formato: "Lectura", nivel: "Profundo", link: "https://www.vatican.va/content/benedict-xvi/es/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html" },
      { titulo: "Carta de Juan Pablo II a los jóvenes", detalle: "Dilecti amici: el proyecto de vida, la vocación y el amor, escrita para los jóvenes del mundo (1985).", pilar: "humano", formato: "Lectura", nivel: "Intermedio", link: "https://www.vatican.va/content/john-paul-ii/es/apost_letters/1985/documents/hf_jp-ii_apl_31031985_dilecti-amici.html" },
      { titulo: "Amoris laetitia", detalle: "Sobre el amor en la familia. El capítulo 4 («El amor en el matrimonio») comenta el himno de la caridad de san Pablo (Francisco, 2016).", pilar: "humano", formato: "Lectura", nivel: "Profundo", link: "https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20160319_amoris-laetitia.html" },
      { titulo: "Creados para amar · Feminidad auténtica", detalle: "Del módulo Creados para amar de HPP. Videos y lecturas sobre la dignidad, la belleza y la vocación de la mujer.", pilar: "humano", formato: "Curso", nivel: "Intermedio",
        links: [
          { texto: "Los 4 pilares de la feminidad según Edith Stein", url: "https://es.aleteia.org/2018/08/21/los-4-pilares-de-la-feminidad-segun-edith-stein/" },
          { texto: "Santa Clara de Asís, una vida para emular (Benedicto XVI)", url: "https://www.vatican.va/content/benedict-xvi/es/audiences/2010/documents/hf_ben-xvi_aud_20100915.html" },
          { texto: "Tres consejos para una universitaria (Leah Darrow)", url: "https://drive.google.com/file/d/1PDd1YighLXRPMYje5rz65if5_RmOP142/view" },
          { texto: "¿Puedo ser feliz estando soltera?", url: "https://drive.google.com/file/d/1bQohocRvzlLD1YD4z9tBtm7rAxGPHjoF/view" },
          { texto: "¿Qué es la modestia? (Leah Darrow) (en inglés)", url: "https://www.youtube.com/watch?v=SQ84oSJcrFE" },
          { texto: "You: Of Whom the World is Not Worthy (en inglés)", url: "https://www.youtube.com/watch?v=KIy9Wmu_Q7g" },
          { texto: "Qué nos dice hoy santa Juana de Arco (en inglés)", url: "https://www.youtube.com/watch?v=mUswlnpnT_w" },
          { texto: "La mujer que me enseñó a ir contra la corriente (en inglés)", url: "https://www.youtube.com/watch?v=59kzZB3UjK8" },
          { texto: "Cómo ser una mujer virtuosa (en inglés)", url: "https://www.youtube.com/watch?v=8QzERcA-0XQ" },
          { texto: "The Victoria's Secret Fashion Show (en inglés)", url: "https://www.youtube.com/watch?v=rkBdCRYCseU" }
        ],
        pedir: ["Feminidad pura (Crystalina Evert)", "Los chicos buenos no existen (Crystalina Evert)"] },
      { titulo: "Creados para amar · Masculinidad auténtica", detalle: "Del módulo Creados para amar de HPP. Qué significa ser un hombre de verdad: virtud, fortaleza y entrega.", pilar: "humano", formato: "Curso", nivel: "Intermedio",
        links: [
          { texto: "Hombres fuertes y débiles a la luz de Notre Dame", url: "https://drive.google.com/file/d/1T8J8eHeGBJ_V4VKbWBUdBJ8BrR_jIeow/view" },
          { texto: "Los buenos chicos siempre pierden", url: "https://drive.google.com/file/d/1Y_5N92noQakd_S2jNdUEIpsZCHSpx8SJ/view" },
          { texto: "¿Es la castidad un castigo? Testimonio de Eduardo Verástegui", url: "https://www.youtube.com/watch?v=DzUVMD6Mjpg" },
          { texto: "¿Qué es la masculinidad auténtica? (en inglés)", url: "https://www.youtube.com/watch?v=8xT2L1DJOz4" },
          { texto: "Qué significa ser un hombre de virtud (en inglés)", url: "https://www.youtube.com/watch?v=DujkQdtik0Y" },
          { texto: "Qué podemos aprender de Máximo Décimo Meridio (en inglés)", url: "https://www.youtube.com/watch?v=u-LsLd4RP5g" },
          { texto: "Curso Into the Breach (en inglés)", url: "https://www.kofc.org/intothebreach" }
        ],
        pedir: ["Masculinidad pura (Jason Evert)", "El valor divino de lo humano: ¡Hombres! (Jesús Urteaga)", "Cómo entregar la vida: carta de un héroe de Malvinas (Jesús Urteaga)"] },
      { titulo: "Creados para amar · Amor y noviazgo", detalle: "Del módulo Creados para amar de HPP. Cómo reconocer a la persona indicada, vivir la castidad y soñar con un amor para toda la vida.", pilar: "humano", formato: "Curso", nivel: "Intermedio",
        links: [
          { texto: "¿Qué significa ser varón y mujer? (Jutta Burggraf)", url: "https://drive.google.com/file/d/1nNumH66kIrYoz2W37DxEcEjNBXDcqtrG/view" },
          { texto: "¿Es posible un matrimonio de santos? Luis y Celia Martin", url: "https://drive.google.com/file/d/1VQ5N2x7TrmxTVMpSd4oFJbqfJ1Cpn1eR/view" },
          { texto: "¿Habrá sexo en el cielo? (Peter Kreeft)", url: "https://drive.google.com/file/d/1LHpD7GI_7OTJmPOE0mYjXh1gy3YQnVgG/view" },
          { texto: "¿Cómo sé si es la persona indicada? (en inglés)", url: "https://www.youtube.com/watch?v=x0g1AAgiGSo" },
          { texto: "¿Alguna vez voy a encontrar a esa persona? (en inglés)", url: "https://www.youtube.com/watch?v=14VAz80R9-0" },
          { texto: "¿La castidad hizo incómoda nuestra noche de bodas? (en inglés)", url: "https://www.youtube.com/watch?v=P3OKZRIEV4M" },
          { texto: "Amar como María y José (en inglés)", url: "https://www.youtube.com/watch?v=zWht7mesRD8" }
        ],
        pedir: ["Amor puro (Jason Evert)", "Jason Evert responde todas las preguntas sobre el noviazgo"] },
      { titulo: "Conversaciones más profundas", detalle: "Cómo conectar de verdad con los demás, más allá de las preguntas de siempre.", pilar: "humano", formato: "Lectura", nivel: "Inicial", link: "https://drive.google.com/file/d/1KNOeCfn3zm7YdNssYPncMP69j8A0QufO/view" },
      { titulo: "Santo Tomás de Aquino · Lecturas", detalle: "Su vida, su pensamiento y su oración, de la biblioteca de HPP.", pilar: "intelectual", formato: "Lectura", nivel: "Intermedio",
        links: [
          { texto: "Introducción a su vida", url: "https://drive.google.com/file/d/1nA9D31lAz7NMRFwIAGjQY6-b0HtyBger/view" },
          { texto: "Biografía resumida (Dominicos)", url: "https://www.dominicos.org/quienes-somos/grandes-figuras/santo-tomas-de-aquino/biografia-tomas-de-aquino/" },
          { texto: "Maestro de vida espiritual (Dominicos)", url: "https://www.dominicos.org/quienes-somos/grandes-figuras/santo-tomas-de-aquino/maestro-vida-espiritual/" },
          { texto: "El Padrenuestro explicado por santo Tomás (Dominicos)", url: "https://www.dominicos.org/quienes-somos/grandes-figuras/santo-tomas-de-aquino/comentario-padrenuestro-tomas-aquino/" },
          { texto: "¿Quién es para la Iglesia? (Eudaldo Forment)", url: "https://drive.google.com/file/d/1oMizzR6sdjmYN5h4biiZcR8Yv3-IdeOn/view" },
          { texto: "Santo Tomás de Aquino (G. K. Chesterton)", url: "https://drive.google.com/file/d/1UthP3uAX0KxuQQp48F-90etb8hWEqeEB/view" },
          { texto: "La verdad moral", url: "https://drive.google.com/file/d/1R8tlV9y6vo_Xo1akWz25sROL5L4SoYzn/view" },
          { texto: "La necesidad de la contemplación", url: "https://drive.google.com/file/d/17sZuFCgQ-RIpDqVv5DQ97Kxp6TIXuMID/view" },
          { texto: "Tomismo para la nueva evangelización (en inglés)", url: "https://drive.google.com/file/d/14PcYfQjWmQyJh7COHMPRfmCAVuadGNoJ/view" }
        ] },
      { titulo: "Santa Teresita · Lecturas", detalle: "El caminito, su vida y por qué es Doctora de la Iglesia.", pilar: "espiritual", formato: "Lectura", nivel: "Inicial",
        links: [
          { texto: "¿Quién fue santa Teresita?", url: "https://drive.google.com/file/d/1Pdp9hwIrVaz_wWKhp9m4JEMkQjSOUcLW/view" },
          { texto: "Una santa para nuestro tiempo: el caminito", url: "https://drive.google.com/file/d/1KPMn4tHp1ZewIcqoZeDt-jFjABCC4D_J/view" },
          { texto: "Homilía de Juan Pablo II: Doctora de la Iglesia", url: "https://www.vatican.va/content/john-paul-ii/es/homilies/1997/documents/hf_jp-ii_hom_19101997.html" },
          { texto: "Teresita, devota de santa Juana de Arco", url: "https://drive.google.com/file/d/1uBFjZ-u7vjwJgayNU2w8jR8GPZr7YVT-/view" }
        ] },
      { titulo: "San John Henry Newman · Lecturas", detalle: "El converso que cambió la historia católica inglesa: su vida y sus sermones.", pilar: "intelectual", formato: "Lectura", nivel: "Profundo",
        links: [
          { texto: "San Juan Enrique Newman (Obispo Barron)", url: "https://www.wordonfire.org/articles/barron/san-juan-enrique-newman/" },
          { texto: "Cómo su conversión dio vuelta la historia (Joseph Pearce)", url: "https://www.religionenlibertad.com/cultura/160721/joseph-pearce-explica-como-conversion-newman-dio_83299.html" },
          { texto: "La conversión de Newman", url: "https://drive.google.com/file/d/1pM75_4YRqX5OkMlwHmtnpLBbVpa4cycN/view" },
          { texto: "Discípulo, teólogo y apóstol", url: "https://drive.google.com/file/d/14T-xG3L5k1Tt76Q02TmkeaNPheizaFmd/view" },
          { texto: "Sermón: Testigos de la resurrección", url: "https://drive.google.com/file/d/10Ej53_5PgvQ6W5bmqexVUZbujfweJR8r/view" },
          { texto: "Sermón: El mundo invisible", url: "https://drive.google.com/file/d/17QXnpMTi-wT5frBydLv98Gp_Tg4xZHDY/view" },
          { texto: "Sermón: La batalla, condición para la victoria", url: "https://drive.google.com/file/d/1hk0B5R2cTHGbEfgOj9jtoEBZV6YgX-I5/view" },
          { texto: "Perspectivas del predicador católico", url: "https://drive.google.com/file/d/1E3R2hEVQxamqc8Z1H4NOn9fxRM7lbuDG/view" },
          { texto: "Los testigos de la fe", url: "https://drive.google.com/file/d/1EBVHzG9jkVZiK4yqvoMExs3fDc3Jtjck/view" },
          { texto: "Tiempos de oración personal", url: "https://drive.google.com/file/d/1TPZaafhknHYc22VQYSUEKfyCiF9evrt5/view" }
        ] },
      { titulo: "Pier Giorgio Frassati · Lecturas", detalle: "El santo de las montañas, de los amigos y de los pobres.", pilar: "apostolico", formato: "Lectura", nivel: "Inicial",
        links: [
          { texto: "Su vida", url: "https://drive.google.com/file/d/14KEmEw7OmrLKyWP3LiD1s7f9ISbqe64r/view" },
          { texto: "El hombre de las bienaventuranzas", url: "https://drive.google.com/file/d/1OuG-2MXeZ7e75aL8he6h1ioKUeLz_2fG/view" },
          { texto: "Caridad y fe: su opción por los pobres", url: "https://drive.google.com/file/d/1nJOVA1rb38nrXa1x5qanPrqmUgQSHMQx/view" },
          { texto: "Modelo de libertad", url: "https://drive.google.com/file/d/1rThypGdocCMreh_ulgngiJKD3skNqTf_/view" },
          { texto: "«Los turbios», su grupo de amigos en la fe", url: "https://drive.google.com/file/d/1QS_MPWlLHcKzpacMSlktgQ1zORpByN_r/view" },
          { texto: "Su devoción a la Eucaristía", url: "https://drive.google.com/file/d/1nt9mmjDgYgipLx3lbY84grT0m8Lnu94A/view" },
          { texto: "Su amor que no fue (carta a Isidoro Bonini)", url: "https://drive.google.com/file/d/1xZ5CKTI6P-FY9PXJrvpxgx9TM763yzCo/view" },
          { texto: "Homilía de su beatificación (Juan Pablo II)", url: "https://drive.google.com/file/d/1siuyqY1TxpHcbKGiU8aO8Cy9d_9Wt_iW/view" },
          { texto: "Más sobre Pier Giorgio", url: "https://drive.google.com/file/d/1Jc0PGtnF9r2FP45ZooNN5mfLioY7biYi/view" }
        ] },
      { titulo: "San Maximiliano Kolbe · Lecturas", detalle: "El caballero de la Inmaculada que dio la vida por otro en Auschwitz.", pilar: "espiritual", formato: "Lectura", nivel: "Intermedio",
        links: [
          { texto: "Primeros años", url: "https://drive.google.com/file/d/1fH4fCgM0-vPTH4Fke9XI_VSl80GmjkJy/view" },
          { texto: "Caballero de la Inmaculada", url: "https://drive.google.com/file/d/1nTM1w-9xYK8kYqDA1nsIanGsL8-iSiEA/view" },
          { texto: "La concepción de la Militia Immaculatae", url: "https://drive.google.com/file/d/1iBQ6S4oh1KJCJ3FE3JlBYL9tE0qLyoK9/view" },
          { texto: "Su amor y devoción a María", url: "https://drive.google.com/file/d/1-32tKo4gboE6NosyrZFDRA2ADPbHYFU5/view" },
          { texto: "Su devoción a santa Teresita", url: "https://drive.google.com/file/d/1ZWCellBS9gChyZ_v53nG3nPRE5VuQ6Tj/view" },
          { texto: "Celo apostólico", url: "https://drive.google.com/file/d/1e1uIQM_akhOhxGHK4uMd4dNwBeWWcY80/view" },
          { texto: "Extractos de su cuaderno espiritual", url: "https://drive.google.com/file/d/1LJExg4YLjoc_w7uymcnrJm8toMjZvO8j/view" },
          { texto: "Las dos coronas de gloria", url: "https://drive.google.com/file/d/1saLqmaQgGKxinam_rFG-4yA9LaVM2A0-/view" },
          { texto: "Últimos años y martirio", url: "https://drive.google.com/file/d/1Kr1C3cUZXuoxI-du8e8B5s2mG_pRj6t9/view" }
        ] },
      { titulo: "Santa Teresa de Calcuta · Lecturas", detalle: "Su vida, su humildad y su larga noche oscura.", pilar: "apostolico", formato: "Lectura", nivel: "Inicial",
        links: [
          { texto: "Biografía (ACI Prensa)", url: "https://www.aciprensa.com/recurso/3600/biografia-de-santa-teresa-de-calcuta" },
          { texto: "«Dios quiere usar nada»: su humildad", url: "https://drive.google.com/file/d/15MElOf25U0suYLWN8z9OtWFG4QTN_ZAv/view" },
          { texto: "Santa de luz, santa de oscuridad", url: "https://drive.google.com/file/d/1PYE1ydlid3WjAI1FiHz7GkRhOVHeBPVi/view" }
        ] },
      { titulo: "Apologética · Razones para creer", detalle: "Respuestas a las grandes preguntas sobre Dios, la verdad y la fe. Lecturas de la biblioteca de HPP.", pilar: "intelectual", formato: "Lectura", nivel: "Profundo",
        links: [
          { texto: "Por qué soy católico (G. K. Chesterton)", url: "https://drive.google.com/file/d/1UsKcDXP1_oS-Qu6BxpSHCJULsjCLznf4/view" },
          { texto: "Why I Am a Catholic (G. K. Chesterton) (en inglés)", url: "https://drive.google.com/file/d/1dyIeuabQhgXKbEKiG-ck5Ds9NmWYzvPN/view" },
          { texto: "Terapias alternativas bajo una mirada de fe", url: "https://drive.google.com/file/d/1N5AoOfrL2Rvq8v5GE5G5bkFJj8kK631L/view" }
        ],
        pedir: ["Razones naturales para creer", "Creación y evolución", "El problema del mal", "La bondad divina", "La verdad objetiva", "El veneno del subjetivismo (C. S. Lewis)", "¿Hombre o conejo? (C. S. Lewis)", "La paz de la roca", "Más que un sentimiento", "El plan de estudios católico para toda una vida"] },
      { titulo: "El aborto: argumentos para el debate", detalle: "Cómo dialogar con caridad y responder los argumentos más comunes.", pilar: "intelectual", formato: "Lectura", nivel: "Profundo",
        links: [
          { texto: "Un pantallazo del debate", url: "https://drive.google.com/file/d/1vy_YFhl-TZx1g3R80isxLa2CFZURKoiP/view" },
          { texto: "Por qué los católicos no pueden estar a favor del aborto", url: "https://drive.google.com/file/d/1w7v55Lg0WZrTlqrTKWro1uv4u6xymMJb/view" },
          { texto: "¿Y qué hay de la mujer?", url: "https://drive.google.com/file/d/1wKFX_sNu1yh745PEykJq5HQ2hetbDIzR/view" },
          { texto: "Refutando los argumentos religiosos", url: "https://drive.google.com/file/d/1r5jVDHDaDTgMWyzyetDywU9ab2XMIu3C/view" }
        ],
        pedir: ["Para encarar la discusión (debatir con caridad)", "Los descalificadores", "Los escépticos", "Los pragmáticos", "Los tolerantes"] },
      { titulo: "YOUCAT", detalle: "El catecismo joven de la Iglesia Católica, en preguntas y respuestas.", pilar: "intelectual", formato: "Lectura", nivel: "Inicial", pedir: true },
      { titulo: "Plan de lectura bíblica", detalle: "Para leer toda la Biblia en 1 año (3 capítulos por día) o en 3 años (1 por día). Una hoja para imprimir.", pilar: "espiritual", formato: "Lectura", nivel: "Inicial", link: "docs/plan-de-lectura-biblica.pdf" },
      { titulo: "Héroes del Antiguo Testamento", detalle: "Formaciones de misión: Abraham, Jacob, Moisés, Samuel, David, Daniel, Elías, Judit y los Macabeos.", pilar: "espiritual", formato: "Curso", nivel: "Intermedio", link: "https://drive.google.com/file/d/1kq0NHh228WVVlfBoDBgspWLZ0vjtB_dK/view" },
      { titulo: "Luchando por la pureza", detalle: "Por qué la pureza es una batalla que vale la pena dar, y cómo darla. De Sam Guzman (The Catholic Gentleman) (en inglés).", pilar: "humano", formato: "Lectura", nivel: "Intermedio", link: "https://www.catholicgentleman.net/2013/07/fighting-for-purity/" },
      { titulo: "10 maneras de evangelizar", detalle: "Evangelizar es más fácil de lo que parece: diez formas concretas para el día a día (FOCUS) (en inglés).", pilar: "apostolico", formato: "Lectura", nivel: "Inicial", link: "https://focusequip.org/10-ways-to-evangelize-its-easier-than-you-think/" },
      { titulo: "Pablo en el Areópago", detalle: "Una clase magistral de evangelización: cómo hablar de Dios a quien no cree (Obispo Robert Barron).", pilar: "apostolico", formato: "Lectura", nivel: "Intermedio", link: "https://www.wordonfire.org/es/articulos/obispo-barron/pablo-en-el-areopago-una-clase-magistral-en-evangelizacion/" },
      { titulo: "Santos que lucharon contra el racismo", detalle: "Santos que defendieron la dignidad de todas las personas (Aleteia) (en inglés).", pilar: "apostolico", formato: "Lectura", nivel: "Inicial", link: "https://aleteia.org/2020/06/01/saints-who-fought-racism/" },
      { titulo: "Carlo Acutis: su kit para ser santo", detalle: "Quién fue el primer santo millennial y qué hacía para crecer en santidad (Catholic-Link). Escrito antes de su canonización.", pilar: "espiritual", formato: "Lectura", nivel: "Inicial", link: "https://catholic-link.com/carlo-acutis-millenial-beatificado/" },
      { titulo: "Mi vida, un disparo a la eternidad", detalle: "Un texto de san Alberto Hurtado sobre vivir con la mirada puesta en lo que no pasa (Fundación Padre Hurtado).", pilar: "espiritual", formato: "Lectura", nivel: "Inicial", link: "https://padrealbertohurtado.cl/mi-vida-un-disparo-a-la-eternidad/" },
      { titulo: "Evangelii gaudium", detalle: "La alegría del Evangelio: cómo anunciar a Jesús hoy (Francisco, 2013).", pilar: "apostolico", formato: "Lectura", nivel: "Profundo", link: "https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html" },
      { titulo: "Dilexi te", detalle: "El amor a los pobres como centro de la fe. Primera exhortación del Papa León XIV (2025).", pilar: "apostolico", formato: "Lectura", nivel: "Intermedio", link: "https://www.vatican.va/content/leo-xiv/es/apost_exhortations/documents/20251004-dilexi-te.html" },
      { titulo: "Laudato si'", detalle: "El cuidado de la casa común (Francisco, 2015).", pilar: "apostolico", formato: "Lectura", nivel: "Intermedio", link: "https://www.vatican.va/content/francesco/es/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html" },
      { titulo: "Fratelli tutti", detalle: "La fraternidad y la amistad social (Francisco, 2020).", pilar: "apostolico", formato: "Lectura", nivel: "Profundo", link: "https://www.vatican.va/content/francesco/es/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html" },
      { titulo: "His Only Son", detalle: "Película sobre Abraham y el sacrificio de Isaac: la fe que confía aun sin entender (2023).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "", imagen: "img/pelis/his-only-son.jpg" },
      { titulo: "The Case for Christ", detalle: "Un periodista ateo investiga la resurrección de Jesús para desmentirla. Basada en la historia real de Lee Strobel (2017).", pilar: "intelectual", formato: "Peli o serie", nivel: "Intermedio", link: "", imagen: "img/pelis/the-case-for-christ.jpg" },
      { titulo: "God's Not Dead", detalle: "Un estudiante universitario defiende la existencia de Dios frente a su profesor de filosofía (2014).", pilar: "intelectual", formato: "Peli o serie", nivel: "Inicial", link: "", imagen: "img/pelis/gods-not-dead.jpg" },
      { titulo: "Young David", detalle: "Serie animada sobre la juventud del rey David, antes de ser rey.", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "", imagen: "img/pelis/young-david.jpg" },
      { titulo: "The Chosen", detalle: "Serie sobre la vida de Jesús y sus discípulos.", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "https://www.thechosen.tv", imagen: "img/pelis/the-chosen.jpg" },
      /* ---- Multimedia: lista de HPP (pelis, series, podcasts y música) ---- */
      { titulo: "Rey David", detalle: "La vida del rey David: pastor, guerrero, rey y pecador arrepentido.", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "La cabaña (The Shack)", detalle: "Un padre atravesado por el dolor se encuentra con Dios (2017).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Tierra de María", detalle: "Documental de Juan Manuel Cotelo sobre historias de conversión de la mano de María (2013).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Cristiada (For Greater Glory)", detalle: "La guerra cristera en México y los que dieron la vida por su fe (2012).", pilar: "apostolico", formato: "Peli o serie", nivel: "Intermedio", link: "" },
      { titulo: "Pablo, apóstol de Cristo", detalle: "Los últimos días de San Pablo en Roma, acompañado por San Lucas (2018).", pilar: "apostolico", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Karol", detalle: "La vida de Karol Wojtyła, San Juan Pablo II, antes y durante su pontificado (2005).", pilar: "apostolico", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Madre Teresa: El legado", detalle: "Sobre la vida y la obra de Santa Teresa de Calcuta.", pilar: "apostolico", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Bakhita: de esclava a santa", detalle: "La historia de Santa Josefina Bakhita, de esclava en Sudán a religiosa canosiana (2009).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Cuarto de guerra (War Room)", detalle: "El poder de la oración para sanar una familia (2015).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Un Dios prohibido", detalle: "Los mártires claretianos de Barbastro durante la Guerra Civil española (2013).", pilar: "apostolico", formato: "Peli o serie", nivel: "Intermedio", link: "" },
      { titulo: "San Agustín", detalle: "La vida de San Agustín, de su búsqueda inquieta a la conversión (2010).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Hasta el último hombre (Hacksaw Ridge)", detalle: "Un médico que se niega a portar armas salva a decenas de soldados. Historia real (2016). Tiene escenas de guerra muy fuertes.", pilar: "apostolico", formato: "Peli o serie", nivel: "Intermedio", link: "" },
      { titulo: "Dios no está muerto 2", detalle: "Una profesora enfrenta un juicio por hablar de Jesús en clase (2016).", pilar: "intelectual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Hijo de Dios (Son of God)", detalle: "La vida de Jesús, adaptada de la serie The Bible (2014).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Woodlawn", detalle: "Fe, fútbol americano y reconciliación en el Alabama de los años 70. Historia real (2015).", pilar: "apostolico", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "A prueba de fuego (Fireproof)", detalle: "Un bombero lucha por salvar su matrimonio (2008).", pilar: "humano", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Ben-Hur", detalle: "El clásico sobre la venganza, el perdón y el encuentro con Cristo (1959).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "El gran regalo", detalle: "Película de Juan Manuel Cotelo sobre el perdón (2018).", pilar: "humano", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Breakthrough", detalle: "Un chico vuelve a la vida después de un accidente, sostenido por la fe de su madre. Historia real (2019).", pilar: "espiritual", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Bella", detalle: "Un encuentro que cambia la vida de una mujer embarazada y sin apoyo (2006).", pilar: "humano", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "La Misión", detalle: "Los jesuitas en las misiones guaraníes del siglo XVIII (1986).", pilar: "apostolico", formato: "Peli o serie", nivel: "Intermedio", link: "" },
      { titulo: "Los Miserables", detalle: "Jean Valjean descubre la misericordia y su vida cambia para siempre.", pilar: "apostolico", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Vida oculta (A Hidden Life)", detalle: "El beato Franz Jägerstätter, campesino austríaco que se negó a jurar lealtad a Hitler (2019).", pilar: "apostolico", formato: "Peli o serie", nivel: "Profundo", link: "" },
      { titulo: "Un hombre para la eternidad (A Man for All Seasons)", detalle: "Santo Tomás Moro, fiel a su conciencia frente al rey (1966).", pilar: "apostolico", formato: "Peli o serie", nivel: "Intermedio", link: "" },
      { titulo: "Harriet", detalle: "Harriet Tubman, mujer de fe que guió a decenas de esclavos a la libertad (2019).", pilar: "apostolico", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Unbroken: Path to Redemption", detalle: "Louis Zamperini después de la guerra: el camino del rencor al perdón (2018).", pilar: "humano", formato: "Peli o serie", nivel: "Inicial", link: "" },
      { titulo: "Bible Project", detalle: "Videos y podcasts excelentes sobre cada libro de la Biblia y sus grandes temas, en español e inglés.", pilar: "intelectual", formato: "Video", nivel: "Inicial", link: "https://bibleproject.com/explore/" },
      { titulo: "El ganso salvaje (The Wild Goose)", detalle: "Serie de 14 videos sobre el Espíritu Santo.", pilar: "espiritual", formato: "Video", nivel: "Inicial", link: "https://www.youtube.com/playlist?list=PLE6t-PqUvPEemaneqIWybKUn4j8olfe9h" },
      { titulo: "C. S. Lewis Doodle", detalle: "Las obras de C. S. Lewis explicadas con dibujos animados (en inglés).", pilar: "intelectual", formato: "Video", nivel: "Intermedio", link: "https://www.youtube.com/user/CSLewisDoodle" },
      { titulo: "Pints with Aquinas", detalle: "Podcast de Matt Fradd: filosofía, fe y preguntas difíciles (en inglés).", pilar: "intelectual", formato: "Podcast", nivel: "Profundo", link: "https://open.spotify.com/show/312eXMI31liKUHSx6U5p1H" },
      { titulo: "Testigos de esperanza", detalle: "Vidas de santos contadas por Fragua Córdoba.", pilar: "espiritual", formato: "Podcast", nivel: "Inicial", link: "https://open.spotify.com/show/70nKWSK0ZapWJCEiXDe2Ex" },
      { titulo: "The Counsel of Trent", detalle: "Apologética con Trent Horn: respuestas a objeciones contra la fe (en inglés).", pilar: "intelectual", formato: "Podcast", nivel: "Profundo", link: "https://open.spotify.com/show/5PGmCKE1KzIHMN9kvKOpC8" },
      { titulo: "The Word on Fire Show", detalle: "El podcast del obispo Robert Barron sobre fe y cultura (en inglés).", pilar: "intelectual", formato: "Podcast", nivel: "Intermedio", link: "https://open.spotify.com/show/5XVmEHRXISUcl0QwDjlk2a" },
      { titulo: "Centinelas de la paz", detalle: "Vidas de santos y novenas, del Obispado Castrense.", pilar: "espiritual", formato: "Podcast", nivel: "Inicial", link: "https://open.spotify.com/show/63c7i3gabONrl5EedGmo02" },
      { titulo: "Catholic Answers", detalle: "Apologética: respuestas claras a preguntas sobre la fe (en inglés).", pilar: "intelectual", formato: "Podcast", nivel: "Intermedio", link: "https://open.spotify.com/show/1bfFSbt0bao7qPDd0UuxQ6" },
      { titulo: "Peter Kreeft", detalle: "Filósofo católico. En su web hay charlas en audio gratis, y aparece como invitado en muchos podcasts: buscá su nombre en Spotify o YouTube (en inglés).", pilar: "intelectual", formato: "Podcast", nivel: "Profundo", link: "https://www.peterkreeft.com" },
      { titulo: "Fr. Mike Schmitz Catholic Podcast", detalle: "Homilías y reflexiones del P. Mike Schmitz (en inglés).", pilar: "espiritual", formato: "Podcast", nivel: "Inicial", link: "https://open.spotify.com/show/2oQATctoAaFiS8bT596v9G" },
      { titulo: "Playlist de Sagrada Familia", detalle: "La música que cantamos en Sagrada, en Spotify.", pilar: "espiritual", formato: "Música", nivel: "Inicial", link: "https://open.spotify.com/playlist/1GEGCMIcV6tEZccLno1TWH" },
      { titulo: "Música para rezar", detalle: "Br. Isaiah, Matt Maher, Hillsong, Vertical Worship, Elevation Worship, Third Day, Bethel, Athenas, Maxi Larghi, Fragua Worship (Joaco Bullrich), Soaking Worship Instrumental (Marcelo Domínguez) y Tobías Buteler.", pilar: "espiritual", formato: "Música", nivel: "Inicial", link: "" }
    ]
  },

  /* ---------- Modelos de vida: santos ----------
     id: se usa en el link (santos.html#carlo-acutis). Para sumar un santo, copiá un bloque.
     imagen: foto de perfil (ej. "img/santos/carlo-acutis.jpg"). Si está vacía, se muestran las iniciales. */
  santos: [
    {
      id: "carlo-acutis", imagen: "img/santos/carlo-acutis.jpg", nombre: "San Carlo Acutis", vida: "1991 – 2006", lugar: "Londres · Milán", fiesta: "12 de octubre",
      etiqueta: "Patrono de HPP", color: "#5b6f6c",
      resumen: "Un adolescente de Milán que amaba la Eucaristía, la tecnología y a sus amigos.",
      texto: [
        "Nació en Londres en 1991 y creció en Milán. Iba a misa todos los días, rezaba el rosario y pasaba ratos frente al Santísimo, sin dejar de ser un chico como cualquiera: jugaba a los videojuegos, filmaba a sus perros y ayudaba a sus compañeros con la computadora.",
        "Usó su talento para la informática para armar una exposición sobre los milagros eucarísticos del mundo, que hoy recorre parroquias de todos los continentes.",
        "Murió de leucemia en 2006, con 15 años, ofreciendo su sufrimiento por el Papa y por la Iglesia. Fue canonizado el 7 de septiembre de 2025."
      ],
      frases: ["La Eucaristía es mi autopista al cielo.", "Todos nacen como originales, pero muchos mueren como fotocopias.", "Estar siempre unido a Jesús, ese es mi proyecto de vida."]
    },
    {
      id: "pier-giorgio-frassati", imagen: "img/santos/pier-giorgio-frassati.jpg", nombre: "San Pier Giorgio Frassati", vida: "1901 – 1925", lugar: "Turín, Italia", fiesta: "4 de julio",
      etiqueta: "Patrono de HPP", color: "#2b3a55",
      resumen: "Estudiante, montañista y amigo de los pobres: la santidad vivida a pleno.",
      texto: [
        "Nació en Turín en 1901, en una familia acomodada. Estudiaba ingeniería en minas, amaba la montaña y organizaba salidas con sus amigos, a las que siempre sumaba la misa y la oración.",
        "En silencio dedicaba su tiempo y su dinero a los pobres de la ciudad a través de la Sociedad de San Vicente de Paúl. Muchos se enteraron de todo lo que hacía recién en su funeral, cuando miles de personas humildes llenaron las calles.",
        "Murió en 1925, con 24 años, de una poliomielitis fulminante. Fue canonizado el 7 de septiembre de 2025, el mismo día que Carlo Acutis."
      ],
      frases: ["Verso l'alto: ¡hacia lo alto!", "Vivir sin fe, sin un patrimonio que defender, sin luchar por la verdad, no es vivir, sino ir tirando."]
    },
    {
      id: "teresita", imagen: "img/santos/teresita.jpg", nombre: "Santa Teresita del Niño Jesús", vida: "1873 – 1897", lugar: "Lisieux, Francia", fiesta: "1 de octubre",
      color: "#94735e",
      resumen: "El caminito: hacer las cosas pequeñas con un amor enorme.",
      texto: [
        "Entró al Carmelo de Lisieux con 15 años. Sin salir nunca del convento, descubrió un caminito de confianza total en Dios: santificar lo cotidiano haciendo cada cosa pequeña por amor.",
        "Murió de tuberculosis a los 24 años. Su autobiografía, Historia de un alma, recorrió el mundo. Es patrona de las misiones y Doctora de la Iglesia."
      ],
      frases: ["Jesús, no quiero probar ninguna alegría fuera de ti.", "En el corazón de la Iglesia, mi Madre, yo seré el amor."]
    },
    {
      id: "maximiliano-kolbe", imagen: "img/santos/maximiliano-kolbe.jpg", nombre: "San Maximiliano Kolbe", vida: "1894 – 1941", lugar: "Polonia", fiesta: "14 de agosto",
      color: "#7d3434",
      resumen: "El franciscano que dio su vida por otro preso en Auschwitz.",
      texto: [
        "Sacerdote franciscano polaco, fundó la Milicia de la Inmaculada y usó la imprenta y la radio para anunciar el Evangelio.",
        "Detenido por los nazis, en Auschwitz se ofreció a morir en lugar de un padre de familia condenado a morir de hambre. Murió el 14 de agosto de 1941 y fue canonizado en 1982 como mártir de la caridad."
      ],
      frases: ["Solo el amor crea."]
    },
    {
      id: "agustin", imagen: "img/santos/agustin.jpg", nombre: "San Agustín", vida: "354 – 430", lugar: "Hipona, norte de África", fiesta: "28 de agosto",
      color: "#4e5f58",
      resumen: "Buscó la felicidad en todas partes hasta encontrarla en Dios.",
      texto: [
        "Brillante e inquieto, pasó años buscando la verdad en filosofías y placeres, mientras su madre, Santa Mónica, rezaba por él sin descanso.",
        "Se convirtió a los 32 años, fue obispo de Hipona y es uno de los grandes Doctores de la Iglesia. Sus Confesiones siguen hablándoles a quienes buscan."
      ],
      frases: ["Nos hiciste, Señor, para ti, y nuestro corazón está inquieto hasta que descanse en ti.", "Ama y haz lo que quieras."]
    },
    {"id": "san-pablo", "nombre": "San Pablo", "vida": "c. 5 – c. 67", "lugar": "Tarso · Roma", "fiesta": "29 de junio", "color": "#7d3434", "resumen": "De perseguidor de los cristianos a apóstol incansable de los paganos.", "texto": ["Nació en Tarso, en la actual Turquía, en una familia judía con ciudadanía romana. Se formó en Jerusalén como fariseo y persiguió con fuerza a los primeros cristianos: estuvo presente en el martirio de Esteban.", "Camino a Damasco, Jesús resucitado se le apareció y le preguntó: «Saulo, Saulo, ¿por qué me persigues?». Quedó ciego tres días, fue bautizado y desde entonces dedicó su vida a anunciar a Cristo.", "Hizo grandes viajes misioneros por el Mediterráneo fundando comunidades, a las que escribió cartas que hoy forman parte del Nuevo Testamento. Según la tradición, murió mártir en Roma."], "frases": ["Ya no vivo yo, sino que Cristo vive en mí.", "Yo lo puedo todo en aquel que me conforta."]},
    {"id": "padre-pio", "nombre": "San Pío de Pietrelcina (Padre Pío)", "vida": "1887 – 1968", "lugar": "Pietrelcina · San Giovanni Rotondo, Italia", "fiesta": "23 de septiembre", "color": "#5b4a3f", "resumen": "Fraile capuchino que pasaba horas en el confesionario y llevó en su cuerpo las heridas de Cristo.", "texto": ["Francesco Forgione nació en Pietrelcina, Italia. Desde chico quería ser fraile, y a los 15 años entró a los capuchinos, donde tomó el nombre de Pío.", "En 1918, mientras rezaba, recibió los estigmas: heridas como las de Jesús en las manos, los pies y el costado, que llevó durante cincuenta años. Pasaba muchas horas confesando, y gente de todo el mundo viajaba a San Giovanni Rotondo para verlo.", "Fundó un gran hospital, la Casa Alivio del Sufrimiento, y grupos de oración que hoy siguen en todo el mundo. San Juan Pablo II lo canonizó en 2002."], "frases": ["Reza, espera y no te preocupes."]},
    {"id": "ceferino-namuncura", "nombre": "Beato Ceferino Namuncurá", "vida": "1886 – 1905", "lugar": "Chimpay, Río Negro · Roma", "fiesta": "26 de agosto", "color": "#a8894f", "resumen": "Hijo de un cacique mapuche que soñaba con ser sacerdote para servir a su pueblo.", "texto": ["Nació en Chimpay, Río Negro, hijo del cacique Manuel Namuncurá. A los 11 años fue a estudiar a Buenos Aires, donde conoció a los salesianos, la congregación de Don Bosco.", "Era un alumno alegre, piadoso y muy querido por sus compañeros. Su sueño era ser sacerdote para volver a su pueblo y anunciarle el Evangelio.", "Viajó a Italia para seguir estudiando, pero estaba enfermo de tuberculosis y murió en Roma en 1905, con 18 años. Fue beatificado en 2007 en Chimpay, su pueblo natal."], "frases": ["Quiero ser útil a mi gente."]},
    {"id": "santiago-apostol", "nombre": "Santiago Apóstol", "vida": "Siglo I", "lugar": "Galilea · Jerusalén", "fiesta": "25 de julio", "color": "#2b3a55", "resumen": "Pescador, hermano de Juan y primer apóstol en dar la vida por Jesús.", "texto": ["Era pescador en el lago de Galilea junto a su padre, Zebedeo, y su hermano Juan. Cuando Jesús los llamó, dejaron las redes y lo siguieron.", "Fue uno de los tres discípulos más cercanos a Jesús, junto con Pedro y Juan: estuvo en la Transfiguración y en el huerto de Getsemaní. Por su carácter, Jesús los llamó a él y a su hermano «hijos del trueno».", "El rey Herodes Agripa lo mandó matar a espada en Jerusalén, como cuentan los Hechos de los Apóstoles. Según la tradición, sus restos descansan en Santiago de Compostela, meta del famoso Camino de Santiago."], "frases": []},
    {"id": "teresa-de-calcuta", "nombre": "Santa Teresa de Calcuta", "vida": "1910 – 1997", "lugar": "Skopie · Calcuta, India", "fiesta": "5 de septiembre", "color": "#2b5c8a", "resumen": "Se entregó a los más pobres entre los pobres, para que nadie muriera solo.", "texto": ["Agnes Gonxha Bojaxhiu nació en Skopie, en una familia albanesa. A los 18 años entró a las Hermanas de Loreto y fue enviada a la India, donde enseñó en un colegio de Calcuta.", "En 1946, viajando en tren, sintió un «llamado dentro del llamado»: dejar el colegio para servir a los más pobres. Fundó las Misioneras de la Caridad, que cuidan a enfermos, moribundos, huérfanos y abandonados en todo el mundo.", "Recibió el Premio Nobel de la Paz en 1979. Murió en Calcuta en 1997 y el Papa Francisco la canonizó en 2016."], "frases": ["No todos podemos hacer grandes cosas, pero sí cosas pequeñas con un gran amor."]},
    {"id": "enrique-shaw", "nombre": "Enrique Shaw", "vida": "1921 – 1962", "lugar": "París · Buenos Aires", "fiesta": "", "color": "#4e5f58", "resumen": "Empresario argentino que vivió la fe en el trabajo y cuidó la dignidad de sus trabajadores.", "texto": ["Nació en París en 1921, en una familia argentina. Fue oficial de la Marina, pero dejó la carrera militar para dedicarse a la empresa y vivir allí su fe.", "Fue director de Cristalerías Rigolleau. Inspirado en la doctrina social de la Iglesia, buscó que sus trabajadores vivieran con dignidad, y en 1952 fundó la Asociación Cristiana de Dirigentes de Empresa (ACDE). Estuvo casado con Cecilia Bunge y tuvieron nueve hijos.", "Cuando enfermó de cáncer, cientos de empleados donaron sangre para él. Murió en 1962, con 41 años. Fue declarado venerable en 2021, y en 2025 se aprobó el milagro para su beatificación."], "frases": []},
    {"id": "tomas-de-aquino", "nombre": "Santo Tomás de Aquino", "vida": "1225 – 1274", "lugar": "Roccasecca, Italia · París", "fiesta": "28 de enero", "color": "#2b3a55", "resumen": "El gran teólogo que puso la inteligencia al servicio de la fe.", "texto": ["Nació en una familia noble del sur de Italia. Quiso hacerse fraile dominico, pero su familia se opuso y lo tuvo encerrado cerca de un año; finalmente pudo cumplir su deseo.", "Estudió con San Alberto Magno. Sus compañeros lo llamaban «el buey mudo» por callado, pero su maestro les dijo que sus mugidos se iban a escuchar en todo el mundo. Fue profesor en París y escribió la Suma Teológica, una de las obras más importantes del pensamiento cristiano.", "Compuso himnos a la Eucaristía que todavía se cantan, como el Pange lingua. Poco antes de morir dijo que todo lo que había escrito le parecía paja comparado con lo que había visto de Dios. Es Doctor de la Iglesia y patrono de los estudiantes."], "frases": []},
    {"id": "tomas-moro", "nombre": "Santo Tomás Moro", "vida": "1478 – 1535", "lugar": "Londres, Inglaterra", "fiesta": "22 de junio", "color": "#7d3434", "resumen": "Abogado, padre de familia y canciller que prefirió la muerte antes que traicionar su conciencia.", "texto": ["Nació en Londres. Fue abogado, escritor y padre de familia, con un gran sentido del humor. Escribió Utopía, un libro sobre una sociedad ideal.", "Llegó a ser canciller de Inglaterra, el cargo más alto después del rey Enrique VIII. Cuando el rey se proclamó jefe de la Iglesia en Inglaterra, Tomás se negó a aceptarlo y renunció.", "Lo encerraron en la Torre de Londres y lo condenaron a muerte. Fue decapitado en 1535. San Juan Pablo II lo nombró patrono de los gobernantes y los políticos."], "frases": ["Muero siendo buen servidor del rey, pero primero de Dios."]},
    {"id": "san-benito", "nombre": "San Benito", "vida": "c. 480 – 547", "lugar": "Nursia · Montecassino, Italia", "fiesta": "11 de julio", "color": "#4e5f58", "resumen": "Padre de los monjes de Occidente: oración y trabajo.", "texto": ["Nació en Nursia, Italia. Fue a estudiar a Roma, pero lo desilusionó la vida de la ciudad y se retiró a vivir como ermitaño en una cueva de Subiaco.", "Muchos se acercaron a seguirlo, y fundó varios monasterios. En Montecassino escribió una Regla para los monjes, equilibrada y humana, cuyo espíritu se resume en «Ora et labora»: reza y trabaja.", "Los monasterios benedictinos conservaron la fe y la cultura de Europa durante siglos; por eso San Pablo VI lo nombró patrono de Europa. Su hermana, Santa Escolástica, también es santa."], "frases": ["Que nada se anteponga al amor de Cristo."]},
    {"id": "felipe-neri", "nombre": "San Felipe Neri", "vida": "1515 – 1595", "lugar": "Florencia · Roma", "fiesta": "26 de mayo", "color": "#a8894f", "resumen": "El santo de la alegría, apóstol de los jóvenes de Roma.", "texto": ["Nació en Florencia y de joven se fue a Roma, donde vivió con sencillez, estudiando y rezando. Recorría las calles hablando con todos, sobre todo con los jóvenes, y los invitaba a rezar y a servir a los enfermos.", "Se ordenó sacerdote a los 36 años y fundó la Congregación del Oratorio, donde se reunían a rezar, leer la Biblia, cantar y conversar. Era famoso por su humor: usaba las bromas para que nadie se creyera demasiado importante.", "Fue un gran confesor y amigo de muchos santos de su tiempo. Lo llaman el «apóstol de Roma» y el santo de la alegría."], "frases": ["Sean buenos, si pueden."]},
    {"id": "catalina-de-siena", "nombre": "Santa Catalina de Siena", "vida": "1347 – 1380", "lugar": "Siena · Roma, Italia", "fiesta": "29 de abril", "color": "#7d3434", "resumen": "Una laica que habló con valentía a papas y reyes por amor a la Iglesia.", "texto": ["Nació en Siena, en una familia muy numerosa. Desde chica tuvo una intensa vida de oración y se consagró a Dios como laica dominica, sin entrar en un convento.", "Servía a los pobres y a los enfermos, incluso durante la peste. Aprendió a escribir de grande, pero dictaba cartas a papas, reyes y gobernantes, pidiéndoles paz y fidelidad a Cristo.", "Convenció al Papa Gregorio XI de volver de Aviñón a Roma y dictó el libro El Diálogo. Murió con 33 años. Es Doctora de la Iglesia y patrona de Italia y de Europa."], "frases": ["Si son lo que deben ser, prenderán fuego al mundo entero."]},
    {"id": "damian-de-molokai", "nombre": "San Damián de Molokai", "vida": "1840 – 1889", "lugar": "Tremelo, Bélgica · Molokai, Hawái", "fiesta": "10 de mayo", "color": "#2b5c8a", "resumen": "Misionero que eligió vivir con los enfermos de lepra hasta compartir su enfermedad.", "texto": ["Jozef De Veuster nació en Tremelo, Bélgica. Entró a la Congregación de los Sagrados Corazones, tomó el nombre de Damián y viajó como misionero a Hawái, donde fue ordenado sacerdote.", "En 1873 se ofreció para ir a la isla de Molokai, donde se aislaba a los enfermos de lepra, abandonados y sin esperanza. Les construyó casas, una iglesia y un orfanato, curó sus heridas y los acompañó hasta la muerte.", "Con los años se contagió la lepra, pero siguió sirviendo hasta morir en 1889. Benedicto XVI lo canonizó en 2009."], "frases": []},
    {"id": "faustina-kowalska", "nombre": "Santa Faustina Kowalska", "vida": "1905 – 1938", "lugar": "Polonia", "fiesta": "5 de octubre", "color": "#2b5c8a", "resumen": "La mensajera de la Divina Misericordia.", "texto": ["Helena Kowalska nació en una familia pobre de Polonia y casi no pudo ir a la escuela. A los 20 años entró en la Congregación de las Hermanas de la Madre de Dios de la Misericordia, donde hacía tareas sencillas: la cocina, la huerta, la portería.", "Jesús se le manifestó y le pidió difundir su misericordia: pintar una imagen con la frase «Jesús, en vos confío», rezar la Coronilla y celebrar la fiesta de la Divina Misericordia. Ella lo escribió todo en su Diario.", "Murió de tuberculosis a los 33 años. San Juan Pablo II la canonizó en el año 2000 e instituyó el Domingo de la Divina Misericordia."], "frases": ["Jesús, en vos confío."]},
    {"id": "francisco-javier", "nombre": "San Francisco Javier", "vida": "1506 – 1552", "lugar": "Javier, Navarra · Isla de Sancián, China", "fiesta": "3 de diciembre", "color": "#7d3434", "resumen": "El gran misionero que llevó el Evangelio hasta Asia.", "texto": ["Nació en el castillo de Javier, en Navarra. Estudiando en París conoció a Ignacio de Loyola, que le repetía: «¿De qué le sirve al hombre ganar el mundo entero si pierde su vida?». Esa pregunta le cambió la vida, y fue uno de los primeros jesuitas.", "En 1541 partió como misionero a la India. Recorrió Goa, el sur de la India, las islas Molucas y Japón, bautizando a miles de personas y aprendiendo a anunciar a Jesús en otras culturas.", "Murió en 1552 en la isla de Sancián, a las puertas de China, adonde soñaba entrar. Es patrono de las misiones."], "frases": []},
    {"id": "francisco-de-sales", "nombre": "San Francisco de Sales", "vida": "1567 – 1622", "lugar": "Saboya · Lyon, Francia", "fiesta": "24 de enero", "color": "#4e5f58", "resumen": "El obispo de la dulzura, que enseñó que todos podemos ser santos en la vida diaria.", "texto": ["Nació en Saboya, en una familia noble. Estudió derecho en Padua para seguir la carrera de su padre, pero sintió el llamado al sacerdocio.", "Fue misionero en la región del Chablais, donde muchos se habían alejado de la Iglesia: como no lo dejaban predicar, escribía hojas y las pasaba por debajo de las puertas. Por eso es patrono de los periodistas y escritores. Después fue obispo de Ginebra.", "Escribió Introducción a la vida devota, donde enseña que cualquiera puede ser santo en su propio estado de vida. Con Santa Juana de Chantal fundó la orden de la Visitación. Es Doctor de la Iglesia."], "frases": ["Se atrapan más moscas con una gota de miel que con un barril de vinagre."]},
    {"id": "guido-schaffer", "nombre": "Venerable Guido Schäffer", "vida": "1974 – 2009", "lugar": "Volta Redonda · Río de Janeiro, Brasil", "fiesta": "", "color": "#2b5c8a", "resumen": "Médico, surfista y seminarista: el «ángel surfista» de Brasil.", "texto": ["Nació en Volta Redonda, Brasil, y creció en Río de Janeiro. Se recibió de médico y atendía gratis a los pobres, muchas veces junto a las Misioneras de la Caridad de la Madre Teresa.", "Amaba el mar y el surf, y aprovechaba los encuentros con sus amigos para hablarles de Dios. Participaba de grupos de oración y misiones, descubrió la vocación al sacerdocio y entró al seminario.", "En 2009, mientras surfeaba en Río, sufrió un accidente en el mar y murió con 34 años. Su causa de canonización avanza: hoy es venerable."], "frases": []},
    {"id": "ignacio-de-loyola", "nombre": "San Ignacio de Loyola", "vida": "1491 – 1556", "lugar": "Loyola, País Vasco · Roma", "fiesta": "31 de julio", "color": "#5b4a3f", "resumen": "Soldado convertido, fundador de los jesuitas y maestro del discernimiento.", "texto": ["Íñigo nació en Loyola, en el País Vasco, y soñaba con la gloria militar. En 1521 una bala de cañón le destrozó una pierna en la defensa de Pamplona.", "Durante la larga recuperación leyó una vida de Cristo y vidas de santos. Notó que esas lecturas le dejaban una alegría duradera y decidió cambiar de vida. De esa experiencia nacieron los Ejercicios Espirituales.", "Estudiando en París reunió a un grupo de amigos, entre ellos Francisco Javier, con quienes fundó la Compañía de Jesús. Su lema era «A mayor gloria de Dios»."], "frases": ["Toma, Señor, y recibe toda mi libertad, mi memoria, mi entendimiento y toda mi voluntad."]},
    {"id": "john-henry-newman", "nombre": "San John Henry Newman", "vida": "1801 – 1890", "lugar": "Londres · Birmingham, Inglaterra", "fiesta": "9 de octubre", "color": "#7d3434", "resumen": "Pensador inglés que buscó la verdad con honestidad y la encontró en la Iglesia católica.", "texto": ["Nació en Londres. Fue pastor anglicano y profesor en Oxford, donde se destacó como predicador e intelectual.", "Estudiando a los Padres de la Iglesia, se fue convenciendo de que la Iglesia católica era la continuación de la Iglesia de los apóstoles. En 1845 se hizo católico, aunque le costó amigos y prestigio. Fundó el Oratorio en Inglaterra, siguiendo a San Felipe Neri.", "León XIII lo hizo cardenal en 1879. Su lema fue «El corazón habla al corazón». El Papa Francisco lo canonizó en 2019."], "frases": ["Guíame, luz amable.", "Vivir es cambiar, y ser perfecto es haber cambiado muchas veces."]},
    {"id": "cura-brochero", "nombre": "San José Gabriel del Rosario Brochero", "vida": "1840 – 1914", "lugar": "Córdoba, Argentina", "fiesta": "16 de marzo", "color": "#a8894f", "resumen": "El Cura Gaucho: recorrió las sierras de Córdoba llevando a Dios y progreso a su gente.", "texto": ["Nació en Santa Rosa de Río Primero, Córdoba. Fue ordenado sacerdote en 1866 y, durante una epidemia de cólera en Córdoba, se dedicó a asistir a los enfermos.", "En 1869 lo enviaron al curato de San Alberto, en Traslasierra. Recorría las sierras a lomo de mula, con poncho y sombrero, visitando a la gente. Construyó una casa de ejercicios espirituales, escuelas, caminos y acequias, y pidió la llegada del ferrocarril para sacar a la zona del aislamiento.", "Por visitar y compartir el mate con enfermos de lepra, se contagió y terminó sus días ciego y sordo. Murió en 1914. El Papa Francisco lo canonizó en 2016: es el primer santo nacido y muerto en la Argentina."], "frases": ["Dios es como los piojos: está en todas partes, pero prefiere a los pobres."]},
    {"id": "juan-bosco", "nombre": "San Juan Bosco", "vida": "1815 – 1888", "lugar": "Piamonte · Turín, Italia", "fiesta": "31 de enero", "color": "#2b3a55", "resumen": "Padre y maestro de los jóvenes.", "texto": ["Nació en I Becchi, en el Piamonte, en una familia campesina, y perdió a su padre siendo muy chico. A los nueve años tuvo un sueño que marcó su vida: debía ganarse a los chicos no con golpes, sino con mansedumbre y caridad.", "Ya sacerdote, se dedicó en Turín a los jóvenes pobres que llegaban a la ciudad a trabajar. Les abrió el Oratorio: un lugar para jugar, aprender oficios, estudiar y rezar. Educaba con lo que llamaba el sistema preventivo: razón, religión y amor.", "Fundó los salesianos y, con Santa María Mazzarello, las Hijas de María Auxiliadora. Los salesianos llegaron a la Argentina en 1875 y misionaron la Patagonia, donde conocieron a Ceferino Namuncurá."], "frases": ["Basta que sean jóvenes para que yo los ame."]},
    {"id": "juan-pablo-ii", "nombre": "San Juan Pablo II", "vida": "1920 – 2005", "lugar": "Wadowice, Polonia · Roma", "fiesta": "22 de octubre", "color": "#a8894f", "resumen": "El Papa de los jóvenes, que recorrió el mundo diciendo «No tengan miedo».", "texto": ["Karol Wojtyła nació en Wadowice, Polonia. De joven fue actor y deportista, y durante la ocupación nazi trabajó en una cantera mientras estudiaba en un seminario clandestino.", "Fue sacerdote, obispo y arzobispo de Cracovia. En 1978 fue elegido Papa, el primero no italiano en más de 450 años. Al comenzar su pontificado dijo: «¡No tengan miedo! ¡Abran de par en par las puertas a Cristo!».", "Viajó a más de cien países, creó las Jornadas Mundiales de la Juventud y sobrevivió a un atentado en 1981. Murió en 2005 y fue canonizado en 2014."], "frases": ["¡No tengan miedo! ¡Abran de par en par las puertas a Cristo!"]},
    {"id": "alberto-hurtado", "nombre": "San Alberto Hurtado", "vida": "1901 – 1952", "lugar": "Viña del Mar · Santiago, Chile", "fiesta": "18 de agosto", "color": "#4e5f58", "resumen": "Jesuita chileno que vio a Cristo en cada pobre de la calle.", "texto": ["Nació en Viña del Mar y perdió a su padre a los cuatro años; su familia pasó necesidades. Estudió derecho y después entró a los jesuitas.", "Como sacerdote se dedicó a los jóvenes y a los pobres. Una noche de lluvia se encontró con un hombre enfermo y sin techo, y poco después fundó el Hogar de Cristo, para dar casa y cariño a los que vivían en la calle. Recorría Santiago en su camioneta verde buscándolos.", "Murió de cáncer en 1952, repitiendo en medio del dolor: «Contento, Señor, contento». Benedicto XVI lo canonizó en 2005."], "frases": ["Contento, Señor, contento.", "¿Qué haría Cristo en mi lugar?"]},
    {"id": "martin-de-porres", "nombre": "San Martín de Porres", "vida": "1579 – 1639", "lugar": "Lima, Perú", "fiesta": "3 de noviembre", "color": "#5b4a3f", "resumen": "El santo de la escoba: humilde, servicial y amigo de todos.", "texto": ["Nació en Lima, hijo de un caballero español y de una mujer liberta de origen africano. Por ser mestizo sufrió desprecios, pero nunca guardó rencor. De joven aprendió el oficio de barbero y algo de medicina.", "Entró a los dominicos como donado, haciendo las tareas más humildes. Cuidaba a los enfermos del convento y de la ciudad, repartía comida a los pobres y hasta curaba a los animales.", "Fue amigo de Santa Rosa de Lima. Se le atribuyen muchos milagros. San Juan XXIII lo canonizó en 1962, y es patrono de la justicia social."], "frases": ["Yo te curo, Dios te sana."]},
    {"id": "martires-de-canada", "nombre": "Santos Mártires de Canadá", "vida": "Murieron entre 1642 y 1649", "lugar": "Nueva Francia (Canadá y Estados Unidos)", "fiesta": "19 de octubre", "color": "#7d3434", "resumen": "Ocho misioneros que dieron la vida por anunciar a Cristo a los pueblos de América del Norte.", "texto": ["En el siglo XVII, misioneros jesuitas franceses llegaron a Nueva Francia, el actual Canadá, para anunciar el Evangelio a los pueblos originarios. Vivieron entre los hurones, aprendieron su lengua y compartieron su vida.", "Entre ellos estaban San Juan de Brébeuf, que escribió un villancico en lengua hurona, y San Isaac Jogues. Los acompañaban laicos como San René Goupil y San Juan de La Lande.", "En medio de guerras entre pueblos, fueron capturados y martirizados entre 1642 y 1649. Fueron canonizados en 1930 y son patronos de Canadá."], "frases": []}
  ],

  /* ---------- Quiz ----------
     Cada partida toma 10 preguntas al azar del tema elegido.
     ok: la respuesta correcta. otras: tres respuestas incorrectas (el orden se mezcla solo).
     porque: explicación corta que aparece después de responder. */
  quiz: {
    temas: [
      { id: "biblia", nombre: "Biblia", color: "#2b3a55" },
      { id: "santos", nombre: "Santos", color: "#94735e" },
      { id: "sacramentos", nombre: "Sacramentos y liturgia", color: "#7d3434" },
      { id: "fe", nombre: "Fe y comunidad", color: "#4e5f58" }
    ],
    preguntas: [
      { tema: "biblia", p: "¿Cuántos libros tiene la Biblia católica?", ok: "73", otras: ["66", "72", "81"], porque: "46 del Antiguo Testamento y 27 del Nuevo." },
      { tema: "biblia", p: "¿Cuántos Evangelios hay en el Nuevo Testamento?", ok: "4", otras: ["3", "5", "12"], porque: "Mateo, Marcos, Lucas y Juan." },
      { tema: "biblia", p: "¿Quién escribió la mayor parte de las cartas del Nuevo Testamento?", ok: "San Pablo", otras: ["San Pedro", "San Juan", "San Lucas"], porque: "Se le atribuyen trece cartas, como Romanos, Corintios y Gálatas." },
      { tema: "biblia", p: "¿En qué ciudad nació Jesús?", ok: "Belén", otras: ["Nazaret", "Jerusalén", "Cafarnaúm"], porque: "Nació en Belén y creció en Nazaret." },
      { tema: "biblia", p: "Según el Evangelio de Juan, ¿cuál fue el primer milagro de Jesús?", ok: "Convertir el agua en vino en Caná", otras: ["Multiplicar los panes", "Caminar sobre el agua", "Curar a un ciego"], porque: "Fue en una boda en Caná, a pedido de María (Jn 2)." },
      { tema: "biblia", p: "¿A quién le dijo Jesús: «Tú eres Pedro, y sobre esta piedra edificaré mi Iglesia»?", ok: "A Simón", otras: ["A Andrés", "A Juan", "A Santiago"], porque: "Jesús le cambió el nombre a Simón por Pedro, que significa «piedra» (Mt 16,18)." },
      { tema: "biblia", p: "¿Cuántos días pasó Jesús en el desierto antes de empezar su vida pública?", ok: "40", otras: ["7", "12", "30"], porque: "Por eso la Cuaresma dura cuarenta días." },
      { tema: "biblia", p: "¿Qué profeta pasó tres días en el vientre de un gran pez?", ok: "Jonás", otras: ["Elías", "Daniel", "Isaías"], porque: "Huía del pedido de Dios de predicar en Nínive." },
      { tema: "biblia", p: "¿Quién venció al gigante Goliat?", ok: "David", otras: ["Sansón", "Saúl", "Josué"], porque: "Siendo un joven pastor, con una honda y una piedra (1 Sam 17)." },
      { tema: "biblia", p: "¿Qué libro cuenta la venida del Espíritu Santo en Pentecostés?", ok: "Hechos de los Apóstoles", otras: ["Evangelio de Juan", "Apocalipsis", "Carta a los Romanos"], porque: "Está en el capítulo 2 de Hechos." },
      { tema: "biblia", p: "¿Cuál es el primer libro de la Biblia?", ok: "Génesis", otras: ["Éxodo", "Salmos", "Mateo"], porque: "Empieza con la Creación: «Al principio Dios creó el cielo y la tierra»." },
      { tema: "biblia", p: "¿A qué apóstol le dijo Jesús resucitado: «No seas incrédulo, sino creyente»?", ok: "A Tomás", otras: ["A Pedro", "A Felipe", "A Mateo"], porque: "Tomás no había creído hasta tocar sus heridas (Jn 20)." },

      { tema: "santos", p: "¿Qué santo es conocido como «el influencer de Dios»?", ok: "Carlo Acutis", otras: ["Pier Giorgio Frassati", "Domingo Savio", "José Sánchez del Río"], porque: "Usó internet para difundir los milagros eucarísticos." },
      { tema: "santos", p: "¿Cuál era el lema de Pier Giorgio Frassati?", ok: "Verso l'alto: ¡hacia lo alto!", otras: ["Ama y haz lo que quieras", "Todo por Jesús", "Solo Dios basta"], porque: "Lo escribía en sus fotos de montaña: apuntar siempre más arriba." },
      { tema: "santos", p: "¿Qué santa propuso el «caminito» de hacer las cosas pequeñas con mucho amor?", ok: "Santa Teresita del Niño Jesús", otras: ["Santa Teresa de Calcuta", "Santa Clara", "Santa Catalina de Siena"], porque: "Lo cuenta en su autobiografía, Historia de un alma." },
      { tema: "santos", p: "¿Dónde dio la vida San Maximiliano Kolbe en lugar de otro preso?", ok: "En Auschwitz", otras: ["En Roma", "En Varsovia", "En Siberia"], porque: "Se ofreció a morir en lugar de un padre de familia, en 1941." },
      { tema: "santos", p: "¿Cómo se llamaba la madre de San Agustín, que rezó años por su conversión?", ok: "Santa Mónica", otras: ["Santa Ana", "Santa Isabel", "Santa Rita"], porque: "Su fiesta es el 27 de agosto, un día antes que la de su hijo." },
      { tema: "santos", p: "¿Quién es la patrona de la Argentina?", ok: "Nuestra Señora de Luján", otras: ["Nuestra Señora del Valle", "Nuestra Señora de Itatí", "Nuestra Señora del Rosario"], porque: "Por eso cada año peregrinamos a Luján." },
      { tema: "santos", p: "¿Cómo le dicen al santo cordobés José Gabriel del Rosario Brochero?", ok: "El Cura Gaucho", otras: ["El Santo de los Andes", "El Padre de los Pobres", "El Cura Viajero"], porque: "Recorría las sierras a lomo de mula. Fue canonizado en 2016." },
      { tema: "santos", p: "¿Quién fundó las Misioneras de la Caridad?", ok: "Santa Teresa de Calcuta", otras: ["Santa Teresita", "Santa Faustina", "Santa Josefina Bakhita"], porque: "Para servir a los más pobres entre los pobres." },
      { tema: "santos", p: "¿En qué año fueron canonizados Carlo Acutis y Pier Giorgio Frassati?", ok: "2025", otras: ["2020", "2023", "2016"], porque: "El 7 de septiembre de 2025, en la misma ceremonia." },
      { tema: "santos", p: "¿Quién fue el padre adoptivo de Jesús?", ok: "San José", otras: ["San Joaquín", "San Juan Bautista", "Zacarías"], porque: "Es patrono de la Iglesia universal y de las familias." },
      { tema: "santos", p: "¿Qué santo es conocido por su pobreza, su amor por la creación y por haber recibido los estigmas?", ok: "San Francisco de Asís", otras: ["San Benito", "San Ignacio de Loyola", "Santo Domingo"], porque: "Escribió el Cántico de las criaturas." },

      { tema: "sacramentos", p: "¿Cuántos sacramentos hay?", ok: "7", otras: ["3", "5", "10"], porque: "Bautismo, Confirmación, Eucaristía, Reconciliación, Unción de los enfermos, Orden sagrado y Matrimonio." },
      { tema: "sacramentos", p: "¿Cuáles son los sacramentos de la iniciación cristiana?", ok: "Bautismo, Confirmación y Eucaristía", otras: ["Bautismo, Reconciliación y Matrimonio", "Confirmación, Orden y Matrimonio", "Bautismo, Eucaristía y Unción"], porque: "Son los que nos hacen plenamente cristianos." },
      { tema: "sacramentos", p: "¿Cuántos son los dones del Espíritu Santo?", ok: "7", otras: ["3", "9", "12"], porque: "Sabiduría, entendimiento, consejo, fortaleza, ciencia, piedad y temor de Dios." },
      { tema: "sacramentos", p: "¿De qué color se viste el sacerdote en Adviento y Cuaresma?", ok: "Morado", otras: ["Verde", "Blanco", "Rojo"], porque: "Es el color de la espera y la conversión." },
      { tema: "sacramentos", p: "¿Qué celebramos el Domingo de Ramos?", ok: "La entrada de Jesús en Jerusalén", otras: ["La Última Cena", "La Resurrección", "La Ascensión"], porque: "Lo recibieron con ramos y gritando «¡Hosanna!»." },
      { tema: "sacramentos", p: "¿Qué celebramos en Pentecostés?", ok: "La venida del Espíritu Santo", otras: ["La Ascensión de Jesús", "El nacimiento de Jesús", "La Asunción de María"], porque: "Cincuenta días después de la Pascua." },
      { tema: "sacramentos", p: "¿Cómo se llama el tiempo litúrgico que prepara la Navidad?", ok: "Adviento", otras: ["Cuaresma", "Tiempo Ordinario", "Pascua"], porque: "Son las cuatro semanas antes de Navidad." },
      { tema: "sacramentos", p: "¿Qué significa la palabra «Eucaristía»?", ok: "Acción de gracias", otras: ["Cena del Señor", "Pan del cielo", "Comunidad"], porque: "Viene del griego eucharistía." },
      { tema: "sacramentos", p: "¿Cuántos grupos de misterios tiene el Rosario?", ok: "4", otras: ["3", "5", "7"], porque: "Gozosos, luminosos, dolorosos y gloriosos." },
      { tema: "sacramentos", p: "¿Qué misterios del Rosario agregó San Juan Pablo II en 2002?", ok: "Los luminosos", otras: ["Los gozosos", "Los gloriosos", "Los dolorosos"], porque: "Recorren la vida pública de Jesús, del Bautismo a la Eucaristía." },

      { tema: "fe", p: "¿Cuándo se celebra la fiesta de la Sagrada Familia?", ok: "El domingo después de Navidad", otras: ["El 25 de diciembre", "El 1 de enero", "El 19 de marzo"], porque: "Si Navidad cae domingo, se celebra el 30 de diciembre." },
      { tema: "fe", p: "¿Quiénes forman la Sagrada Familia?", ok: "Jesús, María y José", otras: ["María, José y Juan Bautista", "Jesús, María y Juan", "Joaquín, Ana y María"], porque: "Es la patrona de nuestra parroquia." },
      { tema: "fe", p: "¿Cómo se llama el Papa actual?", ok: "León XIV", otras: ["Francisco", "Benedicto XVI", "Juan Pablo III"], porque: "Fue elegido en mayo de 2025." },
      { tema: "fe", p: "¿Cuáles son las virtudes teologales?", ok: "Fe, esperanza y caridad", otras: ["Prudencia, justicia y fortaleza", "Humildad, paciencia y obediencia", "Fe, oración y servicio"], porque: "Se llaman así porque tienen a Dios como origen y fin." },
      { tema: "fe", p: "¿Cuáles son las virtudes cardinales?", ok: "Prudencia, justicia, fortaleza y templanza", otras: ["Fe, esperanza, caridad y humildad", "Paciencia, bondad, mansedumbre y paz", "Prudencia, piedad, ciencia y consejo"], porque: "Son las bisagras de la vida moral (cardo significa bisagra)." },
      { tema: "fe", p: "En la peregrinación a Luján, ¿desde dónde sale el trayecto más largo?", ok: "Desde Liniers", otras: ["Desde Moreno", "Desde General Rodríguez", "Desde Pilar"], porque: "Son 63 km hasta la Basílica." },
      { tema: "fe", p: "¿Qué día y a qué hora es la misa de jóvenes en Sagrada?", ok: "Domingos a las 20:15", otras: ["Sábados a las 19:00", "Domingos a las 11:00", "Miércoles a las 21:30"], porque: "¡Te esperamos!" },
      { tema: "fe", p: "¿Qué es la adoración eucarística?", ok: "Rezar frente a Jesús presente en la Eucaristía", otras: ["Una misa especial de los domingos", "Cantar alabanzas en grupo", "Leer la Biblia en voz alta"], porque: "En Sagrada el Santísimo está expuesto siempre." },
      { tema: "fe", p: "¿Qué rezamos al empezar cada encuentro de Confirmación?", ok: "La oración al Espíritu Santo", otras: ["El Ángelus", "El Credo", "La Salve"], porque: "«Ven, Espíritu Santo, llena los corazones de tus fieles…»" },
      { tema: "fe", p: "¿Cuál es la oración que Jesús enseñó a sus discípulos?", ok: "El Padre Nuestro", otras: ["El Ave María", "El Gloria", "El Credo"], porque: "Está en Mateo 6 y Lucas 11." },
      { tema: "fe", p: "¿En qué año arrancó FARO?", ok: "2025", otras: ["2018", "2020", "2023"], porque: "Es el grupo más nuevo de Sagrada." },
      { tema: "fe", p: "¿En qué año arrancó Confirmación en Sagrada?", ok: "2015", otras: ["2010", "2018", "2020"], porque: "Ya son más de diez años de ciclos de Confir." },
      { tema: "fe", p: "¿En qué año arrancó HPP?", ok: "2024", otras: ["2019", "2022", "2025"], porque: "Nació para acompañar a los que terminan Post." },
      { tema: "fe", p: "¿Qué significan las siglas HPP?", ok: "Herramientas para perseverar", otras: ["Hermanos por la paz", "Hacia la plenitud personal", "Hombres para el prójimo"], porque: "Cada uno arma su caja de herramientas para sostener la fe." },
      { tema: "fe", p: "¿Cuáles son las tres etapas de Post?", ok: "Afectiva, formativa y contemplativa", otras: ["Espiritual, intelectual y apostólica", "Conocer, amar y servir", "Oración, misión y comunidad"], porque: "Y el camino culmina con la consagración a María." },
      { tema: "fe", p: "¿Qué significan las siglas JEVC?", ok: "Jesús en vos confío", otras: ["Jóvenes en verdadera comunión", "Juntos en vida cristiana", "Jesús, el verdadero camino"], porque: "La jaculatoria de la Divina Misericordia." },
      { tema: "fe", p: "¿Dónde fue la primera misión de Sagrada Familia?", ok: "En Rauch", otras: ["En Las Tunas", "En Luján", "En Santiago del Estero"], porque: "Ahí empezó la historia misionera de Sagrada." },
      { tema: "fe", p: "¿A dónde misiona todas las semanas Puente a María?", ok: "Al barrio Las Tunas", otras: ["A Rauch", "A Luján", "A Pilar"], porque: "Con catequesis y obras de misericordia, semana a semana." },
      { tema: "fe", p: "¿Quiénes son los dos sacerdotes de Sagrada?", ok: "El P. Checo Avellaneda y el P. Augusto Zampini", otras: ["El P. Checo Avellaneda y el P. Tomás", "El P. Augusto Zampini y el P. Juan", "El P. Tomás y el P. Juan"], porque: "Los podés escuchar en las homilías de la biblioteca." },
      { tema: "fe", p: "¿Cuál es el nombre del P. Checo Avellaneda?", ok: "Carlos", otras: ["Sergio", "Ezequiel", "Francisco"], porque: "Carlos «Checo» Avellaneda." },
      { tema: "fe", p: "¿Quién celebra la misa de jóvenes de los domingos?", ok: "El P. Augusto", otras: ["El P. Checo", "El P. Tomás", "El P. Juan"], porque: "Domingos a las 20:15. ¡Te esperamos!" },
      { tema: "fe", p: "¿De qué equipo de fútbol es hincha el P. Checo?", ok: "River", otras: ["Boca", "Racing", "San Lorenzo"], porque: "Ahora ya lo sabés." },
      { tema: "fe", p: "¿Cuál es el hobby del P. Augusto?", ok: "Andar en moto", otras: ["Jugar al golf", "Pescar", "Tocar la guitarra"], porque: "Ahora ya lo sabés." },
      { tema: "fe", p: "¿Cómo se llama el mejor equipo de fútbol de Sagrada?", ok: "Sanbomazo", otras: ["Pecadores Flojos", "La Renga", "Sagrada FC"], porque: "No hay discusión." },
      { tema: "fe", p: "¿Cuántos seguidores tiene la cuenta @sagradafamilia.joven?", ok: "Unos 1.900", otras: ["Unos 500", "Unos 5.000", "Unos 12.000"], porque: "Si todavía no la seguís, ¡es tu momento!" },
      { tema: "fe", p: "¿Cuántas hostias se consagran, más o menos, en una misa de jóvenes?", ok: "Unas 450", otras: ["Unas 150", "Unas 300", "Unas 1.000"], porque: "Cada domingo, cientos de jóvenes reciben a Jesús." },
      { tema: "fe", p: "En las compartidas de Confir, ¿cuál es el «ABC»?", ok: "Confianza, respeto y sigilo", otras: ["Alegría, bondad y caridad", "Atención, buena onda y compromiso", "Amistad, Biblia y comunión"], porque: "Lo que se comparte en el grupo, queda en el grupo." },
      { tema: "biblia", p: "¿Cuántos apóstoles eligió Jesús?", ok: "12", otras: ["7", "10", "72"], porque: "Doce, como las doce tribus de Israel. A los 72 los envió en misión de a dos." },
      { tema: "biblia", p: "¿Quién bautizó a Jesús?", ok: "Juan el Bautista", otras: ["Pedro", "Juan el apóstol", "Elías"], porque: "Fue en el río Jordán." },
      { tema: "biblia", p: "¿En qué río fue bautizado Jesús?", ok: "Jordán", otras: ["Nilo", "Éufrates", "Tigris"], porque: "Ahí se escuchó la voz del Padre: «Este es mi Hijo muy querido»." },
      { tema: "biblia", p: "¿Quién guió al pueblo de Israel en la salida de Egipto?", ok: "Moisés", otras: ["Abraham", "Josué", "David"], porque: "Lo cuenta el libro del Éxodo." },
      { tema: "biblia", p: "¿Qué libro de la Biblia tiene 150 capítulos?", ok: "Salmos", otras: ["Isaías", "Génesis", "Proverbios"], porque: "Son 150 salmos, oraciones que Jesús también rezaba." },
      { tema: "biblia", p: "¿Quién traicionó a Jesús?", ok: "Judas Iscariote", otras: ["Pedro", "Tomás", "Barrabás"], porque: "Lo entregó por treinta monedas de plata." },
      { tema: "santos", p: "¿Quién es la primera santa argentina?", ok: "Mama Antula", otras: ["Santa Rosa de Lima", "Santa Teresa de Calcuta", "Santa Clara"], porque: "María Antonia de Paz y Figueroa, canonizada en 2024." },
      { tema: "santos", p: "¿Qué santo fundó los salesianos?", ok: "San Juan Bosco", otras: ["San Ignacio de Loyola", "San Benito", "Santo Domingo"], porque: "Para educar a los jóvenes pobres de Turín." },
      { tema: "santos", p: "¿A qué santa le pidió Jesús difundir la Divina Misericordia?", ok: "Santa Faustina", otras: ["Santa Teresita", "Santa Bernardita", "Santa Catalina de Siena"], porque: "De ahí viene la imagen con la frase «Jesús, en vos confío»." },
      { tema: "santos", p: "¿Dónde se le apareció la Virgen a Santa Bernardita?", ok: "En Lourdes", otras: ["En Fátima", "En Guadalupe", "En Luján"], porque: "En una gruta de Francia, en 1858." },
      { tema: "santos", p: "¿A cuántos pastorcitos se les apareció la Virgen en Fátima?", ok: "3", otras: ["1", "2", "5"], porque: "Lucía, Francisco y Jacinta, en 1917." },
      { tema: "santos", p: "¿Qué santo es patrono de los estudiantes?", ok: "Santo Tomás de Aquino", otras: ["San Benito", "San Pedro", "San Ignacio de Loyola"], porque: "Por su inteligencia puesta al servicio de la fe." },
      { tema: "sacramentos", p: "¿Qué sacramento perdona los pecados cometidos después del Bautismo?", ok: "La Reconciliación", otras: ["La Unción de los enfermos", "La Eucaristía", "La Confirmación"], porque: "También la llamamos Confesión." },
      { tema: "sacramentos", p: "¿Cuántas veces se recibe la Confirmación?", ok: "Una sola vez", otras: ["Una vez por año", "Dos veces", "Las que uno quiera"], porque: "Igual que el Bautismo, deja una marca para siempre." },
      { tema: "sacramentos", p: "¿Qué celebramos el Jueves Santo?", ok: "La Última Cena", otras: ["La crucifixión", "La Resurrección", "La entrada en Jerusalén"], porque: "Jesús instituyó la Eucaristía y lavó los pies de sus discípulos." },
      { tema: "sacramentos", p: "¿De qué color se viste el sacerdote en Pentecostés?", ok: "Rojo", otras: ["Verde", "Blanco", "Morado"], porque: "Por el fuego del Espíritu Santo." },
      { tema: "sacramentos", p: "¿Cuál es la fiesta más importante del año para los cristianos?", ok: "La Pascua", otras: ["La Navidad", "Pentecostés", "La Epifanía"], porque: "Celebramos la Resurrección de Jesús." },
      { tema: "fe", p: "¿Qué significa «Amén»?", ok: "Así es", otras: ["Gracias", "Aleluya", "Paz"], porque: "Es una forma de decir «sí, creo»." },
      { tema: "fe", p: "¿Cuántos son los mandamientos?", ok: "10", otras: ["7", "12", "5"], porque: "Dios se los dio a Moisés en el monte Sinaí." },
      { tema: "fe", p: "Según Jesús, ¿cuál es el mandamiento más importante?", ok: "Amar a Dios con todo el corazón", otras: ["No matar", "Santificar las fiestas", "No robar"], porque: "Y el segundo es amar al prójimo como a uno mismo." },
      { tema: "fe", p: "¿Qué celebramos el 8 de diciembre?", ok: "La Inmaculada Concepción", otras: ["La Asunción de María", "La Anunciación", "La Navidad"], porque: "María fue concebida sin pecado original." },
      { tema: "fe", p: "¿Qué celebramos el 15 de agosto?", ok: "La Asunción de la Virgen", otras: ["La Inmaculada Concepción", "La Anunciación", "Pentecostés"], porque: "María fue llevada en cuerpo y alma al cielo." }
    ]
  },

  /* ---------- Preguntas frecuentes (página Sumate) ---------- */
  preguntas: [
    { p: "¿Puedo ir sin conocer a nadie?", r: "¡Sí! Muchos llegan solos. Los grupos están pensados para que todos se sientan incluidos desde el primer encuentro." },
    { p: "Me perdí la inscripción, ¿qué hago?", r: "Los ciclos de Confirmación y Post arrancan a mitad de año, y la inscripción abre en julio. Mientras tanto podés venir a la misa de jóvenes o a la adoración. FARO, HPP y Puente a María tienen la inscripción abierta." },
    { p: "¿Tengo que estar bautizado?", r: "Para participar de los grupos no. Para recibir el sacramento de la Confirmación sí; si no estás bautizado, consultá a la secretaría y te orientamos." },
    { p: "¿Qué es la adoración?", r: "Es un momento de oración en silencio frente a Jesús presente en la Eucaristía. No hace falta saber nada: alcanza con ir y quedarse un rato." },
    { p: "Soy padre o madre, ¿a quién le escribo?", r: "A la secretaría parroquial (+54 9 11 3692-1028). Te responden o te conectan con el grupo que corresponda." },
    { p: "¿Cómo me entero de las novedades?", r: "Todo lo publicamos en Instagram: inscripciones, misiones, eventos y cambios de horario." }
  ]
};
