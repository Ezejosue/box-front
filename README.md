# Box Frontend - Prueba Técnica BoxFull

Este proyecto es el frontend de una prueba técnica para BoxFull, implementado con [Next.js](https://nextjs.org). La aplicación permite gestionar órdenes de envío y paquetes.

## Características

- Autenticación de usuarios (registro e inicio de sesión)
- Gestión de órdenes de envío
- Creación y seguimiento de paquetes
- Interfaz responsiva con Tailwind CSS

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- API Backend ejecutándose en `http://localhost:3000`

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/BoxTest.git
cd BoxTest/BoxApiFront/box-front
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Ejecutar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

El servidor de desarrollo se iniciará en `http://localhost:3001`.

## Estructura del Proyecto

- `/src/app` - Páginas y rutas de la aplicación
- `/src/components` - Componentes reutilizables
- `/src/services` - Servicios para comunicación con la API
- `/src/utils` - Utilidades y helpers
- `/src/api` - Configuración de Axios

## Tecnologías Utilizadas

- Next.js 15.1
- React 19
- Tailwind CSS
- Axios
- JWT para autenticación

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter

## Autor

- Josue Avalos

## Licencia

Este proyecto es parte de una prueba técnica y no está licenciado para uso público.
