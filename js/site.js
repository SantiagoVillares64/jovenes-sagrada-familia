/* Arma cada página a partir de js/contenido.js. No hace falta editar este archivo. */
(function () {
  var C = window.CONTENIDO;
  if (!C) return;
  var PAGE = document.body.getAttribute("data-page") || "inicio";

  /* ---------- utilidades ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function grupo(id) { return C.grupos.filter(function (g) { return g.id === id; })[0]; }
  function ext(href, cls, html) { return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener">' + html + "</a>"; }

  /* ---------- desafíos de hoy: estado y puntos (lo usan el inicio y la página de juegos) ---------- */
  var DESAFIOS = [
    { id: "santo", clave: "santo", nombre: "Santo del día", icono: "🕊️", ancla: "diario-santo" },
    { id: "versiculo", clave: "versiculo", nombre: "Versículo del día", icono: "📖", ancla: "diario-versiculo" },
    { id: "conexiones", clave: "conex", nombre: "Conexiones", icono: "🧩", ancla: "diario-conex" },
    { id: "crucigrama", clave: "cruci", nombre: "Crucigrama", icono: "✏️", ancla: "diario-cruci" }
  ];
  function fechaLocal(d) { return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" : "") + d.getDate(); }
  function leerLS(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
  /* puntos de hoy para el ranking (hasta 100 por desafío); null = todavía no lo terminó */
  function puntosHoy(id) {
    var d = DESAFIOS.filter(function (x) { return x.id === id; })[0], s = leerLS("diario:" + d.clave + ":" + fechaLocal(new Date()));
    if (!s || !s.fin) return null;
    if (id === "santo") return s.puntos * 20;
    if (id === "versiculo") return s.gano ? (s.malas.length ? 50 : 100) : 0;
    if (id === "crucigrama") return Math.max(20, Math.min(100, 100 - 15 * (s.ayudas || 0) - Math.max(0, Math.floor(((s.t || 0) - 180) / 30))));
    return s.puntos;
  }
  function mejorRacha() {
    var hoy = new Date(), ayer = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1), m = 0;
    DESAFIOS.forEach(function (d) {
      var r = leerLS("racha:" + d.id);
      if (r && (r.ultimo === fechaLocal(hoy) || r.ultimo === fechaLocal(ayer))) m = Math.max(m, r.n);
    });
    return m;
  }
  /* Academia Frassati: isotipo (cordada) y sello, del manual de marca */
  var ISO_D = "M2 84 C7 77 12 73 17 72 C21 71 22 71 25 68 L34 60 C37 57 39 56 41 57 L45 61 C49 56 53 51 55.5 47.5 C56.5 46 57.3 44.8 58 44 L58 24 L58 30 L52 30 L64 30 L58 30 L58 44 C59.5 46 61.5 49 64 52 C67 56 70 58 73 59 C75 59 76 58 78 57 C79 56 80 56 81 57 C86 63 92 72 98 84";
  function isoSVG(cls) {
    return '<svg class="' + cls + '" viewBox="0 12 100 64" aria-hidden="true" focusable="false"><path d="' + ISO_D + '" transform="translate(0 -10)" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  var selloN = 0;
  function selloSVG(cls) {
    var id = "sello-c" + (++selloN);
    return '<svg class="' + cls + '" viewBox="0 0 100 100" role="img" aria-label="Sello de la Academia Frassati"><defs><path id="' + id + '" d="M50 50 m-37.5 0 a37.5 37.5 0 1 1 75 0 a37.5 37.5 0 1 1 -75 0"/></defs>' +
      '<circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="50" cy="50" r="33" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
      '<text fill="currentColor" font-family="Lora, Georgia, serif" font-size="7" letter-spacing="1"><textPath href="#' + id + '" textLength="232" lengthAdjust="spacing">ACADEMIA FRASSATI · HACIA LO ALTO ·</textPath></text>' +
      '<g transform="translate(25 27) scale(.5)"><path d="' + ISO_D + '" transform="translate(0 -10)" fill="none" stroke="currentColor" stroke-width="2.42" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';
  }

  /* podio de la semana pasada, del ranking parroquial */
  function podioHtml(podio) {
    if (!podio || !podio.length) return "";
    var med = ["🥇", "🥈", "🥉"];
    return '<div class="podio"><p class="podio__title">🏆 Ganadores de la semana pasada</p><ol>' + podio.map(function (f) {
      return '<li><span class="podio__med">' + (med[f.pos - 1] || f.pos + "°") + '</span><span class="podio__nombre">' + esc(f.nombre) + "</span>" +
        (f.grupo ? '<span class="podio__grupo">' + esc(f.grupo) + "</span>" : "") + '<span class="podio__pts">' + f.puntos + " pts</span></li>";
    }).join("") + "</ol></div>";
  }
  /* ---------- cuenta: "Entrar con Google" (la usan el ranking y la Academia) ----------
     Google hace el inicio de sesión; la planilla (herramientas/ranking/Codigo.gs) verifica el comprobante
     y, si la persona está aprobada, devuelve una sesión. Acá solo se guarda esa sesión, el nombre visible y el grupo. */
  var CUENTA = (function () {
    var cfg = C.ranking || {}, URL_C = cfg.url || "", gisCargando = null, gisListo = false, alTerminarActual = null;
    try { localStorage.removeItem("ranking:yo"); } catch (e) {} /* el sistema viejo de códigos */
    var datos = function () { return leerLS("cuenta"); };
    var guardarC = function (d) { try { if (d) localStorage.setItem("cuenta", JSON.stringify(d)); else localStorage.removeItem("cuenta"); } catch (e) {} };
    var post = function (accion, extra, cb) {
      var body = { accion: accion }, d = datos();
      if (d && d.sesion) body.sesion = d.sesion;
      for (var k in extra) body[k] = extra[k];
      fetch(URL_C, { method: "POST", body: JSON.stringify(body) }).then(function (r) { return r.json(); }).then(function (r) {
        if (r && r.error === "sesion") guardarC(null); /* sesión vencida o cuenta dada de baja */
        cb(null, r);
      }, function (e) { cb(e || true); });
    };
    var cargarGIS = function (cb) {
      if (window.google && google.accounts && google.accounts.id) { cb(); return; }
      if (!gisCargando) {
        gisCargando = [];
        var s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client"; s.async = true;
        s.onload = function () { gisCargando.forEach(function (f) { f(); }); };
        document.head.appendChild(s);
      }
      gisCargando.push(cb);
    };
    /* dibuja el botón de Google en el elemento; alTerminar(estado, nombre) cuando vuelve la respuesta */
    var boton = function (el, alTerminar) {
      if (!URL_C || !cfg.clientId) { el.innerHTML = '<p class="muted">El inicio de sesión todavía no está disponible.</p>'; return; }
      alTerminarActual = alTerminar;
      cargarGIS(function () {
        if (!gisListo) {
          gisListo = true;
          google.accounts.id.initialize({
            client_id: cfg.clientId, ux_mode: "popup", auto_select: false, cancel_on_tap_outside: true,
            callback: function (resp) { entrar(resp.credential, alTerminarActual); }
          });
        }
        el.innerHTML = "";
        google.accounts.id.renderButton(el, { theme: "outline", size: "large", text: "signin_with", shape: "pill", locale: "es" });
      });
    };
    var entrar = function (credencial, alTerminar) {
      post("login", { credencial: credencial }, function (err, r) {
        if (err || !r || !r.ok) { alTerminar("error"); return; }
        if (r.sesion) guardarC({ sesion: r.sesion, nombre: r.nombre, grupo: r.grupo, estado: r.estado });
        alTerminar(r.estado, r.nombre);
      });
    };
    var salir = function (cb) {
      var d = datos();
      if (d && d.sesion) post("salir", {}, function () {});
      guardarC(null);
      try { if (window.google && google.accounts) google.accounts.id.disableAutoSelect(); } catch (e) {}
      if (cb) cb();
    };
    var mensaje = function (estado, nombre) {
      if (estado === "pendiente") return "Todavía no aparecés en el ranking público: cuando " + esc(cfg.aprueba || "los coordinadores") + " apruebe tu cuenta, vas a figurar con tu nombre. Mientras tanto ya sumás puntos e insignias.";
      if (estado === "baja") return "Tu cuenta está dada de baja. Si creés que es un error, escribinos.";
      if (estado === "error") return "No se pudo entrar. Probá de nuevo en un rato.";
      return "";
    };
    var actualizar = function (estado) { var d = datos(); if (d && estado && d.estado !== estado) { d.estado = estado; guardarC(d); } };
    return { url: URL_C, datos: datos, post: post, boton: boton, salir: salir, mensaje: mensaje, entrar: entrar, actualizar: actualizar };
  })();

  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true" class="i-fill"><path d="M8 5.5v13l11-6.5z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    info: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8v5M12 16.5v.01"/><circle cx="12" cy="12" r="9"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>'
  };
  var ESTADOS = {
    abierta: { label: "Inscripción abierta", cls: "is-open" },
    cerrada: { label: "Inscripción cerrada", cls: "is-closed" },
    proximamente: { label: "Próximamente", cls: "is-soon" }
  };
  function badge(g) {
    var e = ESTADOS[(g.inscripcion || {}).estado] || ESTADOS.proximamente;
    return '<span class="badge ' + e.cls + '">' + e.label + "</span>";
  }
  function cta(g, cls) {
    var i = g.inscripcion || {};
    if (i.estado === "abierta" && i.link) return ext(i.link, cls || "btn btn--small", esc(i.texto));
    if (i.estado === "cerrada") return ext(C.redes.instagram, "link", "Abren en julio · seguinos en Instagram");
    return ext(C.secretaria.whatsapp, "link", esc(i.texto || "Consultá a la secretaría"));
  }
  function reelUrl(id) { return "https://www.instagram.com/reel/" + id + "/"; }
  function reelBtn(id, cls, label) {
    return '<a class="' + cls + '" href="' + reelUrl(id) + '" target="_blank" rel="noopener" data-reel="' + esc(id) + '">' + ICON.play + "<span>" + esc(label) + "</span></a>";
  }
  function reelCard(r) {
    return '<a class="reel" href="' + reelUrl(r.id) + '" target="_blank" rel="noopener" data-reel="' + esc(r.id) + '" style="--c:' + esc(r.color || "#26342f") + '">' +
      (r.foto ? '<img src="' + esc(r.foto) + '" alt="" loading="lazy">' : "") +
      '<span class="reel__play">' + ICON.play + '</span><span class="reel__title">' + esc(r.titulo) + "</span></a>";
  }
  function scroller(id, items, cls, label) {
    return '<div class="' + cls + '" id="' + id + '" tabindex="0" aria-label="' + esc(label) + '">' + items + "</div>" +
      '<div class="wrap gallery__nav">' +
        '<button class="round" type="button" data-scroll="-1" data-target="' + id + '" aria-label="Anteriores">' + ICON.left + "</button>" +
        '<button class="round" type="button" data-scroll="1" data-target="' + id + '" aria-label="Siguientes">' + ICON.right + "</button>" +
      "</div>";
  }
  function head(eyebrow, title, lead, extra) {
    return '<div class="section__head' + (extra ? " section__head--row" : "") + '"><div>' +
      '<p class="eyebrow">' + esc(eyebrow) + "</p><h2>" + esc(title) + "</h2>" +
      (lead ? '<p class="muted">' + esc(lead) + "</p>" : "") + "</div>" + (extra || "") + "</div>";
  }
  function contacto(titulo) {
    var s = C.secretaria;
    return '<div class="contact">' +
      '<div class="contact__text"><p class="eyebrow">' + esc(titulo || "¿Tenés dudas?") + "</p>" +
      "<h3>" + esc(s.nombre) + "</h3>" +
      "<p>Para cualquier consulta sobre los grupos, inscripciones o actividades, escribí o llamá a la secretaría. Ellos te conectan con quien corresponda.</p></div>" +
      '<div class="contact__actions"><p class="contact__phone">' + ICON.phone + "<span>" + esc(s.telefono) + "</span></p>" +
      ext(s.whatsapp, "btn btn--small", "Escribir por WhatsApp") + "</div></div>";
  }
  function track() {
    return '<div class="track" aria-label="Grupos según el año">' +
      '<div class="track__head" aria-hidden="true"><span data-short="3°">3er año</span><span data-short="4°">4to año</span><span data-short="5°">5to año</span><span data-short="6°">6to año</span><span data-short="Facu">Universitarios</span></div>' +
      '<div class="track__rows">' + C.grupos.map(function (g) {
        /* columna 1 = nombre; cada año ocupa 2 medias columnas */
        var from = Math.round((g.inicio - 1) * 2) + 2, to = Math.round((g.fin - 1) * 2) + 2;
        return '<a class="track__row" href="' + esc(g.pagina) + '"><span class="track__name">' + esc(g.nombre) + "</span>" +
          '<span class="track__bar' + (g.fin >= 6 ? " track__bar--open" : "") + '" style="--from:' + from + ";--to:" + to + ";--c:" + esc(g.color) + '"></span></a>';
      }).join("") + '</div><p class="track__note">Los ciclos de FARO, Confirmación, Post y HPP van de mitad de año a mitad de año.</p></div>';
  }
  function groupCard(g, sub) {
    return '<a class="gcard" href="' + esc(g.pagina) + '" style="--c:' + esc(g.color) + '">' +
      '<div class="gcard__img"><img src="' + esc(g.imagenCard || g.imagen) + '" alt="" loading="lazy"></div>' +
      '<div class="gcard__body"><p class="group__meta"><span class="dot"></span>' + esc(sub || g.edadesCorto || g.edades) + "</p>" +
      "<h3>" + esc(g.nombre) + "</h3><p>" + esc(g.resumen) + "</p>" +
      '<div class="gcard__foot">' + badge(g) + '<span class="gcard__go">Conocer ' + ICON.right + "</span></div></div></a>";
  }
  function encuentrosHtml() {
    return '<div class="meet">' + C.encuentros.map(function (e) {
      return '<div class="meet__item"><p class="meet__when">' + esc(e.cuando) + "</p><h3>" + esc(e.titulo) + "</h3><p>" + esc(e.detalle) + "</p>" +
        (e.link ? ext(e.link, "link", esc(e.linkTexto)) : "") +
        (e.reel ? reelBtn(e.reel, "chip", "Ver reel") : "") + "</div>";
    }).join("") + "</div>";
  }
  function tabla(items) {
    return '<dl class="table">' + items.map(function (r) { return "<dt>" + esc(r.dia) + "</dt><dd>" + esc(r.horas) + "</dd>"; }).join("") + "</dl>";
  }
  function pagehead(eyebrow, title, lead) {
    return '<section class="pagehead"><div class="wrap"><p class="eyebrow">' + esc(eyebrow) + "</p><h1>" + esc(title) + "</h1>" +
      (lead ? '<p class="lead">' + esc(lead) + "</p>" : "") + "</div></section>";
  }

  /* ---------- calendario ---------- */
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  var DIAS_REGLA = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6 };
  function parseFecha(s) {
    s = String(s || "").trim();
    var m = s.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
    if (m) return { d: new Date(+m[1], +m[2] - 1, m[3] ? +m[3] : 1), soloMes: !m[3] };
    /* también acepta el formato de Google Sheets en español: 21/3/2027 */
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return { d: new Date(+m[3], +m[2] - 1, +m[1]), soloMes: false };
    return null;
  }
  function parseCSV(txt) {
    var rows = [], row = [], cell = "", q = false;
    for (var i = 0; i < txt.length; i++) {
      var ch = txt[i];
      if (q) {
        if (ch === '"' && txt[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') q = false;
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && txt[i + 1] === "\n") i++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    var head = (rows.shift() || []).map(function (h) { return h.trim().toLowerCase(); });
    return rows.filter(function (r) { return r.join("").trim(); }).map(function (r) {
      var o = {}; head.forEach(function (h, k) { o[h] = (r[k] || "").trim(); }); return o;
    });
  }
  var FIESTAS = {
    nochebuena: function (y) { return new Date(y, 11, 24); },
    navidad: function (y) { return new Date(y, 11, 25); },
    /* domingo después de Navidad; si Navidad cae domingo, el 30 de diciembre */
    "sagrada-familia": function (y) { var dow = new Date(y, 11, 25).getDay(); return new Date(y, 11, dow === 0 ? 30 : 25 + (7 - dow)); }
  };
  function sinTildes(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  /* Todas las ocurrencias de eventos entre "desde" y "hasta" (inclusive) */
  function ocurrencias(eventos, recurrentes, desde, hasta) {
    var lista = [];
    eventos.forEach(function (e) {
      var f = parseFecha(e.fecha); if (!f) return;
      var h = parseFecha(e.hasta);
      if (h && h.d.getTime() <= f.d.getTime()) h = null; /* "hasta" igual a la fecha = evento de un día */
      var fin = h ? h.d : f.soloMes ? new Date(f.d.getFullYear(), f.d.getMonth() + 1, 0) : f.d;
      if (fin >= desde && f.d <= hasta) lista.push({ e: e, d: f.d, fin: h ? h.d : null, soloMes: f.soloMes });
    });
    (recurrentes || []).forEach(function (r) {
      var regla = sinTildes(r.regla), push = function (d) { if (d >= desde && d <= hasta) lista.push({ e: r, d: d, fin: null, soloMes: false, semanal: !!r.semanal }); };
      if (FIESTAS[regla]) {
        for (var y = desde.getFullYear(); y <= hasta.getFullYear(); y++) push(FIESTAS[regla](y));
        return;
      }
      var m = regla.match(/^(primer|cada)-(\w+)$/); if (!m) return;
      var dow = DIAS_REGLA[m[2]]; if (dow == null) return;
      for (var mes = new Date(desde.getFullYear(), desde.getMonth(), 1); mes <= hasta; mes = new Date(mes.getFullYear(), mes.getMonth() + 1, 1)) {
        var d = new Date(mes); while (d.getDay() !== dow) d.setDate(d.getDate() + 1);
        if (m[1] === "primer") { push(d); continue; }
        for (var k = 0; d.getMonth() === mes.getMonth(); k++, d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)) {
          if (k === 0 && r.excepto === "primer") continue;
          push(new Date(d));
        }
      }
    });
    lista = lista.concat(fiestasSantos(desde, hasta));
    return lista.sort(function (a, b) { return a.d - b.d || (b.fin ? 1 : 0) - (a.fin ? 1 : 0); });
  }
  /* Carga los eventos (planilla de Google o respaldo local) y devuelve la lista cruda */
  function cargarEventos(cb) {
    var cal = C.calendario || {}, local = function () { cb(cal.eventos || []); };
    if (!cal.hojaCSV || !window.fetch) return local();
    fetch(cal.hojaCSV).then(function (r) { if (!r.ok) throw r; return r.text(); })
      .then(function (txt) { cb(parseCSV(txt)); })
      .catch(local);
  }
  var ALIAS = { confir: "confirmacion", "confirmación": "confirmacion", "post-confirmacion": "post", "puente a maria": "puente", "puente a maría": "puente", "puente-a-maria": "puente", naza: "nazaret", universitarios: "nazaret", "preconfir": "faro" };

  /* Fiestas de los santos (campo fiesta: "12 de octubre").
     Si está cargado el diccionario (juegos-datos.js) usa todos sus santos; si no, las fichas de contenido.js. */
  function fichaDe(id) { return (C.santos || []).filter(function (s) { return s.id === id; })[0]; }
  function fiestasSantos(desde, hasta) {
    var lista = [];
    var fuente = window.JUEGOS ? window.JUEGOS.santos.map(function (s) {
      var f = fichaDe(s.ficha);
      return { nombre: s.n, fiesta: s.fiesta, id: s.id, color: f ? f.color : "#94735e", resumen: f ? f.resumen : "«" + s.p[4] + "»" };
    }) : (C.santos || []);
    fuente.forEach(function (s) {
      var m = sinTildes(s.fiesta).toLowerCase().match(/^(\d{1,2}) de (\w+)/); if (!m) return;
      var mes = MESES.map(sinTildes).indexOf(m[2]); if (mes < 0) return;
      for (var y = desde.getFullYear(); y <= hasta.getFullYear(); y++) {
        var d = new Date(y, mes, +m[1]);
        if (d >= desde && d <= hasta) lista.push({ d: d, fin: null, soloMes: false, santo: true, e: {
          titulo: s.nombre, grupo: "santos", color: s.color,
          detalle: "Fiesta de " + s.nombre + ". " + s.resumen,
          linkInterno: "santos.html#" + s.id, linkTexto: "Conocé su historia"
        } });
      }
    });
    return lista;
  }

  /* "Agregar a mi calendario": Google Calendar y archivo .ics (iPhone, Outlook) */
  function horaDe(txt) {
    var m = String(txt || "").match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|hs|h\b)?/i);
    if (!m) return null;
    var h = +m[1], min = +(m[2] || 0), suf = (m[3] || "").toLowerCase();
    if (suf === "pm" && h < 12) h += 12;
    if (suf === "am" && h === 12) h = 0;
    return h > 23 || min > 59 ? null : { h: h, m: min };
  }
  function p2(n) { return (n < 10 ? "0" : "") + n; }
  function fechaCal(d, hm) { return d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()) + (hm ? "T" + p2(hm.h) + p2(hm.m) + "00" : ""); }
  function rangoCal(x) {
    var hm = x.fin ? null : horaDe(x.e.hora);
    if (hm) {
      var fin = new Date(x.d.getFullYear(), x.d.getMonth(), x.d.getDate(), hm.h, hm.m + 90);
      return { ini: fechaCal(x.d, hm), fin: fechaCal(fin, { h: fin.getHours(), m: fin.getMinutes() }), todoElDia: false };
    }
    var ult = x.fin || x.d, sig = new Date(ult.getFullYear(), ult.getMonth(), ult.getDate() + 1);
    return { ini: fechaCal(x.d), fin: fechaCal(sig), todoElDia: true };
  }
  function botonesCal(x) {
    if (x.soloMes || x.semanal) return "";
    var e = x.e, r = rangoCal(x), base = location.href.split("#")[0].replace(/[^/]*$/, "");
    var detalle = [e.hora, e.detalle].filter(Boolean).join(" · ") + (e.linkInterno ? "\n" + base + e.linkInterno : "");
    var g = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(e.titulo) +
      "&dates=" + r.ini + "/" + r.fin + "&details=" + encodeURIComponent(detalle) + "&ctz=America/Argentina/Buenos_Aires";
    var icsEsc = function (s) { return String(s).replace(/[\\;,]/g, "\\$&").replace(/\n/g, "\\n"); };
    var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Jovenes Sagrada Familia//ES", "BEGIN:VEVENT",
      "UID:" + r.ini + "-" + encodeURIComponent(e.titulo).slice(0, 40) + "@sagradafamiliajoven",
      "DTSTAMP:" + fechaCal(new Date(), { h: 0, m: 0 }),
      r.todoElDia ? "DTSTART;VALUE=DATE:" + r.ini : "DTSTART;TZID=America/Argentina/Buenos_Aires:" + r.ini,
      r.todoElDia ? "DTEND;VALUE=DATE:" + r.fin : "DTEND;TZID=America/Argentina/Buenos_Aires:" + r.fin,
      "SUMMARY:" + icsEsc(e.titulo), "DESCRIPTION:" + icsEsc(detalle), "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var nombre = sinTildes(e.titulo).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".ics";
    return '<div class="ev__cal"><span>Agregar a mi calendario:</span>' +
      ext(g, "ev__calbtn", "Google Calendar") +
      '<a class="ev__calbtn" href="data:text/calendar;charset=utf-8,' + encodeURIComponent(ics) + '" download="' + esc(nombre) + '">iPhone / Outlook</a></div>';
  }

  function eventoHtml(x, conMes, conCal) {
    var e = x.e, clave = String(e.grupo || "").trim().toLowerCase();
    var g = grupo(ALIAS[clave] || clave);
    var etiqueta = g ? g.nombre : (!clave || clave === "todos" ? "Para todos" : clave.charAt(0).toUpperCase() + clave.slice(1));
    var color = e.color || (g ? g.color : "#4e5f58");
    var fecha = x.soloMes
      ? '<span class="ev__day ev__day--tbd">' + esc(MESES[x.d.getMonth()].slice(0, 3)) + "</span><span class=\"ev__dow\">a confirmar</span>"
      : '<span class="ev__day">' + x.d.getDate() + '</span><span class="ev__dow">' + (conMes ? MESES[x.d.getMonth()].slice(0, 3) : DIAS[x.d.getDay()].slice(0, 3)) + "</span>";
    var rango = x.fin ? "Hasta el " + DIAS[x.fin.getDay()] + " " + x.fin.getDate() + " de " + MESES[x.fin.getMonth()] : "";
    var meta = [e.hora, rango].filter(Boolean).map(esc).join(" · ");
    return '<li class="ev' + (x.semanal ? " ev--rutina" : "") + (x.santo ? " ev--santo" : "") + '" style="--c:' + esc(color) + '"><div class="ev__date">' + fecha + "</div>" +
      '<div class="ev__body"><p class="ev__group"><span class="dot"></span>' + esc(etiqueta) + "</p>" +
      "<h3>" + esc(e.titulo) + "</h3>" + (meta ? '<p class="ev__meta">' + meta + "</p>" : "") +
      (e.detalle ? '<p class="ev__detail">' + esc(e.detalle) + "</p>" : "") +
      (e.linkInterno ? '<a class="link" href="' + esc(e.linkInterno) + '">' + esc(e.linkTexto || "Más info") + " →</a>" : "") +
      (e.link ? ext(e.link, "link", "Más info") : "") +
      (conCal ? botonesCal(x) : "") + "</div></li>";
  }
  function agendaHtml(lista) {
    if (!lista.length) return '<p class="muted">No hay eventos cargados por ahora. Seguinos en Instagram para enterarte de lo próximo.</p>';
    var out = "", mes = "";
    lista.forEach(function (x) {
      var m = MESES[x.d.getMonth()] + " " + x.d.getFullYear();
      if (m !== mes) { out += (mes ? "</ul>" : "") + '<h3 class="agenda__month">' + esc(m) + '</h3><ul class="agenda__list">'; mes = m; }
      out += eventoHtml(x);
    });
    return out + "</ul>";
  }

  /* ---------- tiempo litúrgico ----------
     Se calcula solo para cualquier fecha a partir de la Pascua (cómputo gregoriano). */
  var COLORES_LIT = {
    verde: { hex: "#3f7d4f", nombre: "Verde" }, morado: { hex: "#6b4c8a", nombre: "Morado" }, blanco: { hex: "#c9a227", nombre: "Blanco" },
    rojo: { hex: "#a83232", nombre: "Rojo" }, rosa: { hex: "#d27a9d", nombre: "Rosa" }
  };
  function pascuaDe(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    var mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mes - 1, dia);
  }
  function masDias(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function inicioAdviento(y) { var nav = new Date(y, 11, 25), dow = nav.getDay(); return masDias(nav, -(dow === 0 ? 7 : dow) - 21); }
  function bautismoDelSenor(y) { var e = new Date(y, 0, 6); return masDias(e, 7 - e.getDay()); } /* domingo después del 6 de enero */
  function tiempoLiturgico(fecha) {
    var d = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()), y = d.getFullYear();
    var P = pascuaDe(y), ceniza = masDias(P, -46), ramos = masDias(P, -7), pentecostes = masDias(P, 49);
    var adv = inicioAdviento(y), bau = bautismoDelSenor(y), t = d.getTime();
    var es = function (x) { return t === x.getTime(); };
    if (d >= adv && d < new Date(y, 11, 25)) return { tiempo: "Adviento", color: es(masDias(adv, 14)) ? "rosa" : "morado", dia: es(masDias(adv, 14)) ? "Domingo Gaudete" : "" };
    if (d >= new Date(y, 11, 25) || d <= bau) return { tiempo: "Navidad", color: "blanco", dia: es(bau) ? "Bautismo del Señor" : "" };
    if (d < ceniza) return { tiempo: "Tiempo Ordinario", color: "verde", dia: "" };
    if (d < ramos) return { tiempo: "Cuaresma", color: es(masDias(P, -21)) ? "rosa" : "morado", dia: es(ceniza) ? "Miércoles de Ceniza" : es(masDias(P, -21)) ? "Domingo Laetare" : "" };
    if (d < P) {
      var dias = { 0: ["Domingo de Ramos", "rojo"], 4: ["Jueves Santo", "blanco"], 5: ["Viernes Santo", "rojo"], 6: ["Sábado Santo", "morado"] }[Math.round((t - ramos.getTime()) / 864e5) === 0 ? 0 : d.getDay()];
      return { tiempo: "Semana Santa", color: dias ? dias[1] : "morado", dia: dias ? dias[0] : "" };
    }
    if (d < pentecostes) return { tiempo: "Tiempo de Pascua", color: "blanco", dia: es(P) ? "Domingo de Pascua" : es(masDias(P, 7)) ? "Domingo de la Divina Misericordia" : "" };
    if (es(pentecostes)) return { tiempo: "Pentecostés", color: "rojo", dia: "" };
    return { tiempo: "Tiempo Ordinario", color: "verde", dia: "" };
  }
  var EXPLICA_LIT = {
    "Adviento": "Cuatro semanas de espera y preparación para la Navidad.",
    "Navidad": "Celebramos que Dios se hizo hombre, hasta el Bautismo del Señor.",
    "Tiempo Ordinario": "El tiempo de seguir a Jesús en lo cotidiano de su vida pública.",
    "Cuaresma": "Cuarenta días de oración, ayuno y limosna camino a la Pascua.",
    "Semana Santa": "Acompañamos a Jesús en su pasión, muerte y resurrección.",
    "Tiempo de Pascua": "Cincuenta días de alegría por la Resurrección, hasta Pentecostés.",
    "Pentecostés": "La venida del Espíritu Santo sobre los apóstoles."
  };
  function liturgicoHtml(fecha) {
    var L = tiempoLiturgico(fecha), c = COLORES_LIT[L.color];
    return '<div class="litu" style="--lc:' + c.hex + '"><span class="litu__dot" aria-hidden="true"></span>' +
      '<span class="litu__txt"><span class="litu__label">Hoy en el calendario litúrgico</span><strong>' + esc(L.tiempo) + (L.dia ? " · " + esc(L.dia) : "") + "</strong>" +
      "<span>" + esc(EXPLICA_LIT[L.tiempo] || "") + "</span></span>" +
      '<span class="litu__color">Color: ' + c.nombre + "</span></div>";
  }

  /* ---------- encabezado y pie ---------- */
  var activeGroup = PAGE.indexOf("grupo:") === 0 ? PAGE.slice(6) : null;
  function navLink(href, label, key) {
    return '<a href="' + href + '"' + (PAGE === key ? ' aria-current="page"' : "") + ">" + label + "</a>";
  }
  $("site-header").outerHTML =
    '<header class="nav" id="nav"><div class="wrap nav__inner">' +
      '<a href="index.html" class="nav__brand" aria-label="Jóvenes Sagrada Familia, inicio"><img src="img/logo-sagrada.png" alt="" width="92" height="27"><span>Jóvenes <strong>Sagrada Familia</strong></span></a>' +
      '<button class="nav__toggle" aria-expanded="false" aria-controls="menu" aria-label="Abrir menú"><span></span><span></span></button>' +
      '<nav class="nav__menu" id="menu" aria-label="Principal">' +
        '<div class="drop">' +
          '<button class="drop__btn" type="button" aria-expanded="false"' + (activeGroup ? ' aria-current="page"' : "") + ">Grupos " + ICON.down + "</button>" +
          '<div class="drop__panel">' + C.grupos.map(function (g) {
            return '<a href="' + esc(g.pagina) + '" style="--c:' + esc(g.color) + '"' + (activeGroup === g.id ? ' aria-current="page"' : "") + '><span class="dot"></span><span><strong>' + esc(g.nombre) + "</strong><small>" + esc(g.edades) + "</small></span></a>";
          }).join("") + "</div>" +
        "</div>" +
        navLink("calendario.html", "Calendario", "calendario") +
        navLink("juegos.html", "Juegos", "juegos") +
        navLink("horarios.html", "Horarios", "horarios") +
        navLink("recursos.html", "Recursos", PAGE === "santos" || PAGE === "academia" ? PAGE : "recursos") +
        '<a class="btn btn--small" href="sumate.html"' + (PAGE === "sumate" ? ' aria-current="page"' : "") + ">Sumate</a>" +
      "</nav></div></header>";

  $("site-footer").outerHTML =
    '<footer class="footer"><div class="wrap footer__inner">' +
      '<div class="footer__brand"><img src="img/logo-sagrada.png" alt="Parroquia Sagrada Familia" width="140" height="41" loading="lazy">' +
      '<p>Jóvenes Sagrada Familia<br><span class="muted">Parroquia Sagrada Familia · Nordelta</span></p></div>' +
      '<div class="footer__cols">' +
        "<div><h4>Grupos</h4>" + C.grupos.map(function (g) { return '<a href="' + esc(g.pagina) + '">' + esc(g.nombre) + "</a>"; }).join("") + "</div>" +
        '<div><h4>Seguinos</h4>' + ext(C.redes.instagram, "", "Instagram") + ext(C.redes.youtube, "", "YouTube") + ext(C.redes.spotify, "", "Spotify") + "</div>" +
        "<div><h4>Contacto</h4><span class=\"footer__txt\">" + esc(C.secretaria.nombre) + "</span>" + ext(C.secretaria.whatsapp, "", esc(C.secretaria.telefono)) +
          '<a href="mailto:' + esc(C.redes.email) + '">' + esc(C.redes.email) + "</a></div>" +
      "</div></div>" +
      '<div class="wrap footer__legal small muted">© ' + new Date().getFullYear() + ' Jóvenes Sagrada Familia · <a href="privacidad.html">Privacidad</a></div></footer>';

  /* ---------- bloques compartidos ---------- */
  function lujanHtml() {
    var L = C.lujan; if (!L) return "";
    var max = Math.max.apply(null, L.trayectos.map(function (t) { return t.km; }));
    return '<section class="lujan"><div class="wrap lujan__inner"><div class="lujan__text">' +
        '<p class="eyebrow eyebrow--light">' + esc(L.cuando) + "</p><h2>" + esc(L.titulo) + "</h2><p>" + esc(L.texto) + "</p>" +
        (L.proxima ? '<p class="lujan__next">Próxima: <strong>' + esc(L.proxima) + "</strong></p>" : "") +
        '<div class="mission__ctas">' + (L.reel ? reelBtn(L.reel, "btn btn--light", "Ver el reel") : "") +
        '<a class="btn btn--outline-light" href="calendario.html">Ver en el calendario</a></div></div>' +
      '<div class="route" aria-label="Trayectos">' +
        '<p class="route__head"><span>Elegí tu trayecto</span><span>Basílica de Luján</span></p>' +
        L.trayectos.map(function (t) {
          return '<div class="route__row"><span class="route__from">' + esc(t.desde) + "</span>" +
            '<span class="route__track"><span class="route__bar" style="width:' + (t.km / max * 100).toFixed(1) + '%"><span class="route__km">' + t.km + " km</span></span></span></div>";
        }).join("") +
        '<p class="route__note">Las barras están a escala: todas terminan en Luján.</p>' +
      "</div></div></section>";
  }
  function santoCard(s) {
    var ini = s.nombre.replace(/^(San|Santa)\s+/, "").split(/\s+/).filter(function (w) { return /^[A-ZÁÉÍÓÚÑ]/.test(w); }).slice(0, 2).map(function (w) { return w[0]; }).join("");
    return '<a class="saint" href="santos.html#' + esc(s.id) + '" style="--c:' + esc(s.color) + '">' +
      (s.imagen ? '<img class="saint__mono saint__photo" src="' + esc(s.imagen) + '" alt="" loading="lazy">' : '<span class="saint__mono" aria-hidden="true">' + esc(ini) + "</span>") +
      '<span class="saint__body">' + (s.etiqueta ? '<span class="saint__tag">' + esc(s.etiqueta) + "</span>" : "") +
      "<strong>" + esc(s.nombre) + '</strong><span class="saint__dates">' + esc(s.vida) + "</span>" +
      '<span class="saint__resumen">' + esc(s.resumen) + '</span><span class="saint__go">Aprender más ' + ICON.right + "</span></span></a>";
  }
  function santo(id) { return (C.santos || []).filter(function (s) { return s.id === id; })[0]; }

  /* ---------- páginas ---------- */
  var P = {};

  function hoyJuegosHtml() {
    var hechos = 0, total = 0, racha = mejorRacha();
    var items = DESAFIOS.map(function (d) {
      var p = puntosHoy(d.id); if (p !== null) { hechos++; total += p; }
      return '<li class="' + (p !== null ? "is-ok" : "") + '"><a href="juegos.html#' + d.ancla + '"><span class="hoyj__ico" aria-hidden="true">' + d.icono + "</span>" +
        "<span><strong>" + esc(d.nombre) + "</strong><span>" + (p !== null ? "✓ Jugado · " + p + " pts" : "Sin jugar") + "</span></span></a></li>";
    }).join("");
    return '<section class="section section--tight" id="hoy-juegos"><div class="wrap"><div class="hoyj">' +
      '<div class="hoyj__top"><div><p class="eyebrow">Juegos</p><h2 class="hoyj__title">Desafíos de hoy</h2>' +
        '<p class="muted">' + (hechos === 4 ? "¡Hiciste los 4! Sumaste " + total + " de 400 puntos. Volvé mañana." : hechos ? "Te " + (4 - hechos === 1 ? "falta 1" : "faltan " + (4 - hechos)) + ". Llevás " + total + " puntos hoy." : "Cuatro desafíos nuevos cada día, iguales para todos.") + "</p></div>" +
        (racha ? '<span class="daily__racha">🔥 Racha de ' + racha + (racha === 1 ? " día" : " días") + "</span>" : "") + "</div>" +
      '<ul class="hoyj__lista">' + items + "</ul>" +
      '<div class="hoyj__pie"><div id="hoyj-podio"></div><a class="btn btn--small" href="' + (hechos === 4 ? "juegos.html#ranking-seccion" : "juegos.html#diarios") + '">' + (hechos === 4 ? "Ver el ranking" : "Jugar ahora") + "</a></div>" +
    "</div></div></section>";
  }

  P.inicio = function () {
    var I = C.inicio;
    return '<section class="hero" id="inicio"><div class="wrap hero__inner"><div class="hero__text">' +
        '<p class="eyebrow">' + esc(I.eyebrow) + "</p><h1>Jóvenes<br>Sagrada Familia</h1>" +
        '<p class="lead">' + esc(I.bajada) + "</p>" +
        '<div class="hero__ctas"><a class="btn" href="#grupos">Encontrá tu grupo</a><a class="btn btn--ghost" href="sumate.html">Cómo sumarte</a></div>' +
      '</div><figure class="hero__img"><img src="' + esc(I.imagen) + '" alt="La iglesia Sagrada Familia de Nordelta al atardecer" fetchpriority="high"></figure></div></section>' +

      '<section class="section about"><div class="wrap about__inner"><p class="eyebrow">Quiénes somos</p>' +
        '<p class="about__quote">' + esc(I.frase) + '</p><p class="muted">' + esc(I.quienesSomos) + "</p></div></section>" +

      '<section class="gallery" aria-label="Fotos de la comunidad">' +
        scroller("carrusel", C.carrusel.map(function (f) {
          var dentro = '<img src="' + esc(f.foto) + '" alt="' + esc(f.texto) + '" loading="lazy"><figcaption>' + esc(f.texto) + (f.link ? '<span class="gallery__go">Conocer ' + ICON.right + "</span>" : "") + "</figcaption>";
          return f.link ? '<a class="gallery__item" href="' + esc(f.link) + '">' + dentro + "</a>" : '<figure class="gallery__item">' + dentro + "</figure>";
        }).join(""), "gallery__track", "Fotos de la comunidad") + "</section>" +

      '<section class="section section--tint" id="grupos"><div class="wrap">' +
        head("Grupos", "Un camino para cada etapa", "Desde 3er año del secundario hasta la vida profesional. Tocá un grupo para conocerlo.") +
        track() +
        '<div class="gcards">' + C.grupos.map(function (g) { return groupCard(g); }).join("") + "</div>" +
      "</div></section>" +

      lujanHtml() +

      '<section class="section" id="proximos"><div class="wrap">' +
        head("Calendario", "Próximos eventos", "", '<a class="link" href="calendario.html">Ver calendario completo →</a>') +
        '<div class="agenda agenda--home" id="agenda-home"><p class="muted">Cargando eventos…</p></div></div></section>' +

      hoyJuegosHtml() +
      '<section class="section section--tint" id="encuentros"><div class="wrap">' +
        head("Abiertos a todos", "Encuentros para todas las edades", "No hace falta estar en un grupo. Vení cuando quieras.", '<a class="link" href="horarios.html">Todos los horarios →</a>') +
        encuentrosHtml() + "</div></section>" +

      '<section class="section reels" id="experiencias"><div class="wrap">' +
        head("Experiencias", "Mirá cómo lo vivimos", "", ext(C.redes.instagram, "link", "Más en Instagram →")) + "</div>" +
        scroller("lista-reels", C.reels.map(reelCard).join(""), "reels__track", "Reels") + "</section>" +

      '<section class="final"><img class="final__bg" src="img/iglesia-atardecer.jpg" alt="" loading="lazy"><div class="wrap final__inner">' +
        "<h2>Hay un lugar para vos</h2><p>Mirá qué grupos tienen la inscripción abierta o escribinos si tenés dudas.</p>" +
        '<div class="hero__ctas hero__ctas--center"><a class="btn btn--light" href="sumate.html">Sumate</a>' + ext(C.redes.instagram, "btn btn--outline-light", esc(C.redes.instagramUsuario)) + "</div>" +
      "</div></section>";
  };

  P.grupo = function (g) {
    var reels = C.reels.filter(function (r) { return r.grupo === g.id && (!g.destacado || r.id !== g.destacado.reel); });
    var title = g.logo ? '<h1 class="ghero__title ghero__title--logo"><img src="' + esc(g.logo) + '" alt="' + esc(g.nombre) + '"></h1>' : '<h1 class="ghero__title">' + esc(g.nombre) + "</h1>";
    var html =
      '<section class="ghero" style="--c:' + esc(g.color) + '"><div class="wrap ghero__inner"><div class="ghero__text">' +
        '<nav class="crumbs" aria-label="Ruta"><a href="index.html#grupos">Grupos</a><span>/</span><span>' + esc(g.nombre) + "</span></nav>" +
        title + '<p class="ghero__sub">' + esc(g.subtitulo) + "</p>" +
        '<p class="lead">' + esc(g.resumen) + "</p>" +
        '<dl class="facts"><div><dt>Para quién</dt><dd>' + esc(g.edades) + "</dd></div>" +
          "<div><dt>Cuándo</dt><dd>" + esc(g.cuando) + "</dd></div>" +
          (g.ciclo ? "<div><dt>Ciclo</dt><dd>" + esc(g.ciclo) + "</dd></div>" : "") +
          "<div><dt>Inscripción</dt><dd>" + badge(g) + "</dd></div></dl>" +
        '<div class="hero__ctas">' + cta(g, "btn") + (reels[0] ? reelBtn(reels[0].id, "btn btn--ghost", "Ver reel") : "") + "</div>" +
      '</div><figure class="ghero__img"><img src="' + esc(g.imagen) + '" alt="Encuentro de ' + esc(g.nombre) + '"></figure></div></section>';

    html += '<section class="section"><div class="wrap split' + (g.pilares ? "" : " split--single") + '"><div class="split__main"><p class="eyebrow">Qué es</p>' +
      (g.texto || []).map(function (p) { return '<p class="prose">' + esc(p) + "</p>"; }).join("") + "</div>" +
      (g.pilares ? '<aside class="pillars" style="--c:' + esc(g.color) + '"><h3>' + esc(g.pilares.titulo) + "</h3><ul>" +
        g.pilares.items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></aside>" : "") +
      "</div></section>";

    if (g.encuentro && g.encuentro.texto) {
      var EN = g.encuentro;
      html += '<section class="section section--tint"><div class="wrap encuentro" style="--c:' + esc(g.color) + '">' +
        '<div class="encuentro__text">' + head(EN.eyebrow || "Los encuentros", EN.titulo) +
          EN.texto.map(function (p) { return '<p class="prose">' + esc(p) + "</p>"; }).join("") + "</div>" +
        (EN.datos ? '<ul class="encuentro__datos">' + EN.datos.map(function (d) {
          return '<li><strong>' + esc(d.n) + "</strong><span>" + esc(d.t) + "</span></li>";
        }).join("") + "</ul>" : "") +
      "</div></section>";
    } else if (g.encuentro) {
      var ord = g.encuentro.ordenado !== false, tag = ord ? "ol" : "ul";
      html += '<section class="section section--tint"><div class="wrap">' + head(ord ? "Paso a paso" : "Los lunes", g.encuentro.titulo, g.encuentro.intro) +
        "<" + tag + ' class="steps' + (ord ? "" : " steps--plain") + '" style="--c:' + esc(g.color) + '">' + g.encuentro.pasos.map(function (s) { return "<li><span>" + esc(s) + "</span></li>"; }).join("") + "</" + tag + "></div></section>";
    }
    if (g.temas) {
      html += '<section class="section"><div class="wrap">' + head("El recorrido", g.temas.titulo, g.temas.nota) +
        '<ul class="themes" style="--c:' + esc(g.color) + '">' + g.temas.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div></section>";
    }
    if (g.etapas) {
      var E = g.etapas;
      html += '<section class="section' + (g.encuentro ? "" : " section--tint") + '"><div class="wrap">' + head("El recorrido", E.titulo, E.nota) +
        (E.pasos
          ? '<ol class="stages" style="--c:' + esc(g.color) + '">' + E.lista.map(function (s) { return "<li><h3>" + esc(s.nombre) + "</h3><p>" + esc(s.temas[0]) + "</p></li>"; }).join("") + "</ol>"
          : '<div class="topics" style="--c:' + esc(g.color) + '">' + E.lista.map(function (s) {
              return '<div class="topics__col"><h3>' + esc(s.nombre) + "</h3><ul>" + s.temas.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>";
            }).join("") + "</div>") +
        "</div></section>";
    }
    if (g.destacado) {
      var D = g.destacado;
      html += '<section class="mission"><div class="mission__img"><img src="' + esc(D.imagen) + '" alt="" loading="lazy"></div><div class="mission__text">' +
        (D.logo ? '<img class="mission__logo" src="' + esc(D.logo) + '" alt="" loading="lazy">' : "") +
        '<p class="eyebrow eyebrow--light">' + esc(D.eyebrow) + "</p><h2>" + esc(D.titulo) + "</h2><p>" + esc(D.texto) + "</p>" +
        '<div class="mission__ctas">' + (D.reel ? reelBtn(D.reel, "btn btn--light", "Ver el reel de la misión") : "") + ext(C.redes.instagram, "btn btn--outline-light", "Ver novedades") + "</div></div></section>";
    }
    if (reels.length) {
      html += '<section class="section reels"><div class="wrap">' + head("Experiencias", "Así se vive " + g.nombre) + "</div>" +
        '<div class="reels__track reels__track--static">' + reels.map(reelCard).join("") + "</div></section>";
    }
    if (g.testimonios && g.testimonios.length) {
      html += '<section class="section section--tint"><div class="wrap">' + head("Testimonios", "Lo que dicen de " + g.nombre) +
        '<div class="quotes" style="--c:' + esc(g.color) + '">' + g.testimonios.map(function (q) {
          return '<figure class="quote"><blockquote>' + esc(q.texto) + "</blockquote><figcaption>" + esc(q.nombre) + (q.anio ? " · " + esc(q.anio) : "") + "</figcaption></figure>";
        }).join("") + "</div></div></section>";
    }
    if (g.patronos && g.patronos.length) {
      html += '<section class="section"><div class="wrap">' +
        head("Patronos", "Nuestros santos patronos", "Dos jóvenes que se tomaron en serio la santidad. Conocé su historia.") +
        '<div class="saints saints--2">' + g.patronos.map(santo).filter(Boolean).map(santoCard).join("") + "</div>" +
        '<div class="library-cta"><div><p class="eyebrow">Biblioteca HPP</p><h3>¿Querés aprender más?</h3>' +
        "<p>Lecturas, podcasts, pelis y santos ordenados por los cuatro pilares de formación: espiritual, intelectual, humano-afectivo y apostólico-moral.</p></div>" +
        '<a class="btn" href="recursos.html">Ir a la biblioteca</a></div></div></section>';
    }
    if (g.preguntas && g.preguntas.length) {
      html += '<section class="section" id="preguntas-' + esc(g.id) + '"><div class="wrap faq__wrap">' +
        head("Preguntas frecuentes", "Lo que más nos preguntan sobre " + g.nombre) +
        '<div class="faq">' + g.preguntas.map(function (q) { return "<details><summary>" + esc(q.p) + "</summary><p>" + esc(q.r) + "</p></details>"; }).join("") + "</div></div></section>";
    }
    if (g.aCompletar && g.aCompletar.length) {
      html += '<section class="section section--tight"><div class="wrap"><div class="todo">' + g.aCompletar.map(function (t) {
        return '<div class="todo__item"><span class="todo__tag">A completar</span><p>' + esc(t) + "</p></div>";
      }).join("") + "</div></div></section>";
    }
    html += '<section class="section section--tint"><div class="wrap">' +
      head("Inscripción", "Sumate a " + g.nombre) +
      '<div class="signup-box" style="--c:' + esc(g.color) + '"><div><p class="signup-box__state">' + badge(g) + "</p>" +
        "<p>" + esc(g.inscripcion.nota || (g.inscripcion.estado === "cerrada" ? "La inscripción abre en julio. Seguinos en Instagram para enterarte primero." : g.inscripcion.estado === "abierta" ? "Completá la inscripción y te contactamos para sumarte a un grupo." : "Consultá a la secretaría cómo sumarte.")) + "</p></div>" +
        '<div class="signup-box__cta">' + cta(g, "btn") + "</div></div>" +
      contacto() + "</div></section>";

    var next = (g.siguiente || []).map(grupo).filter(Boolean);
    html += '<section class="section"><div class="wrap">' + head("Después", g.siguienteTitulo || (next.length > 1 ? "Próximas etapas" : "Próxima etapa"), g.siguienteTexto) +
      '<div class="gcards gcards--' + next.length + '">' + next.map(function (n) { return groupCard(n); }).join("") + "</div>" +
      '<nav class="othergroups" aria-label="Otros grupos"><span class="muted">Otros grupos:</span>' +
        C.grupos.filter(function (o) { return o.id !== g.id; }).map(function (o) { return '<a href="' + esc(o.pagina) + '" style="--c:' + esc(o.color) + '"><span class="dot"></span>' + esc(o.nombre) + "</a>"; }).join("") +
      "</nav></div></section>";
    return html;
  };

  P.horarios = function () {
    return pagehead("Horarios", "Misas, confesiones y adoración", "Los horarios pueden cambiar en fechas especiales (Navidad, Semana Santa, verano). Los avisamos siempre en Instagram.") +
      '<section class="section section--first"><div class="wrap hours"><figure class="hours__img"><img src="img/misa.jpg" alt="Interior de la iglesia durante la misa" loading="lazy"></figure>' +
        '<div class="hours__text"><h2>Misas</h2>' + tabla(C.misas) + "<h2 class=\"hours__h2\">Confesiones</h2>" + tabla(C.confesiones) + "</div></div></section>" +
      '<section class="section section--tint"><div class="wrap">' + head("Abiertos a todos", "Adoración y misa de jóvenes") + encuentrosHtml() + "</div></section>";
  };

  P.recursos = function () {
    var B = C.biblioteca;
    var cuenta = function (id) { return B.recursos.filter(function (r) { return r.pilar === id; }).length; };
    var formatos = [], niveles = [];
    B.recursos.forEach(function (r) {
      if (formatos.indexOf(r.formato) < 0) formatos.push(r.formato);
      if (niveles.indexOf(r.nivel) < 0) niveles.push(r.nivel);
    });
    var orden = ["Inicial", "Intermedio", "Profundo"];
    niveles.sort(function (a, b) { return orden.indexOf(a) - orden.indexOf(b); });
    function chips(name, items, label) {
      return '<div class="filter" role="group" aria-label="' + esc(label) + '"><span class="filter__label">' + esc(label) + "</span>" +
        '<button type="button" class="fchip is-on" data-f="' + name + '" data-v="">Todos</button>' +
        items.map(function (it) { return '<button type="button" class="fchip" data-f="' + name + '" data-v="' + esc(it.v) + '">' + esc(it.t) + "</button>"; }).join("") + "</div>";
    }
    return pagehead("Recursos · Biblioteca temática HPP", "Biblioteca para crecer en la fe", "Armada por HPP para toda la comunidad: lecturas, podcasts, pelis y santos, ordenados en cuatro pilares de formación.") +
      '<section class="section section--first"><div class="wrap">' +
        '<div class="pillars4">' + B.pilares.map(function (p) {
          var n = cuenta(p.id);
          return '<button type="button" class="pillar" data-pilar="' + esc(p.id) + '" style="--c:' + esc(p.color) + '"><span class="pillar__name">' + esc(p.nombre) + '</span><span class="pillar__detail">' + esc(p.detalle) + '</span><span class="pillar__count">' + (n ? n + (n === 1 ? " recurso" : " recursos") : "Próximamente") + "</span></button>";
        }).join("") + "</div>" +
        '<p class="transversal__label">Recursos transversales, para los cuatro pilares</p>' +
        '<div class="transversal">' +
          '<a class="tcard" href="santos.html"><strong>Modelos de vida</strong><span>Diccionario de santos</span></a>' +
          '<button type="button" class="tcard" data-multimedia><strong>Multimedia</strong><span>Pelis, series y podcasts</span></button>' +
          '<a class="tcard" href="#buscador"><strong>Buscador</strong><span>Por tema, nivel y formato</span></a>' +
        "</div></div></section>" +
      '<section class="section section--tint" id="buscador"><div class="wrap">' + head("Buscador", "Encontrá un recurso") +
        '<div class="search"><label class="sr" for="q">Buscar</label><input id="q" type="search" placeholder="Buscar por título o tema" autocomplete="off"></div>' +
        '<div class="filters">' +
          chips("pilar", B.pilares.map(function (p) { return { v: p.id, t: p.nombre }; }), "Pilar") +
          chips("formato", formatos.map(function (f) { return { v: f, t: f }; }), "Formato") +
          chips("nivel", niveles.map(function (n) { return { v: n, t: n }; }), "Nivel") +
        "</div>" +
        '<p class="results__count" id="res-count" aria-live="polite"></p><div class="lib" id="lib"></div>' +
      "</div></section>" +
      '<section class="section"><div class="wrap">' + head("Modelos de vida", "Santos queridos por la comunidad", "Más de 60 santos y beatos con su fiesta, su historia y sus datos.", '<a class="link" href="santos.html">Abrir el diccionario de santos →</a>') +
        '<div class="saints">' + (C.santos || []).slice(0, 3).map(santoCard).join("") + "</div></div></section>" +
      '<section class="section section--tight"><div class="wrap"><a class="ac-teaser" href="academia.html">' + isoSVG("ac-teaser__iso") +
        '<span class="ac-teaser__txt"><span class="ac-rotulo ac-rotulo--claro">Academia</span><strong>Frassati</strong><em>Hacia lo alto</em></span>' +
        '<span class="ac-teaser__desc">Cursos cortos con examen y certificado: los sacramentos, la misa parte por parte, cómo ser un buen coordinador y más. Cada curso es una cumbre.</span>' +
        '<span class="ac-teaser__go">Empezar a subir ' + ICON.right + "</span></a></div></section>";
  };

  /* Diccionario de santos: todos los santos del juego, con su ficha completa cuando existe */
  var PREFIJO = /^(Santos|Santo|Santa|San|Beato|Beata|Venerable)\s+/;
  function claveOrden(n) { return sinTildes(n.replace(PREFIJO, "")).toLowerCase(); }
  P.santos = function () {
    var J = window.JUEGOS;
    if (!J) return pagehead("Recursos", "Diccionario de santos", "") + '<section class="section"><div class="wrap"><p class="muted">No se pudo cargar el diccionario.</p></div></section>';
    var lista = J.santos.slice().sort(function (a, b) { return claveOrden(a.n) < claveOrden(b.n) ? -1 : 1; });
    var letras = [];
    lista.forEach(function (s) { var l = claveOrden(s.n)[0].toUpperCase(); if (letras.indexOf(l) < 0) letras.push(l); });
    var tarjeta = function (s) {
      var f = fichaDe(s.ficha), letra = claveOrden(s.n)[0].toUpperCase();
      var buscable = sinTildes([s.n, s.fiesta].concat(s.p, f ? [f.resumen, f.lugar, f.vida].concat(f.texto, f.frases || []) : []).join(" ")).toLowerCase();
      return '<details class="dic__item" id="' + esc(s.id) + '" data-g="' + s.g + '" data-letra="' + letra + '" data-ficha="' + (f ? 1 : 0) + '" data-txt="' + esc(buscable) + '"' + (f ? ' style="--c:' + esc(f.color) + '"' : "") + ">" +
        '<summary><img class="dic__foto" src="' + esc(s.foto) + '" alt="" loading="lazy">' +
          '<span class="dic__sum"><strong>' + esc(s.n) + "</strong>" +
          (s.fiesta ? '<small>Fiesta: ' + esc(s.fiesta) + "</small>" : "") +
          '<em>«' + esc(s.p[4]) + "»</em></span>" + ICON.down + "</summary>" +
        '<div class="dic__body">' +
          (f ? '<p class="lead">' + esc(f.resumen) + "</p>" +
               '<dl class="dic__facts"><div><dt>Vida</dt><dd>' + esc(f.vida) + "</dd></div><div><dt>Lugar</dt><dd>" + esc(f.lugar) + "</dd></div>" + (f.etiqueta ? "<div><dt>En Sagrada</dt><dd>" + esc(f.etiqueta) + "</dd></div>" : "") + "</dl>" +
               f.texto.map(function (p) { return '<p class="prose">' + esc(p) + "</p>"; }).join("") +
               (f.frases || []).map(function (q) { return '<blockquote class="saint-full__quote">' + esc(q) + "</blockquote>"; }).join("") : "") +
          '<p class="dic__label">' + (f ? "Así se presenta en el juego «¿Quién soy?»" : "En primera persona, como en el juego «¿Quién soy?»") + "</p>" +
          '<ol class="dic__datos">' + s.p.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol>" +
          '<p class="dic__links"><a class="link" href="juegos.html#diarios">Jugar al Santo del día →</a>' + (s.fiesta ? ' <a class="link" href="calendario.html">Ver su fiesta en el calendario →</a>' : "") + "</p>" +
        "</div></details>";
    };
    return pagehead("Recursos · Modelos de vida", "Diccionario de santos", "Los " + lista.length + " santos y beatos del juego «¿Quién soy?»: sus fiestas, su historia y lo que los hace únicos.") +
      '<section class="section section--first"><div class="wrap">' +
        '<div class="search search--santos"><label class="sr" for="q-santos">Buscar un santo</label><input id="q-santos" type="search" placeholder="Buscar por nombre, país, fiesta o tema (ej. mártir, Argentina, jóvenes, agosto)" autocomplete="off"></div>' +
        '<div class="filter dic__filtros" role="group" aria-label="Filtrar">' +
          '<button type="button" class="fchip is-on" data-dic="todos">Todos</button>' +
          '<button type="button" class="fchip" data-dic="f">Santas</button>' +
          '<button type="button" class="fchip" data-dic="m">Santos</button>' +
          '<button type="button" class="fchip" data-dic="ficha">Con historia completa</button>' +
        "</div>" +
        '<nav class="dic__letras" aria-label="Letras">' + letras.map(function (l) { return '<button type="button" data-letra="' + l + '">' + l + "</button>"; }).join("") + "</nav>" +
        '<p class="results__count" id="santos-count" aria-live="polite"></p>' +
        '<div class="dic" id="dic">' + lista.map(tarjeta).join("") + "</div>" +
        '<p class="muted saint-empty" id="santos-vacio" hidden>No encontramos santos con esa búsqueda. Probá con otra palabra.</p>' +
        '<p class="back"><a class="link" href="recursos.html">← Volver a la biblioteca</a> · <a class="link" href="calendario.html">Ver sus fiestas en el calendario</a></p>' +
      "</div></section>";
  };

  P.calendario = function () {
    var leyenda = C.grupos.map(function (g) { return '<span style="--c:' + esc(g.color) + '"><span class="dot"></span>' + esc(g.nombre) + "</span>"; }).join("") +
      '<span style="--c:#4e5f58"><span class="dot"></span>Para todos</span><span class="leg-rutina"><span class="dot"></span>Todas las semanas</span><span class="leg-santo"><span class="dot"></span>Fiestas de santos</span><span class="leg-lit">La franja de color arriba de cada día es el color litúrgico</span>';
    return pagehead("Calendario", "Lo que se viene", "Retiros, misiones, peregrinaciones, inscripciones y los encuentros de todas las semanas.") +
      '<section class="section section--first"><div class="wrap">' +
        liturgicoHtml(new Date()) +
        '<div class="mcal" id="mcal">' +
          '<div class="mcal__bar"><h2 class="mcal__title" id="mcal-title" aria-live="polite"></h2>' +
            '<div class="mcal__nav"><button type="button" class="mcal__today" id="mcal-hoy">Hoy</button>' +
            '<button type="button" class="round" id="mcal-prev" aria-label="Mes anterior">' + ICON.left + "</button>" +
            '<button type="button" class="round" id="mcal-next" aria-label="Mes siguiente">' + ICON.right + "</button></div></div>" +
          '<div class="mcal__filtros" role="group" aria-label="Qué mostrar"><span class="filter__label">Mostrar</span>' +
            '<button type="button" class="fchip" data-tipo="especiales">Eventos especiales</button>' +
            '<button type="button" class="fchip" data-tipo="semanales">Actividades semanales</button>' +
            '<button type="button" class="fchip" data-tipo="santos">Santos</button></div>' +
          '<div class="mcal__dows" aria-hidden="true"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div>' +
          '<div class="mcal__weeks" id="mcal-weeks"><p class="muted mcal__loading">Cargando eventos…</p></div>' +
        "</div>" +
        '<div class="mcal__legend">' + leyenda + "</div>" +
        '<div class="mcal__list"><h3 class="agenda__month" id="mcal-list-title"></h3><ul class="agenda__list" id="mcal-list"></ul></div>' +
        '<p class="cal__note">Las fechas pueden cambiar: confirmalas siempre en Instagram. Tocá un evento para ver el detalle.</p>' +
      "</div></section>";
  };

  P.juegos = function () {
    return pagehead("Juegos", "Jugá y aprendé", "Cuatro desafíos nuevos cada día, iguales para todos, un ranking parroquial y un quiz para jugar cuando quieras.") +
      '<section class="section section--first" id="diarios"><div class="wrap">' +
        head("Desafíos del día", "Uno nuevo cada día", "Se juegan una vez por día. Volvé mañana para sumar a tu racha.") +
        '<div id="tip-inicio"></div>' +
        '<div class="dailies"><div class="daily" id="diario-santo"><p class="muted">Cargando…</p></div>' +
        '<div class="daily" id="diario-versiculo"><p class="muted">Cargando…</p></div>' +
        '<div class="daily daily--wide" id="diario-conex"><p class="muted">Cargando…</p></div>' +
        '<div class="daily daily--wide" id="diario-cruci"><p class="muted">Cargando…</p></div></div>' +
      "</div></section>" +
      '<section class="section section--tint" id="ranking-seccion"><div class="wrap">' +
        head("Ranking parroquial", "¿Quién suma más?", "Cada desafío del día suma hasta 100 puntos. Entrá con tu código y competí con toda la comunidad.") +
        '<div id="rk-podio"></div><div class="rk" id="ranking"><p class="muted">Cargando…</p></div></div></section>' +
      '<section class="section" id="quiz-seccion"><div class="wrap">' +
        head("Quiz", "¿Cuánto sabés?", "Diez preguntas sobre la Biblia, los santos, los sacramentos y nuestra comunidad. Sumás más puntos si respondés rápido.") +
        '<div class="quiz" id="quiz" aria-live="polite"></div></div></section>';
  };

  P.academia = function () {
    return '<section class="ac-hero"><div class="wrap ac-hero__in">' +
        '<div class="ac-hero__marca">' + isoSVG("ac-hero__iso") + '<p class="ac-rotulo ac-rotulo--claro">Academia</p><h1 class="ac-h1">Frassati</h1><p class="ac-lema">Hacia lo alto</p></div>' +
        '<div class="ac-hero__txt"><p>La Academia Frassati es el espacio de formación de Jóvenes Sagrada Familia. Cada curso es una cumbre: leés, rendís y, si llegás arriba, te llevás tu certificado.</p>' +
        "<p>Lleva el nombre de san Pier Giorgio Frassati (1901–1925): estudiante, alpinista y amigo de los pobres de Turín. Su lema era <em>Verso l'alto</em>: hacia lo alto.</p></div>" +
      "</div></section>" +
      '<section class="ac-cuerpo"><div class="wrap"><div id="formacion"><p class="ac-ayuda">Cargando…</p></div></div></section>' +
      '<section class="ac-cita"><div class="wrap ac-cita__in">' + selloSVG("ac-sello") +
        '<div><p class="ac-cita__txt">«Vivir sin fe, sin un patrimonio que defender, sin luchar por la verdad, no es vivir, sino ir tirando.»</p><p class="ac-rotulo">San Pier Giorgio Frassati</p></div>' +
      "</div></section>";
  };

  P.privacidad = function () {
    var sec = function (t, ps) { return "<h2>" + t + "</h2>" + ps.map(function (x) { return "<p>" + x + "</p>"; }).join(""); };
    var mail = '<a href="mailto:academiafrassati@gmail.com">academiafrassati@gmail.com</a>';
    return pagehead("Privacidad", "Política de privacidad", "Qué datos guardamos, para qué y cómo podés pedir que los borremos.") +
      '<section class="section section--first"><div class="wrap legal">' +
        '<p class="muted">Última actualización: 10 de octubre de 2026.</p>' +
        sec("Quiénes somos", ["Esta web es de Jóvenes Sagrada Familia, la pastoral de jóvenes de la Parroquia Sagrada Familia (Nordelta, Buenos Aires), e incluye la Academia Frassati, su espacio de formación. Para cualquier consulta sobre tus datos escribinos a " + mail + "."]) +
        sec("Qué datos guardamos", [
          "<strong>Si no iniciás sesión:</strong> no guardamos nada sobre vos. Tu progreso en los juegos (rachas, récords, partidas del día) y en los cursos queda solo en tu navegador, en tu celular o compu. No lo vemos ni sale de tu dispositivo.",
          "<strong>Si iniciás sesión con Google o con un código del ranking:</strong> guardamos tu nombre y tu mail de Google (o el nombre que te asignamos), el nombre que aparece en el ranking, tu grupo, los puntos de los desafíos diarios y los cursos de la Academia que aprobaste, con su fecha y nota.",
          "<strong>Nunca</strong> recibimos tu contraseña: el inicio de sesión lo hace Google. No pedimos teléfono, documento, dirección ni fecha de nacimiento."]) +
        sec("Para qué los usamos", ["Solo para que puedas entrar, mostrar el ranking parroquial y registrar tus cursos y certificados. No los vendemos ni los compartimos, no hacemos publicidad y no usamos cookies de seguimiento ni herramientas de análisis que te identifiquen."]) +
        sec("Qué es público", ["En el ranking se muestran únicamente el nombre visible que elegimos con vos, tu grupo, tus puntos y tus insignias. Tu mail nunca se muestra en la web."]) +
        sec("Dónde se guardan y quién los ve", ["En una planilla privada de Google Drive de la cuenta de la Academia Frassati. Solo acceden los administradores de la web de la parroquia. Google procesa esos datos según su propia política de privacidad."]) +
        sec("Menores de edad", ["Muchos de nuestros participantes son menores. Por eso guardamos lo mínimo indispensable, y la participación en el ranking y la Academia se hace con conocimiento de la parroquia. Si sos madre, padre o tutor y querés consultar o borrar los datos de tu hijo o hija, escribinos."]) +
        sec("Tus derechos", ["Podés pedir en cualquier momento ver qué datos tenemos tuyos, corregirlos o borrarlos, escribiendo a " + mail + ". Lo hacemos sin costo. Estos derechos están previstos en la Ley 25.326 de Protección de los Datos Personales. La Agencia de Acceso a la Información Pública es el órgano de control de esa ley."]) +
        sec("Cuánto tiempo los guardamos", ["Mientras participes. Si dejás de participar o nos lo pedís, borramos tus datos del ranking y de la Academia."]) +
        sec("Cambios", ["Si cambiamos esta política, vamos a actualizar la fecha de arriba."]) +
      "</div></section>";
  };

  P.sumate = function () {
    return pagehead("Sumate", "Cómo sumarte", "El estado de todas las inscripciones, en un solo lugar.") +
      '<section class="section section--first"><div class="wrap">' +
        '<div class="notice">' + ICON.info + "<p>" + esc(C.avisoInscripciones) + "</p></div>" +
        '<ul class="signup">' + C.grupos.map(function (g) {
          return '<li class="signup__row" style="--c:' + esc(g.color) + '"><div class="signup__name"><span class="dot"></span><a href="' + esc(g.pagina) + '"><strong>' + esc(g.nombre) + "</strong></a><span class=\"muted\">" + esc(g.edades) + " · " + esc(g.cuando) + "</span></div>" +
            '<div class="signup__state">' + badge(g) + cta(g) + "</div></li>";
        }).join("") + "</ul>" + contacto("Consultas") + "</div></section>" +
      (C.sacramentos ? '<section class="section section--tight" id="sacramentos"><div class="wrap"><div class="sacr">' +
        '<figure class="sacr__img"><img src="' + esc(C.sacramentos.imagen) + '" alt="Bautismo de una joven en la parroquia" loading="lazy"></figure>' +
        '<div class="sacr__text"><p class="eyebrow">Sacramentos</p><h2>' + esc(C.sacramentos.titulo) + "</h2><p>" + esc(C.sacramentos.texto) + "</p>" +
        '<p class="contact__phone contact__phone--dark">' + ICON.phone + "<span>" + esc(C.secretaria.telefono) + "</span></p>" +
        ext(C.secretaria.whatsapp, "btn", "Consultar en la secretaría") + "</div></div></div></section>" : "") +
      '<section class="section section--tint" id="preguntas"><div class="wrap faq__wrap">' + head("Preguntas frecuentes", "Lo que más nos preguntan") +
        '<div class="faq">' + C.preguntas.map(function (q) { return "<details><summary>" + esc(q.p) + "</summary><p>" + esc(q.r) + "</p></details>"; }).join("") + "</div></div></section>";
  };

  /* 404: muestra img/404-horizontal.webp (compu) o img/404-vertical.webp (celu); si no están, solo el texto */
  P.noencontrado = function () {
    return '<section class="section section--first nf"><div class="wrap">' +
      '<picture class="nf__img"><source media="(max-width: 700px)" srcset="img/404-vertical.webp">' +
        '<img src="img/404-horizontal.webp" alt="" onerror="this.parentNode.remove()"></picture>' +
      '<h1>Esta página no existe</h1><p class="muted">Puede que el link esté mal escrito o que la página se haya movido.</p>' +
      '<div class="hero__ctas hero__ctas--center"><a class="btn" href="index.html">Volver al inicio</a><a class="btn btn--ghost" href="calendario.html">Ver el calendario</a></div>' +
      "</div></section>";
  };

  if (PAGE === "academia") document.body.classList.add("pg-academia");
  var main = $("page");
  if (activeGroup && grupo(activeGroup)) {
    var G = grupo(activeGroup);
    main.innerHTML = P.grupo(G);
    document.title = G.nombre + " · Jóvenes Sagrada Familia";
  } else {
    main.innerHTML = (P[PAGE] || P.inicio)();
  }

  /* ---------- inicio: podio de la semana pasada ---------- */
  if ($("hoyj-podio") && C.ranking && C.ranking.url) {
    fetch(C.ranking.url + (C.ranking.url.indexOf("?") < 0 ? "?" : "&") + "accion=ranking").then(function (r) { return r.json(); })
      .then(function (d) { if (d && d.ok) $("hoyj-podio").innerHTML = podioHtml(d.podio); }, function () {});
  }

  /* ---------- calendario: completar cuando llegan los datos ---------- */
  if ($("agenda-home") || $("mcal")) {
    cargarEventos(function (crudos) {
      var rec = (C.calendario || {}).recurrentes || [];
      var hoy = new Date(); hoy.setHours(0, 0, 0, 0);

      if ($("agenda-home")) {
        /* en el inicio: sin los semanales, y cada evento que se repite aparece una sola vez */
        var vistos = {}, home = ocurrencias(crudos, rec, hoy, new Date(hoy.getFullYear() + 2, hoy.getMonth(), 1)).filter(function (x) {
          if (x.semanal || x.santo) return false;
          if (!x.e.regla) return true;
          if (vistos[x.e.titulo]) return false;
          return (vistos[x.e.titulo] = true);
        }).slice(0, 4);
        $("agenda-home").innerHTML = home.length
          ? '<ul class="agenda__list">' + home.map(function (x) { return eventoHtml(x, true); }).join("") + "</ul>"
          : agendaHtml([]);
      }

      if ($("mcal")) iniciarGrilla(crudos, rec, hoy);
    });
  }

  function iniciarGrilla(crudos, rec, hoy) {
    var actual = new Date(hoy.getFullYear(), hoy.getMonth(), 1), vista = [];
    var dlg = document.createElement("dialog");
    dlg.className = "evdlg";
    dlg.innerHTML = '<div class="evdlg__box"><button type="button" class="viewer__close evdlg__close" aria-label="Cerrar">×</button><ul class="agenda__list" id="evdlg-body"></ul></div>';
    document.body.appendChild(dlg);
    dlg.querySelector(".evdlg__close").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });

    /* filtros: qué tipos de eventos se ven (se recuerda en este navegador) */
    var VER = { especiales: true, semanales: true, santos: true };
    try { var g0 = JSON.parse(localStorage.getItem("cal:ver")); if (g0) for (var t0 in VER) if (typeof g0[t0] === "boolean") VER[t0] = g0[t0]; } catch (e) {}
    function tipoDe(x) { return x.santo ? "santos" : x.semanal ? "semanales" : "especiales"; }
    function pintarFiltros() {
      document.querySelectorAll(".mcal__filtros .fchip").forEach(function (b) {
        var on = VER[b.getAttribute("data-tipo")];
        b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on ? "true" : "false");
      });
    }
    document.querySelector(".mcal__filtros").addEventListener("click", function (ev) {
      var b = ev.target.closest(".fchip"); if (!b) return;
      var t = b.getAttribute("data-tipo"); VER[t] = !VER[t];
      try { localStorage.setItem("cal:ver", JSON.stringify(VER)); } catch (e) {}
      pintarFiltros(); pintar();
    });
    pintarFiltros();

    function colorDe(x) {
      if (x.e.color) return x.e.color;
      var clave = String(x.e.grupo || "").trim().toLowerCase(), g = grupo(ALIAS[clave] || clave);
      return g ? g.color : "#4e5f58";
    }
    function dia(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function idx(d, inicio) { return Math.round((dia(d) - inicio) / 864e5); }

    function pintar() {
      var y = actual.getFullYear(), m = actual.getMonth();
      var primero = new Date(y, m, 1), ultimo = new Date(y, m + 1, 0);
      var inicio = new Date(primero); inicio.setDate(1 - ((primero.getDay() + 6) % 7));
      var fin = new Date(ultimo); fin.setDate(ultimo.getDate() + (7 - ((ultimo.getDay() + 6) % 7) - 1));
      vista = ocurrencias(crudos, rec, inicio, fin).filter(function (x) { return VER[tipoDe(x)]; });
      $("mcal-title").textContent = MESES[m].charAt(0).toUpperCase() + MESES[m].slice(1) + " " + y;

      var semanas = Math.round((fin - inicio) / 864e5 + 1) / 7, html = "";
      for (var s = 0; s < semanas; s++) {
        var ini = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + s * 7);
        var finS = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + 6);
        var celdas = "";
        for (var c = 0; c < 7; c++) {
          var d = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + c);
          var cls = "mcal__day" + (d.getMonth() !== m ? " is-out" : "") + (d.getTime() === hoy.getTime() ? " is-today" : "");
          var LT = tiempoLiturgico(d);
          celdas += '<div class="' + cls + '" style="grid-column:' + (c + 1) + ';--lc:' + COLORES_LIT[LT.color].hex + '" title="' + esc(LT.tiempo + (LT.dia ? ' · ' + LT.dia : '')) + '"><span class="mcal__num">' + d.getDate() + (d.getTime() === hoy.getTime() ? ' <em>hoy</em>' : "") + "</span></div>";
        }
        /* segmentos de eventos en esta semana, repartidos en carriles */
        var segs = [];
        vista.forEach(function (x, i) {
          var a = x.d, b = x.fin || (x.soloMes ? null : x.d);
          if (x.soloMes) return; /* los de "solo mes" van en la lista, no en la grilla */
          if (b < ini || a > finS) return;
          var c1 = Math.max(0, idx(a, ini)), c2 = Math.min(6, idx(b, ini));
          segs.push({ i: i, x: x, c1: c1, c2: c2, cortaIzq: a < ini, cortaDer: b > finS });
        });
        segs.sort(function (p, q) { return (q.c2 - q.c1) - (p.c2 - p.c1) || p.c1 - q.c1 || (p.x.semanal ? 1 : 0) - (q.x.semanal ? 1 : 0); });
        var carriles = [];
        segs.forEach(function (sg) {
          for (var l = 0; ; l++) {
            carriles[l] = carriles[l] || [];
            var libre = true;
            for (var k = sg.c1; k <= sg.c2; k++) if (carriles[l][k]) { libre = false; break; }
            if (libre) { for (k = sg.c1; k <= sg.c2; k++) carriles[l][k] = true; sg.l = l; break; }
          }
        });
        var barras = segs.map(function (sg) {
          var x = sg.x, txt = (x.e.hora && !x.fin ? x.e.hora + " · " : "") + x.e.titulo;
          return '<button type="button" class="mcal__ev' + (x.semanal ? " is-rutina" : "") + (x.santo ? " is-santo" : "") + (sg.cortaIzq ? " cut-l" : "") + (sg.cortaDer ? " cut-r" : "") + '" data-ev="' + sg.i + '" ' +
            'style="--c:' + esc(colorDe(x)) + ";grid-column:" + (sg.c1 + 1) + " / " + (sg.c2 + 2) + ";grid-row:" + (sg.l + 2) + '" title="' + esc(txt) + '">' +
            '<span class="mcal__evtxt">' + esc(txt) + "</span></button>";
        }).join("");
        html += '<div class="mcal__week" style="--lanes:' + carriles.length + '">' + celdas + barras + "</div>";
      }
      $("mcal-weeks").innerHTML = html;

      /* lista del mes (se ve en celular y sirve de resumen) */
      var delMes = vista.filter(function (x) { return (x.fin || x.d) >= primero && x.d <= ultimo; });
      $("mcal-list-title").textContent = "Eventos de " + MESES[m] + " " + y;
      $("mcal-list").innerHTML = delMes.length ? delMes.map(function (x) { return eventoHtml(x, false, true); }).join("") : '<li class="muted">No hay eventos cargados este mes.</li>';
      $("mcal-hoy").disabled = y === hoy.getFullYear() && m === hoy.getMonth();
    }

    $("mcal-prev").addEventListener("click", function () { actual = new Date(actual.getFullYear(), actual.getMonth() - 1, 1); pintar(); });
    $("mcal-next").addEventListener("click", function () { actual = new Date(actual.getFullYear(), actual.getMonth() + 1, 1); pintar(); });
    $("mcal-hoy").addEventListener("click", function () { actual = new Date(hoy.getFullYear(), hoy.getMonth(), 1); pintar(); });
    $("mcal-weeks").addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-ev]"); if (!b) return;
      var x = vista[+b.getAttribute("data-ev")];
      $("evdlg-body").innerHTML = eventoHtml(x, true, true);
      if (dlg.showModal) dlg.showModal();
    });
    pintar();
  }

  /* ---------- biblioteca: buscador y filtros ---------- */
  if ($("lib")) {
    var B = C.biblioteca, F = { pilar: "", formato: "", nivel: "", multimedia: false };
    var pil = {}; B.pilares.forEach(function (p) { pil[p.id] = p; });
    var MULTI = ["Podcast", "Video", "Peli o serie", "Música"];
    var PAGINA = 12, limite = PAGINA;
    $("lib").insertAdjacentHTML("afterend", '<button type="button" class="btn btn--ghost lib__more" id="lib-more" hidden></button>');
    $("lib-more").addEventListener("click", function () { limite += 24; pintar(); });
    var norm = function (s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); };
    var pintar = function () {
      var q = norm($("q").value);
      var res = B.recursos.filter(function (r) {
        return (!F.pilar || r.pilar === F.pilar) && (!F.formato || r.formato === F.formato) && (!F.nivel || r.nivel === F.nivel) &&
          (!F.multimedia || MULTI.indexOf(r.formato) >= 0) &&
          (!q || norm(r.titulo + " " + r.detalle + " " + (pil[r.pilar] || {}).nombre + " " + r.formato + " " + (r.links || []).map(function (l) { return l.texto; }).join(" ") + " " + (Array.isArray(r.pedir) ? r.pedir.join(" ") : "")).indexOf(q) >= 0);
      });
      $("res-count").textContent = res.length + (res.length === 1 ? " recurso" : " recursos");
      var resto = Math.max(0, res.length - limite);
      $("lib-more").hidden = !resto;
      $("lib-more").textContent = "Ver " + resto + " más";
      $("lib").innerHTML = res.length ? res.slice(0, limite).map(function (r) {
        var p = pil[r.pilar] || {};
        var inner = (r.imagen ? '<img class="lib__poster" src="' + esc(r.imagen) + '" alt="" loading="lazy">' : "") + '<p class="lib__tags"><span class="lib__pilar"><span class="dot"></span>' + esc(p.nombre) + "</span><span>" + esc(r.formato) + "</span><span>" + esc(r.nivel) + "</span></p>" +
          "<h3>" + esc(r.titulo) + "</h3><p>" + esc(r.detalle) + "</p>" + (r.link ? '<span class="link">Abrir →</span>' : "");
        var botones = (r.links || []).filter(function (l) { return l.url; });
        /* pedir: true (el recurso entero) o una lista de títulos que no se publican: se piden por Instagram */
        var pedir = r.pedir ? '<div class="lib__pedir">' + (Array.isArray(r.pedir) ? '<p class="lib__pedir-label">También en la biblioteca, a pedido</p><ul>' + r.pedir.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" : '<p class="lib__pedir-label">Para acceder</p>') +
          ext(C.redes.instagram, "link", (Array.isArray(r.pedir) ? "Pedilos" : "Pedilo") + " por Instagram →") + "</div>" : "";
        if (r.links || r.pedir) {
          inner = inner.replace('<span class="link">Abrir →</span>', "");
          return '<div class="lib__item' + (r.imagen ? " has-poster" : "") + '" style="--c:' + esc(p.color) + '">' + inner +
            (botones.length ? '<div class="lib__links">' + botones.map(function (l) { return ext(l.url, "link", esc(l.texto) + " →"); }).join("") + "</div>" : "") + pedir + "</div>";
        }
        return r.link ? '<a class="lib__item' + (r.imagen ? " has-poster" : "") + '" style="--c:' + esc(p.color) + '" href="' + esc(r.link) + '" target="_blank" rel="noopener">' + inner + "</a>"
                      : '<div class="lib__item' + (r.imagen ? " has-poster" : "") + '" style="--c:' + esc(p.color) + '">' + inner + "</div>";
      }).join("") : '<p class="muted">No hay recursos con esos filtros todavía.</p>';
      document.querySelectorAll(".fchip").forEach(function (b) {
        b.classList.toggle("is-on", F[b.getAttribute("data-f")] === b.getAttribute("data-v"));
      });
      document.querySelectorAll(".pillar").forEach(function (b) { b.classList.toggle("is-on", F.pilar === b.getAttribute("data-pilar")); });
      var mm = document.querySelector("[data-multimedia]"); if (mm) mm.classList.toggle("is-on", F.multimedia);
    };
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest(".fchip, .pillar, [data-multimedia]");
      if (!b) return;
      if (b.classList.contains("fchip")) { F[b.getAttribute("data-f")] = b.getAttribute("data-v"); if (b.getAttribute("data-f") === "formato") F.multimedia = false; }
      else if (b.classList.contains("pillar")) { var id = b.getAttribute("data-pilar"); F.pilar = F.pilar === id ? "" : id; $("buscador").scrollIntoView({ behavior: "smooth" }); }
      else { F.multimedia = !F.multimedia; F.formato = ""; $("buscador").scrollIntoView({ behavior: "smooth" }); }
      limite = PAGINA;
      pintar();
    });
    $("q").addEventListener("input", function () { limite = PAGINA; pintar(); });
    pintar();
  }

  /* ---------- juegos diarios: Santo, Versículo, Conexiones, Crucigrama y ranking ---------- */
  if (window.JUEGOS && ($("diario-santo") || $("diario-versiculo") || $("diario-cruci") || $("diario-conex"))) {
    var JG = window.JUEGOS;
    var dosD = function (n) { return (n < 10 ? "0" : "") + n; };
    var claveFecha = function (d) { return d.getFullYear() + "-" + dosD(d.getMonth() + 1) + "-" + dosD(d.getDate()); };
    var HOY = new Date(); HOY.setHours(0, 0, 0, 0);
    var AYER = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate() - 1);
    var ini = parseFecha(JG.inicio).d;
    var NUM = Math.max(1, Math.round((HOY - ini) / 864e5) + 1);
    var semilla = function (s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
    var azar = function (seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
    var mezclarCon = function (arr, rnd) { arr = arr.slice(); for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; };
    /* Las listas ya vienen en el orden de salida (herramientas/datos/orden.json): lo nuevo se suma al final,
       así agregar contenido no cambia el desafío de hoy. Cuando se recorre todo, la vuelta siguiente se mezcla. */
    var delDia = function (lista, sal) {
      var n = lista.length, ciclo = Math.floor((NUM - 1) / n), pos = (NUM - 1) % n;
      if (ciclo === 0) return { item: lista[pos], idx: pos };
      var orden = mezclarCon(lista.map(function (_, i) { return i; }), azar(semilla(sal + ":" + ciclo)));
      return { item: lista[orden[pos]], idx: orden[pos] };
    };
    var guardar = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
    var leer = function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
    var sumarRacha = function (juego) {
      var r = leer("racha:" + juego) || { ultimo: "", n: 0 }, hoy = claveFecha(HOY);
      if (r.ultimo === hoy) return r.n;
      r.n = r.ultimo === claveFecha(AYER) ? r.n + 1 : 1; r.ultimo = hoy; guardar("racha:" + juego, r); return r.n;
    };
    var verRacha = function (juego) {
      var r = leer("racha:" + juego);
      return r && (r.ultimo === claveFecha(HOY) || r.ultimo === claveFecha(AYER)) ? r.n : 0;
    };
    var urlJuegos = location.href.split("#")[0].split("?")[0];
    var cuentaRegresiva = function () {
      var m = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate() + 1) - new Date();
      var h = Math.floor(m / 36e5), min = Math.floor(m % 36e5 / 6e4);
      return "Próximo desafío en " + (h ? h + " h " : "") + min + " min";
    };
    var compartirHtml = function (texto) {
      return '<div class="daily__share"><button type="button" class="btn btn--small" data-copiar="' + esc(texto) + '">Copiar resultado</button>' +
        ext("https://wa.me/?text=" + encodeURIComponent(texto), "btn btn--small btn--ghost", "Mandar por WhatsApp") +
        '<span class="daily__copiado" hidden>¡Copiado! Pegalo en el grupo.</span></div>';
    };
    var pieHtml = function (juego) {
      var r = verRacha(juego);
      return '<p class="daily__foot">' + (r ? '<span class="daily__racha">🔥 Racha de ' + r + (r === 1 ? " día" : " días") + "</span>" : "") +
        '<span class="daily__next" data-reloj>' + cuentaRegresiva() + "</span></p>";
    };
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-copiar]"); if (!b) return;
      var txt = b.getAttribute("data-copiar"), aviso = b.parentNode.querySelector(".daily__copiado");
      var ok = function () { aviso.hidden = false; setTimeout(function () { aviso.hidden = true; }, 2500); };
      var plan_b = function () {
        var ta = document.createElement("textarea"); ta.value = txt; ta.className = "daily__ta"; b.parentNode.appendChild(ta); ta.select();
        try { if (document.execCommand("copy")) ok(); } catch (e) {}
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, plan_b); else plan_b();
    });
    setInterval(function () { document.querySelectorAll("[data-reloj]").forEach(function (el) { el.textContent = cuentaRegresiva(); }); }, 30000);

    /* --- Santo del día --- */
    if ($("diario-santo")) {
      var SD = delDia(JG.santos, "santo"), S = SD.item, KS = "diario:santo:" + claveFecha(HOY);
      var rndS = azar(semilla("opciones-santo:" + NUM));
      /* las opciones incorrectas son del mismo género, para que las pistas no regalen la respuesta */
      var otrosS = mezclarCon(JG.santos.filter(function (x) { return x !== S && (!S.g || x.g === S.g); }), rndS).slice(0, 3).map(function (x) { return x.n; });
      var opcionesS = mezclarCon([S.n].concat(otrosS), rndS);
      var est = leer(KS) || { k: 1, malas: [], fin: false, puntos: 0 };
      var cont1 = $("diario-santo");
      var pintarSanto = function () {
        var cab = '<div class="daily__head"><p class="eyebrow">Santo del día · #' + NUM + '</p><h3>¿Quién soy?</h3></div>';
        if (!est.fin) {
          cont1.innerHTML = cab +
            '<ol class="daily__pistas">' + S.p.slice(0, est.k).map(function (p, i) { return '<li class="' + (i === est.k - 1 ? "is-new" : "") + '">' + esc(p) + "</li>"; }).join("") + "</ol>" +
            '<p class="daily__hint">Pista ' + est.k + " de 5 · " + (6 - est.k) + (6 - est.k === 1 ? " punto" : " puntos") + " si acertás ahora</p>" +
            '<div class="daily__opts">' + opcionesS.map(function (o) {
              var mala = est.malas.indexOf(o) >= 0;
              return '<button type="button" class="quiz__opt' + (mala ? " is-bad" : "") + '" data-santo="' + esc(o) + '"' + (mala ? " disabled" : "") + "><span>" + esc(o) + "</span></button>";
            }).join("") + "</div>" +
            (est.k < 5 ? '<button type="button" class="link daily__more" data-pista>Ver otra pista (−1 punto)</button>' : "") +
            pieHtml("santo");
          return;
        }
        var estrellas = "⭐".repeat(est.puntos) + "▫️".repeat(5 - est.puntos);
        var texto = "Santo del día #" + NUM + " 🕊️\n" + estrellas + "\nLo adiviné con " + est.k + (est.k === 1 ? " pista" : " pistas") +
          (verRacha("santo") > 1 ? " · Racha de " + verRacha("santo") + " días 🔥" : "") + "\n" + urlJuegos;
        cont1.innerHTML = cab +
          '<div class="daily__reveal">' + (S.foto ? '<img class="daily__foto" src="' + esc(S.foto) + '" alt="' + esc(S.n) + '">' : "") +
          '<div><p class="daily__result">' + estrellas + "</p><h4>" + esc(S.n) + "</h4>" +
          "<p>Lo adivinaste con <strong>" + est.k + (est.k === 1 ? " pista" : " pistas") + "</strong>: " + est.puntos + (est.puntos === 1 ? " punto." : " puntos.") + "</p>" +
          (S.ficha ? '<a class="link" href="santos.html#' + esc(S.ficha) + '">Conocé su historia →</a>' : "") + "</div></div>" +
          '<details class="daily__todas"><summary>Ver las 5 pistas</summary><ol>' + S.p.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ol></details>" +
          compartirHtml(texto) + pieHtml("santo");
      };
      cont1.addEventListener("click", function (ev) {
        if (est.fin) return;
        var b = ev.target.closest("button"); if (!b) return;
        if (b.hasAttribute("data-pista")) { est.k = Math.min(5, est.k + 1); }
        else if (b.hasAttribute("data-santo")) {
          var o = b.getAttribute("data-santo");
          if (o === S.n) { est.fin = true; est.puntos = 6 - est.k; sumarRacha("santo"); }
          else { est.malas.push(o); est.k = Math.min(5, est.k + 1); }
        } else return;
        guardar(KS, est); pintarSanto();
        if (est.fin) avisarPuntaje("santo");
      });
      pintarSanto();
    }

    /* --- Versículo del día --- */
    if ($("diario-versiculo")) {
      var VD = delDia(JG.versiculos, "versiculo"), V = VD.item, KV = "diario:versiculo:" + claveFecha(HOY);
      var opcionesV = mezclarCon([V.ok].concat(V.otras), azar(semilla("opciones-versiculo:" + NUM)));
      var ev2 = leer(KV) || { malas: [], fin: false, gano: false };
      var cont2 = $("diario-versiculo");
      var conHueco = function (frase, palabra, clase) {
        return esc(frase).replace("_____", '<span class="daily__blank ' + (clase || "") + '">' + (palabra ? esc(palabra) : "&nbsp;") + "</span>");
      };
      var pintarVerso = function () {
        var cab = '<div class="daily__head"><p class="eyebrow">Versículo del día · #' + NUM + '</p><h3>Completá la Palabra</h3></div>';
        if (!ev2.fin) {
          cont2.innerHTML = cab +
            '<blockquote class="daily__verso">' + conHueco(V.frase) + '<cite>' + esc(V.cita) + "</cite></blockquote>" +
            '<p class="daily__hint">' + (ev2.malas.length ? "¡Te queda un intento!" : "Tenés dos intentos.") + "</p>" +
            '<div class="daily__opts">' + opcionesV.map(function (o) {
              var mala = ev2.malas.indexOf(o) >= 0;
              return '<button type="button" class="quiz__opt' + (mala ? " is-bad" : "") + '" data-palabra="' + esc(o) + '"' + (mala ? " disabled" : "") + "><span>" + esc(o) + "</span></button>";
            }).join("") + "</div>" + pieHtml("versiculo");
          return;
        }
        var res = ev2.gano ? (ev2.malas.length ? "🟨✅" : "✅") : "❌";
        var texto = "Versículo del día #" + NUM + " 📖\n" + res + " " + V.cita +
          (verRacha("versiculo") > 1 ? " · Racha de " + verRacha("versiculo") + " días 🔥" : "") + "\n" + urlJuegos;
        cont2.innerHTML = cab +
          '<blockquote class="daily__verso">' + conHueco(V.frase, V.ok, ev2.gano ? "is-ok" : "is-bad") + '<cite>' + esc(V.cita) + "</cite></blockquote>" +
          '<p class="daily__result-v ' + (ev2.gano ? "is-ok" : "is-bad") + '">' + (ev2.gano ? (ev2.malas.length ? "¡Bien! Lo sacaste en el segundo intento." : "¡Perfecto! Al primer intento.") : "Esta vez no salió: la palabra era «" + esc(V.ok) + "».") + "</p>" +
          '<p class="daily__fuente">Texto de <em>El Libro del Pueblo de Dios</em>. ' + ext(V.url, "link", "Leer el capítulo completo →") + "</p>" +
          compartirHtml(texto) + pieHtml("versiculo");
      };
      cont2.addEventListener("click", function (ev) {
        if (ev2.fin) return;
        var b = ev.target.closest("[data-palabra]"); if (!b) return;
        var o = b.getAttribute("data-palabra");
        if (o === V.ok) { ev2.fin = true; ev2.gano = true; }
        else { ev2.malas.push(o); if (ev2.malas.length >= 2) ev2.fin = true; }
        if (ev2.fin) sumarRacha("versiculo");
        guardar(KV, ev2); pintarVerso();
        if (ev2.fin) avisarPuntaje("versiculo");
      });
      pintarVerso();
    }


    /* --- Conexiones: 4 grupos de 4 --- */
    if ($("diario-conex") && JG.conexiones) {
      var CX = delDia(JG.conexiones, "conexiones").item, KX = "diario:conex:" + claveFecha(HOY);
      var COLX = { 1: "#f1d36b", 2: "#a9cf7f", 3: "#9ec2e6", 4: "#bf9fe0" }, EMX = { 1: "🟨", 2: "🟩", 3: "🟦", 4: "🟪" };
      var fichas = [];
      CX.g.forEach(function (g, gi) { g.w.forEach(function (w) { fichas.push({ w: w, g: gi }); }); });
      var ex = leer(KX) || { orden: mezclarCon(fichas.map(function (_, i) { return i; }), azar(semilla("conex:" + NUM))), sel: [], hechos: [], intentos: [], errores: 0, fin: false, gano: false, puntos: 0 };
      var contX = $("diario-conex"), msgX = "";
      var grupoHtml = function (gi) {
        var g = CX.g[gi];
        return '<div class="cx__grupo" style="--gc:' + COLX[g.nivel] + '"><strong>' + esc(g.nombre) + "</strong><span>" + g.w.map(esc).join(" · ") + "</span></div>";
      };
      var pintarX = function () {
        var cab = '<div class="daily__head"><p class="eyebrow">Conexiones · #' + NUM + '</p><h3>Encontrá los 4 grupos</h3></div>';
        var hechos = ex.hechos.map(grupoHtml).join("");
        if (!ex.fin) {
          var quedan = ex.orden.filter(function (i) { return ex.hechos.indexOf(fichas[i].g) < 0; });
          contX.innerHTML = cab +
            '<p class="daily__hint">Agrupá las 16 palabras en 4 grupos de 4 que tengan algo en común. Podés equivocarte hasta 4 veces.</p>' +
            '<div class="cx">' + hechos + '<div class="cx__grid">' + quedan.map(function (i) {
              var on = ex.sel.indexOf(i) >= 0, w = fichas[i].w;
              return '<button type="button" class="cx__ficha' + (on ? " is-sel" : "") + (w.length > 11 ? " is-larga" : "") + '" data-f="' + i + '" aria-pressed="' + on + '">' + esc(w) + "</button>";
            }).join("") + "</div></div>" +
            '<p class="cx__msg" aria-live="polite">' + esc(msgX) + "</p>" +
            '<div class="cx__vidas">Errores que te quedan: <span>' + "●".repeat(4 - ex.errores) + '<span class="is-off">' + "●".repeat(ex.errores) + "</span></span></div>" +
            '<div class="cx__tools"><button type="button" class="btn btn--small btn--ghost" data-cx="mezclar">Mezclar</button>' +
            '<button type="button" class="btn btn--small btn--ghost" data-cx="limpiar"' + (ex.sel.length ? "" : " disabled") + ">Deseleccionar</button>" +
            '<button type="button" class="btn btn--small" data-cx="enviar"' + (ex.sel.length === 4 ? "" : " disabled") + ">Enviar</button></div>" +
            pieHtml("conexiones");
          return;
        }
        var faltan = CX.g.map(function (_, i) { return i; }).filter(function (i) { return ex.hechos.indexOf(i) < 0; });
        var filas = ex.intentos.map(function (t) { return t.map(function (n) { return EMX[n]; }).join(""); }).join("\n");
        var texto = "Conexiones #" + NUM + " 🧩\n" + filas + (verRacha("conexiones") > 1 ? "\nRacha de " + verRacha("conexiones") + " días 🔥" : "") + "\n" + urlJuegos;
        contX.innerHTML = cab + '<div class="cx">' + hechos + faltan.map(grupoHtml).join("") + "</div>" +
          '<p class="daily__result-v ' + (ex.gano ? "is-ok" : "is-bad") + '">' +
          (ex.gano ? (ex.errores ? "¡Los encontraste todos con " + ex.errores + (ex.errores === 1 ? " error!" : " errores!") : "¡Perfecto! Sin ningún error.") : "Esta vez no salió: encontraste " + ex.hechos.length + " de 4 grupos.") + "</p>" +
          compartirHtml(texto) + pieHtml("conexiones");
      };
      contX.addEventListener("click", function (ev) {
        if (ex.fin) return;
        var f = ev.target.closest("[data-f]"), b = ev.target.closest("[data-cx]");
        if (f) {
          var i = +f.getAttribute("data-f"), p = ex.sel.indexOf(i);
          if (p >= 0) ex.sel.splice(p, 1); else if (ex.sel.length < 4) ex.sel.push(i);
          msgX = "";
        } else if (b) {
          var accion = b.getAttribute("data-cx");
          if (accion === "mezclar") {
            var fijos = ex.orden.filter(function (i) { return ex.hechos.indexOf(fichas[i].g) >= 0; });
            ex.orden = fijos.concat(mezclarCon(ex.orden.filter(function (i) { return fijos.indexOf(i) < 0; }), Math.random));
          } else if (accion === "limpiar") { ex.sel = []; msgX = ""; }
          else if (accion === "enviar" && ex.sel.length === 4) {
            var clave = ex.sel.slice().sort(function (a, b) { return a - b; }).join(",");
            ex.probadas = ex.probadas || [];
            if (ex.probadas.indexOf(clave) >= 0) { msgX = "Ya probaste esa combinación."; pintarX(); return; }
            ex.probadas.push(clave);
            ex.intentos.push(ex.sel.map(function (i) { return CX.g[fichas[i].g].nivel; }));
            var cuenta = {};
            ex.sel.forEach(function (i) { cuenta[fichas[i].g] = (cuenta[fichas[i].g] || 0) + 1; });
            var maxi = Math.max.apply(null, Object.keys(cuenta).map(function (k) { return cuenta[k]; }));
            if (maxi === 4) {
              ex.hechos.push(fichas[ex.sel[0]].g); ex.sel = []; msgX = "";
              if (ex.hechos.length === 4) { ex.fin = true; ex.gano = true; }
            } else {
              ex.errores++; msgX = maxi === 3 ? "¡Casi! Te falta una." : "No es un grupo.";
              if (ex.errores >= 4) { ex.fin = true; ex.gano = false; ex.sel = []; }
            }
            if (ex.fin) {
              ex.puntos = ex.gano ? 100 - 20 * ex.errores : 10 * ex.hechos.length;
              sumarRacha("conexiones");
            }
          }
        } else return;
        guardar(KX, ex); pintarX();
        if (ex.fin) avisarPuntaje("conexiones");
      });
      pintarX();
    }

    /* --- Crucigrama del día --- */
    if ($("diario-cruci") && JG.crucigramas) {
      var CR = delDia(JG.crucigramas, "crucigrama").item, KC = "diario:cruci:" + claveFecha(HOY);
      var contC = $("diario-cruci");
      var cel = {}, clave = function (r, c) { return r + "," + c; };
      CR.e.forEach(function (e, i) {
        for (var j = 0; j < e.w.length; j++) {
          var k = clave(e.r + (e.d ? j : 0), e.c + (e.d ? 0 : j));
          cel[k] = cel[k] || { ch: e.w[j], h: -1, v: -1, r: e.r + (e.d ? j : 0), c: e.c + (e.d ? 0 : j) };
          cel[k][e.d ? "v" : "h"] = i;
        }
      });
      /* numeración clásica: de arriba hacia abajo y de izquierda a derecha */
      var num = 0, numDe = {};
      for (var rr = 0; rr < CR.h; rr++) for (var cc = 0; cc < CR.w; cc++) {
        var arranca = CR.e.filter(function (e) { return e.r === rr && e.c === cc; });
        if (arranca.length) { num++; numDe[clave(rr, cc)] = num; arranca.forEach(function (e) { e.n = num; }); }
      }
      var celdasDe = function (e) { var out = []; for (var j = 0; j < e.w.length; j++) out.push(clave(e.r + (e.d ? j : 0), e.c + (e.d ? 0 : j))); return out; };
      var estC = leer(KC) || { l: {}, rev: {}, fin: false, ayudas: 0, t: 0 };
      var act = { k: clave(CR.e[0].r, CR.e[0].c), d: CR.e[0].d };
      var normal = function (s) { s = String(s || "").toUpperCase(); if (s === "Ñ") return s; return s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-ZÑ]/g, ""); };
      var reloj = function (t) { return Math.floor(t / 60) + ":" + dosD(t % 60); };
      /* récord personal: el mejor tiempo sin revelar palabras (se guarda en este celular o compu) */
      var recordC = function () { return leer("record:crucigrama"); };

      var lista = function (d) {
        return CR.e.filter(function (e) { return e.d === d; }).sort(function (a, b) { return a.n - b.n; }).map(function (e) {
          return '<li data-entrada="' + CR.e.indexOf(e) + '"><strong>' + e.n + "</strong> " + esc(e.p) + " <span>(" + e.w.length + ")</span></li>";
        }).join("");
      };
      var montar = function () {
        var grilla = "";
        for (var r = 0; r < CR.h; r++) for (var c = 0; c < CR.w; c++) {
          var k = clave(r, c), x = cel[k];
          grilla += x
            ? '<div class="cw__cell" data-k="' + k + '">' + (numDe[k] ? '<span class="cw__num">' + numDe[k] + "</span>" : "") +
              '<input type="text" inputmode="text" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="2" aria-label="Fila ' + (r + 1) + ", columna " + (c + 1) + '" data-k="' + k + '" value="' + esc(estC.l[k] || "") + '"></div>'
            : '<div class="cw__void" aria-hidden="true"></div>';
        }
        contC.innerHTML =
          '<div class="daily__head"><p class="eyebrow">Crucigrama del día · #' + NUM + '</p><h3>Crucigrama</h3></div>' +
          '<div class="cw">' +
            '<div class="cw__main">' +
              '<div class="cw__bar" id="cw-bar"></div>' +
              '<div class="cw__grid" id="cw-grid" style="--cols:' + CR.w + '">' + grilla + "</div>" +
              '<div class="cw__tools" id="cw-tools"></div>' +
            "</div>" +
            '<div class="cw__clues"><div><h4>Horizontales</h4><ol>' + lista(0) + "</ol></div><div><h4>Verticales</h4><ol>" + lista(1) + "</ol></div></div>" +
          "</div>" +
          '<div id="cw-fin"></div>';
        pintarC();
      };
      var entradaActiva = function () { var x = cel[act.k]; var i = act.d ? x.v : x.h; if (i < 0) { act.d = 1 - act.d; i = act.d ? x.v : x.h; } return CR.e[i]; };
      var pintarC = function () {
        var e = entradaActiva(), enEntrada = celdasDe(e);
        contC.querySelectorAll(".cw__cell").forEach(function (div) {
          var k = div.getAttribute("data-k"), inp = div.querySelector("input");
          div.classList.toggle("is-word", enEntrada.indexOf(k) >= 0);
          div.classList.toggle("is-active", k === act.k && !estC.fin);
          div.classList.toggle("is-rev", !!estC.rev[k]);
          div.classList.toggle("is-ok", estC.fin);
          if (inp.value !== (estC.l[k] || "")) inp.value = estC.l[k] || "";
          inp.disabled = estC.fin;
        });
        contC.querySelectorAll(".cw__clues li").forEach(function (li) { li.classList.toggle("is-active", +li.getAttribute("data-entrada") === CR.e.indexOf(e)); });
        $("cw-bar").innerHTML = estC.fin ? "<strong>¡Completo!</strong>" : "<strong>" + e.n + " " + (e.d ? "Vertical" : "Horizontal") + "</strong>" + esc(e.p) + " <span>(" + e.w.length + ")</span>";
        $("cw-tools").innerHTML = estC.fin ? "" :
          '<button type="button" class="btn btn--small" data-cw="comprobar">Comprobar</button>' +
          '<button type="button" class="btn btn--small btn--ghost" data-cw="revelar">Revelar palabra</button>' +
          '<span class="cw__time" id="cw-time">' + reloj(estC.t) + "</span>" +
          (recordC() ? '<span class="cw__record" title="Tu mejor tiempo sin revelar palabras">🏆 ' + reloj(recordC().t) + "</span>" : "");
        if (estC.fin) {
          var ayudaTxt = estC.ayudas ? (estC.ayudas === 1 ? "con 1 ayuda" : "con " + estC.ayudas + " ayudas") : "sin ayudas";
          var texto = "Crucigrama del día #" + NUM + " ✏️\n✅ en " + reloj(estC.t) + " · " + ayudaTxt + (estC.record ? " · 🏆 ¡Nuevo récord!" : "") +
            (verRacha("crucigrama") > 1 ? " · Racha de " + verRacha("crucigrama") + " días 🔥" : "") + "\n" + urlJuegos;
          var rec = recordC();
          var recTxt = estC.record ? '<p class="cw__nuevo">🏆 ¡Nuevo récord personal!</p>'
            : estC.primero ? '<p class="cw__rec-txt">🏆 Tu primer récord: ' + reloj(estC.t) + ". A ver si lo superás mañana.</p>"
            : rec ? '<p class="cw__rec-txt">🏆 Tu récord: ' + reloj(rec.t) + (estC.ayudas ? " (solo cuenta si no revelás palabras)" : "") + "</p>" : "";
          $("cw-fin").innerHTML = '<p class="daily__result-v is-ok">¡Lo completaste en ' + reloj(estC.t) + " " + ayudaTxt + "!</p>" + recTxt + compartirHtml(texto) + pieHtml("crucigrama");
        } else $("cw-fin").innerHTML = pieHtml("crucigrama");
      };
      var foco = function () { var inp = contC.querySelector('input[data-k="' + act.k + '"]'); if (inp) inp.focus({ preventScroll: true }); };
      var mover = function (paso) {
        var e = entradaActiva(), ks = celdasDe(e), i = ks.indexOf(act.k) + paso;
        if (i >= 0 && i < ks.length) act.k = ks[i];
      };
      var completo = function () { return Object.keys(cel).every(function (k) { return estC.l[k] === cel[k].ch; }); };
      var terminar = function () {
        if (estC.fin || !completo()) return;
        estC.fin = true; sumarRacha("crucigrama");
        if (!estC.ayudas) {
          var rec = recordC();
          if (!rec || estC.t < rec.t) { estC.record = !!rec; estC.primero = !rec; guardar("record:crucigrama", { t: estC.t, num: NUM, fecha: claveFecha(HOY) }); }
        }
        guardar(KC, estC); pintarC(); avisarPuntaje("crucigrama");
      };
      var empezo = function () { return Object.keys(estC.l).length > 0; };
      setInterval(function () {
        if (estC.fin || !empezo() || document.hidden || !$("cw-time")) return;
        estC.t++; $("cw-time").textContent = reloj(estC.t); if (estC.t % 5 === 0) guardar(KC, estC);
      }, 1000);

      montar();
      contC.addEventListener("click", function (ev) {
        var inp = ev.target.closest("input[data-k]"), li = ev.target.closest("li[data-entrada]"), btn = ev.target.closest("[data-cw]");
        if (inp && !estC.fin) {
          var k = inp.getAttribute("data-k");
          if (k === act.k) act.d = 1 - act.d; else act.k = k;
          pintarC(); return;
        }
        if (li && !estC.fin) { var e = CR.e[+li.getAttribute("data-entrada")]; act = { k: clave(e.r, e.c), d: e.d }; pintarC(); foco(); return; }
        if (btn) {
          if (btn.getAttribute("data-cw") === "comprobar") {
            var malas = 0;
            Object.keys(cel).forEach(function (k) {
              var div = contC.querySelector('.cw__cell[data-k="' + k + '"]'), mal = estC.l[k] && estC.l[k] !== cel[k].ch;
              div.classList.toggle("is-bad", !!mal); if (mal) malas++;
            });
            $("cw-bar").innerHTML = malas ? "<strong>Ojo:</strong> hay " + malas + (malas === 1 ? " letra que no va." : " letras que no van.") : "<strong>¡Vas bien!</strong> Todo lo que escribiste está correcto.";
            terminar();
          } else {
            var en = entradaActiva();
            celdasDe(en).forEach(function (k) { if (estC.l[k] !== cel[k].ch) { estC.l[k] = cel[k].ch; estC.rev[k] = true; } });
            estC.ayudas++; guardar(KC, estC); pintarC(); terminar();
          }
        }
      });
      contC.addEventListener("input", function (ev) {
        var inp = ev.target.closest("input[data-k]"); if (!inp || estC.fin) return;
        var k = inp.getAttribute("data-k"), v = normal(inp.value).slice(-1);
        estC.l[k] = v; if (!v) delete estC.l[k];
        inp.closest(".cw__cell").classList.remove("is-bad");
        act.k = k; if (v) mover(1);
        guardar(KC, estC); pintarC(); foco(); terminar();
      });
      contC.addEventListener("keydown", function (ev) {
        var inp = ev.target.closest("input[data-k]"); if (!inp || estC.fin) return;
        var k = inp.getAttribute("data-k"), x = cel[k];
        if (ev.key === "Backspace" && !inp.value) { ev.preventDefault(); act.k = k; mover(-1); delete estC.l[act.k]; guardar(KC, estC); pintarC(); foco(); return; }
        var dir = { ArrowRight: [0, 1, 0], ArrowLeft: [0, -1, 0], ArrowDown: [1, 0, 1], ArrowUp: [-1, 0, 1] }[ev.key];
        if (dir) {
          ev.preventDefault(); act.d = dir[2];
          var r = x.r + dir[0], c = x.c + dir[1];
          if (cel[clave(r, c)]) act.k = clave(r, c);
          pintarC(); foco(); return;
        }
        if (ev.key === "Enter" || ev.key === "Tab") {
          ev.preventDefault();
          var orden = CR.e.slice().sort(function (a, b) { return a.d - b.d || a.n - b.n; }), i = orden.indexOf(entradaActiva());
          var sig = orden[(i + (ev.shiftKey ? orden.length - 1 : 1)) % orden.length];
          act = { k: clave(sig.r, sig.c), d: sig.d }; pintarC(); foco();
        }
      });
    }

    /* --- Ranking parroquial: suma de los 4 desafíos del día (máximo 100 puntos cada uno) ---
       Los puntajes viven en la planilla de la Academia (ver herramientas/ranking/LEEME.md).
       Suman quienes entran con su cuenta de Google y fueron aprobados. */
    var JUEGOS_RK = ["santo", "versiculo", "crucigrama", "conexiones"];
    var puntosDe = puntosHoy;
    var RK = CUENTA.url;
    var enviarRK = function (juego, cb) {
      var pts = puntosDe(juego), f = claveFecha(HOY), k = "ranking:enviado:" + f + ":" + juego;
      if (!RK || !CUENTA.datos() || pts === null || leer(k)) { if (cb) cb(); return; }
      CUENTA.post("puntaje", { fecha: f, juego: juego, puntos: pts, num: NUM }, function (err, d) {
        if (!err && d && d.ok) guardar(k, true);
        if (cb) cb();
      });
    };
    var avisarPuntaje = function (juego) { enviarRK(juego, function () { if ($("ranking")) pintarRK(); }); };
    var vistaRK = "semana", msgRK = "";
    /* etiqueta del grupo (columna Grupo de la planilla), con el color del grupo si coincide */
    var grupoRK = function (txt) {
      txt = String(txt || "").trim(); if (!txt) return "";
      var n = txt.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      var g = C.grupos.filter(function (g) {
        var a = g.nombre.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        return a === n || g.id === n || a.indexOf(n) === 0 || n.indexOf(a) === 0;
      })[0];
      return ' <span class="rk__grupo" style="--c:' + esc(g ? g.color : "#6b7571") + '">' + esc(txt) + "</span>";
    };
    var tablaGruposRK = function (filas) {
      if (!filas || !filas.length) return '<p class="muted">Todavía no hay puntajes de grupos esta semana.</p>';
      return '<ol class="rk__tabla">' + filas.map(function (x) {
        return '<li><span class="rk__pos">' + x.pos + '</span><span class="rk__nombre">' + grupoRK(x.grupo) +
          ' <span class="rk__cuantos">' + x.jugadores + (x.jugadores === 1 ? " jugador" : " jugadores") + '</span></span><span class="rk__pts">' + x.promedio + "</span></li>";
      }).join("") + "</ol>";
    };
    var tablaRK = function (filas) {
      if (!filas || !filas.length) return '<p class="muted">Todavía no hay puntajes. ¡Sé el primero!</p>';
      return '<ol class="rk__tabla">' + filas.map(function (x) {
        return '<li class="' + (x.yo ? "is-yo" : "") + '"><span class="rk__pos">' + x.pos + '</span><span class="rk__nombre">' + esc(x.nombre) + grupoRK(x.grupo) +
          ((x.insignias || []).length ? ' <span class="rk__ins" title="Cumbres de la Academia Frassati">' + x.insignias.map(esc).join("") + "</span>" : "") +
          (x.oculto ? ' <span class="rk__oculto">solo lo ves vos</span>' : "") + '</span><span class="rk__pts">' + x.puntos + "</span></li>";
      }).join("") + "</ol>";
    };
    var cargarTablas = function (cb) {
      if (CUENTA.datos()) CUENTA.post("ranking", {}, cb);
      else fetch(RK + (RK.indexOf("?") < 0 ? "?" : "&") + "accion=ranking").then(function (r) { return r.json(); }).then(function (d) { cb(null, d); }, function (e) { cb(e || true); });
    };
    var pintarRK = function () {
      var cont = $("ranking"); if (!cont) return;
      if (!RK) { cont.innerHTML = '<p class="muted">El ranking parroquial arranca muy pronto.</p>'; return; }
      var yo = CUENTA.datos();
      if (!yo) {
        cont.innerHTML = '<div class="rk__login"><p class="rk__entrar">Entrá con tu cuenta de Google para sumar tus puntos al ranking.</p>' +
          '<div id="rk-google" class="rk__google"></div>' +
          (msgRK ? '<p class="rk__msg" aria-live="polite">' + msgRK + "</p>" : "") +
          '<p class="rk__ayuda">' + esc(C.ranking.pedirUsuario || "") + ' En el ranking solo se ve tu nombre, nunca tu mail. <a href="privacidad.html">Privacidad</a></p></div>' +
          '<div id="rk-tablas"><p class="muted">Cargando ranking…</p></div>';
        CUENTA.boton($("rk-google"), function (estado, nombre) {
          if (CUENTA.datos()) {
            msgRK = "";
            var pend = JUEGOS_RK.length; /* sube lo que ya jugó hoy antes de entrar */
            JUEGOS_RK.forEach(function (j) { enviarRK(j, function () { if (--pend === 0) pintarRK(); }); });
          } else { msgRK = CUENTA.mensaje(estado, nombre); pintarRK(); }
        });
      } else {
        var hoy = 0, jugados = 0;
        var desglose = DESAFIOS.map(function (d) {
          var p = puntosDe(d.id), extra = "";
          if (p !== null) { hoy += p; jugados++; }
          if (d.id === "crucigrama" && p !== null) {
            var sc = leer("diario:cruci:" + claveFecha(HOY)) || {};
            extra = " (" + Math.floor((sc.t || 0) / 60) + ":" + dosD((sc.t || 0) % 60) + (sc.ayudas ? " · " + sc.ayudas + (sc.ayudas === 1 ? " ayuda" : " ayudas") : "") + ")";
          }
          return '<li class="' + (p !== null ? "is-ok" : "") + '"><span aria-hidden="true">' + d.icono + "</span> " + esc(d.nombre) + ": <strong>" + (p !== null ? p : "—") + "</strong>" + esc(extra) + "</li>";
        }).join("");
        cont.innerHTML = '<div class="rk__yo"><p>Jugás como <strong>' + esc(yo.nombre) + "</strong>" + (yo.grupo ? grupoRK(yo.grupo) : "") + ' · <button type="button" class="link" data-rk="salir">Salir</button></p>' +
          (yo.estado === "pendiente" ? '<p class="rk__msg">' + CUENTA.mensaje("pendiente") + "</p>" : "") +
          '<p class="rk__hoy">Hoy: <strong>' + hoy + "</strong> de 400 puntos · " + jugados + " de 4 desafíos</p>" +
          '<ul class="rk__desglose">' + desglose + "</ul>" +
          '<details class="rk__reglas"><summary>¿Cómo se calculan los puntos?</summary><ul>' +
            "<li><strong>Santo del día:</strong> 100 con 1 pista, 80 con 2, 60 con 3, 40 con 4 y 20 con 5.</li>" +
            "<li><strong>Versículo del día:</strong> 100 al primer intento, 50 al segundo y 0 si no sale.</li>" +
            "<li><strong>Conexiones:</strong> 100 sin errores, 80 con 1, 60 con 2 y 40 con 3. Si perdés, 10 por cada grupo encontrado.</li>" +
            "<li><strong>Crucigrama:</strong> 100 si lo terminás en menos de 3:30 sin revelar palabras. Después, −1 por cada 30 segundos y −15 por cada palabra revelada (mínimo 20).</li>" +
          "</ul></details></div>" +
          '<div id="rk-tablas"><p class="muted">Cargando ranking…</p></div>';
      }
      cargarTablas(function (err, d) {
        var t = $("rk-tablas"); if (!t) return;
        if (yo && !CUENTA.datos()) { pintarRK(); return; } /* la sesión venció: vuelve a mostrar el botón */
        if (err || !d || !d.ok) { t.innerHTML = '<p class="muted">No se pudo cargar el ranking. Probá en un rato.</p>'; return; }
        if (yo && d.miEstado && d.miEstado !== yo.estado) { CUENTA.actualizar(d.miEstado); pintarRK(); return; }
        t.innerHTML = '<div class="rk__tabs" role="tablist">' +
          '<button type="button" role="tab" class="fchip' + (vistaRK === "semana" ? " is-on" : "") + '" data-rk="semana" aria-selected="' + (vistaRK === "semana") + '">Esta semana</button>' +
          '<button type="button" role="tab" class="fchip' + (vistaRK === "historico" ? " is-on" : "") + '" data-rk="historico" aria-selected="' + (vistaRK === "historico") + '">Histórico</button>' +
          '<button type="button" role="tab" class="fchip' + (vistaRK === "grupos" ? " is-on" : "") + '" data-rk="grupos" aria-selected="' + (vistaRK === "grupos") + '">Por grupos</button></div>' +
          (vistaRK === "grupos" ? tablaGruposRK(d.grupos) : tablaRK(d[vistaRK])) +
          (d.yo && d.yo[vistaRK] && d.yo[vistaRK].pos > (d[vistaRK] || []).length ? '<p class="rk__mio">Tu puesto: <strong>' + d.yo[vistaRK].pos + "°</strong> con " + d.yo[vistaRK].puntos + " puntos</p>" : "") +
          '<p class="rk__nota">' + (vistaRK === "grupos" ? "Promedio de puntos de esta semana por cada jugador del grupo que sumó algo. Así no gana el grupo con más chicos." : (vistaRK === "semana" ? "La semana va de lunes a domingo." : "Desde el lanzamiento.") + " Cada desafío suma hasta 100 puntos por día.") + "</p>";
        if ($("rk-podio")) $("rk-podio").innerHTML = podioHtml(d.podio);
      });
    };
    if ($("ranking")) {
      $("ranking").addEventListener("click", function (ev) {
        var b = ev.target.closest("[data-rk]"); if (!b) return;
        var a = b.getAttribute("data-rk");
        if (a === "salir") CUENTA.salir(pintarRK);
        else { vistaRK = a; pintarRK(); }
      });
      /* por si jugó sin conexión: reintenta subir lo de hoy */
      JUEGOS_RK.forEach(function (j) { enviarRK(j); });
      pintarRK();
    }
  }

  /* ---------- juegos: tip para agregar la web a la pantalla de inicio (solo celulares) ---------- */
  if ($("tip-inicio")) (function () {
    var ua = navigator.userAgent || "";
    var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var android = /Android/.test(ua);
    var instalada = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
    var cerrado = false; try { cerrado = localStorage.getItem("tip:inicio") === "no"; } catch (e) {}
    if (instalada || cerrado || !(ios || android)) return;
    var pasos = ios
      ? "Tocá <strong>Compartir</strong> (el cuadrado con la flecha para arriba) y después <strong>Agregar a inicio</strong>."
      : "Tocá los <strong>tres puntitos ⋮</strong> arriba a la derecha y después <strong>Agregar a la pantalla principal</strong>.";
    $("tip-inicio").innerHTML = '<div class="tip-inicio"><span class="tip-inicio__ico" aria-hidden="true">📲</span>' +
      "<p><strong>Tip:</strong> agregá la web a tu pantalla de inicio y jugá todos los días con un toque. " + pasos + "</p>" +
      '<button type="button" class="tip-inicio__x" aria-label="Cerrar el tip">×</button></div>';
    $("tip-inicio").querySelector(".tip-inicio__x").addEventListener("click", function () {
      try { localStorage.setItem("tip:inicio", "no"); } catch (e) {}
      $("tip-inicio").innerHTML = "";
    });
  })();

  /* ---------- Academia Frassati (manual de marca: Academia Frassati_ Manual de marca) ---------- */
  if ($("formacion") && window.FORMACION) (function () {
    var FD = window.FORMACION, cont = $("formacion"), N_PREG = 10, APRUEBA = 8;
    var MESES_C = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    var hoyF = fechaLocal(new Date());
    var estado = function (id) { return leerLS("curso:" + id) || {}; };
    var guardarE = function (id, e) { try { localStorage.setItem("curso:" + id, JSON.stringify(e)); } catch (x) {} };
    var curso = function (id) { return FD.cursos.filter(function (c) { return c.id === id; })[0]; };
    var numero = function (c) { var i = FD.cursos.indexOf(c); return (i < 9 ? "0" : "") + (i + 1); };
    var mezclar = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var fechaLarga = function (f) { var p = f.split("-"); return (+p[2]) + " de " + MESES_C[+p[1] - 1] + " de " + p[0]; };
    var examen = null;

    /* la cumbre se registra en la planilla si la persona entró con su cuenta de Google */
    var enviarInsignia = function (c, cb) {
      var e = estado(c.id);
      if (!CUENTA.url || !CUENTA.datos() || !e.aprobado || e.enviada) { if (cb) cb(); return; }
      CUENTA.post("insignia", { curso: c.id, nota: e.aprobado.nota }, function (err, d) {
        if (!err && d && d.ok) { e.enviada = true; guardarE(c.id, e); }
        if (cb) cb();
      });
    };

    var lista = function () {
      var alcanzadas = FD.cursos.filter(function (c) { return estado(c.id).aprobado; }).length;
      cont.innerHTML =
        '<div class="ac-sec"><p class="ac-rotulo">El camino</p><h2 class="ac-h2">Cómo se sube</h2>' +
        '<ol class="ac-pasos3"><li><span>01</span><h3>Leé</h3><p>Cada cumbre tiene su lectura, con una guía de qué buscar.</p></li>' +
        "<li><span>02</span><h3>Rendí</h3><p>" + N_PREG + " preguntas sobre la lectura, a libro abierto. Se aprueba con " + APRUEBA + ".</p></li>" +
        "<li><span>03</span><h3>Llegá a la cumbre</h3><p>Te llevás tu certificado y la cumbre queda registrada en tu cuenta.</p></li></ol></div>" +
        '<div class="ac-sec"><p class="ac-rotulo">Las cumbres' + (alcanzadas ? " · alcanzaste " + alcanzadas + " de " + FD.cursos.length : "") + '</p><h2 class="ac-h2">Elegí tu próxima subida</h2>' +
        '<div class="ac-cumbres">' + FD.cursos.map(function (c) {
          var e = estado(c.id);
          return '<a class="ac-cumbre' + (e.aprobado ? " is-ok" : "") + '" href="#' + esc(c.id) + '"><p class="ac-rotulo">Cumbre ' + numero(c) + "</p>" +
            '<h3 class="ac-h3">' + esc(c.titulo) + "</h3><p>" + esc(c.resumen) + "</p>" +
            '<p class="ac-meta">' + (e.aprobado ? isoSVG("ac-iso-mini") + " Cumbre alcanzada · " + e.aprobado.nota + "/10" : "Unos " + c.minutos + " minutos de lectura · examen de " + N_PREG + " preguntas") + "</p>" +
            '<span class="ac-link">' + (e.aprobado ? "Ver mi certificado" : "Empezar el ascenso") + " →</span></a>";
        }).join("") + FD.proximos.map(function (c, i) {
          var n = FD.cursos.length + i + 1;
          return '<div class="ac-cumbre is-prox"><p class="ac-rotulo">Cumbre ' + (n < 10 ? "0" : "") + n + ' · Próximamente</p><h3 class="ac-h3">' + esc(c.titulo) + "</h3><p>" + esc(c.resumen) + "</p></div>";
        }).join("") + "</div></div>";
    };

    var detalle = function (c) {
      var e = estado(c.id), falloHoy = !e.aprobado && e.ultimoIntento === hoyF;
      cont.innerHTML = '<a class="ac-volver" href="#">← Todas las cumbres</a>' +
        '<header class="ac-det-head"><p class="ac-rotulo">Cumbre ' + numero(c) + '</p><h2 class="ac-h1 ac-h1--det">' + esc(c.titulo) + '</h2><p class="ac-lead">' + esc(c.resumen) + " " + esc(c.para) + "</p></header>" +
        '<ol class="ac-tramos">' +
          '<li><p class="ac-rotulo">Tramo 01</p><h3 class="ac-h3">Leé</h3><ul class="ac-lecturas">' + c.lecturas.map(function (l) {
            return "<li>" + ext(l.url, "ac-link", esc(l.texto) + " →") + "<p>" + esc(l.guia) + "</p></li>";
          }).join("") + "</ul></li>" +
          '<li><p class="ac-rotulo">Tramo 02</p><h3 class="ac-h3">Rendí</h3><p>' + N_PREG + " preguntas sobre la lectura, a libro abierto. Se aprueba con " + APRUEBA + ". Si no llegás, podés volver a intentarlo al día siguiente.</p>" +
            (e.aprobado ? '<p class="ac-ok">' + isoSVG("ac-iso-mini") + " Alcanzaste esta cumbre con " + e.aprobado.nota + "/10 el " + fechaLarga(e.aprobado.fecha) + ".</p>"
              : falloHoy ? '<p class="ac-espera">Hoy sacaste ' + e.ultimaNota + "/10. Repasá la lectura y volvé a intentarlo mañana.</p>"
              : '<button type="button" class="ac-btn" data-f="empezar">Empezar el examen</button>') + "</li>" +
          '<li><p class="ac-rotulo">Tramo 03</p><h3 class="ac-h3">La cumbre</h3>' + (e.aprobado ? certForm(c, e) : "<p>Cuando apruebes, vas a poder descargar tu certificado de la Academia y la cumbre queda registrada en tu cuenta.</p>") + "</li>" +
        '</ol><div id="examen"></div>';
      if ($("f-google")) CUENTA.boton($("f-google"), function (estado, nombre) {
        if (CUENTA.datos()) enviarInsignia(c, function () { detalle(c); });
        else $("f-msg").innerHTML = CUENTA.mensaje(estado, nombre);
      });
    };

    var certForm = function (c, e) {
      var yo = CUENTA.datos();
      return '<form class="ac-cert-form" data-f="cert"><label for="cert-nombre">Nombre y apellido para el certificado</label>' +
        '<div class="ac-fila"><input id="cert-nombre" type="text" maxlength="60" required value="' + esc(e.nombre || "") + '" placeholder="Ej.: Juliana Rodríguez">' +
        '<button type="submit" class="ac-btn">Descargar certificado</button></div>' +
        '<p class="ac-ayuda">Se abre para imprimir: elegí <strong>Guardar como PDF</strong>. En el celular, desde Compartir → Imprimir.</p></form>' +
        '<p class="ac-compartir">' + ext("https://wa.me/?text=" + encodeURIComponent("Alcancé la cumbre «" + c.titulo + "» de la Academia Frassati (" + e.aprobado.nota + "/10). Hacia lo alto.\n" + location.href.split("#")[0]), "ac-link", "Compartir por WhatsApp →") + "</p>" +
        (yo ? '<p class="ac-ayuda">' + (e.enviada ? "La cumbre ya quedó registrada en tu cuenta." : "La cumbre se está registrando en tu cuenta.") + "</p>"
            : '<p class="ac-ayuda">Entrá con tu cuenta de Google para que la cumbre quede registrada a tu nombre.</p><div id="f-google"></div><p class="rk__msg" id="f-msg" aria-live="polite"></p>');
    };

    var empezar = function (c) {
      examen = { c: c, qs: mezclar(c.preguntas).slice(0, N_PREG).map(function (q) { return { q: q, ops: mezclar([q.ok].concat(q.otras)) }; }) };
      $("examen").innerHTML = '<form class="ac-examen" data-f="entregar"><p class="ac-rotulo">Examen</p><h3 class="ac-h2">' + esc(c.titulo) + "</h3>" + examen.qs.map(function (x, i) {
        return '<fieldset class="ac-q"><legend><span>' + (i < 9 ? "0" : "") + (i + 1) + "</span>" + esc(x.q.p) + "</legend>" + x.ops.map(function (o, j) {
          return '<label class="ac-op"><input type="radio" name="q' + i + '" value="' + j + '" required> <span>' + esc(o) + "</span></label>";
        }).join("") + "</fieldset>";
      }).join("") + '<button type="submit" class="ac-btn">Entregar</button><p class="ac-falta" aria-live="polite"></p></form>';
      $("examen").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    var corregir = function (form) {
      var c = examen.c, bien = 0, res = examen.qs.map(function (x, i) {
        var sel = form.querySelector('input[name="q' + i + '"]:checked'), ok = sel && x.ops[+sel.value] === x.q.ok;
        if (ok) bien++;
        return { x: x, ok: ok };
      });
      var e = estado(c.id), aprobo = bien >= APRUEBA;
      e.ultimoIntento = hoyF; e.ultimaNota = bien;
      if (aprobo) e.aprobado = { nota: bien, fecha: hoyF };
      guardarE(c.id, e);
      if (aprobo) enviarInsignia(c);
      detalle(c);
      $("examen").innerHTML = '<div class="ac-res ' + (aprobo ? "is-ok" : "is-bad") + '">' + (aprobo ? isoSVG("ac-iso-res") : "") +
        '<p class="ac-nota">' + bien + "<span>/10</span></p>" +
        '<p class="ac-lead">' + (aprobo ? "¡Llegaste a la cumbre! Ya podés descargar tu certificado." : "Esta vez no alcanzó. Repasá lo que te marcamos y volvé a intentarlo mañana.") + "</p></div>" +
        '<ol class="ac-repaso">' + res.map(function (r) {
          return '<li class="' + (r.ok ? "is-ok" : "is-bad") + '"><span>' + (r.ok ? "✓" : "✗") + "</span> " + esc(r.x.q.p) + (r.ok ? "" : ' <em>Repasá: ' + esc(r.x.q.ref) + "</em>") + "</li>";
        }).join("") + "</ol>";
      examen = null;
      $("examen").scrollIntoView({ behavior: "smooth", block: "start" });
    };

    /* certificado: A4 apaisado, diseño del manual (10 · Diploma) */
    var imprimir = function (c, e, nombre) {
      var cert = $("cert");
      if (!cert) { cert = document.createElement("div"); cert.id = "cert"; cert.className = "cert"; document.body.appendChild(cert); }
      cert.innerHTML = '<div class="cert__marco"><div class="cert__in">' +
        selloSVG("cert__sello") + '<p class="cert__marca">Academia Frassati</p>' +
        '<p class="cert__certifica">certifica que</p>' +
        '<p class="cert__nombre">' + esc(nombre) + "</p>" +
        '<p class="cert__txt">alcanzó la cumbre <strong>' + esc(c.titulo) + "</strong> de la Academia Frassati,<br>aprobando el examen con " + e.aprobado.nota + " de 10 respuestas correctas.</p>" +
        '<div class="cert__firmas"><div><span></span>Director/a académico/a</div><p>Hacia lo alto</p><div><span></span>Asesor espiritual</div></div>' +
        '<p class="cert__pie">Jóvenes Sagrada Familia · Nordelta, ' + fechaLarga(e.aprobado.fecha) + "</p></div></div>";
      document.body.classList.add("imprimiendo");
      var fin = function () { document.body.classList.remove("imprimiendo"); window.removeEventListener("afterprint", fin); };
      window.addEventListener("afterprint", fin);
      setTimeout(function () { window.print(); setTimeout(fin, 1000); }, 300);
    };

    var pintar = function () {
      var c = curso(location.hash.slice(1));
      if (c) detalle(c); else lista();
    };
    cont.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-f]"); if (!b) return;
      if (b.getAttribute("data-f") === "empezar") empezar(curso(location.hash.slice(1)));
    });
    cont.addEventListener("submit", function (ev) {
      var f = ev.target; ev.preventDefault();
      var c = curso(location.hash.slice(1)); if (!c) return;
      if (f.getAttribute("data-f") === "entregar") {
        var falta = examen.qs.filter(function (_, i) { return !f.querySelector('input[name="q' + i + '"]:checked'); }).length;
        if (falta) { f.querySelector(".ac-falta").textContent = "Te " + (falta === 1 ? "falta 1 pregunta" : "faltan " + falta + " preguntas") + "."; return; }
        corregir(f);
      } else if (f.getAttribute("data-f") === "cert") {
        var e = estado(c.id), nombre = String($("cert-nombre").value || "").trim();
        if (!nombre || !e.aprobado) return;
        e.nombre = nombre; guardarE(c.id, e); imprimir(c, e, nombre);
      }
    });
    window.addEventListener("hashchange", function () { pintar(); window.scrollTo(0, 0); });
    FD.cursos.forEach(function (c) { enviarInsignia(c); }); /* por si aprobó antes de entrar con su cuenta */
    pintar();
  })();

  /* ---------- quiz ---------- */
  if ($("quiz")) {
    var Q = C.quiz, cont = $("quiz"), LETRAS = ["A", "B", "C", "D"], SEG = 20;
    var temaDe = function (id) { return Q.temas.filter(function (t) { return t.id === id; })[0]; };
    var mezclar = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var mejor = function (tema, valor) {
      try {
        var k = "quiz-mejor-" + tema;
        if (valor != null) { if (valor > (+localStorage.getItem(k) || 0)) localStorage.setItem(k, valor); }
        return +localStorage.getItem(k) || 0;
      } catch (e) { return 0; }
    };
    var J = { temas: [] }, reloj;  /* temas vacío = todos */
    var claveTemas = function () { return J.temas.length ? J.temas.slice().sort().join("+") : "todos"; };
    var nombreTemas = function () { return J.temas.length ? J.temas.map(function (id) { return (temaDe(id) || {}).nombre; }).join(", ") : "Todos los temas"; };

    var inicio = function () {
      clearInterval(reloj);
      var r = mejor(claveTemas());
      cont.innerHTML = '<div class="quiz__card quiz__start">' +
        '<p class="eyebrow">Elegí uno o varios temas</p>' +
        '<div class="quiz__temas">' +
          '<button type="button" class="fchip' + (!J.temas.length ? " is-on" : "") + '" data-tema="todos" aria-pressed="' + !J.temas.length + '">Todos los temas</button>' +
          Q.temas.map(function (t) { var on = J.temas.indexOf(t.id) >= 0; return '<button type="button" class="fchip' + (on ? " is-on" : "") + '" data-tema="' + t.id + '" aria-pressed="' + on + '">' + (on ? "✓ " : "") + esc(t.nombre) + "</button>"; }).join("") +
        "</div>" +
        '<ul class="quiz__rules"><li><strong>10</strong> preguntas al azar</li><li><strong>100</strong> puntos por respuesta correcta</li><li>Hasta <strong>50</strong> puntos extra por rapidez</li></ul>' +
        '<button type="button" class="btn quiz__go" data-accion="empezar">Empezar</button>' +
        (r ? '<p class="quiz__best">Tu mejor puntaje en <em>' + esc(nombreTemas()) + "</em>: <strong>" + r + "</strong></p>" : "") +
      "</div>";
    };

    var empezar = function () {
      var banco = Q.preguntas.filter(function (p) { return !J.temas.length || J.temas.indexOf(p.tema) >= 0; });
      J.lista = mezclar(banco).slice(0, 10).map(function (p) { return { q: p, opciones: mezclar([p.ok].concat(p.otras)) }; });
      J.i = 0; J.puntos = 0; J.aciertos = 0; J.resp = [];
      pregunta();
    };

    var pregunta = function () {
      var it = J.lista[J.i], t = temaDe(it.q.tema) || {};
      J.respondida = false; J.t0 = Date.now();
      cont.innerHTML = '<div class="quiz__card" style="--c:' + esc(t.color || "#4e5f58") + '">' +
        '<div class="quiz__top"><span>Pregunta <strong>' + (J.i + 1) + "</strong> de " + J.lista.length + '</span><span class="quiz__pts"><strong>' + J.puntos + "</strong> puntos</span></div>" +
        '<div class="quiz__progress"><span style="width:' + (J.i / J.lista.length * 100) + '%"></span></div>' +
        '<div class="quiz__timer"><span id="quiz-timer"></span></div>' +
        '<p class="quiz__tema"><span class="dot"></span>' + esc(t.nombre) + "</p>" +
        '<h2 class="quiz__q">' + esc(it.q.p) + "</h2>" +
        '<div class="quiz__opts">' + it.opciones.map(function (o, k) {
          return '<button type="button" class="quiz__opt" data-op="' + k + '"><span class="quiz__letra">' + LETRAS[k] + "</span><span>" + esc(o) + "</span></button>";
        }).join("") + "</div>" +
        '<div class="quiz__after" id="quiz-after"></div>' +
      "</div>";
      var barra = $("quiz-timer");
      clearInterval(reloj);
      reloj = setInterval(function () {
        var resto = Math.max(0, 1 - (Date.now() - J.t0) / (SEG * 1000));
        if (barra) barra.style.width = (resto * 100) + "%";
        if (!resto) clearInterval(reloj);
      }, 100);
    };

    var responder = function (k) {
      if (J.respondida) return;
      J.respondida = true; clearInterval(reloj);
      var it = J.lista[J.i], elegida = it.opciones[k], bien = elegida === it.q.ok;
      var seg = (Date.now() - J.t0) / 1000, extra = bien ? Math.round(Math.max(0, 50 * (1 - seg / SEG))) : 0;
      var gano = bien ? 100 + extra : 0;
      J.puntos += gano; if (bien) J.aciertos++;
      J.resp.push({ q: it.q, elegida: elegida, bien: bien });
      cont.querySelectorAll(".quiz__opt").forEach(function (b) {
        var o = it.opciones[+b.getAttribute("data-op")];
        b.disabled = true;
        if (o === it.q.ok) b.classList.add("is-ok");
        else if (b.getAttribute("data-op") == k) b.classList.add("is-bad");
      });
      cont.querySelector(".quiz__pts strong").textContent = J.puntos;
      var ultima = J.i === J.lista.length - 1;
      $("quiz-after").innerHTML = '<p class="quiz__feedback ' + (bien ? "is-ok" : "is-bad") + '"><strong>' + (bien ? "¡Correcto! +" + gano + " puntos" : "Casi… la respuesta era: " + esc(it.q.ok)) + "</strong>" +
        (it.q.porque ? "<span>" + esc(it.q.porque) + "</span>" : "") + "</p>" +
        '<button type="button" class="btn" data-accion="siguiente">' + (ultima ? "Ver resultado" : "Siguiente") + "</button>";
      $("quiz-after").querySelector("button").focus();
    };

    var final = function () {
      var antes = mejor(claveTemas()), nuevo = J.puntos > antes;
      mejor(claveTemas(), J.puntos);
      var a = J.aciertos, msg = a === 10 ? "¡Perfecto! Sos un crack." : a >= 7 ? "¡Muy bien! Se nota que sabés." : a >= 4 ? "¡Nada mal! Siempre hay algo nuevo para aprender." : "¡Hay mucho por descubrir!";
      cont.innerHTML = '<div class="quiz__card quiz__end">' +
        '<p class="eyebrow">Resultado</p><p class="quiz__score">' + J.puntos + "<span>puntos</span></p>" +
        '<p class="quiz__hits"><strong>' + a + " de " + J.lista.length + "</strong> respuestas correctas · " + esc(msg) + "</p>" +
        (nuevo ? '<p class="quiz__record">¡Nuevo récord personal!</p>' : antes ? '<p class="quiz__best">Tu mejor puntaje en <em>' + esc(nombreTemas()) + "</em>: <strong>" + antes + "</strong></p>" : "") +
        '<div class="hero__ctas"><button type="button" class="btn" data-accion="empezar">Jugar de nuevo</button><button type="button" class="btn btn--ghost" data-accion="inicio">Cambiar de tema</button></div>' +
        (a < 7 ? '<p class="quiz__more">¿Querés aprender más? Mirá la <a class="link" href="recursos.html">biblioteca</a> o los <a class="link" href="santos.html">santos</a>.</p>' : "") +
        '<details class="quiz__review"><summary>Revisar mis respuestas</summary><ol>' + J.resp.map(function (r) {
          return '<li class="' + (r.bien ? "is-ok" : "is-bad") + '"><strong>' + esc(r.q.p) + "</strong><span>" + (r.bien ? "✓ " + esc(r.q.ok) : "✗ " + esc(r.elegida) + " · Correcta: " + esc(r.q.ok)) + "</span></li>";
        }).join("") + "</ol></details>" +
      "</div>";
    };

    cont.addEventListener("click", function (ev) {
      var b = ev.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-tema")) {
        var id = b.getAttribute("data-tema"), k = J.temas.indexOf(id);
        if (id === "todos") J.temas = [];
        else if (k >= 0) J.temas.splice(k, 1);
        else J.temas.push(id);
        if (J.temas.length === Q.temas.length) J.temas = [];
        inicio(); return;
      }
      if (b.hasAttribute("data-op")) { responder(+b.getAttribute("data-op")); return; }
      var acc = b.getAttribute("data-accion");
      if (acc === "empezar") empezar();
      else if (acc === "inicio") inicio();
      else if (acc === "siguiente") { J.i++; if (J.i < J.lista.length) pregunta(); else final(); }
    });
    document.addEventListener("keydown", function (ev) {
      if (!cont.querySelector(".quiz__opt") || J.respondida) return;
      var k = ["1", "2", "3", "4"].indexOf(ev.key); if (k < 0) k = ["a", "b", "c", "d"].indexOf(ev.key.toLowerCase());
      if (k >= 0) responder(k);
    });
    inicio();
  }

  /* ---------- diccionario de santos: buscador y filtros ---------- */
  if ($("dic")) {
    var DF = { tipo: "todos", letra: "" };
    var items = [].slice.call(document.querySelectorAll(".dic__item"));
    var filtrar = function () {
      var q = sinTildes($("q-santos").value).toLowerCase().trim(), vis = 0;
      items.forEach(function (it) {
        var ok = (!q || q.split(/\s+/).every(function (w) { return it.getAttribute("data-txt").indexOf(w) >= 0; })) &&
          (DF.tipo === "todos" || (DF.tipo === "ficha" ? it.getAttribute("data-ficha") === "1" : it.getAttribute("data-g") === DF.tipo)) &&
          (!DF.letra || it.getAttribute("data-letra") === DF.letra);
        it.hidden = !ok; if (ok) vis++;
      });
      $("santos-count").textContent = vis === items.length ? items.length + " santos y beatos" : vis + (vis === 1 ? " resultado" : " resultados");
      $("santos-vacio").hidden = vis > 0;
      document.querySelectorAll("[data-dic]").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-dic") === DF.tipo); });
      document.querySelectorAll(".dic__letras button").forEach(function (b) { b.classList.toggle("is-on", b.getAttribute("data-letra") === DF.letra); });
    };
    $("q-santos").addEventListener("input", filtrar);
    document.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-dic], .dic__letras button");
      if (!b) return;
      if (b.hasAttribute("data-dic")) DF.tipo = b.getAttribute("data-dic");
      else DF.letra = DF.letra === b.getAttribute("data-letra") ? "" : b.getAttribute("data-letra");
      filtrar();
    });
    /* si se llega con un link a un santo (santos.html#carlo-acutis), se abre su ficha */
    var abrir = location.hash && document.getElementById(location.hash.slice(1));
    if (abrir && abrir.tagName === "DETAILS") abrir.open = true;
    filtrar();
  }

  /* ---------- interacciones ---------- */
  document.querySelectorAll("[data-scroll]").forEach(function (b) {
    b.addEventListener("click", function () {
      var t = $(b.getAttribute("data-target"));
      t.scrollBy({ left: Number(b.getAttribute("data-scroll")) * t.clientWidth * 0.8, behavior: "smooth" });
    });
  });

  /* Carrusel automático: avanza solo y se pausa cuando la persona interactúa */
  var car = $("carrusel");
  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (car && !quieto) {
    var pausa = false, reanudar;
    var avanzar = function () {
      if (pausa || document.hidden) return;
      var item = car.querySelector(".gallery__item");
      var paso = item ? item.getBoundingClientRect().width + 14 : car.clientWidth * 0.8;
      if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 8) car.scrollTo({ left: 0, behavior: "smooth" });
      else car.scrollBy({ left: paso, behavior: "smooth" });
    };
    var parar = function () { pausa = true; clearTimeout(reanudar); };
    var seguir = function (ms) { clearTimeout(reanudar); reanudar = setTimeout(function () { pausa = false; }, ms || 0); };
    car.addEventListener("mouseenter", parar);
    car.addEventListener("mouseleave", function () { seguir(1500); });
    car.addEventListener("focusin", parar);
    car.addEventListener("focusout", function () { seguir(1500); });
    car.addEventListener("touchstart", parar, { passive: true });
    car.addEventListener("touchend", function () { seguir(6000); }, { passive: true });
    document.querySelectorAll('[data-target="carrusel"]').forEach(function (b) {
      b.addEventListener("click", function () { parar(); seguir(8000); });
    });
    setInterval(avanzar, 4000);
  }

  var nav = $("nav"), toggle = nav.querySelector(".nav__toggle");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  var drop = nav.querySelector(".drop"), dropBtn = drop.querySelector(".drop__btn");
  dropBtn.addEventListener("click", function (ev) {
    ev.stopPropagation();
    var open = drop.classList.toggle("is-open");
    dropBtn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", function (ev) {
    if (!drop.contains(ev.target)) { drop.classList.remove("is-open"); dropBtn.setAttribute("aria-expanded", false); }
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape") { drop.classList.remove("is-open"); dropBtn.setAttribute("aria-expanded", false); }
  });
  window.addEventListener("scroll", function () { nav.classList.toggle("is-scrolled", window.scrollY > 8); }, { passive: true });

  /* Visor de reels */
  if (C.reelsIncrustados && typeof HTMLDialogElement === "function") {
    var visor = document.createElement("dialog");
    visor.className = "viewer";
    visor.setAttribute("aria-label", "Reel de Instagram");
    visor.innerHTML = '<div class="viewer__box"><button class="viewer__close" type="button" aria-label="Cerrar">×</button><div class="viewer__frame"></div><a class="viewer__link" href="#" target="_blank" rel="noopener">Abrir en Instagram</a></div>';
    document.body.appendChild(visor);
    var frame = visor.querySelector(".viewer__frame");
    visor.addEventListener("close", function () { frame.innerHTML = ""; });
    visor.querySelector(".viewer__close").addEventListener("click", function () { visor.close(); });
    visor.addEventListener("click", function (ev) { if (ev.target === visor) visor.close(); });
    document.addEventListener("click", function (ev) {
      var a = ev.target.closest && ev.target.closest("[data-reel]");
      if (!a || ev.metaKey || ev.ctrlKey) return;
      ev.preventDefault();
      var id = a.getAttribute("data-reel");
      frame.innerHTML = '<iframe src="https://www.instagram.com/reel/' + encodeURIComponent(id) + '/embed" title="Reel de Instagram" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
      visor.querySelector(".viewer__link").href = reelUrl(id);
      visor.showModal();
    });
  }

  /* Al abrir una página: ir a la sección del link (#…) o, si no hay, arrancar desde arriba.
     scrollIntoView también mueve el marco que la contiene (por ejemplo, la vista previa). */
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  var destinoInicial = location.hash && document.getElementById(location.hash.slice(1));
  var irAlInicio = function () {
    if (destinoInicial) { destinoInicial.scrollIntoView({ block: "start" }); return; }
    window.scrollTo(0, 0);
    var arriba = document.getElementById("arriba");
    if (!arriba) { document.body.insertAdjacentHTML("afterbegin", '<div id="arriba" style="position:absolute;top:0;left:0;width:1px;height:1px"></div>'); arriba = document.getElementById("arriba"); }
    if (window.self !== window.top) arriba.scrollIntoView({ block: "start" });
  };
  /* La vista previa (y algunos navegadores) reacomodan el scroll un momento después de cargar:
     repetimos durante el primer segundo y medio, salvo que la persona ya haya empezado a moverse. */
  var tocado = false, marcar = function () { tocado = true; };
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (ev) { window.addEventListener(ev, marcar, { passive: true, once: true }); });
  [0, 120, 350, 700, 1100, 1500].forEach(function (ms) { setTimeout(function () { if (!tocado) irAlInicio(); }, ms); });
  window.addEventListener("load", function () { if (!tocado) irAlInicio(); });
  window.addEventListener("pageshow", function (ev) { if (ev.persisted) irAlInicio(); });
})();
