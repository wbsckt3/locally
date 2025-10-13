# 🚀 Guía de Configuración - Locally Vue 3

## 📋 Pasos para Ejecutar la Aplicación

### 1. Instalar Dependencias
```bash
cd vue3_vite_local
npm install
```

### 2. Configurar Variables de Entorno (Opcional)
Crear archivo `.env` en la raíz del proyecto:
```env
VITE_API_BASE_URL=https://www.refactorii.com/api/tenant
VITE_GOOGLE_CLIENT_ID=980822676255-vntch0t28qbesul2bp5oc1galtoi8a97.apps.googleusercontent.com
```

### 3. Ejecutar en Modo Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🔧 Configuración de Google Sign-In

### Cliente ID Configurado
- **ID**: `980822676255-vntch0t28qbesul2bp5oc1galtoi8a97.apps.googleusercontent.com`
- **Dominios autorizados**: `localhost:5173`, `127.0.0.1:5173`

### Para Producción
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto o seleccionar existente
3. Habilitar Google Sign-In API
4. Crear credenciales OAuth 2.0
5. Agregar dominios de producción
6. Actualizar `VITE_GOOGLE_CLIENT_ID` en `.env`

## 🗺️ Estructura de Navegación

### Rutas Disponibles
- `/` - Login (selección de perfil)
- `/company` - Perfil de empresa
- `/technician` - Perfil de técnico
- `/*` - Página 404

### Flujo de Navegación
1. **Login** → Selección de perfil → Autenticación Google
2. **Empresa** → Mapa, Solicitudes, Propuestas, Perfil
3. **Técnico** → Mapa, Oportunidades, Mis Propuestas, Perfil

## 🔐 Sistema de Autenticación

### Flujo Completo
1. Usuario accede a la aplicación
2. Selecciona perfil (Empresa/Técnico)
3. Autenticación con Google
4. Redirección automática al perfil
5. Verificación de autenticación en cada navegación

### Persistencia
- Token JWT en localStorage
- Datos de usuario en localStorage
- Perfil seleccionado en localStorage
- Verificación de expiración automática

## 📱 Características por Perfil

### 🏢 Perfil de Empresa
- **Mapa**: Visualización de ubicación
- **Solicitudes**: Crear y gestionar solicitudes de servicio
- **Propuestas**: Ver y gestionar propuestas recibidas
- **Perfil**: Información de la empresa

### 👨‍🔧 Perfil de Técnico
- **Mapa**: Visualización de ubicación
- **Oportunidades**: Ver oportunidades cercanas
- **Mis Propuestas**: Gestionar propuestas enviadas
- **Perfil**: Información profesional

## 🛠️ Desarrollo

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview

# Linting (si está configurado)
npm run lint
```

### Estructura de Archivos Importantes
```
src/
├── views/
│   ├── Login.vue              # Autenticación
│   ├── CompanyProfile.vue    # Perfil empresa
│   ├── TechnicianProfile.vue # Perfil técnico
│   └── NotFound.vue          # 404
├── store/index.js            # Estado global
├── router/index.js           # Rutas
└── App.vue                   # Componente principal
```

## 🔧 Configuración Avanzada

### API Integration
- Base URL: `https://www.refactorii.com/api/tenant`
- Headers: `x-user-email` para autenticación
- Endpoints: `/damages/nearby`, `/auth/google-signin`

### Estado Global (Vuex)
```javascript
// Acciones principales
store.dispatch('login', { userData, profile })
store.dispatch('logout')
store.dispatch('checkAuthStatus')
store.dispatch('loadUserLocation')
store.dispatch('loadDamages')
```

### Notificaciones
```javascript
// Mostrar notificación
store.dispatch('showNotification', {
  message: 'Mensaje',
  type: 'success', // success, error, warning, info
  duration: 5000
})
```

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Archivos Generados
- `dist/` - Archivos estáticos listos para desplegar
- `dist/index.html` - Punto de entrada
- `dist/assets/` - CSS, JS y otros recursos

### Servidores Compatibles
- Apache
- Nginx
- Netlify
- Vercel
- GitHub Pages

## 🐛 Solución de Problemas

### Error: Google Sign-In no funciona
- Verificar que el Cliente ID sea correcto
- Comprobar que el dominio esté autorizado
- Revisar la consola del navegador

### Error: API no responde
- Verificar conexión a internet
- Comprobar que la API esté disponible
- Revisar headers de autenticación

### Error: Rutas no funcionan
- Verificar configuración de Vue Router
- Comprobar que las rutas estén definidas
- Revisar guards de navegación

## 📞 Soporte

Para problemas técnicos:
1. Revisar la consola del navegador
2. Verificar logs de la aplicación
3. Comprobar configuración de variables de entorno
4. Contactar al equipo de desarrollo

---

**¡La aplicación está lista para usar! 🎉**



