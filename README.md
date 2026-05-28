# Reto Millonario Buena Energía — Electroingeniería S.A.S.

Carpeta lista para subir a GitHub Pages. No necesita npm, Vite ni compilador.

## Estructura

```text
index.html
styles.css
app.js
firestore.rules
firebase.json
.nojekyll
assets/
```

## Cómo subirlo a GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube todos los archivos de esta carpeta.
3. En GitHub entra a `Settings > Pages`.
4. En `Build and deployment`, selecciona `Deploy from a branch`.
5. Selecciona la rama `main` y carpeta `/root`.
6. Guarda y abre el enlace que GitHub Pages genere.

## Firebase / Firestore

La app guarda el ranking en la colección:

```text
rankings
```

No tienes que crear la colección manualmente. Firestore la crea automáticamente cuando el primer jugador termina una partida y se guarda el puntaje.

Cada partida finalizada guarda:

```text
game
player
area
points
money
coins
level
correct
wrong
jokes
lifelinesUsed
createdAt
```

El ranking se ordena por `points` de mayor a menor. Si Firestore bloquea por reglas o conexión, el juego mantiene ranking local temporal en el navegador.

## Reglas de Firestore

Copia el contenido de `firestore.rules` en Firebase Console:

```text
Firestore Database > Rules > pegar reglas > Publish
```

Estas reglas permiten leer el ranking, crear puntajes validados, bloquear edición/eliminación y cerrar cualquier otra colección.

## Assets incorporados

Se incluyeron los GIFs, logo y audios entregados por el usuario. Los nombres seguros para GitHub son:

```text
assets/logo_dream_team_calidad.png
assets/gif_dance_class.gif
assets/gif_sad_pablo.gif
assets/gif_dance_shock.gif
assets/gif_scream_help.gif
assets/gif_processing_cat.gif
assets/gif_loading_gorilla.gif
assets/gif_energy_pill.gif
assets/gif_support_bunny.gif
assets/gif_penguin_oops.gif
assets/gif_rabbids_win.gif
assets/yeah-baby.mp3
assets/nahhh-baby.mp3
```

## Sonidos

- Respuesta correcta: `assets/yeah-baby.mp3`
- Respuesta incorrecta o tiempo vencido: `assets/nahhh-baby.mp3`

## Nota de seguridad

La configuración web de Firebase puede estar visible en el navegador. Eso es normal en apps web de Firebase. La protección real está en las reglas de Firestore.
