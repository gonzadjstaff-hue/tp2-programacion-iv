# Falsebook

Red social desarrollada para el Trabajo Práctico N.º 2 de **Programación IV** (UTN Avellaneda, 2026). Incluye los **sprints 1 y 2**: registro, login, publicaciones y "me gusta".

**Autor:** Gonzalo Garcez

## Demo

- Frontend: https://tp2-programacion-iv-gold.vercel.app
- Backend (API): https://tp2-programacion-iv.onrender.com

El backend está en el plan gratuito de Render: si estuvo inactivo, el primer pedido puede tardar alrededor de un minuto mientras se inicia.

## Tecnologías

| Parte | Tecnología |
|---|---|
| Frontend | Angular 22 (componentes standalone, signals, formularios reactivos, SCSS) |
| Backend | NestJS, Mongoose, class-validator, bcrypt, multer |
| Base de datos | MongoDB Atlas |
| Imágenes | Supabase Storage |
| Hosting | Vercel (frontend) y Render (backend) |

## Funcionalidades

- **Registro** con foto de perfil obligatoria. Los datos se validan en el frontend y en el backend, y la contraseña se guarda encriptada con bcrypt.
- **Login** con email o nombre de usuario.
- **Perfiles:** todo usuario nuevo se crea como `usuario`. El perfil `administrador` no puede elegirse al registrarse.
- **Publicaciones:**
  - crear con imagen opcional;
  - ordenar por fecha o por cantidad de "me gusta";
  - listado paginado.
- **Me gusta:** cada usuario puede dar o quitar un único "me gusta" por publicación.
- **Baja lógica:** solo el autor o un administrador puede eliminar una publicación. El backend lo verifica y responde 403 si no corresponde.
- **Mi perfil:** muestra los datos del usuario y sus últimas 3 publicaciones con sus comentarios.

## Estructura

```
backend/    API REST en NestJS
  src/autenticacion/   registro y login
  src/publicaciones/   publicaciones, me gusta y comentarios
  src/usuarios/        esquema de usuario
  src/imagenes.ts      validación y subida de imágenes a Supabase
frontend/   aplicación Angular
  src/app/pages/       login, registro, publicaciones, mi-perfil
  src/app/shared/      componentes de publicación y modal
  src/app/services/    sesión del usuario
```

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/autenticacion/registro` | Registro de usuario (multipart, con foto) |
| POST | `/autenticacion/login` | Login con email o nombre de usuario |
| GET | `/publicaciones?orden=fecha\|meGusta&usuario=&offset=&limit=` | Listado paginado |
| POST | `/publicaciones` | Crear publicación (multipart, imagen opcional) |
| DELETE | `/publicaciones/:id` | Baja lógica (autor o administrador) |
| POST | `/publicaciones/:id/me-gusta` | Dar "me gusta" |
| DELETE | `/publicaciones/:id/me-gusta` | Quitar "me gusta" |
| GET | `/publicaciones/:id/comentarios` | Comentarios de una publicación |

## Ejecución local

Requisitos: Node.js 20 o superior, más una base de MongoDB Atlas y un proyecto de Supabase con un bucket público llamado `imagenes`.

### Backend

```bash
cd backend
npm install
```

Crear `backend/.env` a partir de `backend/.env.example`:

```
MONGO_URI=
SUPABASE_URL=
SUPABASE_KEY=
```

```bash
npm run start:dev
```

La API queda disponible en http://localhost:3000.

### Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación queda disponible en http://localhost:4200. Por defecto usa la API publicada en Render. Para usar el backend local, cambiar `API_URL` en `frontend/src/app/api.ts` a `http://localhost:3000`.

## Alcance

Esta entrega cubre los sprints 1 y 2. Como la autenticación con JWT corresponde al sprint 3, por ahora el frontend identifica al usuario con los datos de sesión guardados en `localStorage`.
