# Nutricion IA - Frontend

Frontend desarrollado con Next.js y React para la interfaz de usuario de Nutricion IA.

## Instalación

```bash
npm install
```

## Configuración

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env.local
```

2. Editar `.env.local` con la URL de tu backend

## Ejecución

### Desarrollo
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Producción
```bash
npm run build
npm start
```

## Estructura

```
src/
├── app/            # Páginas y layouts (App Router)
├── components/     # Componentes React reutilizables
├── services/       # Cliente API
└── utils/          # Funciones auxiliares
```

## Características

- **Next.js 14** con App Router
- **TypeScript** para type safety
- **React 18** con componentes modernos
- **Axios** para comunicación con API
- **Responsive Design** para móviles y desktop

## Desarrollo

El proyecto usa el nuevo App Router de Next.js 14. Las páginas se definen en el directorio `src/app/`.

### Crear una nueva página

1. Crear un directorio en `src/app/nombre-pagina/`
2. Crear un archivo `page.tsx` en ese directorio
3. La ruta será automáticamente `/nombre-pagina`

### Crear un componente

1. Crear archivo en `src/components/NombreComponente.tsx`
2. Exportar el componente
3. Importar donde sea necesario

## Scripts

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Construye para producción
- `npm start` - Inicia servidor de producción
- `npm run lint` - Ejecuta linter
