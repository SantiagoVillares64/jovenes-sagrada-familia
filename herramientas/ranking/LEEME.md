# Ranking parroquial: cómo ponerlo en marcha

El ranking suma los 4 desafíos del día (Santo, Versículo, Crucigrama y Conexiones, hasta 100 puntos cada uno).
Los jugadores y los puntajes se guardan en una **planilla de Google** que solo vos podés ver y editar.
En la web solo aparece el **nombre que vos elijas** para cada jugador.

## Una sola vez (10 minutos)

1. Creá una planilla nueva en Google Drive. Ponele de nombre, por ejemplo, `Ranking juegos`.
2. En la planilla: **Extensiones → Apps Script**.
3. Borrá lo que aparece y pegá todo el contenido de `Codigo.gs` (está en esta misma carpeta). Guardá (ícono del disquete).
4. Arriba a la derecha: **Implementar → Nueva implementación**.
   - Tipo (el engranaje): **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
   - **Implementar**. Google te va a pedir permiso para que el script use tu planilla: aceptalo
     (si aparece "Google no verificó esta app", tocá *Configuración avanzada → Ir a … (no seguro)*: es tu propio script).
5. Copiá la **URL de la aplicación web** (termina en `/exec`) y pasásela a quien mantiene la web,
   o pegala en `js/contenido.js`, en `ranking: { url: "ACÁ" }`.
6. Volvé a la planilla y recargala. Va a aparecer el menú **Ranking**: tocá **Preparar pestañas**.

## Para sumar jugadores

1. En la pestaña **Jugadores**, escribí en la columna B el nombre que va a aparecer en el ranking
   (por ejemplo `Santi V.` o `Juli (FARO)`). En la C, si querés, el grupo.
2. Menú **Ranking → Generar códigos para los nuevos**. Cada uno recibe un código de 6 letras y números.
3. Pasale a cada uno su código por mensaje privado. En la web lo escriben una sola vez en *Juegos → Ranking parroquial*.

Para dar de baja a alguien, destildá **Activo**: deja de aparecer y no puede sumar más puntos.

## Cómo cuenta los puntos

| Desafío | Puntos |
|---|---|
| Santo del día | 100 con 1 pista, 80 con 2, 60 con 3, 40 con 4, 20 con 5 |
| Versículo del día | 100 al primer intento, 50 al segundo, 0 si no sale |
| Crucigrama | 100 si lo terminás en menos de 3 minutos sin ayudas; −15 por cada palabra revelada y −1 por cada 30 segundos de más (mínimo 20) |
| Conexiones | 100 sin errores, 80 con 1, 60 con 2, 40 con 3; si perdés, 10 por grupo encontrado |

- Solo cuenta el desafío **del día** y **una vez** por persona.
- **Semana**: de lunes a domingo (hora de Argentina). **Histórico**: desde que arrancó.
- Los puntajes se pueden ver (y borrar, si hiciera falta) en la pestaña **Puntajes**.

> Aviso honesto: los puntos se calculan en el celular de cada uno. Alguien que sepa de programación podría
> mandarse puntos de más, pero nunca más de 100 por desafío por día. Si ves algo raro, borrá esas filas en *Puntajes*.

## Si cambiás el código del script

Después de pegar una versión nueva: **Implementar → Administrar implementaciones → editar (lápiz) → Versión: Nueva → Implementar**.
Así la URL sigue siendo la misma.
