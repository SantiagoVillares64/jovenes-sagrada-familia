"""Baja (con copia local) y ordena los textos oficiales que se leen en las cumbres de la Academia Frassati.

Devuelve listas de bloques:  {'t': 'titulo', 'texto': ...}  o  {'t': 'par', 'n': 202, 'texto': ..., 'pregunta': ...}
Fuentes: vatican.va (Compendio del Catecismo, Instrucción General del Misal Romano, Christus vivit).
"""
import html
import os
import re
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(os.path.dirname(AQUI), '.cache_docs')
os.makedirs(CACHE, exist_ok=True)

FUENTES = {
    'compendio': 'https://www.vatican.va/archive/compendium_ccc/documents/archive_2005_compendium-ccc_sp.html',
    'igmr': 'https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_sp.html',
    'cv': 'https://www.vatican.va/content/francesco/es/apost_exhortations/documents/papa-francesco_esortazione-ap_20190325_christus-vivit.html',
}


def texto_plano(clave):
    ruta = os.path.join(CACHE, clave + '.html')
    if not os.path.exists(ruta):
        req = urllib.request.Request(FUENTES[clave], headers={'User-Agent': 'Mozilla/5.0'})
        open(ruta, 'wb').write(urllib.request.urlopen(req, timeout=60).read())
    crudo = open(ruta, 'rb').read()
    for enc in ('utf-8', 'cp1252'):
        try:
            t = crudo.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    t = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', t, flags=re.S | re.I)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', t))
    return re.sub(r'\s+', ' ', t)


def _limpiar(s):
    s = re.sub(r'\s*\[\d+\]\s*', ' ', s)          # notas al pie [111]
    s = re.sub(r'\s+([.,;:])', r'\1', s)
    s = re.sub(r'\(\s+', '(', s)
    s = re.sub(r'\s+\)', ')', s)
    return re.sub(r'\s+', ' ', s).strip()


def _cortar_titulo(texto, titulos):
    """Si el párrafo termina con un título de sección, lo separa."""
    for tit in sorted(titulos, key=len, reverse=True):
        if texto.endswith(' ' + tit) or texto.endswith('.' + tit) or texto.endswith(tit) and texto != tit:
            return texto[: -len(tit)].rstrip(), tit
    return texto, None


def _bloques(t, patron, desde, hasta, titulos, titulo_inicial=None, extra=None):
    pos = {}
    for m in re.finditer(patron, t):
        n = int(m.group(1))
        if desde <= n <= hasta + 1 and n not in pos and (not pos or n > max(pos)):
            pos[n] = (m.start(), m.end())
    salida = [{'t': 'titulo', 'texto': titulo_inicial}] if titulo_inicial else []
    nums = sorted(pos)
    for i, n in enumerate(nums):
        if n > hasta:
            break
        fin = pos[nums[i + 1]][0] if i + 1 < len(nums) else pos[n][1] + 4000
        cuerpo = _limpiar(t[pos[n][1]:fin])
        cuerpo, tit = _cortar_titulo(cuerpo, titulos)
        b = {'t': 'par', 'n': n, 'texto': cuerpo}
        if extra:
            extra(b)
        salida.append(b)
        if tit and n < hasta:
            salida.append({'t': 'titulo', 'texto': tit})
    return salida


CV_TITULOS = ['Una pastoral sinodal', 'Grandes líneas de acción', 'Ambientes adecuados', 'La pastoral de las instituciones educativas',
              'Distintos ámbitos para desarrollos pastorales', 'Una pastoral popular juvenil', 'Siempre misioneros',
              'El acompañamiento de los adultos', 'Capítulo octavo La vocación', 'Escucha y acompañamiento', '* * * Y al final... un deseo']


def christus_vivit():
    t = texto_plano('cv')
    a = _bloques(t, r' (\d{1,3}) \. ', 202, 247, CV_TITULOS, 'La pastoral de los jóvenes')
    b = _bloques(t, r' (\d{1,3}) \. ', 291, 298, CV_TITULOS, 'Escucha y acompañamiento')
    return [x for x in a + b if not (x['t'] == 'titulo' and x['texto'].startswith(('Capítulo octavo', '* * *')))]


IGMR_TITULOS = ['II. DIVERSOS ELEMENTOS DE LA MISA La lectura de la Palabra de Dios y su explicación',
                'Las oraciones y otras partes que corresponden al sacerdote', 'Otras fórmulas que ocurren en la celebración',
                'Las maneras de pronunciar los diversos textos', 'Importancia del canto', 'Gestos y posturas corporales', 'El silencio',
                'III. CADA UNA DE LAS PARTES DE LA MISA A) Ritos iniciales', 'Entrada', 'Saludo al altar y al pueblo congregado',
                'Acto penitencial', 'Señor, ten piedad', 'Gloria a Dios en el cielo', 'Colecta', 'B) Liturgia de la palabra', 'Silencio',
                'Lecturas bíblicas', 'Salmo responsorial', 'Aclamación antes de la lectura del Evangelio', 'Homilía', 'Profesión de fe',
                'Oración universal', 'C) Liturgia Eucarística', 'Preparación de los dones', 'Oración sobre las ofrendas', 'Plegaria Eucarística',
                'Rito de la comunión', 'Oración del Señor', 'Rito de la paz', 'Fracción del Pan', 'Comunión', 'D) Rito de conclusión',
                'Capítulo III OFICIOS Y MINISTERIOS EN LA CELEBRACIÓN DE LA MISA']
IGMR_LINDOS = {'II. DIVERSOS ELEMENTOS DE LA MISA La lectura de la Palabra de Dios y su explicación': 'La lectura de la Palabra de Dios y su explicación',
               'III. CADA UNA DE LAS PARTES DE LA MISA A) Ritos iniciales': 'Los ritos iniciales', 'B) Liturgia de la palabra': 'La Liturgia de la Palabra',
               'C) Liturgia Eucarística': 'La Liturgia Eucarística', 'D) Rito de conclusión': 'El rito de conclusión'}


def misal():
    t = texto_plano('igmr')
    i = t.find('ESTRUCTURA DE LA MISA, SUS ELEMENTOS Y SUS PARTES', t.find('ESTRUCTURA DE LA MISA, SUS ELEMENTOS Y SUS PARTES') + 10)
    t = t[i:]
    out = _bloques(t, r' (\d{2,3})\. ', 27, 90, IGMR_TITULOS, 'La estructura general de la Misa')
    for b in out:
        if b['t'] == 'titulo':
            b['texto'] = IGMR_LINDOS.get(b['texto'], b['texto'])
    return [b for b in out if not (b['t'] == 'titulo' and b['texto'].startswith('Capítulo III'))]


def _pregunta(b):
    """Compendio: '¿Qué son…? 1113-1131 Los sacramentos…' → pregunta y respuesta (sin las referencias al Catecismo)."""
    m = re.match(r'(.*?\?)\s*((?:\d[\d\s.,\-–]*\s)+)?(.*)', b['texto'])
    if m:
        b['pregunta'] = m.group(1).strip()
        b['texto'] = m.group(3).strip()


def _cortar_mayusculas(b):
    """Saca los títulos en mayúsculas que quedan pegados al final de una respuesta del Compendio."""
    tit = None
    chico = None
    m0 = re.search(r'\s(¿(?:Quién|Cómo|Cuándo|Dónde) celebra(?:r)?\?)$', b['texto'])
    if m0:
        chico = m0.group(1)
        b['texto'] = b['texto'][: m0.start()].rstrip()
    texto = b['texto']
    # el n. 249 trae además la lista de sacramentos (en castellano y en latín) después del título
    k = texto.find(' SEGUNDA SECCIÓN')
    if k > 0:
        b['texto'], texto, tit = texto[:k].rstrip(), '', 'SEGUNDA SECCIÓN'
    palabras = texto.split(' ')
    j = len(palabras)
    while j > 0 and re.fullmatch(r'[A-ZÁÉÍÓÚÑÜ,.]{1,}', palabras[j - 1]) and not re.fullmatch(r'[\d.,]+', palabras[j - 1]):
        j -= 1
    cola = ' '.join(palabras[j:])
    if len(cola) > 8 and sum(c.isalpha() for c in cola) > 6:
        tit = cola
        b['texto'] = ' '.join(palabras[:j]).rstrip()
    if chico:
        tit = (tit + ' | ' + chico) if tit else chico
    return tit


COMP_LINDOS = [('CELEBRACIÓN SACRAMENTAL', 'La celebración sacramental del misterio pascual'), ('¿Quién celebra?', '¿Quién celebra?'), ('SEGUNDA SECCIÓN', 'Los siete sacramentos de la Iglesia'), ('LOS SACRAMENTOS DE LA INICIACIÓN', 'Los sacramentos de la iniciación cristiana'),
               ('EL SACRAMENTO DEL BAUTISMO', 'El Bautismo'), ('CONFIRMACIÓN', 'La Confirmación'), ('EUCARISTÍA', 'La Eucaristía'),
               ('LOS SACRAMENTOS DE CURACIÓN', 'Los sacramentos de curación'), ('PENITENCIA', 'La Penitencia y la Reconciliación'),
               ('UNCIÓN', 'La Unción de los enfermos'), ('AL SERVICIO DE LA COMUNIÓN', 'Los sacramentos al servicio de la comunión y de la misión'),
               ('EL SACRAMENTO DEL ORDEN', 'El Orden'), ('MATRIMONIO', 'El Matrimonio'), ('DIVERSIDAD LITÚRGICA', 'Diversidad litúrgica y unidad del misterio'),
               ('¿Cómo celebrar?', '¿Cómo celebrar?'), ('¿Cuándo celebrar?', '¿Cuándo celebrar?'), ('¿Dónde celebrar?', '¿Dónde celebrar?'),
               ('OTRAS CELEBRACIONES', None)]


def compendio():
    t = texto_plano('compendio')
    i = t.find('224. ', t.find('224. ') + 1) if t.count('224. ') > 1 else t.find('224. ')
    t = t[i - 2:]
    crudo = _bloques(t, r'(?<![\d,])(\d{3})\. ', 224, 350, [], 'Los sacramentos: signos de la gracia')
    out = []
    for b in crudo:
        if b['t'] != 'par':
            out.append(b)
            continue
        tit = _cortar_mayusculas(b)
        _pregunta(b)
        out.append(b)
        for parte in (tit.split(' | ') if tit else []):
            lindo = next((v for k, v in COMP_LINDOS if k in parte), parte.capitalize())
            if lindo:
                out.append({'t': 'titulo', 'texto': lindo})
    return out


if __name__ == '__main__':
    import json
    for nombre, f in (('cv', christus_vivit), ('igmr', misal), ('compendio', compendio)):
        bl = f()
        pars = [b for b in bl if b['t'] == 'par']
        print(nombre, len(pars), 'párrafos', [b['texto'] for b in bl if b['t'] == 'titulo'])
        json.dump(bl, open(os.path.join(AQUI, 'textos_' + nombre + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
