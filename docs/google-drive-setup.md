# Activar Google Drive en Escuela de Manejo Nicaragua

La implementación está preparada, pero requiere un cliente OAuth propio. La conexión permanece desactivada si no se configura el identificador; no hay cuentas ni copias ficticias.

1. Crear o seleccionar un proyecto en Google Cloud y habilitar **Google Drive API**.
2. Configurar Google Auth Platform: nombre de aplicación, correo de soporte y audiencia externa. Durante las pruebas, agregar las cuentas autorizadas como usuarios de prueba.
3. Añadir los permisos `openid`, `email`, `profile` y `https://www.googleapis.com/auth/drive.appdata`. No solicitar acceso a todos los archivos de Drive.
4. Crear un cliente OAuth de tipo **Aplicación web**. En **Orígenes autorizados de JavaScript**, agregar `https://luismgnictech-cloud.github.io` (sin la ruta del repositorio). Para pruebas locales agregar también `http://localhost` y `http://localhost:5173`. El flujo usa una ventana emergente, sin redirección del servidor.
5. Copiar solo el **Client ID** (termina en `.apps.googleusercontent.com`). No publicar ni enviar el Client Secret.
6. En el repositorio de GitHub, Settings → Secrets and variables → Actions → Variables, crear `GOOGLE_CLIENT_ID` con ese identificador. Ejecutar nuevamente el workflow **Publicar en GitHub Pages**. Para desarrollo local: `VITE_GOOGLE_CLIENT_ID=... npm run dev`.
7. Completar en Google los datos, enlaces de privacidad y requisitos que solicite la plataforma antes de abrir el acceso al público.

## Datos y funcionamiento

- La sesión OAuth permanece únicamente en memoria. Nunca se guardan access tokens en localStorage ni se usa un Client Secret en la web.
- Las copias JSON contienen estadísticas, historial de pruebas, módulos, errores, preguntas dominadas y las preguntas ya usadas para evitar repeticiones.
- Se usa la carpeta oculta `appDataFolder`, accesible a esta aplicación. No se leen documentos personales.
- Al conectar, si hay diferencias, el usuario elige continuar el progreso local o el de Drive. No se suman contadores para evitar duplicar resultados.
- Tras elegir, los cambios se guardan luego de cinco segundos de inactividad. Debe haber internet y una sesión vigente; la sincronización no continúa con la app cerrada. Las copias pendientes tras un error se conservan localmente y requieren volver a conectar.
- Se crean copias independientes para evitar que dos dispositivos sobrescriban la copia del otro. Las copias anteriores se conservan en Drive; no se eliminan automáticamente. El usuario puede retirar el acceso y eliminar los datos de la aplicación desde su cuenta de Google.
- Desconectar deja el progreso local y las copias de Drive. En un dispositivo compartido, usar perfiles de navegador separados o reiniciar el progreso local antes de estudiar con otra cuenta.
- La conexión en la PWA instalada debe validarse con el cliente real; si el sistema bloquea la ventana de Google, abrir la misma página en Chrome para conectar.

## Validación antes de declarar activa la integración

1. Conectar una cuenta autorizada, aceptar el permiso y guardar progreso local.
2. Responder preguntas y comprobar el guardado automático, incluyendo el historial de preguntas usadas.
3. En otro dispositivo, conectar la misma cuenta, elegir Drive y verificar resultados, refuerzo y ruta.
4. Probar dos dispositivos con cambios distintos: debe aparecer la elección de copia, sin sumar resultados ni borrar copias anteriores.
5. Denegar permisos, cerrar el popup, expirar la sesión y cortar internet: el progreso local debe conservarse.
6. Desconectar y conectar otra cuenta: no subir progreso antes de la elección del usuario.
7. Revisar desktop, tablet, móvil y PWA Android.

Fuentes oficiales:
- https://developers.google.com/workspace/drive/api/guides/appdata
- https://developers.google.com/identity/oauth2/web/guides/use-token-model
- https://developers.google.com/identity/oauth2/web/guides/get-google-api-clientid
