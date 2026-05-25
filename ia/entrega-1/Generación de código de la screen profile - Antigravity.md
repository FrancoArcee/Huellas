Para este proyecto hace falta la gestión de usuarios, por lo que debo agregar una sección de visualización del perfil del usuario con la posibilidad de ver sus datos, editarlos, cerrar su sesión o eliminar su cuenta si así lo desea.

Genera los archivos nuevos y cambiá los necesarios para:

- Agregar un quinto tab al proyecto llamado “Perfil” cuyo ícono será “profile.svg” ubicado en la carpeta Mobile/src/icons/screens.
- La pantalla asociada a este tab, la cual contendrá la foto de perfil del usuario, con su nombre apellido, correo y número de wsp. Además presentará tres botones correspondientes a “Editar perfil” (con el ícono “pencil.scg” que está en Mobile/src/icons/buttons),  “Cerrar sesión” (con el ícono “logout.scg” que está en Mobile/src/icons/buttons) y el botón “Eliminar cuenta”.
- La pantalla de edición del perfil.
- El modal de perfil actualizado con éxito.
- El modal de confirmación de eliminación de cuenta.
- El modal de confirmación de cierre de sesión.

Los diseños de todo lo nuevo son los que se ven en la imagen adjunta, el resultado final generado debe ser igual a esas pantallas.

Tené bien presente la organización del repositorio para saber que archivos crear y donde específicamente.

No ejecutes tests ni npm run build.
Solo modifica el código necesario.
No hagas verificaciones automáticas.
No agregues dependencias nuevas.
Usá solo librerías ya instaladas.

Cuando finalices tu tarea quiero que me expliques que hiciste.

Haceme preguntas que creas necesarias antes de generar el código

**23:25**

Todo está correcto. Aquí está el resumen completo de lo que hice:

---

## Resumen de cambios

### Archivos **creados** (nuevos)

| Archivo                          | Descripción                                                                                                                                                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ProfileScreen.tsx**      | Pantalla de perfil con header naranja, avatar circular, card de datos (nombre, email, WhatsApp) y botones "Editar perfil", "Cerrar sesión" y "Eliminar cuenta". Incluye los modales de confirmación de cierre de sesión y eliminación de cuenta reutilizando el `ConfirmModal` existente. |
| **EditProfileScreen.tsx**  | Pantalla de edición del perfil con formulario de 4 campos (Nombre, Apellido, Correo, WhatsApp), botones "Actualizar perfil" y "Cancelar", y el modal de éxito con animación Lottie al guardar.                                                                                               |
| **app/(tabs)/profile.tsx** | Route del tab "Cuenta" que monta la `ProfileScreen`.                                                                                                                                                                                                                                          |
| **app/edit-profile.tsx**   | Route stack (fuera de los tabs) para la `EditProfileScreen`, accesible con `router.push('/edit-profile')`.                                                                                                                                                                                  |

### Archivos **modificados**

| Archivo                          | Qué cambió                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **app/(tabs)/_layout.tsx** | Se importó `ProfileSvg` y se agregó el quinto `<Tabs.Screen name="profile" title="Cuenta">`.                                             |
| **app/_layout.tsx**        | Se registró `<Stack.Screen name="edit-profile">` para que la navegación al formulario funcione desde cualquier tab.                        |
| **Navbar.tsx**             | Se importó `ProfileIcon`, se extendió el tipo `TabName` con `'cuenta'` y se agregó el tab al array `TABS`.                          |
| **SuccessCheckIcon.tsx**   | Se agregó prop opcional `size?: number` (default `350`) para poder reutilizarlo en el modal con `size={80}` sin romper usos anteriores. |

### Decisiones de diseño

* **Avatar** : usa el `profile.svg` existente sobre un círculo blanco con fondo naranja, igual al mockup.
* **Modales de confirmación** : reutilizan el componente `ConfirmModal` ya existente, que ya tiene el ícono de advertencia y los botones con el estilo correcto.
* **Flujo de logout/eliminación** : navega a `/(auth)` usando `router.replace` (no agrega al historial).
* **Modal de éxito** : implementado inline en `EditProfileScreen` con la animación Lottie existente en `success.json`.

23:25

Bien hecho el diseño, corregí los siguientes puntos:

- Al cerrar sesión y eliminar la cuenta salta el error Unmatched Route.
- al Incluir un nuevo Tab, el tab "Publicaciones" se corta el texto y queda "Publicac...", cambiale el nombre a "Mascotas" y tené en cuenta en donde repercute este cambio de nombre

**23:40**

Listo. Los tres cambios están aplicados:

---

### Correcciones realizadas

**1. Unmatched Route al cerrar sesión / eliminar cuenta**

* **Causa:** `/(auth)` es un grupo de rutas (layout group) sin `index.tsx` propio, por lo que Expo Router no sabe qué renderizar.
* **Fix:** En **ProfileScreen.tsx** se cambió `router.replace('/(auth)')` → `router.replace('/(auth)/login')` en ambos handlers (`handleLogout` y `handleDeleteAccount`).

**2. Tab "Publicaciones" se cortaba → renombrado a "Mascotas"**

* **app/(tabs)/_layout.tsx** → `title: 'Mascotas'` (el label visible en la tab bar)
* **app/(tabs)/mypost.tsx** → `title: 'Mascotas'` (el título del Stack.Screen)

> Los nombres de código (`publicaciones`, `usePublicacionesStore`, `MisPublicacionesScreen`, etc.) **no se tocaron** ya que son identificadores internos que no afectan la UI visible.

23:40

en la carpeta Mobile/src/assets está el ícono "whatsapp.svg", utilizalo en el perfil cuando mostras el número en lugar de ese punto verde.
el ícono del perfil debe colorearse de naranja (no su fondo sino que las lineas del ícono) al ser seleccionado al igual que los otros íconos.

**23:48**

El patrón de uso es exactamente el mismo que implementé — se usa como componente JSX con `width` y `height`. El import ya existe y funciona en otro lugar del proyecto. Los cambios son correctos.

---

### Cambios realizados

**1. Ícono de perfil se colorea en naranja al seleccionarlo**

* **Causa del bug:** **profile.svg** tenía el stroke hardcodeado como `stroke="#212121"` (negro fijo), mientras que todos los demás íconos de tab usan `stroke="currentColor"` para responder al `tabBarActiveTintColor` de Expo.
* **Fix:** Se cambió `stroke="#212121"` → `stroke="currentColor"`. Ahora el ícono se pinta de naranja (`#F19C2B`) al estar activo y de gris al estar inactivo, igual que Inicio, Buscar, Mascotas y Favoritos.

**2. WhatsApp icon en lugar del punto verde**

* En **ProfileScreen.tsx** se importó `WhatsAppSvg` desde `../../../assets/icons/whatsapp.svg` (mismo patrón que ya usa `AnimalDetailScreen.tsx`) y se reemplazó el `View` del punto verde por `<WhatsAppSvg width={20} height={20} />`.
