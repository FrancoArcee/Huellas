# Alcance final — Mapa de funcionalidades

## Mapa de funcionalidades

```text
HUELLAS — Plataforma móvil para adopción de animales
│
├── 1. Acceso y cuenta
│   ├── Pantalla de bienvenida
│   ├── Registro de usuario
│   │   ├── Datos personales y medio de contacto
│   │   └── Carga de foto de perfil
│   ├── Inicio y cierre de sesión
│   └── Perfil de usuario
│       ├── Consulta de datos personales
│       └── Edición de perfil, contacto y foto
│
├── 2. Explorar animales
│   ├── Inicio
│   │   ├── Carrusel de categorías de animales
│   │   ├── Carrusel de publicaciones destacadas/recientes
│   │   └── Acceso a filtros
│   ├── Búsqueda de publicaciones
│   │   ├── Búsqueda por texto
│   │   ├── Filtro por categoría, tamaño y sexo
│   │   ├── Filtro por estado de adopción
│   │   ├── Filtro por rango de edad y peso
│   │   └── Filtro por ubicación o radio de cercanía
│   └── Detalle de animal
│       ├── Datos, descripción, ubicación y estado
│       ├── Carrusel de fotografías
│       ├── Visualización en mapa
│       ├── Datos de contacto del publicador
│       └── Contacto mediante la aplicación/red social configurada
│
├── 3. Favoritos
│   ├── Marcar una publicación como favorita
│   ├── Quitar una publicación de favoritos
│   └── Consultar las publicaciones favoritas del usuario
│
├── 4. Publicaciones de animales
│   ├── Crear publicación
│   │   ├── Datos del animal: nombre, especie, edad, peso, tamaño y sexo
│   │   ├── Estado de castración y estado de adopción
│   │   ├── Fecha de nacimiento y descripción opcional
│   │   ├── Carga de hasta tres fotografías
│   │   └── Selección de ubicación en mapa o por dirección
│   ├── Mis publicaciones
│   │   └── Listado de publicaciones propias
│   ├── Editar publicación
│   │   ├── Modificar datos, estado, imágenes y ubicación
│   │   └── Conservar o reemplazar fotografías existentes
│   └── Eliminar publicación
│
├── 5. Historial clínico
│   ├── Consultar historial de una mascota autenticado
│   ├── Registrar evento clínico
│   │   ├── Tipo de evento: vacunación, desparasitación, consulta,
│   │   │   cirugía, diagnóstico, chequeo u otro
│   │   ├── Fecha, profesional/veterinaria y descripción
│   │   └── Adjuntar comprobante o documento
│   ├── Editar un registro clínico
│   └── Eliminar un registro clínico
│
├── 6. Ubicación
│   ├── Permisos y geolocalización del dispositivo
│   ├── Mapa para elegir la ubicación de una publicación
│   ├── Autocompletado de direcciones de Argentina (Georef)
│   └── Normalización de provincia, departamento, municipio y localidad
│
└── 7. Servicios de plataforma
    ├── API REST para usuarios, animales, favoritos e historial clínico
    ├── Autenticación y control de acceso a operaciones protegidas
    ├── Validación de datos compartida entre aplicación y servidor
    ├── Almacenamiento de imágenes de perfil, animales y comprobantes
    ├── Paginación de publicaciones y filtros de consulta
    └── Manejo de errores y limitación de solicitudes de georreferenciación
```

## Roles y alcance de acceso

| Rol | Funcionalidades principales |
| --- | --- |
| Visitante | Visualizar y buscar publicaciones públicas. |
| Usuario autenticado | Gestionar su cuenta, favoritos, publicaciones propias e historial clínico de animales. |
| Propietario de la publicación | Editar o eliminar únicamente sus propias publicaciones; administrar su historial clínico asociado. |
