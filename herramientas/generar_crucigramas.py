"""Genera los crucigramas del día a partir de banco_crucigrama.py y los guarda en datos/crucigramas.json.

Uso:  python herramientas/generar_crucigramas.py            (genera 100 nuevos, REEMPLAZA los actuales)
      python herramientas/generar_crucigramas.py --sumar 50 (agrega 50 al final, sin tocar los que ya hay)

Reglas: grillas de hasta 11x11, 7 a 9 palabras, las palabras solo se tocan donde se cruzan,
todo conectado. Cada crucigrama pasa por un control independiente antes de guardarse.
"""
import collections
import json
import os
import random
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
from banco_crucigrama import B  # noqa: E402

MAX_LARGO, MAX_ANCHO, MAX_ALTO = 11, 11, 11
SALIDA = os.path.join(AQUI, 'datos', 'crucigramas.json')

pistas, categoria = collections.OrderedDict(), {}
for palabra, pista, cat in B:
    if not (3 <= len(palabra) <= MAX_LARGO) or not palabra.isalpha():
        continue
    pistas.setdefault(palabra, [])
    if pista not in pistas[palabra]:
        pistas[palabra].append(pista)
    categoria[palabra] = cat
PALABRAS = list(pistas)


def entra(grid, w, r, c, d):
    dr, dc = (0, 1) if d == 0 else (1, 0)
    if (r - dr, c - dc) in grid or (r + dr * len(w), c + dc * len(w)) in grid:
        return -1
    cruces = 0
    for i, ch in enumerate(w):
        rr, cc = r + dr * i, c + dc * i
        if (rr, cc) in grid:
            if grid[(rr, cc)][0] != ch or grid[(rr, cc)][d + 1]:
                return -1
            cruces += 1
        elif (rr + dc, cc + dr) in grid or (rr - dc, cc - dr) in grid:
            return -1
    return cruces


def caja(grid):
    rs = [k[0] for k in grid]
    cs = [k[1] for k in grid]
    return min(rs), max(rs), min(cs), max(cs)


def poner(grid, w, r, c, d):
    dr, dc = (0, 1) if d == 0 else (1, 0)
    for i, ch in enumerate(w):
        k = (r + dr * i, c + dc * i)
        celda = list(grid.get(k, [ch, False, False]))
        celda[d + 1] = True
        grid[k] = celda


def armar(rnd, uso, objetivo):
    pool = sorted(PALABRAS, key=lambda w: uso[w] + rnd.random() * 1.6)
    inicio = next(w for w in pool if 6 <= len(w) <= 9)
    grid, puestas, usadas = {}, [(inicio, 0, 0, 0)], {inicio}
    poner(grid, inicio, 0, 0, 0)
    for w in pool:
        if len(puestas) >= objetivo:
            break
        if w in usadas:
            continue
        opciones = []
        for (r, c), celda in list(grid.items()):
            for i, ch in enumerate(w):
                if ch != celda[0]:
                    continue
                for d in (0, 1):
                    if celda[d + 1]:
                        continue
                    rr, cc = (r, c - i) if d == 0 else (r - i, c)
                    x = entra(grid, w, rr, cc, d)
                    if x < 1:
                        continue
                    g2 = dict(grid)
                    poner(g2, w, rr, cc, d)
                    r0, r1, c0, c1 = caja(g2)
                    if r1 - r0 + 1 > MAX_ALTO or c1 - c0 + 1 > MAX_ANCHO:
                        continue
                    opciones.append((x * 10 - (r1 - r0 + 1) * (c1 - c0 + 1) * 0.05 + rnd.random(), rr, cc, d))
        if opciones:
            _, rr, cc, d = max(opciones)
            poner(grid, w, rr, cc, d)
            puestas.append((w, rr, cc, d))
            usadas.add(w)
    return grid, puestas


def verificar(p):
    g = {}
    for e in p['e']:
        for i, ch in enumerate(e['w']):
            k = (e['r'] + (e['d'] == 1) * i, e['c'] + (e['d'] == 0) * i)
            if k in g and g[k] != ch:
                return 'choque'
            g[k] = ch
    if any(not (0 <= r < p['h'] and 0 <= c < p['w']) for r, c in g):
        return 'fuera de la grilla'
    halladas = set()
    for (r, c) in g:
        if (r, c - 1) not in g and (r, c + 1) in g:
            s, k = '', c
            while (r, k) in g:
                s += g[(r, k)]
                k += 1
            halladas.add((s, r, c, 0))
        if (r - 1, c) not in g and (r + 1, c) in g:
            s, k = '', r
            while (k, c) in g:
                s += g[(k, c)]
                k += 1
            halladas.add((s, r, c, 1))
    if halladas != {(e['w'], e['r'], e['c'], e['d']) for e in p['e']}:
        return 'palabras de más o de menos'
    vistos, pila = set(), [next(iter(g))]
    while pila:
        k = pila.pop()
        if k in vistos:
            continue
        vistos.add(k)
        r, c = k
        pila += [n for n in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)) if n in g]
    return 'ok' if len(vistos) == len(g) else 'desconectado'


def generar(cantidad, existentes, semilla):
    rnd = random.Random(semilla)
    uso = collections.Counter(e['w'] for p in existentes for e in p['e'])
    firmas = {frozenset(e['w'] for e in p['e']) for p in existentes}
    nuevos = []
    while len(nuevos) < cantidad:
        grid, puestas = armar(rnd, uso, rnd.choice([7, 8, 8, 9]))
        if len(puestas) < 7:
            continue
        firma = frozenset(w for w, *_ in puestas)
        if firma in firmas:
            continue
        r0, r1, c0, c1 = caja(grid)
        p = {'w': c1 - c0 + 1, 'h': r1 - r0 + 1,
             'e': [{'w': w, 'r': r - r0, 'c': c - c0, 'd': d, 'p': rnd.choice(pistas[w])} for w, r, c, d in puestas]}
        if verificar(p) != 'ok':
            continue
        firmas.add(firma)
        nuevos.append(p)
        for w, *_ in puestas:
            uso[w] += 1
    return nuevos


def main():
    existentes = json.load(open(SALIDA, encoding='utf-8')) if os.path.exists(SALIDA) else []
    if '--sumar' in sys.argv:
        cantidad = int(sys.argv[sys.argv.index('--sumar') + 1])
        todos = existentes + generar(cantidad, existentes, 2026 + len(existentes))
    else:
        todos = generar(100, [], 2026)
    json.dump(todos, open(SALIDA, 'w', encoding='utf-8'), ensure_ascii=False)
    uso = collections.Counter(e['w'] for p in todos for e in p['e'])
    print(f'Crucigramas: {len(todos)} | palabras del banco: {len(PALABRAS)} | más repetidas: {uso.most_common(5)}')


if __name__ == '__main__':
    main()
