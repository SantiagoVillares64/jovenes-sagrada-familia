# Herramientas

Scripts que generan el contenido de los juegos y del diccionario de santos. Ver el README principal para el detalle.

| Archivo                     | Qué es                                                                 |
|-----------------------------|------------------------------------------------------------------------|
| `banco_santos.py`           | Los santos del juego y del diccionario (nombre, 5 pistas, fiesta, foto) |
| `banco_versiculos.py`       | Los versículos del día (textuales de El Libro del Pueblo de Dios)      |
| `banco_crucigrama.py`       | Palabras y pistas del crucigrama                                       |
| `verificar_versiculos.py`   | Verifica los versículos contra vatican.va → `datos/versiculos.json`    |
| `generar_crucigramas.py`    | Arma y verifica crucigramas → `datos/crucigramas.json`                 |
| `armar_juegos.py`           | Junta todo → `../js/juegos-datos.js` (y optimiza fotos nuevas)         |
| `generar_paginas.py`        | Regenera los `.html` de la web                                         |
| `lpd.py`                    | Lee El Libro del Pueblo de Dios desde vatican.va (con copia local)     |
| `datos/orden.json`          | Orden en que salen los desafíos diarios. **No borrar.**                |

Orden habitual:

```
python herramientas/verificar_versiculos.py
python herramientas/armar_juegos.py
```
