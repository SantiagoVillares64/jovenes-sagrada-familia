"""Verifica el banco de versículos contra El Libro del Pueblo de Dios y genera datos/versiculos.json.

Uso:  python herramientas/verificar_versiculos.py

Para cada versículo comprueba que el fragmento sea textual y que la palabra oculta aparezca
una sola vez. Los que no pasan se informan y NO entran al juego.
"""
import json
import os
import re
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from banco_versiculos import LIBROS, VERSICULOS  # noqa: E402
import lpd  # noqa: E402


def referencia(cita):
    m = re.match(r'^(.+?) (\d+),(\d+)(?:-(\d+))?$', cita)
    if not m or m.group(1) not in LIBROS:
        raise ValueError(f'Cita no reconocida: {cita} (¿falta la abreviatura en LIBROS?)')
    return LIBROS[m.group(1)], int(m.group(2)), int(m.group(3)), int(m.group(4)) if m.group(4) else None


def main():
    ok, errores = [], []
    for cita, fragmento, oculta, otras in VERSICULOS:
        try:
            libro, cap, v1, v2 = referencia(cita)
            vs = lpd.versiculos(libro, cap)
            completo = re.sub(r'\s+', ' ', ' '.join(vs[v] for v in range(v1, (v2 or v1) + 1)))
        except Exception as e:  # noqa: BLE001
            errores.append(f'{cita}: {e}')
            continue
        patron = r'(?<!\w)' + re.escape(oculta) + r'(?!\w)'
        veces = len(re.findall(patron, fragmento))
        if fragmento not in completo:
            errores.append(f'{cita}: el fragmento no es textual.\n    Texto: {completo}')
            continue
        if veces != 1:
            errores.append(f'{cita}: «{oculta}» aparece {veces} veces en el fragmento.')
            continue
        if len(otras) != 3 or oculta in otras:
            errores.append(f'{cita}: tiene que haber exactamente 3 opciones incorrectas distintas de la correcta.')
            continue
        ok.append({'cita': cita, 'frase': re.sub(patron, '_____', fragmento, count=1), 'ok': oculta,
                   'otras': otras, 'texto': fragmento, 'url': lpd.url_capitulo(libro, cap)})
    json.dump(ok, open(os.path.join(AQUI, 'datos', 'versiculos.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'Versículos verificados: {len(ok)} de {len(VERSICULOS)}')
    for e in errores:
        print('  ✗', e)
    return 1 if errores else 0


if __name__ == '__main__':
    sys.exit(main())
