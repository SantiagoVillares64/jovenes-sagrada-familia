"""Arma js/juegos-datos.js (Santo del día, Versículo del día, Crucigrama del día y Diccionario de santos).

Uso:  python herramientas/armar_juegos.py

Toma:  banco_santos.py · datos/versiculos.json (de verificar_versiculos.py) · datos/crucigramas.json
Orden: datos/orden.json guarda en qué orden salen los desafíos. Lo que ya está no se mueve;
       lo nuevo se agrega al final (mezclado entre sí). Así sumar contenido no cambia el desafío de hoy.
"""
import json
import os
import random
import re
import sys
import unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
WEB = os.path.dirname(AQUI)
FOTOS_ORIGEN = os.path.join(os.path.dirname(WEB), 'fotos-santos')  # carpeta al lado de la web
sys.path.insert(0, AQUI)
from banco_santos import SANTOS  # noqa: E402

INICIO = '2026-10-09'  # día #1 de los desafíos (cambialo a la fecha de lanzamiento si querés empezar en #1)


def slug(s):
    s = unicodedata.normalize('NFD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40]


def foto_web(s):
    if s['foto'] and os.path.exists(os.path.join(WEB, s['foto'])):
        return s['foto']
    if not s['foto_origen']:
        print(f'  ! {s["nombre"]}: sin foto')
        return ''
    from PIL import Image, ImageOps
    origen = os.path.join(FOTOS_ORIGEN, s['foto_origen'])
    destino = 'img/santos-juego/' + slug(s['nombre']) + '.jpg'
    im = ImageOps.exif_transpose(Image.open(origen)).convert('RGB')
    im.thumbnail((520, 700), Image.LANCZOS)
    os.makedirs(os.path.join(WEB, 'img', 'santos-juego'), exist_ok=True)
    im.save(os.path.join(WEB, destino), quality=80, optimize=True, progressive=True)
    print(f'  + foto nueva: {destino}')
    return destino


def ordenar(clave, items, id_de):
    """Devuelve items en el orden guardado; los nuevos van al final."""
    ruta = os.path.join(AQUI, 'datos', 'orden.json')
    orden = json.load(open(ruta, encoding='utf-8')) if os.path.exists(ruta) else {}
    por_id = {id_de(x): x for x in items}
    previos = [i for i in orden.get(clave, []) if i in por_id]
    nuevos = [i for i in por_id if i not in set(previos)]
    random.Random(f'{clave}:{len(previos)}').shuffle(nuevos)
    orden[clave] = previos + nuevos
    json.dump(orden, open(ruta, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if nuevos and previos:
        print(f'  {clave}: {len(nuevos)} nuevos agregados al final')
    return [por_id[i] for i in orden[clave]]


def main():
    nombres = [s['nombre'] for s in SANTOS]
    repetidos = {n for n in nombres if nombres.count(n) > 1}
    if repetidos:
        sys.exit(f'Santos repetidos en el banco: {repetidos}')
    santos = []
    for s in SANTOS:
        if len(s['pistas']) != 5:
            sys.exit(f'{s["nombre"]} tiene {len(s["pistas"])} pistas (tienen que ser 5)')
        santos.append({'n': s['nombre'], 'p': s['pistas'], 'foto': foto_web(s), 'ficha': s['ficha'],
                       'g': 'f' if s['nombre'].split()[0] in ('Santa', 'Beata') else 'm',
                       'id': s['ficha'] or slug(s['nombre']), 'fiesta': s['fiesta']})
    versiculos = json.load(open(os.path.join(AQUI, 'datos', 'versiculos.json'), encoding='utf-8'))
    crucigramas = json.load(open(os.path.join(AQUI, 'datos', 'crucigramas.json'), encoding='utf-8'))
    for i, c in enumerate(crucigramas):
        c['id'] = i
    datos = {
        'inicio': INICIO,
        'santos': ordenar('santos', santos, lambda x: x['id']),
        'versiculos': ordenar('versiculos', versiculos, lambda x: x['cita']),
        'crucigramas': ordenar('crucigramas', crucigramas, lambda x: str(x['id'])),
    }
    js = ('/* Datos de los juegos diarios y del Diccionario de santos.\n'
          '   NO editar a mano: se genera con  python herramientas/armar_juegos.py\n'
          '   Versículos: El Libro del Pueblo de Dios (vatican.va). */\n'
          'window.JUEGOS = ' + json.dumps(datos, ensure_ascii=False, separators=(',', ':')) + ';\n')
    open(os.path.join(WEB, 'js', 'juegos-datos.js'), 'w', encoding='utf-8', newline='\n').write(js)
    f = sum(s['g'] == 'f' for s in santos)
    print(f'Listo: {len(santos)} santos ({f} santas, {len(santos) - f} santos) · {len(versiculos)} versículos · '
          f'{len(crucigramas)} crucigramas · {round(len(js.encode()) / 1024)} KB')
    sin_fiesta = [s['n'] for s in santos if not s['fiesta']]
    if sin_fiesta:
        print('  Sin fecha de fiesta:', ', '.join(sin_fiesta))


if __name__ == '__main__':
    main()
