# Índice de conversaciones con IA — Entrega 2

## Proyecto: Huellas — App de adopción de mascotas

> Esta carpeta reúne las conversaciones de la segunda entrega del proyecto, incluyendo integración entre frontend y backend, mejoras de UX/UI, refactors de pantallas y correcciones varias. El contenido está organizado de forma resumida para facilitar su revisión.

---

## Archivos de conversaciones

| Archivo                                                                 | Herramienta     | Descripción                                                                                                                                                                                                  |
| ----------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Calcular distancia en la card.txt                                       | Codex           | Implementación del cálculo real de distancia en las cards de búsqueda usando coordenadas y la fórmula de Haversine, con formato en metros o kilómetros según la distancia.                              |
| Conectar pantalla de Detalle.txt                                        | Codex           | Conexión de la pantalla de detalle de mascota con el backend para cargar datos reales, gestionar favoritos, mostrar el botón de contacto según el dueño y abrir enlaces de contacto.                      |
| Corrige Animal Detail y comunicacion.txt                                | Codex           | Ajuste de la pantalla de detalle para usar correctamente el tipo de contacto del usuario, mostrar el ícono adecuado y redirigir a la aplicación correspondiente; además se incorpora un carrusel de fotos. |
| Creacion de Calendario, Funcion Imagenes y Conectar Backend Mascotas.md | Antigravity     | Implementación de la conexión de la pantalla de Mis Mascotas con el backend, incluyendo creación, edición, eliminación, carga de imágenes y validación de formularios.                                 |
| Home Screen Location and API Integration.md                             | OpenCode        | Desarrollo de la pantalla Home con ubicación del dispositivo, carga de datos reales desde el backend, cálculo de distancia, límite de 10 km, navegación por categorías y guardado de favoritos.          |
| HotFixesVariados.md                                                     | OpenCode        | Hotfixes varios para filtrar publicaciones propias en Home, mapa y búsqueda; unificación de cards; traducción de datos al español; y correcciones de validación de Instagram y Telegram.                 |
| Implementing Profile Screen Integration.md                              | OpenCode        | Integración de la pantalla de perfil con el backend para obtener datos del usuario, cerrar sesión, eliminar cuenta y modificar perfil, incluyendo foto de perfil.                                           |
| ModificarSignUpScreen.md                                                | OpenCode        | Modificación del formulario de registro para reemplazar el campo de WhatsApp por un selector de medio de comunicación y un campo dinámico según la plataforma elegida.                                    |
| Plan de desarrollo backend.txt                                          | OpenCode        | Plan y debugging del desarrollo del backend: configuración inicial, autenticación, endpoints, Docker y pruebas de funcionamiento.                                                                           |
| Refactoring Search To Explore.md                                        | OpenCode        | Refactor de la pantalla de búsqueda para convertirla en Explorar con mapa interactivo de OpenStreetMap, barra de búsqueda flotante, chips de filtros y marcadores de animales.                              |

---

## Resumen por herramienta

| Herramienta     | Cantidad de conversaciones | Usos principales                                                                 |
| --------------- | -------------------------- | -------------------------------------------------------------------------------- |
| OpenCode        | 6                          | Integración de Home, perfil, registro, backend, hotfixes y refactor de Explorar |
| Codex           | 3                          | Cálculo de distancia, conexión de detalle y ajustes de Animal Detail y contacto |
| Antigravity     | 1                          | Desarrollo de la pantalla de Mis Mascotas con conexión al backend y gestión de publicaciones |
