# Jóvenes Sagrada Familia

Web de los grupos de jóvenes de la Parroquia Sagrada Familia (Nordelta): grupos, calendario, horarios,
biblioteca, diccionario de santos y juegos diarios.

Es una web estática (HTML + CSS + JavaScript, sin servidor ni base de datos), pensada para publicarse
gratis en **GitHub Pages**.

---

## Qué se edita y dónde

| Quiero…                                              | Archivo                                   |
|------------------------------------------------------|-------------------------------------------|
| Cambiar horarios, textos de grupos, inscripciones    | `js/contenido.js`                          |
| Abrir o cerrar una inscripción                       | `js/contenido.js` → `grupos` → `inscripcion.estado` (`"abierta"`, `"cerrada"`, `"proximamente"`) y `link` |
| Cargar un evento en el calendario                    | La **planilla de Google** del calendario (no hace falta tocar código) |
| Eventos que se repiten (misa de jóvenes, adoración…) | `js/contenido.js` → `calendario.recurrentes` |
| Sumar un recurso a la biblioteca                     | `js/contenido.js` → `biblioteca.recursos`  |
| Preguntas del quiz                                   | `js/contenido.js` → `quiz.preguntas`       |
| Historia completa de un santo                        | `js/contenido.js` → `santos`               |
| Santos del juego / diccionario                       | `herramientas/banco_santos.py` y después correr `armar_juegos.py` |
| Versículos del día                                   | `herramientas/banco_versiculos.py` y después `verificar_versiculos.py` + `armar_juegos.py` |
| Palabras del crucigrama                              | `herramientas/banco_crucigrama.py` y después `generar_crucigramas.py --sumar N` + `armar_juegos.py` |
| Categorías de Conexiones                             | `herramientas/banco_conexiones.py` y después `generar_conexiones.py --sumar N` + `armar_juegos.py` |
| Jugadores del ranking                                | La planilla de Google del ranking (ver `herramientas/ranking/LEEME.md`) |
| Cursos de Formación con certificado                  | `herramientas/banco_formacion.py` y después `python herramientas/armar_formacion.py` |
| Fotos                                                | carpeta `img/` (reemplazá el archivo con el mismo nombre) |

`js/site.js` arma todas las páginas a partir de esos datos: normalmente no hace falta tocarlo.

### Reglas para editar `js/contenido.js`
- Todo texto va entre comillas `"así"` y cada elemento de una lista termina con coma `,`.
- Si después de un cambio la página queda en blanco, casi siempre falta una coma o una comilla.
- Para probar antes de subir: ver "Probar en la compu" más abajo.

---

## Calendario (planilla de Google)

La web lee una planilla de Google publicada como CSV (el link está en `js/contenido.js` → `calendario.hojaCSV`).

Columnas: `fecha · hasta · hora · titulo · grupo · detalle · link`

- `fecha`: `2027-04-17` (o `2027-07` si todavía no hay día). También acepta `17/4/2027`.
- `hasta`: solo si dura varios días; si no, vacío.
- `grupo`: `faro`, `confirmacion`, `post`, `hpp`, `puente`, `nazaret` o `todos`.
- No hace falta ordenarla: la web ordena sola y oculta lo que ya pasó.
- Los cambios tardan unos 5 minutos en verse (Google actualiza la versión publicada).

Se agregan solos (no hace falta cargarlos): misa de jóvenes, adoración, adoración y pizzas, misión de Puente,
Nochebuena, Navidad, Sagrada Familia, las fiestas de los santos del diccionario y el tiempo litúrgico.

---

## Juegos diarios y diccionario de santos (`herramientas/`)

Los juegos (Santo del día, Versículo del día, Crucigrama del día, Conexiones) y el Diccionario de santos salen de
`js/juegos-datos.js`, que **no se edita a mano**: se genera con los scripts de `herramientas/`.

Necesitás Python 3 y la librería Pillow (`pip install pillow`). Se corren desde esta carpeta:

```
python herramientas/verificar_versiculos.py     # si cambiaste versículos
python herramientas/generar_crucigramas.py --sumar 50   # si querés más crucigramas
python herramientas/generar_conexiones.py --sumar 50    # si querés más partidas de Conexiones
python herramientas/armar_juegos.py             # siempre, al final
```

- **Versículos:** tienen que ser textuales de *El Libro del Pueblo de Dios*. `verificar_versiculos.py` los compara
  con el texto publicado en vatican.va y avisa si alguno no coincide.
- **Santos:** al sumar uno, poné su foto original en la carpeta `Fotos y logos/Fotos de santos` (al lado de la carpeta de la web) y
  su nombre en `foto_origen`; `armar_juegos.py` la optimiza y la copia a `img/santos-juego/`.
- **Orden de los desafíos:** `herramientas/datos/orden.json` guarda en qué orden salen. Lo nuevo se suma al final,
  así agregar contenido no cambia el desafío de hoy. No borres ese archivo.
- `generar_crucigramas.py` sin `--sumar` **reemplaza los 100 crucigramas** por otros nuevos. Usalo solo si querés empezar de cero.
- `herramientas/generar_paginas.py`: regenera los `.html` (solo si agregás una página nueva).

---

## Probar en la compu

Abrí una terminal en esta carpeta y corré:

```
python -m http.server 8000
```

y entrá a <http://localhost:8000>.

---

## Publicar en GitHub Pages

**La web ya está publicada** en <https://sagradafamiliajoven.github.io/>
(repositorio: <https://github.com/sagradafamiliajoven/sagradafamiliajoven.github.io>).

Para publicar un cambio, desde esta carpeta:

```
git add -A
git commit -m "Qué cambié"
git push
```

A los 1 o 2 minutos se ve online. Los eventos de la planilla de Google **no** necesitan esto: se actualizan solos.

Cómo se armó (por si hay que repetirlo en otra cuenta):

1. Crear un repositorio en GitHub (por ejemplo `jovenes-sagrada-familia`) y subir **todo el contenido de esta carpeta**.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: Deploy from a branch → `main` / `(root)` → Save**.
3. En 1 o 2 minutos queda online en `https://<usuario>.github.io/jovenes-sagrada-familia/`.
4. Cada cambio que se suba a `main` se publica solo.
5. Una sola vez, con la dirección final, correr y subir el resultado:
   `python herramientas/generar_paginas.py --url https://<usuario>.github.io/jovenes-sagrada-familia/`
   Esto arma `sitemap.xml` y `robots.txt` (la lista de páginas para Google) y deja bien la vista previa
   cuando se comparte un link por WhatsApp. Si después cambia la dirección (dominio propio), se vuelve a correr con la nueva.

**Página 404:** `404.html` muestra `img/404-horizontal.png` (compu) y `img/404-vertical.png` (celu) si existen;
si no, solo el texto y el botón para volver al inicio.

**Dominio propio (opcional):** comprarlo (por ejemplo en nic.ar), cargarlo en *Settings → Pages → Custom domain*
y seguir las instrucciones de DNS que muestra GitHub.

---

## Antes de lanzar

- Revisar con la parroquia los permisos de las fotos donde aparecen menores.
- Si querés que los desafíos arranquen en el #1 el día del lanzamiento, cambiá `INICIO` en
  `herramientas/armar_juegos.py` y corré el script.
- Actualizar los horarios de Navidad del año (están en `calendario.recurrentes`).
