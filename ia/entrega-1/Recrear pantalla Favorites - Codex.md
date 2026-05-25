# Recrear pantalla Favorites

> Favorites screen. Quiero que repliques esta pantalla en el código del repositorio.Ademas uses la card PetHorizontal y le agregues el boton de like como ya esta diseñado y que al tocar en la card lo conectes con el detail
>
> Objetivo:
> - Analizá la imagen adjunta y recreá la interfaz lo más fiel posible.
> - Respetá estructura visual, colores, espaciados, tipografías aproximadas, tamaños, botones, cards, formularios, íconos y distribución.
> - Usá los componentes, estilos y patrones que ya existan en este repositorio.
> - No cambies la lógica de negocio existente salvo que sea necesario para conectar la pantalla.
> - Mantené el diseño responsive para desktop y mobile.
>
> Después implementá:
> - La pantalla igual o muy similar a la imagen.
> - Reutilizá CSS/Tailwind/componentes existentes si aplica / sino añade librerias o componentes.
> - Si faltan imágenes o íconos, usá placeholders claros o íconos equivalentes.
> - No elimines funcionalidades existentes.
>
> Al finalizar:
> - Mostrame un resumen de los archivos modificados.
>
> User context
>
> Images:
> - `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWIAAAK6CAYAAAAD2ValAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7P1plGVnfed7fp9nz2eOiMzIOTIlIQmEUkoxGFeRIKXBVdUIsFRt31tAcU32at/C2KsQq7sXNvUC6fYtjHp1L0M3trh165bEpQyr29eFwEZVXMCSbMk2ZkqRQlOmlJGRc0xnPnt6hn5xIsKZITFoICOV9XzWiqWIvc/ZZ+99lL/znP9+9vOImZkZi+M4jrNh5PoFlzIpJUEQ4Hne+lWvGN/3kfJVdVocx3mVEy+1RVyr1Xj3u9+N53lYO97E0tISf/mXf0lZlusf/oqYmJjguuuuY2lpieeee47NmzezvLxMmqbrH/qibd26lTe84Q20Wi2EEMzNzfHYY4/R6/XWP9RxHOcV9bKC+B3veAff/va3GQwG61f/woVhyIEDBzh8+DBnzpxZ+zB4KarVKvv27ePUqVOcPHkSIQRvfOMb6Xa7HDt2jCzL1j/FcRznFfOKB7EQgiuuuILrr7+eer1OmqYcPnyY5eVl9uzZQ6/X48iRI7RaLa666i`

<details><summary>10 previous messages</summary>

> Voy a ubicar la estructura del proyecto y los componentes existentes, especialmente `PetHorizontal`, navegación y pantalla de detalle. Después hago la implementación respetando el patrón local.
>
> `rg` está bloqueado en este entorno, así que sigo con PowerShell nativo. Ya veo que es un repo con carpeta `Mobile`; voy a inspeccionar ahí los componentes y rutas.
>
> Encontré la pantalla `favorites.tsx`, la ruta de detalle `animals/[id].tsx` y el componente `PetHorizontalCard`. Ahora voy a leer esos archivos junto con tema y tabs para encajar la pantalla sin pelearme con el diseño existente.
>
> Voy a tocar dos piezas: ampliar `PetHorizontalCard` para soportar tap de card y botón de like, y reemplazar `favorites.tsx` por la pantalla completa con scroll, header propio y cards conectadas al detalle.
>
> <details><summary>Created 1 file, edited 1 file</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+88 -33)
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+155 -0)
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+8 -2)
>
> </details>
>
> La card ya tiene interacción completa: tap de card, tap de botón “Ver detalles” y tap independiente del corazón. Voy a correr una verificación TypeScript rápida para atrapar errores de props o rutas antes de cerrar.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+1 -1)
>
> </details>
>
> TypeScript quedó limpio. Para que lo puedas probar directamente, voy a levantar Expo web en segundo plano y confirmar el puerto local.
>
> El primer intento de servidor tropezó con una opción vieja de Expo (`--non-interactive`). Lo relanzo con `CI=1`, que es lo que esta versión espera.
>
> Dale, freno ahí con las pruebas. Ya limpié los logs temporales del intento de Expo; no levanto nada más y dejo la verificación de UI para vos.
</details>

Listo. Implementé la pantalla de favoritos y conecté las cards al detalle.

Resumen de archivos modificados:
- [favorites.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/(tabs)/favorites.tsx>): recrea la pantalla “Mis Favoritos” con header, scroll, cards, botón volver y navegación a `/animals/[id]`.
- [PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>): agrega soporte para tap en la card, botón “Ver detalles” y botón de like con el ícono ya existente.

También dejé de probar como pediste; no quedó servidor levantado.

> asi es como quedo , lo cual no respeta al mockup que te mande ademas no me deja ver los otros favoritos
>
> User context
>
> Images:
> - `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAuAAAAZACAIAAAC372CjAAAQAElEQVR4AezdB5ydRfU38PvcLcnupveEAAGS0HsngCAgvXeUDiIgCoKIKGBDAakiooDSpEjvvffeey8J6T3ZXt7vvY/uyx82JBt2k9zds5/jOM/MmTNnfjPPnN8zs1my06ZODgkEAoFAIBAIBAKBQGCRQiCbiZ9AIBAIBAKBQCAQaGMEwty3RSAIyrdFMNoHAoFAIBAIBAKBQJsjEASlzSENg4FAIBAIFD4CMYJAYGEjEARlYc9A9B8IBAKBQCAQCAQCX0MgCMrXIImCQCAQKHwEYgSBQCBQ6AgEQSn0GQz/A4FAIBAIBAKBDohAEJQOOKkxpMJHIEYQCAQCgUBnRyAISmdfATH+QCAQCAQCgUBgEUQgCMoiOCmF71KMIBAIBAKBQCAQ+HYIBEH5dvhF60AgEAgEAoFAIBBoBwSCoLQAahQFAoFAIBAIBAKBwMJFIAjKwsU/eg8EAoFAIBAIBDoLAq0aZxCUVsEVyoFAIBAIBAKBQCCwIBAIgrIgUI4+AoFAIBAIBAofgRjBAkUgCMoChTs6CwQCgUAgEAgEAoF5QSAIyrygFDqBQCAQCBQ+`

<details><summary>4 previous messages</summary>

> Sí, tenés razón: la card quedó estirada porque dejé `minHeight` y el bloque de imagen con `height: '100%'`, entonces en móvil tomó una altura enorme y el scroll quedó prácticamente bloqueado por la primera card. Lo corrijo directo, sin levantar pruebas.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+19 -18)
>
> </details>
>
> Ajusté la card a altura fija tipo mockup y bajé radios, textos y espaciados. Ahora la primera card no debería ocupar toda la pantalla y vas a poder scrollear los demás favoritos.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+6 -6)
>
> </details>
</details>

Corregido. El problema principal era la altura de `PetHorizontalCard`: al no tener `height` fijo, la imagen la estiraba casi toda la pantalla. Ahora la card queda compacta como el mockup y el scroll permite ver los otros favoritos.

También ajusté:
- Espaciado superior para acercarlo más al mockup.
- Tamaño del título.
- Separación entre cards.
- Radio, padding y tamaños internos de la card.
- Botón de like y “Ver detalles” mantienen interacción independiente.
- Tap en la card sigue navegando al detalle.

No levanté ni corrí pruebas, como me pediste.

> ahora quedaron muy chicas respeta el tamaño este escalar mas o menos a medida
>
> User context
>
> Images:
> - `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeQAAAMrCAYAAACYj+GxAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAP+lSURBVHhe7P15nGTHdd+JfiPibrlVVlV3V69oAgRBgiCbgizKkkhoRIjUow2QtCTLC0hRJv2eZWqzpHkzQ4l+Y0vjMSl65vO0jCVx7BlRGlGAlydLIgl8PDIlASRgUVzEpblibRTQW3Vtud41It4fmTeVdbt6RXVVVyO+n09+qm7cJbNuZMXvnhMnzhGAxTGh2WzSarUIggAAKSVhGBJFEe12m3q9TrPZpF6v4/s+vu8jhMAYQ57n9Ho9VldXWV5eZmVlhTRNsdYSBAFzc3PMzMzQbDYxxqC1nvy01k62yxcw2Q9grd3wKtum95UIIc47tmwv912Icn/158XY7JjN2jZrr25fiAsdV/2cvu+TpilZlpHnOUVRAKCUmvQrcN6+si+tteR5Prnv0+dV93meh+/7k31Zlk36bnpf+f0o9/m+j+d5l9yntSbP88nffbF9QRCglLrkvqIoyPMcz/PYu3cvaZoihICp79OF7nVJ9Z5fjOljS6bfZ5rpa13sM13ofavt5Xb5klJOrlu9XvVn+ZreZvx9KLellJNtpdRkW0o5eQ2HQ9bW1uh0OmRZBkAURczNzbF//35mZ2eZmZkhDEOstZPvQZIk9Ho9hsMhvV6PwWBAnuckSTL57mqtGQ6HdLtdHLsf4QR5RCm2vu`

<details><summary>2 previous messages</summary>

> Entendido: no era achicar todo, era mantener la proporción del mockup. Voy a dejar la card con una altura más cercana a la referencia y recuperar el aire entre cards, pero sin volver al estiramiento gigante.
>
> <details><summary>Edited 2 files</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+9 -9)
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+1 -1)
>
> </details>
</details>

Ajustado: subí la altura de la `PetHorizontalCard` a una proporción más parecida al mockup, recuperé tamaño de textos/botones y dejé más separación vertical entre cards.

Archivos tocados:
- [PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)
- [favorites.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/(tabs)/favorites.tsx>)

No probé nada ni levanté servidor.

> Medidas aproximadas de la referencia:
>
> width: 348
> height: 190
> Pero para React Native prefiero que sea responsive:
>
> width: '100%'
> height: 190
> La card debe tener:
>
> Fondo blanco.
> Bordes redondeados grandes, aproximadamente 24.
> Sombra suave.
> Layout horizontal en dos columnas.
> Columna izquierda con la información.
> Imagen a la derecha ocupando aproximadamente el 42% o 45% del ancho.
> La imagen debe ocupar todo el alto de la card y usar resizeMode: 'cover'.
> El contenido izquierdo debe tener padding interno de 16.

<details><summary>2 previous messages</summary>

> Perfecto, ahora sí tenemos medidas concretas. Aplico esos valores tal cual sobre `PetHorizontalCard`: `height: 190`, radio 24, padding 16, imagen derecha al 44% y cover a todo el alto.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+7 -9)
>
> </details>
</details>

Listo, dejé la card con esas medidas:

- `width: '100%'`
- `height: 190`
- `borderRadius: 24`
- fondo blanco
- sombra suave
- layout horizontal
- padding izquierdo interno general de `16`
- imagen derecha al `44%`
- imagen a todo el alto con `resizeMode: 'cover'`

Archivo modificado:
[PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)

> faltan dos cosas: 1- el icono de ubicacion al lado de la ciudad, 2- el logo de volver para atras esta mal centrado en el circulo gris

<details><summary>2 previous messages</summary>

> Voy a ajustar esas dos cosas puntuales: alinear mejor el chevron dentro del círculo y asegurar que ubicación salga en la misma fila con el ícono visible junto a la ciudad.
>
> <details><summary>Edited 2 files</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+12 -12)
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+2 -8)
>
> </details>
</details>

Listo, corregí ambos puntos:

- La ubicación ahora fuerza la fila con el ícono pegado a la ciudad y con separación correcta.
- El botón de volver ya no usa el carácter `‹`; ahora usa el SVG `chevronBack.svg`, centrado dentro del círculo gris.

Archivos modificados:
- [favorites.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/(tabs)/favorites.tsx>)
- [PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)

> no se ve el icono asi deberia quedar
>
> User context
>
> Images:
> - `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAAXCAYAAACChfjKAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOYSURBVGhD7ZcvcNtIFMa/3sEuacmKXImMb1GIRVubNqG+iNYqTQx6xDbwASmmTjPTm2kUXLXUMq2NvSYhFt8tiIHXJGRLJI0s2bmkubN7M/oh6+3bP/P527e7T7TWGiU755d8oGQ3lMLviVL4PVEKvydK4fdEKfyeeLLtOulfXiIcjWBQCgBQSoEQAuftW5immU8veSAbhfc8DwDgOA4IIWmcc47zwQDHtg3LsjI9Sh6MznH58aN2XTf9ns/nejqd6uVyqbXWerlc6kajkX7vg+l0qqfTaT78v6JQ48PRCI7jALHzzwcDTCYTNJtNRFEEQgiODg8RfPqU77qVVy9f5kP3wvd9/NFo4PTkBM03b3A+GADxzuOc59ML+L4P3/fz4Z+CgvAGpSCEIIoiSCFw1u/DcRx0u114rgsAqFoWZrNZvuuD4JynwkghtgpUq9dx1u/j/cXFVsHD4RC+7yMcDiGFAOccUgjMOMcsnichCII0d9t4u6AgPDUMID5MzUoljZumCSklAMCIc34Uzjk67TYMSmGaJjzPw9UW4bMka8viuS7GkwkYY1CrFTzPA+ccTwkBpRSUUjDGAACnJyfgnIMxBiElOu32zyO8FAKIhR6Px4iiCIhvOdX4QE1iP0oQBDhttVCr12FZFlqtVj4lJXFsu93GSqlURMRr5Zyj2+2CMYajo6P0xkUIATUMUMMAYwxRFEEIkebato1arZaZabcUhBdSQggBQkhaXg5fv4b89i2t/eOvX1GtVvNd780qvpombHJyQuJY27Zx1u+vtQkpC7vv98wfk0UpVch9mlnDrikIf3x8jKurKyB2/fuLC3z+8gWtVguEECilEI5GqNXr+a73hlK6tmvu2u6JYze9HUzTRBRFUEqlscl4vJaTYMRzZnMfu3Mfw6+dTqeTDVQqFXwOAuj4d54/373DsW1vbNtGUr8TgS3Lwl+9HhY3N7i+vsYoDCGlhG3ba/2S/Gx5ycYPDg7w/Nkz9Ho9qNUK4XAIxGWGMQYpBMIwxM1iAcuycHt7i78/fMDNYoEgCCCFwG8vXhTG3wUbH1BKKTSbTXS73TWnJQ+ru2ryJrKONigFNQwopVLHMcbSQy9Lct7kS1E+njiZxAfqSqlCWzJ28p28yLPj7JT8xT5hPp/rRqOh5/O51lpr13XXHlYlj2Oj4xOiKEK73U7d8lCnl2znTuERix8EQSn6v8w/Cl/y31C4Tpbshu/zX4eQafUUhwAAAABJRU5ErkJggg==`

<details><summary>3 previous messages</summary>

> Claro, debería verse como una fila simple: pin chico + texto. Reviso el SVG de ubicación y ajusto el render para que tome color explícito en React Native.
>
> El problema está claro: `location.svg` tiene `stroke="white"` hardcodeado, por eso sobre la card blanca desaparece. Lo cambio a `currentColor` y paso color desde los lugares donde se usa.
>
> <details><summary>Edited 4 files</summary>
>
> - Wrote `./Mobile/src/assets/icons/location.svg` (+2 -2)
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+1 -1)
> - Wrote `./Mobile/src/shared/components/ui/AnimalCard.tsx` (+2 -2)
> - Wrote `./Mobile/src/features/animals/screens/AnimalDetailScreen.tsx` (+1 -1)
>
> </details>
</details>

Corregido. El ícono no se veía porque el SVG tenía el trazo fijo en blanco. Lo cambié para que acepte color y en la card ahora se renderiza gris junto a la ciudad, como en tu referencia.

También mantuve blanco el ícono en las cards donde va sobre fondo oscuro y gris en el detalle.

Archivos tocados:
- [location.svg](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/assets/icons/location.svg>)
- [PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)
- [AnimalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/AnimalCard.tsx>)
- [AnimalDetailScreen.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>)

> ademas agregar que solo vaya a detail screen si toca el boton ver detalles

<details><summary>2 previous messages</summary>

> Hecho, ajusto la navegación para que la card completa no abra detalle; solo el botón “Ver detalles” navega. El corazón queda independiente.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+0 -1)
>
> </details>
</details>

Listo. Ahora la card no navega al tocarla; solo abre el detalle cuando tocás el botón **“Ver detalles”**. El botón de like sigue funcionando aparte.

Archivo modificado:
[favorites.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/(tabs)/favorites.tsx>)

> Ajustá las cards de la pantalla “Mis Favoritos” para que respeten el tamaño y proporción de la referencia enviada.
>
> Las cards deben verse compactas, no ocupar todo el ancho de la pantalla. En mobile deben tener aproximadamente:
>
> - ancho: 320px / 85% del viewport
> - alto: 175px aprox.
> - border-radius: 18px
> - overflow hidden
> - sombra suave
> - separación vertical entre cards de 30px aprox.
> - layout horizontal: información a la izquierda e imagen a la derecha
> - la imagen debe ocupar alrededor del 40% del ancho de la card y cubrir todo el alto con object-fit: cover
> - el contenido de texto debe ocupar el 60% restante, con padding interno de 16px
>
> No agrandar las cards ni hacerlas full width. Deben quedar centradas y con márgenes laterales similares a la imagen de referencia.

<details><summary>2 previous messages</summary>

> Perfecto, cambio la card para que el tamaño lo controle el listado: ancho centrado al 85% con máximo 320, alto 175, radio 18, imagen al 40% y separación de 30. Mantengo el contenido interno en 60% con padding 16.
>
> <details><summary>Edited 2 files</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+14 -16)
> - Wrote `./Mobile/app/(tabs)/favorites.tsx` (+6 -3)
>
> </details>
</details>

Listo. Ajusté las cards de “Mis Favoritos” para que queden compactas y centradas:

- Card al `85%` del viewport con `maxWidth: 320`
- Alto `175`
- `borderRadius: 18`
- Sombra suave
- Separación vertical `30`
- Imagen al `40%`
- Texto en el resto, con `padding: 16`
- Ya no dependen del padding horizontal de toda la pantalla, así quedan centradas con margen lateral como la referencia

Archivos modificados:
- [favorites.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/(tabs)/favorites.tsx>)
- [PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)

> La proporción general de las cards ya está bastante bien. No quiero reducir más el tamaño de la card.
>
> El problema principal es que el contenido interno se ve chico en comparación con la referencia. Ajustar solamente la escala interna de la card:
>
> - Aumentar tamaño de fuente del nombre de la mascota.
> - Aumentar levemente el texto de especie / raza / edad.
> - Aumentar texto de ubicación.
> - Aumentar tamaño de chips como “Macho”, “Hembra”, “Castrado”.
> - Aumentar tamaño del botón “Ver detalles”.
> - Aumentar el tamaño del botón/ícono de corazón.
> - Mantener la card con el mismo ancho y alto actual.
> - Mantener layout horizontal: texto a la izquierda e imagen a la derecha.
> - No agrandar la card completa.
> - No modificar lógica ni datos, solo estilos.
>
> Valores sugeridos:
> - nombre: 18px o 19px, font-weight 700
> - descripción: 14px
> - ubicación: 13px
> - chips: 12px, padding 4px 10px
> - botón “Ver detalles”: 13px o 14px, height 34px
> - corazón: círculo de 34px o 36px
> - padding interno izquierdo: 20px

<details><summary>2 previous messages</summary>

> Perfecto: dejo intacta la card por fuera y escalo solo los elementos internos según esos valores. También ajusto el padding izquierdo a 20 sin tocar datos ni lógica.
>
> <details><summary>Edited 1 file</summary>
>
> - Wrote `./Mobile/src/shared/components/ui/PetHorizontalCard.tsx` (+52 -48)
>
> </details>
</details>

Listo. Escalé solo el contenido interno de la card, sin cambiar ancho ni alto:

- Nombre a `18px`
- Descripción a `14px`
- Ubicación a `13px`
- Chips a `12px` con padding mayor
- Botón “Ver detalles” más grande, altura mínima `34px`
- Corazón en círculo de `36px`
- Padding interno izquierdo `20px`

Archivo modificado:
[PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)

> haceme un resumen de los archivos que se cambiaron

Archivos modificados:

- [favorites.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/app/(tabs)/favorites.tsx>)
  Pantalla “Mis Favoritos”, layout, cards centradas, navegación solo desde “Ver detalles”.

- [PetHorizontalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/PetHorizontalCard.tsx>)
  Card horizontal con like, botón de detalle, estilos responsive y escala interna ajustada.

- [location.svg](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/assets/icons/location.svg>)
  Ícono de ubicación ahora acepta color dinámico.

- [AnimalCard.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/shared/components/ui/AnimalCard.tsx>)
  Ajuste para pasar color blanco al ícono de ubicación.

- [AnimalDetailScreen.tsx](</C:/Users/Usuario/OneDrive/Documentos/Desktop/Nueva carpeta/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx>)
  Ajuste para pasar color gris al ícono de ubicación.

> dame el mensaje para el commit

```bash
git commit -m "Implement favorites screen UI"
```

> mas detallado

```bash
git commit -m "Implement favorites screen with horizontal pet cards"
```

O más descriptivo:

```bash
git commit -m "Build favorites screen and enhance horizontal pet card UI"
```
