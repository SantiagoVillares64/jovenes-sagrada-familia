/**
 * Ranking parroquial de los juegos de Jóvenes Sagrada Familia.
 * Se pega en: planilla de Google → Extensiones → Apps Script (ver LEEME.md).
 *
 * Pestañas que usa (las crea solo la primera vez):
 *   Jugadores: Código | Nombre en el ranking | Grupo | Activo
 *   Puntajes:  Fecha | Código | Juego | Puntos | Desafío # | Registrado
 */

var JUEGOS = ['santo', 'versiculo', 'crucigrama', 'conexiones'];
var ZONA = 'America/Argentina/Buenos_Aires';
var TOP = 20;

/* ---------- menú de la planilla ---------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Ranking')
    .addItem('Preparar pestañas', 'preparar')
    .addItem('Generar códigos para los nuevos', 'generarCodigos')
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
function hojaJugadores() { return hoja('Jugadores', ['Código', 'Nombre en el ranking', 'Grupo', 'Activo']); }
function hojaPuntajes() { return hoja('Puntajes', ['Fecha', 'Código', 'Juego', 'Puntos', 'Desafío #', 'Registrado']); }

function preparar() {
  var j = hojaJugadores();
  hojaPuntajes();
  j.getRange('D2:D500').insertCheckboxes();
  SpreadsheetApp.getUi().alert('Listo. Cargá los nombres en "Jugadores" (columna B), tildá "Activo" y después usá Ranking → Generar códigos.');
}

/* Completa la columna Código de las filas que tienen nombre y no tienen código. */
function generarCodigos() {
  var h = hojaJugadores(), datos = h.getDataRange().getValues(), usados = {};
  var letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I para que no se confundan
  datos.slice(1).forEach(function (f) { if (f[0]) usados[String(f[0]).toUpperCase()] = true; });
  var nuevos = 0;
  for (var i = 1; i < datos.length; i++) {
    if (datos[i][1] && !datos[i][0]) {
      var c;
      do { c = ''; for (var k = 0; k < 6; k++) c += letras.charAt(Math.floor(Math.random() * letras.length)); } while (usados[c]);
      usados[c] = true;
      h.getRange(i + 1, 1).setValue(c);
      h.getRange(i + 1, 4).setValue(true); // un jugador nuevo queda activo
      nuevos++;
    }
  }
  SpreadsheetApp.getUi().alert(nuevos ? 'Se generaron ' + nuevos + ' códigos nuevos.' : 'No había nombres sin código.');
}

/* ---------- web ---------- */
function respuesta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function jugadores() {
  var datos = hojaJugadores().getDataRange().getValues(), out = {};
  datos.slice(1).forEach(function (f) {
    var cod = String(f[0] || '').toUpperCase().trim();
    if (cod && f[1] && f[3] === true) out[cod] = { nombre: String(f[1]).trim(), grupo: String(f[2] || '').trim() };
  });
  return out;
}

function hoyAR() { return Utilities.formatDate(new Date(), ZONA, 'yyyy-MM-dd'); }

function lunesAR() {
  var hoy = new Date(hoyAR() + 'T12:00:00');
  var dia = (hoy.getDay() + 6) % 7; // 0 = lunes
  hoy.setDate(hoy.getDate() - dia);
  return Utilities.formatDate(hoy, ZONA, 'yyyy-MM-dd');
}

function textoFecha(v) {
  return v instanceof Date ? Utilities.formatDate(v, ZONA, 'yyyy-MM-dd') : String(v);
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.accion === 'entrar') return respuesta(entrar(p));
    if (p.accion === 'puntaje') return respuesta(puntaje(p));
    if (p.accion === 'ranking') return respuesta(ranking(p));
    return respuesta({ ok: false, error: 'accion' });
  } catch (err) {
    return respuesta({ ok: false, error: String(err) });
  }
}

function entrar(p) {
  var j = jugadores()[String(p.codigo || '').toUpperCase()];
  return j ? { ok: true, nombre: j.nombre } : { ok: false };
}

function puntaje(p) {
  var cod = String(p.codigo || '').toUpperCase(), juego = String(p.juego || ''), pts = Number(p.puntos);
  if (!jugadores()[cod]) return { ok: false, error: 'codigo' };
  if (JUEGOS.indexOf(juego) < 0) return { ok: false, error: 'juego' };
  if (!(pts >= 0 && pts <= 100) || Math.round(pts) !== pts) return { ok: false, error: 'puntos' };
  var fecha = String(p.fecha || '');
  if (fecha !== hoyAR()) return { ok: false, error: 'fecha' }; // solo se suma el desafío del día
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var h = hojaPuntajes(), datos = h.getDataRange().getValues();
    for (var i = 1; i < datos.length; i++) {
      if (textoFecha(datos[i][0]) === fecha && String(datos[i][1]).toUpperCase() === cod && datos[i][2] === juego) {
        return { ok: true, repetido: true }; // cada desafío cuenta una sola vez por día
      }
    }
    h.appendRow([fecha, cod, juego, pts, Number(p.num) || '', new Date()]);
    CacheService.getScriptCache().remove('ranking');
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

function tabla(totales, js) {
  var filas = Object.keys(totales).filter(function (c) { return js[c]; })
    .map(function (c) { return { codigo: c, nombre: js[c].nombre, grupo: js[c].grupo, puntos: totales[c] }; })
    .sort(function (a, b) { return b.puntos - a.puntos || a.nombre.localeCompare(b.nombre); });
  var pos = 0, ant = null;
  filas.forEach(function (f, i) { if (f.puntos !== ant) { pos = i + 1; ant = f.puntos; } f.pos = pos; });
  return filas;
}

function ranking(p) {
  var cache = CacheService.getScriptCache(), base = cache.get('ranking'), r;
  if (base) r = JSON.parse(base);
  else {
    var js = jugadores(), datos = hojaPuntajes().getDataRange().getValues(), lunes = lunesAR();
    var semana = {}, historico = {};
    datos.slice(1).forEach(function (f) {
      var cod = String(f[1]).toUpperCase(), pts = Number(f[3]) || 0, fecha = textoFecha(f[0]);
      historico[cod] = (historico[cod] || 0) + pts;
      if (fecha >= lunes) semana[cod] = (semana[cod] || 0) + pts;
    });
    r = { semana: tabla(semana, js), historico: tabla(historico, js) };
    cache.put('ranking', JSON.stringify(r), 60);
  }
  var cod = String(p.codigo || '').toUpperCase(), yo = {};
  ['semana', 'historico'].forEach(function (k) {
    var mio = r[k].filter(function (f) { return f.codigo === cod; })[0];
    if (mio) yo[k] = { pos: mio.pos, puntos: mio.puntos };
  });
  var limpiar = function (filas) { return filas.slice(0, TOP).map(function (f) { return { pos: f.pos, nombre: f.nombre, grupo: f.grupo, puntos: f.puntos }; }); };
  return { ok: true, semana: limpiar(r.semana), historico: limpiar(r.historico), yo: yo };
}
