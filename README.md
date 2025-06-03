# API de Gestión de Películas y Categorías

Una API backend construida con Node.js, Express, TypeScript y PostgreSQL para gestionar películas y sus categorías.

## Requisitos Previos

- Node.js (v14 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

## Configuración

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env` en el directorio raíz con el siguiente contenido:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=PeliculasVL
NODE_ENV=development # Cambia a 'production' en producción
```

4. Crear una base de datos PostgreSQL llamada `PeliculasVL`

5. Compilar el código TypeScript:
```bash
npm run build
```

## Ejecutar la Aplicación

Modo desarrollo:
```bash
npm run dev
```

Modo producción:
```bash
npm start
```

## Endpoints de la API

### Base URL
Todos los endpoints comienzan con `http://localhost:3000/api`

### Manejo de Errores
La API maneja los siguientes casos de error:

#### Ruta no encontrada (404)
Si intentas acceder a una ruta que no existe, recibirás:
```json
{
    "mensaje": "Ruta no encontrada",
    "ruta": "/api/ruta-inexistente",
    "metodo": "GET"
}
```

#### Error interno del servidor (500)
En caso de un error interno, recibirás:
```json
{
    "mensaje": "Error interno del servidor",
    "error": "Descripción del error (solo en desarrollo)"
}
```

### Categorías
Todos los endpoints de categorías están disponibles en `http://localhost:3000/api/categorias`

#### GET `/api/categorias`
- Obtener todas las categorías
- **Validaciones**: 
  - Soporta paginación opcional con parámetros `page` y `limit`
  - `page` debe ser un número positivo
  - `limit` debe ser un número entre 1 y 100

#### GET `/api/categorias/:id`
- Obtener una categoría específica por ID

#### POST `/api/categorias`
- Crear una nueva categoría
- **Validaciones**:
  - Campo `nombre` es requerido y no puede estar vacío
  - Campo `descripcion` es requerido y no puede estar vacío
  - No permite nombres duplicados
- **Respuesta de error si faltan campos**:
  ```json
  {
    "mensaje": "Error de validación",
    "errores": [
      "La descripción es requerida"
    ]
  }
  ```

#### PUT `/api/categorias/:id`
- Actualizar una categoría existente
- **Validaciones**:
  - Si se proporciona `nombre`, no puede estar vacío
  - Si se proporciona `descripcion`, no puede estar vacío
  - No permite nombres duplicados

#### DELETE `/api/categorias/:id`
- Eliminar una categoría
- **Validaciones**:
  - No permite eliminar categorías que tengan películas vinculadas

### Películas
Todos los endpoints de películas están disponibles en `http://localhost:3000/api/peliculas`

#### GET `/api/peliculas`
- Obtener todas las películas
- **Validaciones**:
  - Soporta paginación opcional con parámetros `page` y `limit`
  - `page` debe ser un número positivo
  - `limit` debe ser un número entre 1 y 100
- **Filtros opcionales**:
  - `nombre`: Búsqueda por nombre
  - `categoriaId`: Filtrar por categoría
- **Ejemplos de uso**:
  1. Obtener todas las películas (primera página, 10 elementos por defecto):
     ```
     GET http://localhost:3000/api/peliculas
     ```

  2. Usar paginación:
     ```
     GET http://localhost:3000/api/peliculas?page=2&limit=20
     ```

  3. Buscar por nombre:
     ```
     GET http://localhost:3000/api/peliculas?nombre=Matrix
     ```

  4. Filtrar por categoría:
     ```
     GET http://localhost:3000/api/peliculas?categoriaId=1
     ```

  5. Combinar filtros y paginación:
     ```
     GET http://localhost:3000/api/peliculas?nombre=Matrix&categoriaId=1&page=1&limit=10
     ```

- **Ejemplo de respuesta exitosa**:
  ```json
  {
    "peliculas": [
      {
        "id": 1,
        "nombre": "Matrix",
        "descripcion": "Una película revolucionaria",
        "sinapsis": "Un programador descubre un mundo misterioso...",
        "categoria": {
          "id": 1,
          "nombre": "Ciencia Ficción",
          "descripcion": "Películas que exploran conceptos científicos y tecnológicos"
        }
      },
      // ... más películas ...
    ],
    "total": 50,
    "pagina": 1,
    "ultimaPagina": 5
  }
  ```

#### GET `/api/peliculas/:id`
- Obtener una película específica por ID

#### POST `/api/peliculas`
- Crear una nueva película
- **Validaciones**:
  - Campo `nombre` es requerido y no puede estar vacío
  - Campo `descripcion` es requerido y no puede estar vacío
  - Campo `sinapsis` es requerido y no puede estar vacío
  - Campo `categoriaId` es requerido y debe ser un ID válido de una categoría existente
- **Respuesta de error si faltan campos o están vacíos**:
  ```json
  {
    "mensaje": "Error de validación",
    "errores": [
      "La descripción es requerida",
      "La sinopsis es requerida"
    ]
  }
  ```

#### PUT `/api/peliculas/:id`
- Actualizar una película existente
- **Validaciones**:
  - Si se proporciona `nombre`, no puede estar vacío
  - Si se proporciona `descripcion`, no puede estar vacío
  - Si se proporciona `sinapsis`, no puede estar vacío
  - Si se proporciona `categoriaId`, debe ser un ID válido de una categoría existente
- **Respuesta de error si la categoría no existe**:
  ```json
  {
    "mensaje": "Error de validación",
    "errores": ["La categoría con ID 999 no existe"]
  }
  ```

#### DELETE `/api/peliculas/:id`
- Eliminar una película

## Ejemplos de Cuerpo de Peticiones

### Crear una Categoría
```json
{
  "nombre": "Ciencia Ficción",
  "descripcion": "Películas que exploran conceptos científicos, tecnológicos y sus implicaciones en la sociedad"
}
```

### Crear una Película
``` 