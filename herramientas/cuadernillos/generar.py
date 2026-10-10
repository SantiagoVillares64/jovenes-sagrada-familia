"""Genera los cuadernillos A4 de la Academia Frassati (docs/academia/*.pdf) con el diseño del manual de marca.

Uso:  python herramientas/cuadernillos/textos.py     (solo si hay que volver a bajar los textos oficiales)
      python herramientas/cuadernillos/generar.py    (todas las cumbres)
      python herramientas/cuadernillos/generar.py misa (una sola)

Necesita Microsoft Edge (o Chrome) instalado: lo usa para pasar el HTML a PDF.
"""
import html
import json
import os
import pathlib
import re
import subprocess
import sys
import unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.dirname(os.path.dirname(AQUI))
SALIDA = os.path.join(WEB, 'docs', 'academia')
sys.path.insert(0, AQUI)
from contenido import CUMBRES, TEXTO_HABLAR  # noqa: E402

URL_ACADEMIA = 'sagradafamiliajoven.github.io/academia.html'
ISO = ('M2 84 C7 77 12 73 17 72 C21 71 22 71 25 68 L34 60 C37 57 39 56 41 57 L45 61 C49 56 53 51 55.5 47.5 C56.5 46 57.3 44.8 58 44 '
       'L58 24 L58 30 L52 30 L64 30 L58 30 L58 44 C59.5 46 61.5 49 64 52 C67 56 70 58 73 59 C75 59 76 58 78 57 C79 56 80 56 81 57 C86 63 92 72 98 84')


def iso(cls, w=2.2):
    return (f'<svg class="{cls}" viewBox="0 12 100 64" aria-hidden="true"><path d="{ISO}" transform="translate(0 -10)" fill="none" '
            f'stroke="currentColor" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def sello(cls):
    return (f'<svg class="{cls}" viewBox="0 0 100 100"><defs><path id="sc" d="M50 50 m-37.5 0 a37.5 37.5 0 1 1 75 0 a37.5 37.5 0 1 1 -75 0"/></defs>'
            '<circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="50" cy="50" r="33" fill="none" stroke="currentColor" stroke-width="1.1"/>'
            '<text fill="currentColor" font-family="Lora, Georgia, serif" font-size="7" letter-spacing="1"><textPath href="#sc" textLength="232" lengthAdjust="spacing">ACADEMIA FRASSATI · HACIA LO ALTO ·</textPath></text>'
            f'<g transform="translate(25 27) scale(.5)"><path d="{ISO}" transform="translate(0 -10)" fill="none" stroke="currentColor" stroke-width="2.42" stroke-linecap="round" stroke-linejoin="round"/></g></svg>')


def norm(s):
    s = unicodedata.normalize('NFD', re.sub(r'<[^>]+>', '', s)).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()


def bloques(c):
    if c['fuente_txt']:
        return json.load(open(os.path.join(AQUI, c['fuente_txt']), encoding='utf-8'))
    return [{'t': 'titulo', 'texto': x[1]} if x[0] == 't' else {'t': 'par', 'n': x[0], 'texto': x[1], 'propio': True} for x in TEXTO_HABLAR]


def controlar(cid, c, bl):
    pars = {b['n']: b for b in bl if b['t'] == 'par'}
    for n, (frase, _) in c['destacados'].items():
        if n not in pars:
            sys.exit(f'{cid}: destacado después del n. {n}, que no existe')
        if norm(frase) not in norm(pars[n]['texto']):
            sys.exit(f'{cid}: la frase destacada no es textual del n. {n}: «{frase}»')
    for n in c['pausas']:
        if n not in pars:
            sys.exit(f'{cid}: «Para detenerse» después del n. {n}, que no existe')


def cuerpo(c, bl):
    partes = []
    for b in bl:
        if b['t'] == 'titulo':
            partes.append(f'<h3 class="subt">{html.escape(b["texto"])}</h3>')
            continue
        t = b['texto'] if b.get('propio') else html.escape(b['texto'])
        if not re.search(r'[.!?»”"…)]$', t):
            t += '.'
        preg = b.get('pregunta')
        if preg:
            preg = re.sub(r'\s+\?', '?', preg)
            t = f'<strong class="preg">{html.escape(preg)}</strong> {t}'
        partes.append(f'<p class="par"><span class="num">{b["n"]}</span>{t}</p>')
        if b['n'] in c['destacados']:
            frase, ref = c['destacados'][b['n']]
            partes.append(f'<aside class="dest"><p>«{html.escape(frase)}»</p><span>{html.escape(ref)}</span></aside>')
        if b['n'] in c['pausas']:
            lis = ''.join(f'<li>{html.escape(q)}</li>' for q in c['pausas'][b['n']])
            partes.append(f'<aside class="pausa"><p class="rot">Para detenerse</p><ul>{lis}</ul></aside>')
    return '\n'.join(partes)


CSS = r'''
@page { size: A4; margin: 26mm 22mm 24mm;
  @top-left { content: "ACADEMIA FRASSATI · CUMBRE %(num)s"; font-family: Lora, Georgia, serif; font-size: 6.6pt; letter-spacing: .3em; color: #1B55A3; vertical-align: bottom; padding-bottom: 5mm; }
  @top-right { content: "Hacia lo alto"; font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 10pt; color: #2F7FE0; vertical-align: bottom; padding-bottom: 4.5mm; }
  @bottom-left { content: "%(pie)s"; font-family: Lora, Georgia, serif; font-size: 7pt; color: #5b6577; vertical-align: top; padding-top: 5mm; }
  @bottom-right { content: counter(page); font-family: 'Cormorant Garamond', Georgia, serif; font-size: 11pt; color: #16294A; vertical-align: top; padding-top: 4mm; } }
@page :first { margin: 0; @top-left { content: none; } @top-right { content: none; } @bottom-left { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; }
body { margin: 0; font-family: Lora, Georgia, serif; color: #16294A; font-size: 10pt; line-height: 1.62; }
svg text { stroke: none; }
.tapa { height: 297mm; background: #0F1F3C; color: #fff; padding: 26mm 22mm 24mm; display: flex; flex-direction: column; break-after: page; }
.tapa .rot { display: flex; justify-content: space-between; font-size: 7pt; letter-spacing: .34em; text-transform: uppercase; color: #7fb0f2; }
.tapa .iso { width: 46mm; color: #fff; margin-top: 52mm; }
.tapa .cumbre { font-size: 8pt; letter-spacing: .34em; text-transform: uppercase; margin: 14mm 0 0; }
.tapa h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400; font-size: 46pt; line-height: 1.02; margin: 4mm 0 0; max-width: 150mm; }
.tapa .lema { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; color: #7fb0f2; font-size: 19pt; margin: 6mm 0 0; }
.tapa .datos { margin-top: auto; border-top: .5pt solid rgba(127,176,242,.45); padding-top: 5mm; font-size: 8.5pt; line-height: 1.7; color: rgba(255,255,255,.84); }
.rot2 { font-size: 7pt; letter-spacing: .32em; text-transform: uppercase; color: #1B55A3; margin: 0 0 2mm; }
h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400; font-size: 28pt; line-height: 1.1; margin: 0 0 6mm; }
.antes { break-after: page; }
.antes > p { font-size: 11pt; line-height: 1.7; }
.caja { border: .6pt solid rgba(22,41,74,.2); background: #F3F2F2; padding: 6mm 7mm; margin: 6mm 0; break-inside: avoid; }
.caja ul { margin: 0; padding-left: 5mm; }
.caja li { margin-bottom: 1.6mm; }
.subt { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-style: italic; font-size: 17pt; line-height: 1.2; margin: 9mm 0 4mm; padding-top: 3mm; border-top: .8pt solid #2F7FE0; display: inline-block; break-after: avoid; }
.par { text-align: justify; hyphens: auto; margin: 0 0 3mm; position: relative; padding-left: 11mm; orphans: 3; widows: 3; }
.num { position: absolute; left: 0; top: 0; font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; font-size: 11pt; color: #1B55A3; }
.preg { font-weight: 600; display: block; margin-bottom: .8mm; }
.dest { margin: 6mm 0 6mm 11mm; padding: 1mm 0 1mm 6mm; border-left: 1.2pt solid #2F7FE0; break-inside: avoid; }
.dest p { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 17pt; line-height: 1.28; margin: 0 0 2mm; }
.dest span { font-size: 6.6pt; letter-spacing: .28em; text-transform: uppercase; color: #1B55A3; }
.pausa { background: #0F1F3C; color: #fff; padding: 6mm 7mm; margin: 6mm 0 7mm; break-inside: avoid; }
.pausa .rot { font-size: 7pt; letter-spacing: .32em; text-transform: uppercase; color: #7fb0f2; margin: 0 0 2.5mm; }
.pausa ul { margin: 0; padding-left: 5mm; }
.pausa li { margin-bottom: 1.5mm; }
.final { break-before: page; }
.final .caja { background: #fff; }
.final .cierre { margin-top: 18mm; display: flex; gap: 10mm; align-items: center; break-inside: avoid; }
.final .sello { width: 34mm; color: #16294A; flex: none; }
.final .cierre p { margin: 0; }
.final .lema2 { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 20pt; color: #1B55A3; }
.credito { font-size: 7.6pt; color: #5b6577; margin-top: 10mm; border-top: .5pt solid rgba(22,41,74,.18); padding-top: 3mm; }
'''


def html_cumbre(cid, c, bl):
    css = CSS % {'num': c['numero'], 'pie': c['pie'].replace('"', '\\"')}
    lista = lambda xs: ''.join(f'<li>{x}</li>' for x in xs)
    return f'''<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Academia Frassati · {html.escape(c["titulo"])}</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<style>{css}</style></head><body>
<section class="tapa">
  <div class="rot"><span>Academia Frassati</span><span>Cuadernillo</span></div>
  {iso("iso", 1.8)}
  <p class="cumbre">Cumbre {c["numero"]}</p>
  <h1>{html.escape(c["titulo"])}</h1>
  <p class="lema">Hacia lo alto</p>
  <div class="datos">Lectura: {html.escape(c["lectura"])}.<br>Unos {c["minutos"]} minutos · Examen de 10 preguntas en {URL_ACADEMIA}</div>
</section>
<section class="antes">
  <p class="rot2">Antes de subir</p>
  <h2>Para qué es esta cumbre</h2>
  <p>{html.escape(c["intro"])}</p>
  <div class="caja"><p class="rot2">Vas a aprender</p><ul>{lista(map(html.escape, c["aprender"]))}</ul></div>
  <div class="caja"><p class="rot2">Cómo leerlo</p><ul>{lista(map(html.escape, c["leer"]))}</ul></div>
</section>
<section class="texto">{cuerpo(c, bl)}</section>
<section class="final">
  <p class="rot2">Antes del examen</p>
  <h2>Repasá antes de rendir</h2>
  <div class="caja"><ul>{lista(map(html.escape, c["cierre"]))}</ul></div>
  <p>Cuando estés listo, entrá a <strong>{URL_ACADEMIA}</strong>, elegí esta cumbre y rendí el examen: 10 preguntas, a libro abierto. Se aprueba con 8. Si llegás arriba, te llevás tu certificado.</p>
  <div class="cierre">{sello("sello")}<div><p class="rot2">Academia Frassati</p><p class="lema2">Hacia lo alto</p></div></div>
  <p class="credito">{html.escape(c["credito"])}</p>
</section>
</body></html>'''


def navegador():
    for p in (r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe', r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
              r'C:\Program Files\Google\Chrome\Application\chrome.exe'):
        if os.path.exists(p):
            return p
    sys.exit('No encontré Edge ni Chrome para generar los PDF.')


def main():
    pedidas = sys.argv[1:] or list(CUMBRES)
    os.makedirs(SALIDA, exist_ok=True)
    nav = navegador()
    for cid in pedidas:
        c = CUMBRES[cid]
        bl = bloques(c)
        controlar(cid, c, bl)
        tmp = os.path.join(AQUI, f'_tmp_{cid}.html')
        open(tmp, 'w', encoding='utf-8').write(html_cumbre(cid, c, bl))
        pdf = os.path.join(SALIDA, f'cumbre-{c["numero"]}-{cid}.pdf')
        subprocess.run([nav, '--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=10000',
                        f'--print-to-pdf={pdf}', pathlib.Path(tmp).as_uri()], capture_output=True)
        if not os.path.exists(pdf):
            sys.exit(f'{cid}: el navegador no generó el PDF')
        os.remove(tmp)
        try:
            from pypdf import PdfReader
            paginas = len(PdfReader(pdf).pages)
        except Exception:
            paginas = '?'
        print(f'{cid}: {os.path.relpath(pdf, WEB)} · {paginas} páginas · {os.path.getsize(pdf) // 1024} KB')


if __name__ == '__main__':
    main()
