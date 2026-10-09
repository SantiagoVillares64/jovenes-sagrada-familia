"""Lee El Libro del Pueblo de Dios (traducción argentina) desde vatican.va/archive/ESL0506.

Las páginas se guardan en herramientas/.cache_lpd para no descargarlas cada vez.
"""
import html
import json
import os
import re
import urllib.request

BASE = 'https://www.vatican.va/archive/ESL0506/'
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.cache_lpd')
os.makedirs(CACHE, exist_ok=True)


def get(pagina):
    ruta = os.path.join(CACHE, pagina)
    if os.path.exists(ruta) and os.path.getsize(ruta) > 200:
        return open(ruta, encoding='utf-8').read()
    req = urllib.request.Request(BASE + pagina, headers={'User-Agent': 'Mozilla/5.0'})
    crudo = urllib.request.urlopen(req, timeout=40).read()
    try:
        texto = crudo.decode('utf-8')
    except UnicodeDecodeError:
        texto = crudo.decode('cp1252', 'replace')
    open(ruta, 'w', encoding='utf-8').write(texto)
    return texto


def mapa():
    """{'EVANGELIO SEGUN SAN JUAN': {'1': '__PV0.HTM', ...}, ...}"""
    ruta = os.path.join(CACHE, 'mapa.json')
    if os.path.exists(ruta):
        return json.load(open(ruta, encoding='utf-8'))
    indice = get('_INDEX.HTM')
    libros, actual = {}, None
    for m in re.finditer(r'<font size=3>(.*?)</font>|<a href=(__P\w+\.HTM)>(\d+)</a>', indice, re.S):
        if m.group(1) is not None:
            nombre = html.unescape(re.sub('<[^>]+>', '', m.group(1))).strip()
            if nombre:
                actual = nombre
                libros.setdefault(actual, {})
        elif actual:
            libros[actual][m.group(3)] = m.group(2)
    json.dump(libros, open(ruta, 'w', encoding='utf-8'), ensure_ascii=False)
    return libros


def versiculos(libro, cap):
    """{numero: texto} de un capítulo."""
    pagina = get(mapa()[libro][str(cap)])
    cuerpo = pagina.split('class=Capitulo', 1)[-1]
    salida, actual = {}, None
    for p in re.findall(r'<p[^>]*>(.*?)</p>', cuerpo, re.S | re.I):
        txt = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', p))).strip()
        if not txt:
            continue
        m = re.match(r'^(\d+)\s+(.*)', txt)
        if m:
            actual = int(m.group(1))
            salida[actual] = m.group(2)
        elif actual is not None:
            salida[actual] += ' ' + txt
    return salida


def url_capitulo(libro, cap):
    return BASE + mapa()[libro][str(cap)]
