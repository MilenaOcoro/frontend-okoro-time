# 🖥️ Okoro Time Frontend - Sistema de Control Horario

El frontend de Okoro Time ofrece una interfaz intuitiva para la gestión de fichajes y control horario, desarrollada con React y diseñada para una experiencia de usuario óptima.

## 👩‍💻 Desarrollador

| Nombre           | GitHub                                      |                                     
|------------------|---------------------------------------------|
| Milena Okoro     | [@MilenaOcoro](https://github.com/MilenaOcoro) | 

## 🚀 Tecnologías utilizadas

- React.js
- Vite
- Axios
- React Icons
- JWT Decode

## 🛠️ Instalación y ejecución

1. Clona el repositorio:
```bash
git clone https://github.com/codekraftians/front_end.git
```

2. Instala las dependencias:
```bash
npm install
```

3. Ejecuta el proyecto:
```bash
npm run dev
```

El proyecto se ejecutará en: [http://localhost:5173](http://localhost:5173)

## 📋 Requisitos del sistema

- Node.js 18 o superior
- npm 9 o superior

## 🌟 Características principales

1. **Autenticación y seguridad**
   - Login y gestión de sesiones con JWT 
   - Gestión de roles (Admin/Usuario)

2. **Dashboards personalizados**
   - Panel de usuario con acciones rápidas
   - Panel administrativo
   - Visualización de información relevante

3. **Gestión de fichajes**
   - Registro rápido de entrada/salida
   - Fichajes manuales con fecha y hora personalizadas
   - Edición y eliminación de registros

4. **Gestión de usuarios**
   - CRUD completo de empleados (admin)
   - Perfiles de usuario
   - Cambio de contraseñas

## 📁 Estructura del proyecto

```
src/
│
├── components/
│   ├── Button/
│   ├── Card/
│   ├── Input/
│   ├── main/
│   ├── ProtectedRoute/
│   ├── TimeEntryDetail/
│   ├── TimeEntryForm/
│   ├── TimeEntryList/
│   ├── TimeEntrySummary/
│   └── UserForm/
│
├── hooks/
│   ├── useAuth.jsx
│   └── useFichaje.jsx
│
├── pages/
│   ├── AccessDenied/
│   ├── DashboardAdminPage/
│   ├── DashboardPage/
│   ├── LoginPage/
│   ├── RegisterPage/
│   ├── TimeEntriesPage/
│   └── UsersPage/
│
├── services/
│   ├── auth.jsx
│   ├── authService.jsx
│   ├── timeEntries.jsx
│   └── users.jsx
│
├── styles/
│   ├── buttons.css
│   ├── common.css
│   ├── fonts.css
│   └── forms.css
│
├── utils/
│   └── constants.jsx
│
├── App.jsx
└── main.jsx
```

## 🏗️ Componentes principales

- **TimeEntryForm**: Componente para registrar fichajes
- **TimeEntryList**: Visualización de fichajes con filtros
- **TimeEntryDetail**: Detalle y edición de fichajes
- **TimeEntrySummary**: Estadísticas y resúmenes de horas
- **UserForm**: Formulario para crear/editar usuarios
- **ProtectedRoute**: Rutas protegidas por autenticación y permisos

## 🎨 Diseño y UX

- Interfaz responsive para todos los dispositivos
- Tema claro con acentos de color
- Iconografía intuitiva
- Formularios con validación reactiva

## 🔄 Integración con Backend

El frontend se comunica con el backend mediante Axios. La configuración de endpoints está en los archivos de servicios.

Para funcionar correctamente, es necesario tener el [backend](https://github.com/MilenaOcoro/backend-okoro-time) ejecutándose en http://localhost:8080.
 

## 🔧 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila el proyecto para producción
- `npm run preview` - Previsualiza la versión compilada

## 📝 Licencia

Este proyecto está licenciado bajo [MIT License](LICENSE).

Copyright © 2025 Milena Okoro
