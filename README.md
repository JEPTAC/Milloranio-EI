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

## Firestore

La app guarda el ranking en la colección:

```text
rankings
```

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

El ranking se ordena por `points` de mayor a menor.

## Reglas de Firestore

Copia el contenido de `firestore.rules` en Firebase Console:

```text
Firestore Database > Rules > pegar reglas > Publish
```

Estas reglas permiten:

- Leer ranking públicamente.
- Crear puntajes con campos validados.
- Bloquear edición y eliminación de puntajes desde la web.
- Bloquear cualquier otra colección.

## Importante

La configuración web de Firebase puede estar visible en el navegador. Eso es normal en apps web de Firebase. La protección real está en las reglas de Firestore.

## Assets

La carpeta incluye assets base generados para que el juego cargue de una vez. Puedes reemplazarlos por los GIFs/logos reales conservando exactamente los mismos nombres:

```text
assets/logo.png
assets/logo_calidad.png
assets/login_dance.gif
assets/enviado_penguin.gif
assets/enviado_rabbids.gif
assets/soporte_trabajando.gif
assets/documento_proceso.gif
assets/no_encontrado.gif
assets/ampliar_espera.gif
assets/cierre_final.gif
assets/risa.gif
```
