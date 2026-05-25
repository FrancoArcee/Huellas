# DetailScreen
> DetailScreen  Quiero que repliques esta pantalla en el código del repositorio a partir de la imagen adjunta.
>
> Objetivo visual:
> - Recrear la interfaz lo más fiel posible a la captura.
> - Respetar colores, espaciados, tipografías aproximadas, cards, botones, íconos, sombras, bordes y distribución.
> - Mantener un diseño responsive para desktop y mobile.
> - Usar los componentes, estilos y patrones existentes del proyecto.
> - No modificar la lógica de negocio existente salvo que sea necesario para integrar esta pantalla.
>
> Además de replicar el diseño, necesito que la pantalla tenga acciones funcionales:
>
> 1. Botón de “Me gusta”
>    - Debe permitir que el usuario marque o desmarque “me gusta”.
>    - Al hacer clic, debe cambiar visualmente el estado del botón/icono.
>    - Si ya existe lógica de favoritos/likes en el proyecto, reutilizarla.
>    - Si no existe backend para esto, implementar el estado de forma local y dejar el código preparado para conectarlo luego.
>
> 2. Botón de “Contactar por WhatsApp”
>    - Debe abrir WhatsApp al hacer clic.
>    - Usar un enlace del tipo:
>      https://wa.me/NUMERO?text=MENSAJE
>    - El mensaje debe incluir una consulta inicial relacionada con el elemento mostrado en la pantalla.
>    - Si el número de WhatsApp ya existe en los datos del proyecto, usarlo.
>    - Si no existe, dejarlo parametrizado como constante o placeholder claramente editable.
>
> 3. Acciones generales
>    - Los botones deben tener estados hover, active y disabled si corresponde.
>    - Deben ser accesibles, usando labels o aria-label cuando haga falta.
>    - No deben romper la navegación actual del sistema.
>
> Antes de modificar:
> - Revisá la estructura del proyecto.
> - Identificá qué componente, ruta o pantalla corresponde.
> - Decime brevemente qué archivos vas a modificar.
>
> Implementación:
> - Modificá solo los archivos necesarios.
> - Reutilizá componentes existentes.
> - Mantené la lógica existente del repositorio.
> - Si necesitás crear un componente nuevo, que sea limpio, reutilizable y fácil de mantener.
>
> Al finalizar:
> - Mostrame un resumen de los archivos modificados.
> - Explicame cómo probar la pantalla localmente.
> - Indicame cómo probar el botón de “Me gusta”.
> - Indicame cómo probar el botón de “Contactar por WhatsApp”.
> - Ejecutá build/linter/test si el proyecto los tiene.
>
> User context
>
> Images:
> - `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnsAAAMWCAYAAACJKUCnAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7P15tO3ped8Ffp7nfd/fbw/nnDvVvbeqVCpNtuVZTuLGtkKISdIZaScBYxJCEvcynaaBBgLdKywWi0AD3cBaNEP3YpGEdAImTjvdju02TjAmxlZsLDsyHmQ5kiLZkiyVqu6tusMZ9t6/3zs8/cfz7lP3XpVky5I8aT+1dp3hnj3+pu/7PN9BAONQv+HqypUrrFYrUkqoKovFgpQS165d4+rVq6xWKxaLBcMwkFKi1sq9e/f46Ec/ysc+9jFOT0+5ffs2165dY7FY0FpjnmdyzuScKaVQSqHWenlrrWFmtNZorQFg5ruPmV3e9vXo90/+/OT3qvoJ9xeRx/5GRC6/Pvr7T/a3r3W/1/r7J++z/3lfT/7+yfs+Wa/1HJ/qfiLClStXuHLlymve57Ve+5PfP/q7/e+ffJxHv3/y65P/9mh9sr/f32f/N0/+bv/717rvJ/v+0Z+ffD3n5+fcv3//sX3vyfvxyGt5red4rd89ev9P9m+P/g2v8X6fvN+TX5/8t/1jPPl3T/7Nvp58LU8+9qO/f/Trk7/b38yMEAIAqoqqIiKEEB67pZQeu8UY2Ww2nJ6e8vGPf5zj42Ne97rX8cY3vpGrV68iIpfnkv3fPXjwgIuLCzabDTlnaq2YGdvtlldeeeXydR7qUIf63JVwAHu/`

<details><summary>10 previous messages</summary>

> Voy a ubicar la pantalla de detalle real y las utilidades existentes de favoritos/WhatsApp antes de tocar código. También voy a respetar el estado actual del repo: no voy a revertir ni mezclar los cambios del login en esta tarea.
>
> Encontré que `AnimalDetailScreen.tsx`, el store de animales y el hook de WhatsApp existen pero están vacíos, así que no hay lógica previa que reutilizar ahí. Voy a mirar cards/listas y datos para integrar el detalle sin inventar una ruta que no exista.
>
> Voy a modificar estos archivos: `Mobile/src/features/animals/screens/AnimalDetailScreen.tsx` para la UI y acciones, `Mobile/src/shared/hooks/useWhatsApp.ts` para abrir `wa.me`, y agregar una ruta Expo `Mobile/app/animals/[id].tsx` para poder probar la pantalla sin romper tabs. Como el proyecto no trae store/datos reales de animales, usaré datos mock/placeholder dentro del detalle, preparados para reemplazarlos por backend después.
>
> Empiezo por crear la ruta `animals/[id]` y después cargo la pantalla de detalle con estado local de favorito y contacto por WhatsApp. Mantengo todo encapsulado en animales para que el resto de navegación siga igual.
>
> <details><summary>Created 1 file, edited 2 files</summary>
>
> - Wrote `./Mobile/app/animals/[id].tsx` (+13 -0)
> - Wrote `./Mobile/src/features/animals/screens/AnimalDetailScreen.tsx` (+388 -0)
> - Wrote `./Mobile/src/shared/hooks/useWhatsApp.ts` (+19 -0)
>
> </details>
>
> La primera versión ya está aplicada: detalle con hero, botón volver, favorito local, chips, sección descriptiva, ubicación y barra de contacto. Ahora corro TypeScript para ajustar imports o tipos de React Native Web si aparece algo.
>
> TypeScript marcó que la versión de React Native del proyecto no tipa `hovered` en `Pressable`. Lo adapto con estado `onHoverIn/onHoverOut`, así queda funcional en web y tipado limpio.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/src/features/animals/screens/AnimalDetailScreen.tsx` (+15 -7)
>
> </details>
>
> TypeScript del workspace móvil pasó. Como el proyecto no tiene lint ni tests definidos en Mobile, voy a correr el build disponible del monorepo para cumplir la verificación general.
>
> El build del monorepo pasó, pero generó `.js` al lado de los `.ts` en `Server/src` y `Shared/src` porque esos paquetes no tienen `outDir`. Son artefactos del build, no parte del diseño; voy a limpiar solo esos archivos generados para dejar el diff enfocado.
</details>

Listo, implementé la pantalla de detalle tipo captura para Rocky.

Archivos modificados:
- [AnimalDetailScreen.tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>)
- [useWhatsApp.ts](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/hooks/useWhatsApp.ts>)
- [Mobile/app/animals/[id].tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/animals/[id].tsx>)

Qué quedó hecho:
- UI responsive con imagen hero, botones flotantes, card de nombre, tags, descripción, ubicación y barra inferior de contacto.
- “Me gusta” funcional con estado local y cambio visual del corazón.
- WhatsApp funcional usando `https://wa.me/NUMERO?text=MENSAJE`.
- El número está como placeholder editable: `WHATSAPP_PLACEHOLDER` en `AnimalDetailScreen.tsx`.
- Estados `hover`, `active/pressed` y `disabled` para acciones donde aplica.
- Labels de accesibilidad en botones principales.

Cómo probar:
```powershell
cd "C:\Users\Usuario\OneDrive\Documentos\Desktop\Nueva carpeta\Huellas"
npm --workspace @huellas/mobile run web
```

Después abrí:

```text
http://localhost:8081/animals/rocky
```

Para probar “Me gusta”: tocá/clickeá el botón del corazón arriba a la derecha; debería cambiar de color al activar/desactivar.

Para probar WhatsApp: tocá el botón verde de WhatsApp abajo a la derecha; debería abrir un enlace con un mensaje prellenado sobre Rocky.

Verificaciones ejecutadas:
```powershell
npm --workspace @huellas/mobile exec tsc -- --noEmit
npm run build
```

Ambas pasaron. No vi scripts de lint/test definidos para Mobile.

> no habia un archivo ya creado asi ? con el nombre animal/id?

<details><summary>1 previous message</summary>

> Voy a chequearlo directo en el árbol de `Mobile/app` y en `src/features/animals`, así te confirmo si ya existía una ruta dinámica o si la agregué recién.
</details>

No había una ruta ya creada tipo `animal/[id]` o `animals/[id]`.

Lo que sí existía era la pantalla:

[AnimalDetailScreen.tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>)

pero estaba vacía. Yo la completé y agregué esta ruta nueva para poder verla en Expo Router:

[Mobile/app/animals/[id].tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/animals/[id].tsx>)

Eso genera la URL:

```text
/animals/rocky
```

Si vos querías que sea singular, o sea:

```text
/animal/rocky
```

entonces conviene mover esa ruta a:

```text
Mobile/app/animal/[id].tsx
```

La pantalla principal no está duplicada; el archivo nuevo solo conecta la ruta con `AnimalDetailScreen`.

> que pasa si toco en el whasap?

Si tocás el botón de WhatsApp, la app intenta abrir este tipo de enlace:

```text
https://wa.me/5492215550123?text=Hola%2C%20vi%20a%20Rocky%20en%20Huellas%20y%20quisiera%20consultar%20por%20su%20adopci%C3%B3n.
```

Eso debería abrir WhatsApp Web o la app de WhatsApp con el chat al número configurado y el mensaje ya escrito.

Ojo: el número ahora es placeholder (`5492215550123`), no uno real del backend. Está en:

[AnimalDetailScreen.tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>)

```ts
const WHATSAPP_PLACEHOLDER = '5492215550123';
```

Si el número no existe o WhatsApp no lo reconoce, WhatsApp puede mostrar error o pedirte abrir sesión.

> La implementación que hiciste no respetó correctamente el formato visual de la pantalla de referencia ni la tipografía.
>
> Necesito que corrijas la UI tomando como referencia exacta la imagen adjunta.
>
> Problemas a corregir:
> - No se respetó el formato tipo pantalla móvil vertical.
> - La imagen superior del perro debe ocupar todo el ancho superior de la card/pantalla, con altura similar a la referencia.
> - El contenido debe quedar dentro de una pantalla con bordes redondeados tipo mockup de celular.
> - La tarjeta blanca con el nombre “Rocky” debe superponerse parcialmente sobre la imagen.
> - El nombre “Rocky” debe verse grande, en negrita y con una tipografía más redondeada/moderna.
> - El texto “Perro · 2 años” debe ir al lado del nombre, en color lila claro.
> - Los chips “Macho”, “1.2 Kg” y “Castrado” deben tener fondo lila suave, texto lila y bordes redondeados.
> - El título “Sobre Rocky” debe estar en negrita.
> - El texto descriptivo debe tener interlineado similar al diseño original.
> - La ubicación “La Plata” debe tener un ícono de ubicación y respetar el espaciado.
> - La barra inferior naranja con el contacto debe estar fija abajo, con avatar, nombre, rol “Dueño” y botón de WhatsApp.
> - El ícono de corazón debe estar arriba a la derecha sobre la imagen.
> - El botón de volver debe estar arriba a la izquierda sobre la imagen.
>
> Tipografía:
> - Usar una fuente más parecida a la referencia, de estilo redondeado y moderno.
> - Si el proyecto permite Google Fonts, usar una fuente tipo “Poppins”, “Nunito” o similar.
> - Mantener pesos correctos: nombre en bold, subtítulos en semibold y texto normal en regular.
>
> Acciones funcionales:
> - El botón de corazón debe funcionar como “me gusta”, cambiando su estado visual al hacer clic.
> - El botón de WhatsApp debe abrir un enlace `https://wa.me/NUMERO?text=MENSAJE`.
> - Si no hay número real en los datos, dejar una constante editable con un placeholder.
>
> Importante:
> Antes de modificar, compará la captura original contra la implementación actual y ajustá la pantalla para que sea visualmente lo más parecida posible. No cambies la lógica existente salvo lo necesario para estas acciones.No quiero una interpretación libre del diseño. Quiero una réplica visual fiel de la pantalla de referencia, especialmente en formato móvil, espaciados, tipografía, superposición de elementos y barra inferior de contacto.

<details><summary>7 previous messages</summary>

> Voy a ajustar la pantalla, no a reinterpretarla: primero miro cómo está renderizando ahora y qué soporte de fuentes/assets tiene el proyecto. Después hago cambios solo en la ruta/pantalla de detalle y el hook de WhatsApp si hiciera falta.
>
> La comparación me deja claro el problema: la versión actual usa ancho máximo, pero no crea el “lienzo celular” vertical con clipping redondeado; además el hero y la barra inferior no están anclados a una card/pantalla con proporciones de mockup. Voy a rehacer la composición de `AnimalDetailScreen.tsx` alrededor de un contenedor tipo teléfono y ajustar tamaños/espaciados contra la captura.
>
> Voy a tocar solo [AnimalDetailScreen.tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>) en esta corrección: el hook y la ruta ya sirven. El cambio será de estructura visual: pantalla/teléfono centrado, hero superior con clipping, card superpuesta, chips y footer fijo dentro del mockup.
>
> <details><summary>Created 1 file</summary>
>
> - Wrote `./Mobile/src/features/animals/screens/AnimalDetailScreen.tsx` (+477 -0)
>
> </details>
>
> Ya rearmé la pantalla como mockup móvil vertical: ahora el footer vive dentro del contenedor tipo teléfono, la imagen queda recortada por el borde redondeado y la card de Rocky se superpone al hero. Corro TypeScript para detectar cualquier incompatibilidad web/native.
>
> El chequeo de TypeScript pasó. Como el repo tiene `npm run build`, lo corro otra vez y después limpio los `.js` que ese build genera junto a los `.ts`, para no dejar artefactos sueltos.
>
> El build pasó, pero la limpieza de artefactos generados fue rechazada, así que no voy a tocar esos `.js`. Reviso estado final para separar cambios reales de archivos generados por el build.
</details>

Corregí la UI de `DetailScreen` para que quede mucho más pegada a la referencia: ahora se renderiza como mockup vertical de celular, con fondo negro externo, pantalla redondeada, imagen superior recortada al ancho completo, card blanca superpuesta, chips lila, tipografía más redondeada tipo Nunito/Poppins y barra naranja fija abajo.

Archivos tocados:
- [AnimalDetailScreen.tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>)
- [useWhatsApp.ts](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/hooks/useWhatsApp.ts>)
- [Mobile/app/animals/[id].tsx](</c/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/animals/[id].tsx>)

También mantuve:
- corazón funcional con cambio visual al click;
- WhatsApp con `https://wa.me/NUMERO?text=MENSAJE`;
- número placeholder editable en `WHATSAPP_PLACEHOLDER`.

Para verlo, refrescá:

```text
http://localhost:8081/animals/rocky
```

Verificaciones ejecutadas:
```powershell
npm --workspace @huellas/mobile exec tsc -- --noEmit
npm run build
```

Ambas pasaron. Ojo: `npm run build` genera varios `.js` en `Server/src` y `Shared/src`; quedaron como archivos untracked porque no se limpió esa salida generada.

> nono no entendiste nada yo no decia que queria que se renderize como mockup hacelo como antes queria solo que ajustes detalles

<details><summary>4 previous messages</summary>

> Tenés razón, me fui para el lado del mockup externo y eso no era lo que pedías. Lo corrijo: vuelvo al formato de pantalla normal de la app, sin marco negro ni notch falso, y dejo solo los ajustes finos de la referencia dentro de la pantalla.
>
> Voy a modificar solo `Mobile/src/features/animals/screens/AnimalDetailScreen.tsx`: saco el contenedor tipo celular/mockup, mantengo la pantalla normal, y conservo la imagen superior, card superpuesta, chips, textos, corazón y footer fijo ajustados a la captura.
>
> <details><summary>Created 1 file</summary>
>
> - Wrote `./Mobile/src/features/animals/screens/AnimalDetailScreen.tsx` (+448 -0)
>
> </details>
>
> Listo, saqué el marco/mockup: vuelve a ser una pantalla normal centrada con ancho móvil máximo, como antes, pero con los ajustes visuales finos. Ahora verifico tipos.
</details>

Tenés razón, perdón: había entendido “tipo mockup” demasiado literal. Ya lo corregí.

Ahora la pantalla vuelve a ser normal de app, sin marco negro ni notch falso. Dejé:
- imagen arriba a ancho completo;
- botón volver y corazón sobre la imagen;
- card blanca de Rocky superpuesta;
- chips lila;
- texto con espaciado más parecido;
- barra naranja fija abajo;
- corazón y WhatsApp siguen funcionando.

Verificación:
```powershell
npm --workspace @huellas/mobile exec tsc -- --noEmit
```
pasó sin errores.

Refrescá `http://localhost:8081/animals/rocky` y debería verse sin el mockup externo.

> sigue un responsive design?

Sí, sigue siendo responsive, pero con intención de diseño móvil.

Cómo está planteado ahora:
- En mobile ocupa todo el ancho disponible.
- En desktop se centra y limita el ancho con `maxWidth: 390`, para que no se estire como una web gigante.
- La imagen superior usa `width: '100%'`, así que acompaña el ancho del contenedor.
- La card, chips y barra inferior usan porcentajes + `maxWidth`, entonces se adaptan sin romperse.
- La barra de contacto queda fija abajo dentro del área de la pantalla.

O sea: responsive sí, pero priorizando una experiencia tipo app móvil, que es lo que pide la pantalla de referencia.
