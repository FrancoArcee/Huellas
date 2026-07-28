# Índice de conversaciones con IA — Entrega 3

## Proyecto: Huellas — App de adopción de mascotas

> Las conversaciones se entregan en formato PDF y Markdown por haber utilizado
> múltiples herramientas de IA a lo largo del desarrollo. Todas están completas
> y sin recortar.

---

## Archivos de conversaciones

| Archivo                                | Herramienta          | Descripción                                                                                                                                                                                                               |
| -------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Updating-Post-Status-Schema.md`       | Antigravity (Google) | Modificación full-stack para agregar estados ("En adopción", "En tránsito", "Adoptado") a las publicaciones: actualización de Prisma schema, migraciones, wizards de creación/edición y lógica de filtrado.            |
| `Updating Pet Search Filters.md`       | Antigravity (Google) | Actualización de los filtros de búsqueda de mascotas en frontend y backend: sincronización de categorías con el Home, restricción de estados ("En adopción" y "En tránsito"), cambio de etiqueta "Senior" por "Adulto Mayor" y eliminación del filtro de peso. |
| `Implement Clinical History Screen.md` | Antigravity (Google) | Implementación de la pantalla y flujo de carga de historial clínico en el frontend mobile: modal emergente con validación Zod, límite de 1 comprobante por registro, cards horizontales con íconos dinámicos e integración en `MyPostScreen`. |
| `historial-clinico.md`                 | OpenCode             | Implementación completa del historial clínico en el backend: modelo de base de datos (HistorialClinico y EntradaHistorial), endpoints API (GET, POST, PUT, DELETE), controladores, servicios y repositorios.          |
| `medic-modal.md`                       | OpenCode             | Adaptación del botón y modal de historial clínico en el frontend mobile: integración en pantalla de detalle de mascotas, uso de convenciones del proyecto (colores, iconos Lucide).                                   |

---

## Resumen por herramienta

| Herramienta          | Cantidad de conversaciones | Usos principales                                                                                          |
| -------------------- | -------------------------- | --------------------------------------------------------------------------------------------------------- |
| Antigravity (Google) | 3                          | Desarrollo de features full-stack, actualización de filtros de búsqueda y pantallas de historial clínico |
| OpenCode             | 2                          | Implementación de historial clínico (backend + frontend)                                                  |

