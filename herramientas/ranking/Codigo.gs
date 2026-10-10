/** @OnlyCurrentDoc */
/**
 * Cuentas, ranking parroquial e insignias de Jóvenes Sagrada Familia y la Academia Frassati.
 * Se pega en: planilla de Google (cuenta academiafrassati) → Extensiones → Apps Script (ver LEEME.md).
 *
 * @OnlyCurrentDoc: este script solo puede leer y escribir ESTA planilla, ninguna otra de la cuenta.
 *
 * Pestañas (se crean solas):
 *   Usuarios:  ID | Email | Nombre (Google) | Nombre en el ranking | Grupo | Estado | Alta | Último ingreso
 *   Puntajes:  Fecha | ID | Juego | Puntos | Desafío # | Registrado
 *   Insignias: Fecha | ID | Curso | Insignia | Nota | Registrado
 *   Sesiones:  (interna, no tocar) Huella | ID | Vence
 *
 * Seguridad:
 *   - El inicio de sesión lo hace Google. Acá solo llega un "comprobante" firmado por Google, que se verifica con Google.
 *   - Nadie entra hasta que el administrador pone su Estado en "aprobado".
 *   - Las sesiones se guardan como huella (hash): aunque alguien viera la planilla, no podría usarlas.
 *   - La web nunca recibe mails ni IDs de otras personas: solo nombre visible, grupo, puntos e insignias.
 *   - Todo texto que llega de afuera se limpia antes de guardarse (evita fórmulas inyectadas en la planilla).
 */

var CLIENT_ID = '938247619466-bc1mftrsnnrbh9f3hk1i3j1o5r3stoq2.apps.googleusercontent.com';
var JUEGOS = ['santo', 'versiculo', 'crucigrama', 'conexiones'];
var CURSOS = { 'sacramentos': '🕯️', 'misa': '⛪', 'coordinador': '🧭', 'hablar-de-jesus': '💬' };
var ESTADOS = ['pendiente', 'aprobado', 'baja'];
var ZONA = 'America/Argentina/Buenos_Aires';
var TOP = 20;
var DIAS_SESION = 120;

/* ---------- menú de la planilla ---------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Administración')
    .addItem('Preparar pestañas', 'preparar')
    .addItem('Pasar jugadores con código a Usuarios', 'migrarJugadores')
    .addItem('Cerrar todas las sesiones', 'cerrarSesiones')
    .addToUi();
}

function hoja(nombre, encabezados) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var h = ss.getSheetByName(nombre);
  if (!h) {
    h = ss.insertSheet(nombre);
    h.appendRow(encabezados);
    h.setFrozenRows(1);
    h.getRange(1, 1, 1, encabezados.length).setFontWeight('bold');
  }
  return h;
}
function hojaUsuarios() { return hoja('Usuarios', ['ID', 'Email', 'Nombre (Google)', 'Nombre en el ranking', 'Grupo', 'Estado', 'Alta', 'Último ingreso']); }
function hojaPuntajes() { return hoja('Puntajes', ['Fecha', 'ID', 'Juego', 'Puntos', 'Desafío #', 'Registrado']); }
function hojaInsignias() { return hoja('Insignias', ['Fecha', 'ID', 'Curso', 'Insignia', 'Nota', 'Registrado']); }
function hojaSesiones() {
  var h = hoja('Sesiones', ['Huella', 'ID', 'Vence']);
  if (!h.isSheetHidden()) h.hideSheet();
  return h;
}

function preparar() {
  var u = hojaUsuarios();
  hojaPuntajes(); hojaInsignias(); hojaSesiones();
  var regla = SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).build();
  u.getRange('F2:F1000').setDataValidation(regla);
  SpreadsheetApp.getUi().alert('Listo. Cuando alguien entra con Google por primera vez, aparece en "Usuarios" como pendiente. ' +
    'Para habilitarlo, poné su Estado en "aprobado" y completá "Nombre en el ranking" y "Grupo".');
}

/* Pasa los jugadores de la pestaña vieja "Jugadores" (con código) a "Usuarios", conservando sus puntos.
   Después completá la columna Email de cada uno: cuando entre con esa cuenta de Google, recupera todo. */
function migrarJugadores() {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), vieja = ss.getSheetByName('Jugadores');
  if (!vieja) { SpreadsheetApp.getUi().alert('No hay pestaña "Jugadores".'); return; }
  var u = hojaUsuarios(), ya = {};
  u.getDataRange().getValues().slice(1).forEach(function (f) { ya[String(f[0])] = true; });
  var n = 0;
  vieja.getDataRange().getValues().slice(1).forEach(function (f) {
    var id = String(f[0] || '').toUpperCase().trim();
    if (!id || ya[id]) return;
    u.appendRow([id, '', '', limpio(f[1], 40), limpio(f[2], 30), f[3] === true ? 'aprobado' : 'baja', new Date(), '']);
    n++;
  });
  SpreadsheetApp.getUi().alert(n + ' jugadores pasados a "Usuarios". Completá su Email para que puedan entrar con Google.');
}

function cerrarSesiones() {
  var s = hojaSesiones();
  if (s.getLastRow() > 1) s.deleteRows(2, s.getLastRow() - 1);
  SpreadsheetApp.getUi().alert('Se cerraron todas las sesiones. Todos van a tener que volver a entrar con Google.');
}

/* ---------- utilidades ---------- */
function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
/* Saca lo que podría convertirse en fórmula o en algo raro dentro de la planilla. */
function limpio(v, max) {
  var t = String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
  while (/^[=+\-@\t\r']/.test(t)) t = t.slice(1).trim();
  return t.slice(0, max || 60);
}
function huella(token) {
  var b = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(token), Utilities.Charset.UTF_8);
  return Utilities.base64Encode(b);
}
function hoyAR() { return Utilities.formatDate(new Date(), ZONA, 'yyyy-MM-dd'); }
function lunesAR() {
  var hoy = new Date(hoyAR() + 'T12:00:00');
  hoy.setDate(hoy.getDate() - (hoy.getDay() + 6) % 7);
  return Utilities.formatDate(hoy, ZONA, 'yyyy-MM-dd');
}
function textoFecha(v) { return v instanceof Date ? Utilities.formatDate(v, ZONA, 'yyyy-MM-dd') : String(v); }
function nuevoId(usados) {
  var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', c;
  do { c = ''; for (var k = 0; k < 8; k++) c += letras.charAt(Math.floor(Math.random() * letras.length)); } while (usados[c]);
  return c;
}

/* Usuarios aprobados: { ID: {nombre, grupo} } */
function aprobados() {
  var out = {};
  hojaUsuarios().getDataRange().getValues().slice(1).forEach(function (f) {
    var id = String(f[0] || ''), nombre = String(f[3] || '').trim();
    if (id && f[5] === 'aprobado') out[id] = { nombre: nombre || String(f[2] || '').split(' ')[0] || 'Sin nombre', grupo: String(f[4] || '').trim() };
  });
  return out;
}

/* ---------- entrada ---------- */
function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.accion === 'ranking') return respuesta(ranking(null));
    return respuesta({ ok: false, error: 'accion' });
  } catch (err) {
    return respuesta({ ok: false, error: 'interno' });
  }
}

function doPost(e) {
  var p;
  try { p = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (x) { return respuesta({ ok: false, error: 'formato' }); }
  try {
    if (p.accion === 'login') return respuesta(login(p));
    var yo = sesion(p.sesion);
    if (p.accion === 'ranking') return respuesta(p.sesion && !yo ? { ok: false, error: 'sesion' } : ranking(yo));
    if (!yo) return respuesta({ ok: false, error: 'sesion' });
    if (p.accion === 'yo') return respuesta({ ok: true, nombre: yo.nombre, grupo: yo.grupo });
    if (p.accion === 'puntaje') return respuesta(puntaje(yo, p));
    if (p.accion === 'insignia') return respuesta(insignia(yo, p));
    if (p.accion === 'salir') return respuesta(salir(p.sesion));
    return respuesta({ ok: false, error: 'accion' });
  } catch (err) {
    return respuesta({ ok: false, error: 'interno' });
  }
}

/* ---------- cuentas ---------- */
/* Verifica con Google el comprobante (ID token) que manda el botón "Entrar con Google". */
function verificarGoogle(credencial) {
  if (!credencial || String(credencial).length > 4096) return null;
  var r = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credencial), { muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) return null;
  var t = JSON.parse(r.getContentText());
  var emisorOk = t.iss === 'accounts.google.com' || t.iss === 'https://accounts.google.com';
  var vigente = Number(t.exp) * 1000 > Date.now();
  if (t.aud !== CLIENT_ID || !emisorOk || !vigente || String(t.email_verified) !== 'true' || !t.email) return null;
  return { email: String(t.email).toLowerCase(), nombre: limpio(t.name || t.given_name || '', 60) };
}

function login(p) {
  var g = verificarGoogle(p.credencial);
  if (!g) return { ok: false, error: 'google' };
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var u = hojaUsuarios(), datos = u.getDataRange().getValues(), fila = -1, usados = {};
    for (var i = 1; i < datos.length; i++) {
      usados[String(datos[i][0])] = true;
      if (String(datos[i][1]).toLowerCase().trim() === g.email) fila = i;
    }
    if (fila < 0) {
      u.appendRow([nuevoId(usados), g.email, g.nombre, '', '', 'pendiente', new Date(), new Date()]);
      avisarNuevo(g);
      return { ok: true, estado: 'pendiente', nombre: g.nombre.split(' ')[0] };
    }
    var f = datos[fila], estado = String(f[5] || 'pendiente');
    if (!f[2]) u.getRange(fila + 1, 3).setValue(g.nombre);
    u.getRange(fila + 1, 8).setValue(new Date());
    if (estado !== 'aprobado') return { ok: true, estado: estado, nombre: g.nombre.split(' ')[0] };
    var token = Utilities.getUuid() + Utilities.getUuid(), vence = new Date(Date.now() + DIAS_SESION * 864e5);
    hojaSesiones().appendRow([huella(token), String(f[0]), vence]);
    return { ok: true, estado: 'aprobado', sesion: token, nombre: String(f[3] || '').trim() || g.nombre.split(' ')[0], grupo: String(f[4] || '').trim() };
  } finally {
    lock.releaseLock();
  }
}

/* Un mail al administrador cuando alguien nuevo pide entrar (solo nombre, para que lo apruebe). */
function avisarNuevo(g) {
  try {
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(), 'Nueva cuenta pendiente: ' + g.nombre,
      g.nombre + ' (' + g.email + ') entró por primera vez con Google y está esperando aprobación.\n\n' +
      'Para habilitarlo: abrí la planilla, pestaña Usuarios, poné su Estado en "aprobado" y completá Nombre en el ranking y Grupo.');
  } catch (x) { /* si falla el mail, el pedido igual queda en la planilla */ }
}

/* Devuelve {id, nombre, grupo} si la sesión es válida y el usuario sigue aprobado. */
function sesion(token) {
  if (!token || String(token).length > 200) return null;
  var h = huella(token), datos = hojaSesiones().getDataRange().getValues(), id = null;
  for (var i = 1; i < datos.length; i++) {
    if (datos[i][0] === h && new Date(datos[i][2]).getTime() > Date.now()) { id = String(datos[i][1]); break; }
  }
  if (!id) return null;
  var a = aprobados()[id];
  return a ? { id: id, nombre: a.nombre, grupo: a.grupo } : null;
}

function salir(token) {
  var s = hojaSesiones(), h = huella(token), datos = s.getDataRange().getValues();
  for (var i = datos.length - 1; i >= 1; i--) {
    if (datos[i][0] === h || new Date(datos[i][2]).getTime() < Date.now()) s.deleteRow(i + 1);
  }
  return { ok: true };
}

/* ---------- puntos e insignias ---------- */
function puntaje(yo, p) {
  var juego = String(p.juego || ''), pts = Number(p.puntos), fecha = String(p.fecha || '');
  if (JUEGOS.indexOf(juego) < 0) return { ok: false, error: 'juego' };
  if (!(pts >= 0 && pts <= 100) || Math.round(pts) !== pts) return { ok: false, error: 'puntos' };
  if (fecha !== hoyAR()) return { ok: false, error: 'fecha' }; // solo el desafío del día
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var h = hojaPuntajes(), datos = h.getDataRange().getValues();
    for (var i = 1; i < datos.length; i++) {
      if (textoFecha(datos[i][0]) === fecha && String(datos[i][1]) === yo.id && datos[i][2] === juego) return { ok: true, repetido: true };
    }
    h.appendRow([fecha, yo.id, juego, pts, Math.max(0, Math.round(Number(p.num) || 0)), new Date()]);
    CacheService.getScriptCache().remove('ranking');
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function insignia(yo, p) {
  var curso = String(p.curso || ''), nota = Number(p.nota);
  if (!CURSOS.hasOwnProperty(curso)) return { ok: false, error: 'curso' };
  if (!(nota >= 8 && nota <= 10) || Math.round(nota) !== nota) return { ok: false, error: 'nota' };
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var h = hojaInsignias(), datos = h.getDataRange().getValues();
    for (var i = 1; i < datos.length; i++) {
      if (String(datos[i][1]) === yo.id && datos[i][2] === curso) return { ok: true, repetido: true };
    }
    h.appendRow([hoyAR(), yo.id, curso, CURSOS[curso], nota, new Date()]);
    CacheService.getScriptCache().remove('ranking');
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/* ---------- ranking ---------- */
function insigniasPorJugador() {
  var out = {};
  hojaInsignias().getDataRange().getValues().slice(1).forEach(function (f) {
    var id = String(f[1]), ic = CURSOS[f[2]];
    if (!id || !ic) return;
    out[id] = out[id] || [];
    if (out[id].indexOf(ic) < 0) out[id].push(ic);
  });
  return out;
}

function tabla(totales, js) {
  var filas = Object.keys(totales).filter(function (c) { return js[c]; })
    .map(function (c) { return { id: c, nombre: js[c].nombre, grupo: js[c].grupo, puntos: totales[c] }; })
    .sort(function (a, b) { return b.puntos - a.puntos || a.nombre.localeCompare(b.nombre); });
  var pos = 0, ant = null;
  filas.forEach(function (f, i) { if (f.puntos !== ant) { pos = i + 1; ant = f.puntos; } f.pos = pos; });
  return filas;
}

/* Nombre "oficial" del grupo, para que "faro", "Faro" o "FARO" cuenten como el mismo. */
var GRUPOS = [['faro', 'FARO'], ['confir', 'Confirmación'], ['post', 'Post'], ['hpp', 'HPP'], ['puente', 'Puente a María'], ['naza', 'Nazaret']];
function grupoOficial(texto) {
  var t = String(texto || '').trim(), n = t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (!n) return '';
  for (var i = 0; i < GRUPOS.length; i++) if (n.indexOf(GRUPOS[i][0]) === 0) return GRUPOS[i][1];
  return t;
}

/* Promedio de puntos por jugador que sumó algo en el período (así no gana el grupo con más chicos). */
function tablaGrupos(totales, js) {
  var g = {};
  Object.keys(totales).forEach(function (c) {
    if (!js[c] || !totales[c]) return;
    var nombre = grupoOficial(js[c].grupo);
    if (!nombre) return;
    g[nombre] = g[nombre] || { suma: 0, jugadores: 0 };
    g[nombre].suma += totales[c];
    g[nombre].jugadores++;
  });
  var filas = Object.keys(g).map(function (k) { return { grupo: k, promedio: Math.round(g[k].suma / g[k].jugadores), jugadores: g[k].jugadores }; })
    .sort(function (a, b) { return b.promedio - a.promedio || b.jugadores - a.jugadores; });
  var pos = 0, ant = null;
  filas.forEach(function (f, i) { if (f.promedio !== ant) { pos = i + 1; ant = f.promedio; } f.pos = pos; });
  return filas;
}

function ranking(yo) {
  var cache = CacheService.getScriptCache(), base = cache.get('ranking'), r;
  if (base) r = JSON.parse(base);
  else {
    var js = aprobados(), datos = hojaPuntajes().getDataRange().getValues(), lunes = lunesAR();
    var d = new Date(lunes + 'T12:00:00'); d.setDate(d.getDate() - 7);
    var lunesPasado = Utilities.formatDate(d, ZONA, 'yyyy-MM-dd');
    var semana = {}, historico = {}, pasada = {};
    datos.slice(1).forEach(function (f) {
      var id = String(f[1]), pts = Number(f[3]) || 0, fecha = textoFecha(f[0]);
      historico[id] = (historico[id] || 0) + pts;
      if (fecha >= lunes) semana[id] = (semana[id] || 0) + pts;
      else if (fecha >= lunesPasado) pasada[id] = (pasada[id] || 0) + pts;
    });
    r = {
      semana: tabla(semana, js), historico: tabla(historico, js),
      podio: tabla(pasada, js).filter(function (f) { return f.pos <= 3 && f.puntos > 0; }),
      grupos: tablaGrupos(semana, js), insignias: insigniasPorJugador()
    };
    cache.put('ranking', JSON.stringify(r), 60);
  }
  var mio = {};
  if (yo) ['semana', 'historico'].forEach(function (k) {
    var f = r[k].filter(function (x) { return x.id === yo.id; })[0];
    if (f) mio[k] = { pos: f.pos, puntos: f.puntos };
  });
  var ins = r.insignias || {};
  /* a la web solo salen nombre visible, grupo, puntos e insignias (nunca IDs ni mails) */
  var publico = function (filas) {
    return filas.slice(0, TOP).map(function (f) { return { pos: f.pos, nombre: f.nombre, grupo: f.grupo, puntos: f.puntos, insignias: ins[f.id] || [], yo: !!(yo && f.id === yo.id) }; });
  };
  return { ok: true, semana: publico(r.semana), historico: publico(r.historico), podio: publico(r.podio || []),
           grupos: r.grupos || [], yo: mio, misInsignias: yo ? (ins[yo.id] || []) : [] };
}
