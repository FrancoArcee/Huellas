Conectar pantalla de Mis Mascotas con backend es mi mision actual:

\- Implementar CRUD para una publicación  
\- Almacenar las imagenes en un volumen en docker dentro de uploads/animal  
\- Chequear cada input  en tiempo real con zod (frontend) como se hace en login y signup.

Optimized tool selection

Updated todo list

Voy a ubicar el flujo existente de autenticación y la pantalla de Mis Mascotas para reutilizar el patrón de validación y ver dónde entra el CRUD de publicaciones. Después de eso haré un cambio acotado en frontend y backend sobre el mismo recorrido.

Searched for regex \`zod|safeParse|resolver|react-hook-form|login|signup|register\` (\`\*\*/Mobile/src/\*\*\`), 50 results

Searched for regex \`mypost|mis mascotas|myposts|post\` (\`\*\*/Mobile/app/\*\*\`), 19 results

Searched for regex \`animal|upload|uploads|multer|formidable|image\` (\`\*\*/Server/src/\*\*\`), 50 results

Searched for files matching \`\*\*/Mobile/src/features/\*\*/schema\*.ts\`, 1 match

Searched for files matching \`\*\*/Server/src/features/animals/\*\*\`, 5 matches

Ya encontré los dos puntos de control: el frontend ya valida con Zod en auth y el backend de publicaciones ya existe, así que voy a leer el contrato real de creación/edición y la pantalla de Mis Mascotas para engancharme sin inventar un flujo nuevo.

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/auth/validations/schemas.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/auth/screens/LogInScreen.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/auth/screens/RegisterScreen.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28tabs%29/mypost.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/animals/screens/CreatePostScreen.tsx\#1-1), lines 1 to 420

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/routes/animal.routes.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/service/animal.service.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/repository/animal.repository.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/config/server.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/search/schemas/animalSchema.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/search/services/animalsService.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/store/authStore.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/docker-compose.yml)

El backend ya expone \`POST/PUT/DELETE /animals\`, pero ahora mismo el frontend de creación es solo maqueta. Voy a abrir el tipo compartido y la pantalla de Mis Publicaciones para reemplazar esa UI por el flujo real con validación por campo y subida de imágenes.

Searched for regex \`createPostSchema|updatePostSchema|postSearchSchema|photosUrl|imageUrl\` (\`\*\*/Shared/src/\*\*\`), 5 results

Searched for regex \`MisPublicacionesScreen|EditPost|create-post|animalService|fetch\` (\`\*\*/Mobile/src/features/admin/\*\*\`), 1 result

Searched for files matching \`\*\*/Mobile/src/features/admin/\*\*/MisPublicacionesScreen.tsx\`, 1 match

Searched for files matching \`\*\*/Mobile/src/features/admin/\*\*/Edit\*.tsx\`, 1 match

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/index.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/src/types/api.types.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/src/types/animal.types.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/services/api.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/MisPublicacionesScreen.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28tabs%29/\_layout.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/prisma/schema.prisma)

Ya vi que Mis Publicaciones hoy usa un store local y no toca red. Falta confirmar cómo están modelados los posts en el shared contract y si el backend ya sirve archivos, porque eso define si la primera pasada será multipart con persistencia local o solo URLs.

Searched for regex \`multer|form-data|FormData|upload|uploads|static\\(|express.static\` (\`\*\*/Server/src/\*\*\`), 7 results

Searched for regex \`FormData|ImagePicker|launchImageLibraryAsync|photosUrl|createPost|updatePost|deletePost\` (\`\*\*/Mobile/src/\*\*\`), 73 results

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/src/utils/validation.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/store/publicaciones.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/EditAnimalScreen.tsx)

La app ya tiene un formulario de creación separado del tab de Mis Mascotas, así que el cambio correcto es unificarlo contra el backend en vez de tocar solo la pantalla de tab. Ahora voy a revisar el validador local y el middleware de carga para decidir si el upload se resuelve con multipart y archivos en disco.

Searched for regex \`express.static|uploads/animal|uploads|public/\` (\`\*\*/Server/src/\*\*\`), no results

Searched for regex \`FormData|api.post\\('/animals'|api.put\\('/animals|api.delete\\('/animals\` (\`\*\*/Mobile/src/\*\*\`), 63 results

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/utils/validateAnimalForm.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/shared/middleware/uploadMiddleware.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/CreateAnimalScreen.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/config/env.ts)

Encontré un middleware de Multer ya listo, pero no está conectado a rutas ni a un directorio público, así que el backend todavía no persiste imágenes. Voy a enlazar eso con el contrato de publicaciones y después reemplazar el estado mockado del tab por llamadas reales.

Read \[\](file:///c%3A/Users/pc/Huellas/Server/package.json)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/package.json)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/animals/services/animalService.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/home/hooks/useHomeData.ts\#1-1), lines 1 to 220

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/animals/screens/AnimalDetailScreen.tsx\#1-1), lines 1 to 280

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/shared/middleware/errorHandler.ts)

La ruta de backend no tiene upload persistente ni estática, así que el CRUD de publicación tiene que cerrar dos huecos: guardar archivos en disco dentro de \`uploads/animal\` y exponer esas URLs al frontend. Voy a ajustar eso junto con un servicio de publicaciones en el móvil para crear/editar/listar/eliminar desde la API.

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/store/authStore.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/components/ui/CustomInput.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/components/ui/CustomDropdown.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/components/ui/Button.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/Dockerfile)

Tengo el punto de integración: \`/animals?userId=\<id\>\` ya filtra por autor, así que Mis Publicaciones puede vivir directamente sobre ese endpoint. Ahora voy a escribir un servicio de posts en el móvil, validar el formulario con Zod por campo y conectar las pantallas de crear/editar/eliminar al backend.

Searched for files matching \`\*\*/Mobile/src/features/admin/services/\*\*\`, 1 match

Searched for files matching \`\*\*/Mobile/src/features/admin/components/\*\*\`, 3 matches

Searched for files matching \`\*\*/Server/src/shared/errors/\*\*\`, 2 matches

Searched for files matching \`\*\*/Server/src/features/users/routes/\*\*\`, 1 match

Searched for files matching \`\*\*/Mobile/src/shared/services/storage.ts\`, 1 match

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/services/adminService.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/components/AnimalForm.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/components/RequestCard.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/services/storage.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/users/routes/user.routes.ts)

Hay una discrepancia importante: la UI de publicaciones tiene campos de género y castrado, pero el modelo \`Post\` del backend no los guarda. Antes de editar código, voy a confirmar si esos campos se usan en otro lado; si no, voy a hacer el CRUD contra el contrato real del backend y dejar la UI alineada al modelo persistido.

Searched for regex \`gender|castrat|castrado\`, 103 results

Searched for regex \`birthDate|category|size|location|photosUrl\` (\`\*\*/Mobile/src/features/\*\*\`), 200 results

Searched for regex \`gender|castrado\` (\`\*\*/Server/src/\*\*\`), no results

La modelación real del backend es más simple que la maqueta actual, así que voy a priorizar el contrato persistido: \`name\`, \`age\`, \`weight\`, \`size\`, \`category\`, \`location\`, \`description\` y \`photosUrl\`. Con eso el listado, el alta, la edición y la eliminación quedan consistentes de punta a punta.

Searched for files matching \`\*\*/Mobile/app/(admin)/\*.tsx\`, 2 matches

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28tabs%29/mypost.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28admin%29/create.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28admin%29/edit/%5Bid%5D.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28admin%29/\_layout.tsx)

Antes de editar, cerré el mapa de dependencias: el tab usa una pantalla local con store mock y el flujo de alta real vive aparte. Voy a redirigir ese flujo a un servicio único para no terminar con dos versiones distintas de “crear publicación”.

Searched for text \`CreatePostScreen\` (\`\*\*/Mobile/src/\*\*\`), 1 result

Searched for text \`CreateAnimalScreen\` (\`\*\*/Mobile/app/\*\*\`), 3 results

Searched for text \`MisPublicacionesScreen\` (\`\*\*/Mobile/src/\*\*\`), 1 result

Apply Patch

Voy a aplicar el primer bloque de cambios en backend y validación compartida: persistencia de imágenes en disco, exposición pública de \`/uploads\`, y esquema Zod listo para recibir multipart con números coercionados.

Generating patch (197 lines) in \[\](file:///c%3A/Users/pc/Huellas/Server/src/shared/middleware/uploadMiddleware.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/config/server.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/routes/animal.routes.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Shared/src/utils/validation.ts), \[\](file:///c%3A/Users/pc/Huellas/docker-compose.yml)

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`  
El bloque de backend ya quedó conectado. Ahora hago una validación corta sobre los archivos tocados para ver si el contrato multipart y la coerción de tipos rompieron algo antes de pasar a la parte del móvil.

Checked , no problems found

Created 3 todos

Estoy pasando al móvil. Primero habilito \`FormData\` en el cliente HTTP y agrego el servicio/esquema de publicaciones; después reemplazo las pantallas para que dejen de depender del store mockado.

Generating patch (206 lines) in \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/services/api.ts), \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/create-post.tsx), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/validations/postSchemas.ts), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/services/adminService.ts)

La ruta \`create-post\` no coincidió con el contexto esperado, así que primero corroboro ese archivo exacto y reaplico el bloque frontend con el contexto correcto.

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/create-post.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/services/adminService.ts)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/services/api.ts)

Voy a aplicar el soporte multipart y crear el servicio/esquema de publicaciones en una pasada limpia, ahora con el contexto correcto de los archivos reales del workspace.

Generating patch (179 lines) in \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/services/api.ts), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/validations/postSchemas.ts), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/services/adminService.ts)

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

Generating patch (16 lines) in \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/create-post.tsx)

\`\`\`

\`\`\`  
Ya quedó el cliente HTTP preparado para multipart y el servicio de publicaciones. Ahora reescribo los tres puntos de entrada del flujo real: crear, editar y ver “Mis Publicaciones”, todos contra \`/animals\` y con validación por campo en tiempo real.

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/components/StepIndicator.tsx)

Read \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/components/ui/ConfirmModal.tsx)

Voy a crear pantallas nuevas en paralelo al código viejo para no arrastrar el mock; después solo apunto las rutas a estas versiones y las valido.

Created \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/BackendMisPublicacionesScreen.tsx)

Created \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/BackendCreateAnimalScreen.tsx)

Created \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/BackendEditAnimalScreen.tsx)

Las pantallas nuevas están creadas; ahora las engancho en las rutas reales y hago una compilación focalizada para corregir los errores de tipos que aparezcan antes de tocar nada más.

Generating patch (36 lines) in \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28tabs%29/mypost.tsx), \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28admin%29/create.tsx), \[\](file:///c%3A/Users/pc/Huellas/Mobile/app/%28admin%29/edit/%5Bid%5D.tsx)

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

Starting: \*Chequear cada input en tiempo real con zod (frontend) como se hace en login y signup.\* (3/3)

Checked \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/shared/services/api.ts), no problems found

La primera validación encontró que el cliente HTTP está bien; ahora aislo los errores de las pantallas nuevas porque ahí es donde es más probable que fallen los tipos de Zod, \`FormData\` o props de componentes.

Checked \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/BackendCreateAnimalScreen.tsx), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/BackendEditAnimalScreen.tsx), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/screens/BackendMisPublicacionesScreen.tsx), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/services/adminService.ts), \[\](file:///c%3A/Users/pc/Huellas/Mobile/src/features/admin/validations/postSchemas.ts), no problems found

La parte móvil ya quedó limpia en el chequeo estático. Me falta validar el slice del servidor para asegurar que el middleware multipart y el parseo de \`req.files\` no introdujeron un error de compilación.

Checked \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/shared/middleware/uploadMiddleware.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/config/server.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/routes/animal.routes.ts), \[\](file:///c%3A/Users/pc/Huellas/Shared/src/utils/validation.ts), 1 problem found

El único error real es la referencia a \`@huellas/shared\` desde el controller del servidor. Voy a comprobar el alias del workspace antes de tocar el import, porque si el problema es el entrypoint del paquete compartido conviene corregirlo ahí y no parchear el síntoma.

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/package.json)

Read \[\](file:///c%3A/Users/pc/Huellas/Server/tsconfig.json)

Read \[\](file:///c%3A/Users/pc/Huellas/package.json)

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/tsconfig.json)

La pista confirma que el workspace confía en \`Shared/dist\` y el checker está viendo el paquete antes de compilarlo. Voy a mirar el entrypoint compartido para decidir si conviene apuntar el servidor al source o si basta con hacer que el paquete exporte algo que el editor pueda resolver.

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/src/index.ts)

Voy a cambiar solo el resolver de TypeScript del servidor hacia el source compartido. Eso le quita el falso negativo al editor sin alterar el paquete publicado ni el runtime de Docker.

Generating patch (11 lines) in \[\](file:///c%3A/Users/pc/Huellas/Server/tsconfig.json)

\`\`\`

\`\`\`

Checked \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/tsconfig.json), 1 problem found

The checker is not honoring the path map for that import, so I’m going one step more concrete: replace the server-side shared import with a relative source import that the editor can resolve immediately.

Searched for text \`@huellas/shared\` (\`\*\*/Server/src/\*\*\`), 3 results

Searched for regex \`from "@huellas/shared"|from '@huellas/shared'\` (\`\*\*/Server/src/\*\*\`), 3 results

I found three controllers using the same shared package import. I’m switching all of them in one patch so the server editor diagnostics settle consistently instead of leaving one unresolved dependency behind.

Generating patch (14 lines) in \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/users/controller/user.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/requests/controller/request.controller.ts)

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

Checked \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/users/controller/user.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/requests/controller/request.controller.ts), 1 problem found

The controller itself is now pointed at source, so the lingering 

Added 3 todos

\`@huellas/shared\` error is coming from inside the shared package graph. I’m checking that package for self-imports or another unresolved entrypoint before I rewrite anything else.

Searched for text \`@huellas/shared\` (\`\*\*/Shared/src/\*\*\`), 1 result

Read \[\](file:///c%3A/Users/pc/Huellas/Shared/tsconfig.json)

Searched for files matching \`\*\*/Shared/dist/\*\*\`, no matches

I’ve narrowed the remaining diagnostics to package-resolution behavior, so the cheapest real check now is a workspace build. That will tell us whether this is only an editor false positive or an actual compile break.

Ran terminal command: npm run build  
Completed with input: npm run build

The workspace build failure exposed two unrelated server issues: Prisma client generation and the temporary source-path import workaround. For the publication task, I’m reverting the server back to its normal package import and restoring the \`dist\` path mapping, then I’ll build only Shared so the editor can resolve the package cleanly.

Generating patch (23 lines) in \[\](file:///c%3A/Users/pc/Huellas/Server/tsconfig.json), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/users/controller/user.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/requests/controller/request.controller.ts)

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

\`\`\`

Ran terminal command: npm \--workspace @huellas/shared run build

El intento anterior no ejecutó por una limitación del runner, así que voy a volver a lanzar solo el build del paquete compartido con una forma más directa. Si vuelve a bloquearse, me quedo con la validación estática ya obtenida.

Ran terminal command: cd Shared; npm run build

El paquete compartido ya se compiló y dejó \`dist\` listo. Voy a re-chequear el servidor para confirmar que la única señal pendiente no sea ya un falso positivo del workspace.

Checked \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/animals/controller/animal.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/users/controller/user.controller.ts), \[\](file:///c%3A/Users/pc/Huellas/Server/src/features/requests/controller/request.controller.ts), 1 problem found

I’ve got one stale editor diagnostic left on the animals controller. The fastest way to tell if it’s real is to re-run the server build now that dist exists and see whether the package import is still a compiler problem or just a cached IDE warning.

Ran terminal command: cd Server; npm run build

The shell kept the previous workspace directory, so the server build command missed its target. I’m rerunning it from an explicit relative path to avoid that environment drift.

Ran terminal command: Push-Location ..\\Server; npm run build; Pop-Location

I only need one clean server compile result. I’m using an absolute path this time so the runner doesn’t inherit the wrong working directory from the previous command.

Ran terminal command: Set-Location c:\\Users\\pc\\Huellas\\Server; npm run build

Made changes.

quiero que al crear o modificar una publicacion, la fecha de nacimiento del animal la pueda colocar con un calendario donde yo seleccione el dia, el mes y el anio. Tambien quiero poder ver las imagenes correspondientes a ese animal al querer modificarlo.

Listo. Implementé el calendario para seleccionar día, mes y año al crear o editar publicaciones, usando el nuevo componente \[BirthDatePicker.tsx (line 73)\](C:/Users/pc/Huellas/Mobile/src/features/admin/components/BirthDatePicker.tsx:73).

También actualicé:

* \[CreateAnimalScreen.tsx (line 142)\](C:/Users/pc/Huellas/Mobile/src/features/admin/screens/CreateAnimalScreen.tsx:142): usa el calendario y muestra miniaturas de imágenes seleccionadas.  
* \[EditAnimalScreen.tsx (line 166)\](C:/Users/pc/Huellas/Mobile/src/features/admin/screens/EditAnimalScreen.tsx:166): usa el calendario y muestra las imágenes actuales del animal; si seleccionás nuevas, muestra esas como reemplazo antes de guardar.

Verificación: corrí `npx.cmd tsc -p Mobile\tsconfig.json --noEmit` y pasó sin errores.

