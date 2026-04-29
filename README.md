# 🐾 Adopta

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

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para configuración del entorno.

```bash
docker compose -f docker-compose.dev.yml up -d
```
