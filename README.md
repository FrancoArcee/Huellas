# 🐾 Huellas

Plataforma móvil para centralizar y facilitar la adopción de animales, conectando adoptantes con refugios y rescatistas.

## Estructura del monorepo

El proyecto está estructurado como un monorepo gestionado con **npm workspaces**:

```
Huellas/
├── Mobile/     # App React Native con Expo
├── Server/     # API REST construida con Node.js + Express
└── Shared/     # Tipos TypeScript y esquemas de validación Zod compartidos entre frontend y backend
```

## Tecnologías principales

| Capa | Stack tecnológico |
| :--- | :--- |
| **Mobile** | React Native, Expo (SDK 54), Expo Router, Zustand (gestión de estado), Axios, React Native Maps, Expo Location, Lucide React Native, Lottie React Native, Zod |
| **Server** | Node.js, Express, TypeScript, Prisma ORM, Better-Auth (autenticación), PostgreSQL, Multer (subida de imágenes local) |
| **Shared** | TypeScript puro, esquemas de validación Zod comunes |

---

## Inicio rápido

Seguí estos pasos para configurar y ejecutar el entorno de desarrollo local:

### 1. Requisitos previos

Asegurate de tener instalado:

* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* [npm](https://www.npmjs.com/) (incluido con Node.js)
* [Docker](https://www.docker.com/) y Docker Compose (para la base de datos)
* Un emulador de Android (Android Studio), simulador de iOS (Xcode, solo macOS) o la aplicación **Expo Go** en tu dispositivo físico para probar la app.

### 2. Configuración de Variables de Entorno

Creá los archivos `.env` basándote en los ejemplos provistos:

1. Copiá el archivo `.env.example` de la raíz a un nuevo archivo `.env` en la raíz.
2. Copiá el archivo `Server/.env.example` a `Server/.env`.
3. Verificá y configurá las variables según tu entorno local:
   * `DATABASE_URL`: URL de conexión a la base de datos (por defecto apunta al contenedor PostgreSQL de Docker).
   * `BETTER_AUTH_SECRET`: Clave secreta para la sesión y encriptación de Better Auth.
   * `BETTER_AUTH_URL`: URL base del backend server (ej: `http://localhost:3000`).
   * `EXPO_PUBLIC_API_URL`: URL del backend expuesta a la app móvil (ej: `http://localhost:3000` o la IP local de tu red si usás un dispositivo físico).

### 3. Instalación de dependencias

Instalá todas las dependencias del monorepo (raíz y subproyectos `Mobile`, `Server` y `Shared`) ejecutando desde la raíz:

```bash
npm install
```

### 4. Preparación de la base de datos

1. Levantá el servicio de PostgreSQL utilizando Docker Compose:
   ```bash
   docker compose up -d
   ```
2. Ejecutá las migraciones de Prisma para crear las tablas de base de datos e iniciar Better Auth:
   ```bash
   npm run prisma:migrate --workspace=@huellas/server
   ```
3. Generá el cliente de Prisma:
   ```bash
   npm run prisma:generate --workspace=@huellas/server
   ```

### 5. Ejecución del proyecto

Podés iniciar el backend y la app móvil de forma independiente desde la raíz del monorepo:

#### Iniciar el Servidor Backend (Node.js + Express)
```bash
npm run server
```
El servidor se ejecutará por defecto en el puerto `3000`.

#### Iniciar la Aplicación Móvil (React Native + Expo)
```bash
npm run mobile
```
Una vez que Expo inicie en tu terminal, podés:
* Escanear el código QR con la cámara (iOS) o la app **Expo Go** (Android) para correrla en tu celular físico (asegurate de configurar `EXPO_PUBLIC_API_URL` con la IP local de tu computadora en lugar de `localhost`).
* Presionar **`a`** para iniciar en un emulador de Android.
* Presionar **`i`** para iniciar en un simulador de iOS.
* Presionar **`w`** para correr la versión web en tu navegador.

---

## Conectividad de la APK con el backend

La app móvil se comunica con el backend a través de la variable de entorno `EXPO_PUBLIC_API_URL`. Por defecto, si no se configura, toma `http://localhost:3000`. La lógica en `Mobile/src/shared/services/api.ts` aplica las siguientes reglas:

| Entorno | Comportamiento |
|---|---|
| **Desarrollo (`__DEV__`) con `localhost`** | Reemplaza `localhost` por la IP que el celular/emulador usa para conectarse a Metro (el servidor de Expo). Esto permite que la app funcione en emuladores y dispositivos físicos en red local sin configurar nada. |
| **APK de producción (EAS Build) sin `EXPO_PUBLIC_API_URL`** | El valor `http://localhost:3000` queda "horneado" (baked-in) en el bundle. La APK intentará conectar a `localhost:3000`, lo cual **solo funciona si el backend corre en el mismo dispositivo**, lo cual no es el caso habitual. |
| **APK de producción con `EXPO_PUBLIC_API_URL`** | La URL configurada se usa tal cual. Es la forma correcta de apuntar a un servidor remoto. |

### Para que la APK funcione correctamente, se debe cumplir UNA de estas condiciones:

#### Opción A: Backend y emulador en la misma máquina (desarrollo)
- El backend debe escuchar en **`0.0.0.0:3000`** (no solo `127.0.0.1`), porque el emulador Android usa `10.0.2.2` para mapear al host.
- Ejemplo: `node dist/server.js` con el servidor Express escuchando en `0.0.0.0`.
- La app detecta automáticamente la IP de Metro y reemplaza `localhost`.

#### Opción B: Dispositivo físico en la misma red LAN (desarrollo)
- La PC que corre el backend y la que corre Expo deben estar en la misma red.
- El backend debe escuchar en **`0.0.0.0:3000`**.
- La app usa la IP LAN del host (ej: `192.168.1.50`) automáticamente gracias al reemplazo de `localhost`.

#### Opción C: APK con backend remoto (producción)
- Setear la variable de entorno antes de buildear con EAS:
  ```bash
  EXPO_PUBLIC_API_URL=https://api.huellas.example.com eas build --platform android
  ```
- Puede configurarse también desde el dashboard de EAS como secret.
- En este caso la URL se usa literal, sin reemplazo de IP.

### Variables de entorno requeridas en el backend
El servidor necesita su propio `.env` (`Server/.env`):
- `DATABASE_URL` — conexión a PostgreSQL
- `BETTER_AUTH_SECRET` — clave de sesión de Better Auth
- `BETTER_AUTH_URL` — debe coincidir con la URL desde la cual el backend es accesible (interna y externamente)
- `PORT` — puerto del servidor (default: `3000`)

---

## Autocompletado de direcciones

La plataforma cuenta con integración en el backend para realizar autocompletado de direcciones consultando la API oficial y gratuita de **Georef Argentina**.
* No requiere API key ni configuración de cuentas de facturación externas.
* El autocompletado está restringido a Argentina y combina nombres de calles y localidades. Cuando no se cuenta con el punto exacto de la altura, Georef ubica el centroide oficial de la localidad para referenciar la publicación de manera aproximada.
