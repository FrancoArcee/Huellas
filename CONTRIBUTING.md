# Guía de Contribución 🐾

## 1. Ramas de Trabajo (Git Flow)

Trabajamos directamente sobre la rama principal `main` mediante Pull Requests. Para cada tarea, creá una rama con nombres claros y en minúsculas utilizando los siguientes prefijos:

* **Nuevas funcionalidades:** `feat/<nombre-de-la-tarea>` (ej: `feat/favoritos-screen`)
* **Corrección de errores (Bugs):** `fix/<nombre-del-bug>` (ej: `fix/profile-upload`)
* **Correcciones urgentes en producción:** `hotfix/<nombre-del-arreglo>` (ej: `hotfix/better-auth-origin`)
* **Documentación:** `docs/<descripcion-breve>` (ej: `docs/contributing-guide`)
* **Refactorización de código:** `refactor/<area-modificada>` (ej: `refactor/validation-shared`)

---

## 2. Mensajes de Commit Semánticos

Para que el historial de Git sea legible y fácil de auditar, los mensajes de commit deben seguir un formato semántico estándar:

```
tipo(ámbito): descripción corta y clara del cambio en minúsculas
```

### Tipos admitidos:
* **`feat`**: Nueva funcionalidad para el usuario.
* **`fix`**: Corrección de un error.
* **`docs`**: Cambios únicamente en la documentación.
* **`style`**: Cambios estéticos o de formato que no afectan la lógica del código (espacios, formateo, etc.).
* **`refactor`**: Cambios en el código que no corrigen errores ni añaden funcionalidades (reestructuración).
* **`test`**: Añadir o modificar pruebas automatizadas.

### Ejemplos correctos:
* `feat(backend): agrega volumen para almacenar imagenes localmente`
* `fix(frontend): corrige error en subida de imagen de perfil`
* `refactor(shared): centraliza esquemas de validación de mascotas con zod`

---

## 3. Trabajo en el Monorepo (Workspaces)

El repositorio está estructurado como un monorepo administrado por **npm workspaces**. Tené en cuenta lo siguiente al trabajar:

* **Instalación:** Ejecutá siempre `npm install` únicamente en la **raíz del proyecto**. Esto garantiza que las dependencias comunes y cruzadas se enlacen correctamente sin duplicar archivos.
* **Dependencias cruzadas:** La aplicación `Mobile` depende del paquete común `Shared`. Si modificás algo en `Shared`, recordá reconstruir o asegurarte de que los cambios se propaguen adecuadamente.
* **Comandos específicos:** Utilizá la bandera `--workspace` desde la raíz para correr tareas de subproyectos (ej: `npm run prisma:migrate --workspace=@huellas/server`).

---

## 4. Calidad y Estilo del Código

* **TypeScript:** Declará tipos de manera explícita siempre que sea posible. Evitá usar `any` a menos que sea estrictamente necesario.
* **Validación robusta:** Toda validación de datos (formularios del frontend y payloads del backend) debe realizarse de forma centralizada utilizando esquemas de **Zod** definidos en la carpeta `Shared/src/types` o `Shared/src/utils/validation.ts`.
* **Seguridad y Variables:** Nunca subas credenciales, llaves API o archivos `.env` al repositorio. Asegurate de que cualquier archivo de variables de entorno esté declarado en el `.gitignore`.

---

## 5. Proceso de Pull Requests

1. Asegurate de que tu rama esté actualizada con los últimos cambios de `main`.
2. Verificá que el proyecto compile sin errores ejecutando `npm run build` desde la raíz.
3. Creá el Pull Request detallando los cambios introducidos y cómo probarlos.
4. Una vez aprobado por el equipo, se podrá fusionar a `main`.
