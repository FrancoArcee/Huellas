# Agregar filtros en bottom sheet

> En este proyecto actualmente estamos desarrollando con React Native el front de la aplicación Huellas.
>
> Para todo el trabajo de este chat se desarrollará en la rama feature/HomeScreen del repositorio “Huellas”.
>
> Actualmente verás que está desarrollado el home y que el mismo cuenta con un botón para aplicar filtros a la búsqueda. Ahora quiero generar el componente que se desplegará desde abajo donde estarán los filtros, será una especie de bottom sheet, con tamaño predefinido máximo del 60% de la pantalla, donde el usuario no podrá hacerlo mas grande o mas chico mediante gestos, simplemente se abrirá hasta su máxima altura al presionar el botón de filtros y luego el mismo se cerrará al aplicar los filtros seleccionados o presionar la cruz superior.
>
> El diseño del desplegable de los filtros es el que se ve en la imágen adjunta.
>
> Al desplegarse los Filtros, el fondo deberá quedar opaco como se ve en la imágen.
>
> Quiero que generes el código necesario (creando archivo y modificando los necesarios) para este desplegable de filtros. Genera un código escalable para cuando tengamos que aplicar la lógica de los filtros pero no desarrolles la lógica en sí. A la hora de crear archivos tené muy en cuenta la estructura actual de los archivos del repositorio para así seguir el órden del mismo.
>
> No ejecutes tests ni npm run build.
> Solo modifica el código necesario.
> No hagas verificaciones automáticas.
> No agregues dependencias nuevas.
> Usá solo librerías ya instaladas.
>
> Cuando finalices tu tarea quiero que me expliques que hiciste.
>
> User context
>
> Images:
>
> - `data:image/png;base64,....`

<details><summary>9 previous messages</summary>

> Voy a revisar la estructura del repo y cómo está armado el Home para encajar el bottom sheet en el mismo estilo, sin tocar más de lo necesario. No voy a correr tests ni build, tal como pediste.
>
> El shell por defecto intentó abrir `pwsh` desde WindowsApps y falló por permisos del proceso. Cambio a `powershell.exe` explícito para poder inspeccionar los archivos.
>
> Ya confirmé que estamos en `feature/HomeScreen` dentro de `Huellas` y la estructura separa `features/home/components` para piezas del Home, así que voy a seguir esa organización. Ahora miro el Home y los componentes compartidos para reutilizar estilos/iconos existentes.
>
> El botón de filtros vive en `SearchBar`, así que voy a convertirlo en un punto de entrada con `onFilterPress` y crear el bottom sheet como componente propio en `features/home/components`. La lógica real queda preparada con estado local y handlers, pero sin aplicar filtros todavía.
>
> Voy a tocar tres lugares: `SearchBar` para exponer el click, `HomeScreen` para controlar apertura/cierre, y un nuevo `FilterBottomSheet.tsx` con la UI del desplegable.
>
> <details><summary>Created 1 file, edited 2 files</summary>
>
> - Wrote `./Huellas/Mobile/src/features/home/components/FilterBottomSheet.tsx` (+247 -0)
> - Wrote `./Huellas/Mobile/src/features/home/screens/HomeScreen.tsx` (+34 -21)
> - Wrote `./Huellas/Mobile/src/shared/components/ui/SearchBar.tsx` (+16 -13)
>
> </details>
>
> La implementación ya quedó aplicada. Hago una revisión manual del diff para asegurar que solo haya cambiado lo necesario y que no haya quedado ningún import o comentario fuera de lugar.
>
> Ajusto un detalle de comportamiento para que el cierre responda a lo pedido: cruz superior o aplicar. El fondo opaco queda como overlay visual, sin cerrar por toque accidental fuera del sheet.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Huellas/Mobile/src/features/home/components/FilterBottomSheet.tsx` (+1 -1)
>
> </details>

</details>

Listo. Implementé el desplegable de filtros sin agregar dependencias, sin tests, sin build y sin verificaciones automáticas.

Qué cambié:

- Creé [FilterBottomSheet.tsx](~/Franco/Facultad/Aplicaciones%20m%C3%B3viles/Huellas/Mobile/src/features/home/components/FilterBottomSheet.tsx), siguiendo la estructura de `features/home/components`.
- Modifiqué [HomeScreen.tsx](~/Franco/Facultad/Aplicaciones%20m%C3%B3viles/Huellas/Mobile/src/features/home/screens/HomeScreen.tsx) para manejar la apertura/cierre del bottom sheet.
- Modifiqué [SearchBar.tsx](~/Franco/Facultad/Aplicaciones%20m%C3%B3viles/Huellas/Mobile/src/shared/components/ui/SearchBar.tsx) para aceptar `onFilterPress` y abrir los filtros desde el botón actual.

El bottom sheet:

- Se abre desde abajo con `Modal`.
- Tiene altura fija del `60%`.
- No tiene gestos para agrandar o achicar.
- Muestra fondo opaco.
- Se cierra al presionar la `X` o al tocar `Aplicar`.
- Deja preparada una estructura escalable con `FilterValues`, `onApply`, `onClear` y estado local, pero sin desarrollar la lógica real de filtrado.

> Cambios a realizar:
>
> - No debe haber valores por defecto en los desplegables.
> - La flecha de los desplegables debe ser mas pequeña, no tan brusca.
> - El botón de cierre que no sea una simple X, queda mal estéticamente, que sea un boton con una cruz.
> - Utiliza los colores definidos en el repositorio en Mobile/src/theme

<details><summary>3 previous messages</summary>

> Voy a ajustar el componente directamente: saco los valores iniciales de categoría/tamaño, reduzco el tamaño del chevron y cambio la X textual por un icono reutilizando assets existentes y colores del theme.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Huellas/Mobile/src/features/home/components/FilterBottomSheet.tsx` (+24 -14)
>
> </details>
>
> Quedó aplicado. Reviso el diff final de los archivos tocados para confirmar que los ajustes quedaron contenidos en el bottom sheet y su integración.

</details>

Listo, apliqué los cambios pedidos.

Actualicé [FilterBottomSheet.tsx](~/Franco/Facultad/Aplicaciones%20m%C3%B3viles/Huellas/Mobile/src/features/home/components/FilterBottomSheet.tsx):

- Quité los valores por defecto de `Categoría` y `Tamaño`; ahora arrancan vacíos y muestran `Seleccionar`.
- Achiqué la flecha de los desplegables de `20x20` a `14x14`.
- Reemplacé la `X` textual por un botón circular con una cruz construida visualmente.
- Cambié el overlay para usar `theme.colors.black` con `opacity`, en lugar de un color hardcodeado con `rgba`.
- Ajusté colores del cierre, placeholders y controles usando valores de `Mobile/src/theme`.

No ejecuté tests, build ni verificaciones automáticas.
