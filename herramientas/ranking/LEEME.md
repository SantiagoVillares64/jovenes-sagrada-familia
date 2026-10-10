# Cuentas, ranking e insignias: cómo funciona

La web usa **"Entrar con Google"**. Google hace el inicio de sesión (nosotros nunca vemos contraseñas) y la planilla
de la cuenta **academiafrassati@gmail.com** guarda quién puede entrar, los puntos de los juegos y las cumbres de la Academia.

## Instalación (una sola vez)

1. En la planilla del ranking (cuenta academiafrassati): **Extensiones → Apps Script**.
2. Borrá todo y pegá el contenido de `Codigo.gs`. Guardá.
3. **Implementar → Nueva implementación** → Aplicación web · Ejecutar como **Yo** · Acceso **Cualquier usuario** → Implementar.
   Google pide permisos: leer y editar **esta** planilla (solo esta, por `@OnlyCurrentDoc`), conectarse a Google para
   verificar los inicios de sesión y mandarte un mail cuando alguien nuevo pide entrar. Aceptalos.
4. Pasá la URL nueva (termina en `/exec`) a quien mantiene la web, o pegala en `js/contenido.js` → `ranking.url`.
5. Recargá la planilla: aparece el menú **Administración**. Tocá **Preparar pestañas**.
6. Si venías del sistema de códigos: **Administración → Pasar jugadores con código a Usuarios** y completá el
   **Email** de cada uno. Cuando entren con esa cuenta de Google, recuperan sus puntos.

## Cuentas nuevas y aprobación

1. La persona toca "Entrar con Google" en la web y **ya puede usar todo**: jugar, sumar puntos, hacer los cursos de la
   Academia y llevarse sus insignias. Queda en la pestaña **Usuarios** con Estado **pendiente** y te llega un mail.
2. Mientras esté pendiente **no aparece en el ranking público** (ella sí ve su propio puesto).
3. Para que aparezca: poné su **Estado** en **aprobado** y revisá **Nombre en el ranking** (si lo dejás vacío se usa
   su nombre de pila con la inicial del apellido, nunca el apellido completo) y **Grupo**.
4. El aviso llega a la cuenta que implementó el script. Para mandarlo a otro mail, completá `AVISAR_A` al principio de `Codigo.gs`.

- **Dar de baja:** Estado → **baja**. Deja de sumar y desaparece del ranking (sus datos quedan, por si vuelve).
- **Borrar a alguien** (si lo pide): borrá su fila en Usuarios y sus filas en Puntajes e Insignias (buscá su ID).
- **Cerrar todas las sesiones** (si sospechás algo raro): Administración → Cerrar todas las sesiones.

## Qué se guarda y qué se ve

| Pestaña | Qué tiene | ¿Sale a la web? |
|---|---|---|
| Usuarios | ID, mail, nombre de Google, nombre en el ranking, grupo, estado, fechas | Solo nombre en el ranking y grupo, y solo de los aprobados |
| Puntajes | Fecha, ID, juego, puntos | Solo los totales |
| Insignias | Fecha, ID, curso, nota | Solo el ícono de la cumbre |
| Sesiones (oculta) | Huellas de las sesiones abiertas | No |

Los mails y los IDs **nunca** salen a la web. Política de privacidad: https://sagradafamiliajoven.github.io/privacidad.html

## Cómo cuenta los puntos

| Desafío | Puntos |
|---|---|
| Santo del día | 100 con 1 pista, 80 con 2, 60 con 3, 40 con 4, 20 con 5 |
| Versículo del día | 100 al primer intento, 50 al segundo, 0 si no sale |
| Crucigrama | 100 si lo terminás en menos de 3:30 sin revelar palabras; después −1 por cada 30 segundos y −15 por cada palabra revelada (mínimo 20) |
| Conexiones | 100 sin errores, 80 con 1, 60 con 2, 40 con 3; si perdés, 10 por grupo encontrado |

- Solo cuenta el desafío **del día** y **una vez** por persona. Semana: lunes a domingo (hora de Argentina).

> Aviso honesto: los puntos se calculan en el celular de cada uno. Alguien que sepa de programación podría
> mandarse puntos de más, pero nunca más de 100 por desafío por día. Si ves algo raro, borrá esas filas en *Puntajes*.

## Si cambiás el código del script

Pegá la versión nueva y después **Implementar → Administrar implementaciones → lápiz → Versión: Nueva → Implementar**.
Así la URL sigue siendo la misma.
