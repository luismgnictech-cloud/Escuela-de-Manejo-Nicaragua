# Escuela de Manejo Nicaragua

Plataforma de práctica para el examen teórico de conducción en Nicaragua. Incluye preguntas por módulo, simulacros, revisión de errores y progreso guardado en el dispositivo.

## Versión 2: aplicación instalable

Esta versión funciona como **Progressive Web App (PWA)**:

- Instalación desde Chrome en Android.
- Icono propio en la pantalla de inicio y el menú de aplicaciones.
- Apertura en modo independiente, sin la barra normal del navegador.
- Preguntas e imágenes disponibles sin conexión después de la primera carga completa.
- Actualización automática al publicar una nueva versión en GitHub Pages.
- Progreso guardado localmente en el dispositivo.

## Desarrollo local

```bash
npm install
npm run dev
```

## Construcción

```bash
npm run build
npm run preview
```

## Publicación

El flujo `.github/workflows/deploy.yml` publica automáticamente en GitHub Pages cuando se envían cambios a la rama `main`.

```bash
git add .
git commit -m "Convertir plataforma en aplicación PWA"
git push origin main
```

Sitio publicado:

```text
https://luismgnictech-cloud.github.io/Escuela-de-Manejo-Nicaragua/
```

## Probar la instalación en Android

1. Abrir el sitio en Chrome.
2. Esperar a que cargue completamente.
3. Pulsar **Instalar aplicación** en la página o abrir el menú `⋮` de Chrome.
4. Seleccionar **Instalar aplicación** o **Agregar a pantalla principal**.
5. Abrirla desde el icono creado en Android.
6. Activar modo avión y comprobar que las preguntas y señales ya visitadas continúan disponibles.

> La opción exacta del menú puede variar según la versión de Chrome y Android.
