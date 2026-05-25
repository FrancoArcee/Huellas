# 🐾 Huellas

Plataforma móvil para centralizar y facilitar la adopción de animales, conectando adoptantes con refugios y rescatistas.

## Estructura del monorepo

```
Adopta/
├── Mobile/     # App React Native con Expo (adoptantes y admin)
├── Server/     # API REST con Node.js + Express
└── Shared/     # Tipos TypeScript y utilidades compartidas
```

## Tecnologías principales

| Capa   | Stack                                   |
| ------ | --------------------------------------- |
| Mobile | React Native, Expo, TypeScript, Zustand |
| Server | Node.js, Express, TypeScript            |
| Shared | TypeScript puro                         |

## Inicio rápido

Para configurar y ejecutar el proyecto localmente en tu entorno de desarrollo:

### 1. Requisitos previos

Tener instalado:

* [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
* [npm](https://www.npmjs.com/) (incluido con Node.js)
* Un emulador de Android (Android Studio), simulador de iOS (Xcode, solo macOS) o la aplicación **Expo Go** en tu dispositivo móvil para probar la app.

### 2. Instalación de dependencias

El proyecto utiliza **npm workspaces** para gestionar el monorepo. Podes instalar todas las dependencias (tanto de la raíz como de los subproyectos `Mobile`, `Server` y `Shared`) con un solo comando ejecutado desde la raíz del repositorio:

```bash
npm install
```

### 3. Ejecución del proyecto

Podés iniciar cada parte del proyecto de manera independiente utilizando los scripts definidos en la raíz:

#### Iniciar la Aplicación Móvil (React Native + Expo)

Para iniciar el servidor de desarrollo de Expo, ejecuta:

```bash
npm run mobile
```

Una vez que Expo se esté ejecutando en la terminal, podés:

* Escanear el código QR con la cámara (iOS) o con la app **Expo Go** (Android) para correr la app directamente en tu dispositivo físico.
* Presionar **`a`** para abrir en un emulador de Android.
* Presionar **`i`** para abrir en un simulador de iOS.
* Presionar **`w`** para abrir la versión web en tu navegador.
