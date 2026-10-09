"""Genera las partidas de Conexiones a partir de banco_conexiones.py → datos/conexiones.json.

Uso:  python herramientas/generar_conexiones.py            (genera 150 nuevas, REEMPLAZA las actuales)
      python herramientas/generar_conexiones.py --sumar 50 (agrega 50 al final, sin tocar las que ya hay)

Reglas de cada partida:
  - 4 grupos de 4 fichas, sin fichas repetidas.
  - Ninguna ficha encaja en otro grupo de la misma partida (se mira usar + tambien).
  - Al menos 3 niveles de dificultad distintos.
  - No se repite una partida igual (mismas 16 fichas).
"""
import json
import os
import random
import sys
import unicodedata

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from banco_conexiones import C  # noqa: E402

SALIDA = os.path.join(AQUI, 'datos', 'conexiones.json')


def norm(s):
    s = unicodedata.normalize('NFD', s.upper()).encode('ascii', 'ignore').decode()
    return ' '.join(s.split())


def miembros(cat):
    return {norm(w) for w in cat['usar'] + cat['tambien']}


def controlar(partida):
    """Control independiente: devuelve una lista de problemas (vacía si está bien)."""
    problemas, vistas = [], set()
    cats = [next(c for c in C if c['nombre'] == g['nombre']) for g in partida['g']]
    for g, cat in zip(partida['g'], cats):
        if len(g['w']) != 4:
            problemas.append(f'{g["nombre"]}: {len(g["w"])} fichas')
        for w in g['w']:
            if norm(w) in vistas:
                problemas.append(f'ficha repetida: {w}')
            vistas.add(norm(w))
            if w not in cat['usar']:
                problemas.append(f'{w} no está en "usar" de {cat["nombre"]}')
            otros = [c['nombre'] for c in cats if c is not cat and norm(w) in miembros(c)]
            if otros:
                problemas.append(f'{w} ({cat["nombre"]}) también encaja en {otros}')
    if len({c['nivel'] for c in cats}) < 3:
        problemas.append('menos de 3 niveles distintos')
    return problemas


def armar(rnd, usadas):
    for _ in range(5000):
        cats = rnd.sample(C, 4)
        if len({c['nivel'] for c in cats}) < 3:
            continue
        todos = [miembros(c) for c in cats]
        grupos, ok = [], True
        for i, c in enumerate(cats):
            # fichas que solo encajan en su propio grupo dentro de esta partida
            libres = [w for w in c['usar'] if not any(norm(w) in todos[j] for j in range(4) if j != i)]
            if len(libres) < 4:
                ok = False
                break
            grupos.append({'nombre': c['nombre'], 'nivel': c['nivel'], 'w': rnd.sample(libres, 4)})
        if not ok:
            continue
        firma = frozenset(norm(w) for g in grupos for w in g['w'])
        if firma in usadas:
            continue
        grupos.sort(key=lambda g: g['nivel'])
        partida = {'g': grupos}
        if controlar(partida):
            continue
        usadas.add(firma)
        return partida
    raise SystemExit('No se pudo armar una partida nueva: sumá categorías al banco.')


def main():
    sumar = '--sumar' in sys.argv
    n = int(sys.argv[sys.argv.index('--sumar') + 1]) if sumar else 150
    previas = json.load(open(SALIDA, encoding='utf-8')) if sumar and os.path.exists(SALIDA) else []
    usadas = {frozenset(norm(w) for g in p['g'] for w in g['w']) for p in previas}
    rnd = random.Random(f'conexiones:{len(previas)}')
    nuevas = []
    ultimas = []
    while len(nuevas) < n:
        p = armar(rnd, usadas)
        nombres = {g['nombre'] for g in p['g']}
        # que dos partidas seguidas no compartan categorías (si se puede)
        if any(nombres & u for u in ultimas[-1:]) and rnd.random() < 0.9:
            usadas.discard(frozenset(norm(w) for g in p['g'] for w in g['w']))
            continue
        ultimas.append(nombres)
        nuevas.append(p)
    todas = previas + nuevas
    for p in todas:
        prob = controlar(p)
        if prob:
            raise SystemExit(f'Partida con problemas: {prob}')
    os.makedirs(os.path.dirname(SALIDA), exist_ok=True)
    json.dump(todas, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    uso = {}
    for p in todas:
        for g in p['g']:
            uso[g['nombre']] = uso.get(g['nombre'], 0) + 1
    print(f'Listo: {len(todas)} partidas ({len(nuevas)} nuevas) · {len(uso)} de {len(C)} categorías usadas')
    sin_uso = [c['nombre'] for c in C if c['nombre'] not in uso]
    if sin_uso:
        print('  Sin usar:', ', '.join(sin_uso))


if __name__ == '__main__':
    main()
