# Historial de Cambios (Changelog) 🐾


## [1.0.0] - 2026-06-22

### Añadido
* **Backend:** Soporte para carga y almacenamiento local de imágenes de mascotas utilizando `multer` y un volumen persistente de Docker.
* **Backend:** Integración de la API de Georef Argentina para autocompletado de direcciones en base a calles y centroides aproximados de localidades.
* **Backend:** Registro e integración de medios de contacto y su respectivo tipo (WhatsApp, Telegram, etc.) en el servicio de usuarios.
* **Mobile:** Pantalla de edición de publicaciones (`EditAnimalScreen`) con soporte para cargar/ver fotos cargadas previamente y modificar todos los campos de la mascota.
* **Mobile:** Calendario nativo para seleccionar la fecha de nacimiento de la mascota durante la edición y creación.
* **Shared:** Utilidades de traducción y formateo de atributos de mascotas (como tipo de animal, tamaño, género).

### Corregido
* **Backend:** Límite máximo de caracteres en la descripción de las publicaciones de animales para evitar desbordamiento en la interfaz.
* **Mobile:** Layout y visualización de la pantalla de detalle del animal (`DetailScreen`) para mejorar la jerarquía visual de la información.
* **Mobile:** Errores en la carga de imágenes del perfil y sincronización del tipo de contacto seleccionado.

---

## [0.9.0] - 2026-06-15

### Añadido
* **Backend:** Endpoint para la consulta y almacenamiento de las publicaciones favoritas de un usuario.
* **Mobile:** Pantalla de Favoritos (`FavoritesScreen`) que lista los animales guardados por el usuario directamente desde la API.
* **Mobile:** Botón interactivo de favorito (ícono de corazón) con animaciones en la interfaz.
* **Mobile:** Integración activa de GPS a través de `expo-location` para obtener la ubicación exacta del usuario en tiempo real.
* **Mobile:** Implementación de la fórmula de Haversine para calcular dinámicamente y mostrar la distancia entre el usuario y la mascota.
* **Mobile:** Pantalla de exploración y búsqueda (`SearchScreen`) integrada con `react-native-maps`, incluyendo marcador de mapa personalizado.
* **Mobile:** Filtro de búsqueda extensible mediante un panel deslizable modal (`FilterBottomSheet`) para filtrar por categoría y tamaño de animal.

---

## [0.8.0] - 2026-06-01

### Añadido
* **Backend:** Integración de Better Auth para el control de sesiones seguras y middlewares de autenticación de peticiones.
* **Mobile:** Pantalla de registro (`Register`) e inicio de sesión (`Login`) con validaciones de campos en tiempo real mediante esquemas comunes de `Zod`.
* **Mobile:** Manejo y guardado local del token de sesión para autenticación persistente al iniciar la app.
* **Infraestructura:** Monorepo con estructura de npm workspaces (`Mobile`, `Server`, `Shared`).
* **Infraestructura:** Archivo de configuración de Docker Compose para base de datos PostgreSQL local.
* **Infraestructura:** Modelos de datos en Prisma ORM para gestionar usuarios (`User`), publicaciones (`Post`), favoritos (`Favorite`) y Better Auth.
