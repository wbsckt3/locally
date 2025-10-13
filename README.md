# Locally - Vue 3 Application

Una aplicación profesional para conectar empresas con técnicos especializados, construida con Vue 3, Vite y Vuex.

## 🚀 Características

### Perfiles Separados
- **Empresa**: Publica solicitudes de servicio y recibe propuestas
- **Técnico**: Encuentra oportunidades y envía propuestas

### Funcionalidades Principales
- ✅ Autenticación con Google Sign-In
- ✅ Gestión de perfiles (Empresa/Técnico)
- ✅ Mapa interactivo con ubicación del usuario
- ✅ Sistema de notificaciones
- ✅ Gestión de solicitudes y propuestas
- ✅ Perfil de usuario personalizable
- ✅ Diseño responsive y moderno

## 🛠️ Tecnologías

- **Vue 3** - Framework principal
- **Vite** - Build tool y dev server
- **Vue Router** - Navegación
- **Vuex** - Estado global
- **Vuetify** - Componentes UI
- **Google Sign-In** - Autenticación
- **Phosphor Icons** - Iconografía

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## 🏗️ Estructura del Proyecto

```
src/
├── views/
│   ├── Login.vue              # Página de autenticación
│   ├── CompanyProfile.vue    # Perfil de empresa
│   ├── TechnicianProfile.vue  # Perfil de técnico
│   └── NotFound.vue          # Página 404
├── store/
│   └── index.js              # Estado global (Vuex)
├── router/
│   └── index.js              # Configuración de rutas
├── App.vue                   # Componente principal
└── main.js                   # Punto de entrada
```

## 🔐 Autenticación

### Google Sign-In
- Cliente ID: `980822676255-vntch0t28qbesul2bp5oc1galtoi8a97.apps.googleusercontent.com`
- Manejo automático de tokens JWT
- Persistencia en localStorage
- Verificación de expiración de tokens

### Flujo de Autenticación
1. Usuario selecciona perfil (Empresa/Técnico)
2. Autenticación con Google
3. Redirección automática al perfil correspondiente
4. Verificación de autenticación en cada navegación

## 🗺️ API Integration

### Endpoints Utilizados
- `GET /api/tenant/damages/nearby` - Obtener daños cercanos
- `POST /api/tenant/auth/google-signin` - Autenticación Google
- `GET /api/tenant/companies` - Información de empresas

### Configuración
```javascript
const API_BASE_URL = 'https://www.refactorii.com/api/tenant'
```

## 🎨 Diseño

### Paleta de Colores
- **Primario**: #667eea (Azul)
- **Secundario**: #764ba2 (Púrpura)
- **Éxito**: #48bb78 (Verde)
- **Error**: #f56565 (Rojo)
- **Advertencia**: #f6ad55 (Naranja)

### Componentes UI
- Diseño moderno y limpio
- Iconografía Phosphor
- Animaciones suaves
- Responsive design

## 📱 Responsive Design

- **Mobile First**: Optimizado para dispositivos móviles
- **Breakpoints**: 768px, 1024px
- **Grid System**: CSS Grid y Flexbox
- **Touch Friendly**: Botones y elementos táctiles

## 🔧 Desarrollo

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview       # Preview de producción
```

### Estructura de Estado (Vuex)
```javascript
state: {
  auth: {           # Autenticación
    loggedIn: false,
    user: null,
    profile: null,
    token: null
  },
  app: {            # Estado de la app
    loading: false,
    notifications: []
  },
  map: {            # Mapa y ubicación
    userLocation: null,
    damages: []
  },
  company: {        # Datos de empresa
    currentCompany: null,
    companyInfo: null
  }
}
```

## 🚀 Despliegue

### Variables de Entorno
```env
VITE_API_BASE_URL=https://www.refactorii.com/api/tenant
VITE_GOOGLE_CLIENT_ID=980822676255-vntch0t28qbesul2bp5oc1galtoi8a97.apps.googleusercontent.com
```

### Build de Producción
```bash
npm run build
```

Los archivos se generan en la carpeta `dist/` y están listos para desplegar en cualquier servidor web.

## 📋 TODO

- [ ] Implementar mapa interactivo real
- [ ] Integrar API completa
- [ ] Añadir tests unitarios
- [ ] Implementar PWA
- [ ] Añadir internacionalización
- [ ] Optimizar performance

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

**Locally** - Conectando empresas con técnicos especializados 🚀



