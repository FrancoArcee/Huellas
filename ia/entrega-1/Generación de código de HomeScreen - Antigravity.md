![User uploaded media 1]()

Para la primera entrega de este proyecto debemos entregar todo el flujo principal de la app movil, sin backend, solo datos mockeados. Como se puede ver, actualmente solo están hechos las pantallas de login y signup. Para esta primera entrega quiero que al presionar sobre los botones "Iniciar Sesión" y "Registrarme" te redirija directamente al Home (aunque el formulario esté vacío).
En la imágen adjunta se puede ver el diseño exacto de la home screen.
Generá los archivos necesarios con sus códigos correspondientes y modificá los que necesites para que exista:
1- home screen con:
1.1- su componente navbar ya hecho (ubicado en la parte inferior de la pantalla como se ve en la imágen). Debe ser un componente a parte ya que la navbar aparece en diferentes pantallas
1.2- El título que se ve en la imagen ("Adopta tu próximo compañero") en su posición específica.
1.3- La barra de búsqueda como componente externo (solo la barra, no su funcionalidad)
1.4- El ícono de filtros (solo el botón, ya que mi compañero diseñará la modal de filtros mas adelante por su cuenta).
1.5- Carrousel de categorías (Perro, Gato, etc, todas las que ve en la imágen), estas no deben tener funcionalidad, solo el front.

NO diseñes la card del animal, eso es tarea para mi compañero mas adelante. Asegurate de que al diseñar el home y ubicar los elementos quede el espacio perfecto para la card pero NO la diseñes.

Es muy importante que utilices los colores y tipografías definidos en la carpeta Mobile/src/theme. La tipogrfía a utilizar es Poppins. Los íconos para las categorías se encuentran en Mobile/src/assets/icons.

Debe ser un código sencillo y entendible, que de lugar a ala componentización como te mencioné.

Haceme las preguntas que necesites antes de generar el código final. Una vez tengas mis respuestas ahí si podés empezar a generr el código necesario

**12:51, 14/5/2026**

Ya tengo todo el contexto del proyecto. Antes de generar código, tengo algunas preguntas puntuales sobre la imagen del diseño y la navbar:

---

**Preguntas sobre la Navbar:**

1. **¿Cuántos ítems tiene la navbar?** Por los íconos en `icons/screens/` veo 4: `home`, `search`, `explore`, `like`. ¿Es eso exactamente? ¿En ese orden de izquierda a derecha?
2. **¿Tiene algún ítem activo resaltado?** ¿Cómo se distingue visualmente el ítem activo (el color primario `#F19C2B`, subrayado, ícono más grande, etc.)?
3. **¿La navbar tiene fondo blanco o sigue el color de fondo de la app (`#F1EEEE`)?** ¿Tiene sombra?

---

**Preguntas sobre el Home:**

4. **El carrusel de categorías:** En la imagen, ¿las categorías aparecen con fondo de chip/pastilla (tipo badge redondeado con ícono + texto)? ¿O son ícono + texto apilados verticalmente? ¿Cuál está seleccionado por defecto?
5. **La barra de búsqueda:** ¿Tiene un ícono de lupa adentro (a la izquierda)? Veo que hay un `search.svg` en `icons/screens/`. ¿Lo uso ahí?
6. **El botón de filtros:** ¿Va a la derecha de la barra de búsqueda en la misma fila, o está separado? Veo `filter.svg` en `icons/buttons/`.
7. **El espacio reservado para la card:** ¿Dejo simplemente un `FlatList` vacío (o con un placeholder gris) con el espacio correcto, o solo el espacio en blanco?
8. **¿Adjuntás la imagen del diseño?** No la veo adjunta en el mensaje. ¿Podés compartirla?

12:49, 14/5/2026

![User uploaded media 1]()

1- Exactamente esos 4 y en ese órden
2- Si, debe resaltarse el ícono seleccionado (que mas adelante al seleccionar el ícono te llevará a la pantalla correspondiente, aún no), poniéndolo de color naranja (el que está en themes que quede mejor) si es posible.
3- es un fondo blanco que se distingue del fondo del home, hay una pequeña sombra.
4- es el ícono del animal redondeado y abajo el texto que le corresponde. Por defecto ninguno está seleccionado pero al seleccionar uno debe quedar marcado sutilmente.
5- Podes utilizar ese ícono a la izquierda. Da lugar a que mas adelante ese ícono funciones como boton de "Buscar" cuando esté hechala funcionaldiad de búsqueda.
6- Va a la derecha de la barra, utilizá el ícono que mencionas
7- Dejá el espacio en blanco
8- La imágen está adjunta en este mensaje, podes visualizarla?

**12:58, 14/5/2026**

Listo. Acá va el resumen de todo lo generado:

---

### Archivos creados

| Archivo                                           | Qué es                                           |
| ------------------------------------------------- | ------------------------------------------------- |
| `shared/components/ui/SearchBar.tsx`            | Barra de búsqueda + botón de filtros naranja    |
| `shared/components/layout/Navbar.tsx`           | Navbar inferior reutilizable con 4 tabs           |
| `features/home/components/CategoryCarousel.tsx` | Carrusel horizontal de categorías con selección |
| `features/home/screens/HomeScreen.tsx`          | Pantalla home armada con todos los componentes    |

### Archivos modificados

| Archivo                | Cambio                                           |
| ---------------------- | ------------------------------------------------ |
| `App.tsx`            | Usa el `HomeScreen` real, arranca en `Login` |
| `LogInScreen.tsx`    | "Iniciar Sesión" → navega a `Home`           |
| `RegisterScreen.tsx` | "Registrarme" → navega a `Home`               |

---

**⚠️ Nota sobre los íconos de la Navbar:** Los SVG en React Native no siempre aceptan `fill`/`stroke` dinámico si tienen colores hardcodeados internamente. Si ves que los íconos no cambian de color al seleccionarlos, avisame y vemos el contenido de cada SVG para ajustarlo.

12:58, 14/5/2026

![User uploaded media 1]()

Bien, para arrancar ya cumple con mucho de lo que necesito. La sección de Categorías está perfecta. En la imágen adjunta en este mensaje se vé como veo yo en mi celular tu diseño.
A lo ya creado aplicá los siguientes cambios:

- La navbar choca con los botones de navegación de mi celular, esto no debería ser así. Tené en cuenta que en algunos dispositivos los botontes siempre están ahí, en algunos celulares estos botones pueden "desaparecer", en esos casos quiero que siga estando en la posición y tamaño actual, sin embargo si los botones no desaparecen queda la barra tapada por los mismos, entonces debería subirse la navbar para que no se interfieran. Decidí, razoná y actuá con una solución directa a este problema.
- También sobre la navbar: los íconos no seleccionados NO deben tener fondo, acutalmente tienen un fondo gris, al no estar seleccionados no deben tener fondo. Al seleccionarse está perfecto que se pongan naranjas y el texto también. Quiero que al ícono seleccionado se le ponga ua viñeta naranja como en la primera imágen que adjunté.
- La barra de búsqueda es muy "baja", debe quedar del mismo alto que el ícono de los filtros.
  -Agregá una sombra al ícono de los filtros como tiene la barra de búsqueda.
- El título está muy arriba en la pantalla, dale una posición mas baja (lógicamente "empujando" todo el contenido de la pantalla).

**13:16, 14/5/2026**

Listo. Resumen de cambios:

| Cambio                                         | Solución                                                                                                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Navbar choca con botones del celular** | `useSafeAreaInsets()` + `SafeAreaProvider` en App. `paddingBottom = max(insets.bottom, 16)` — si hay botones los respeta, si desaparecen usa el padding normal |
| **Íconos con fondo gris**               | Los no-seleccionados ya no reciben `fill`/`stroke`, usan sus colores de fábrica. Solo el activo recibe naranja                                                   |
| **Viñeta naranja**                      | Pequeño `View` circular de 6px bajo el label del tab activo                                                                                                        |
| **SearchBar altura**                     | `height: 48` fijo en el inputWrapper, sin `paddingVertical`                                                                                                       |
| **Sombra del filtro**                    | Misma sombra oscura/sutil que la barra de búsqueda                                                                                                                   |
| **Título más abajo**                   | `paddingTop` subió de 40px → 64px en el scroll del HomeScreen                                                                                                     |

13:03, 14/5/2026

![User uploaded media 1]()

Perfecto los cambios que hiciste. Cambiá los siguientes detalles:

- La viñeta que quiero que aparezca en el ícono seleccionado es del estilo que aparece en la imagen adjunta en este mensaje.
- El texto en la barra de búsqueda (placeholder) está muy arriba, debe estar mas centrado en altura.

**13:21, 14/5/2026**

Cambios aplicados:

* **Viñeta** : ahora es una barra horizontal naranja (`width: 32, height: 3, borderRadius: 2`) posicionada en `top: 0` del tab activo — igual al estilo de la imagen.
* **Placeholder centrado** : `textAlignVertical: 'center'` en el `TextInput`, que es el fix estándar para Android cuando el texto aparece pegado arriba dentro del campo.

13:19, 14/5/2026

![User uploaded media 1]()

en esta imágen adjunta se ve que el placeholder NO está centrado en altura dentro de la barra. Quiero que lo centres.

**13:26, 14/5/2026**

Agregué `includeFontPadding: false` junto con `paddingVertical: 0` explícito.

En Android, aunque tengas `textAlignVertical: 'center'`, el sistema añade un padding interno reservado para los ascendentes/descendentes de la fuente (`includeFontPadding`) que desplaza el texto visualmente hacia arriba. Con `false` se elimina ese espacio extra y el texto queda centrado correctamente.

13:24, 14/5/2026

![User uploaded media 1]()

Quiero que la viñeta que está por encima del ícono seleccionado en la navbar, "toque" el "techo" de la navbar, quiero que quede como en esta imágen adjunta

**13:27, 14/5/2026**

Listo. `top: -8px` mueve la barra hacia arriba exactamente la misma cantidad que el `paddingTop` del container, haciendo que quede pegada al borde superior de la navbar.

13:27, 14/5/2026

Quiero que el título del home se note mas oscuro el "tu próximo compañero"

**13:44, 14/5/2026**

Listo. Pasa de `textPrimary` (`#111827`) a `black` (`#000000`), que es el color más oscuro disponible en el tema.

13:36, 14/5/2026

una letra mas ancha para esa parte

**13:45, 14/5/2026**

Listo. Pasa de `h2` (28px) a `h1` (32px), ambos en Poppins Bold 700. Si aún querés más tamaño o querés agregar `letterSpacing` para separar más las letras, avisame.

13:45, 14/5/2026
