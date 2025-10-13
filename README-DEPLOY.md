# 🚀 Guía de Deploy Automático

Esta guía te ayuda a configurar un sistema de deploy automático para GitHub Pages, usando credenciales específicas para este proyecto (separadas de tu cuenta corporativa).

## 📋 Configuración Inicial (Solo una vez)

### 1. **Configurar Git para este proyecto**
```powershell
.\configure-git-project.ps1
```
- Te pedirá tu nombre de usuario y email de GitHub
- Configura credenciales solo para este proyecto
- No afecta tu configuración Git corporativa

### 2. **Configurar credenciales de GitHub**
```powershell
.\setup-github-credentials.ps1
```
**Opciones disponibles:**
- **GitHub CLI** (recomendado): Más fácil y seguro
- **Token de acceso personal**: Para casos específicos
- **SSH Key**: Para máxima seguridad

## 🚀 Deploy Automático (Cada vez que hagas cambios)

### Opción 1: Script PowerShell
```powershell
.\deploy.ps1
```

### Opción 2: Comando npm
```powershell
npm run deploy
```

## 🔧 ¿Qué hace el deploy automático?

1. **📦 Build**: Ejecuta `npm run build`
2. **📁 Git Add**: Agrega archivos del `dist/` al staging
3. **💾 Commit**: Hace commit con timestamp automático
4. **🌐 Push**: Sube los cambios a GitHub
5. **✅ Confirmación**: Te dice si fue exitoso

## 🔐 Seguridad de Credenciales

### ✅ **Configuración Local**
- Las credenciales se configuran solo para este proyecto
- No afecta tu configuración Git corporativa
- Se almacenan de forma segura

### 🔒 **Opciones de Autenticación**

#### **GitHub CLI (Recomendado)**
```powershell
# Instalar GitHub CLI
winget install GitHub.cli

# Autenticarse
gh auth login --web
```

#### **Token de Acceso Personal**
1. Ve a GitHub.com → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token → Generate new token (classic)
4. Selecciona scopes: `repo`, `workflow`
5. Copia el token y úsalo en el script

#### **SSH Key**
```bash
# Generar nueva SSH key
ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"

# Agregar a GitHub
# Luego usar URL SSH: git@github.com:usuario/locally.git
```

## 🎯 Flujo de Trabajo Típico

```bash
# 1. Haces cambios en el código Vue
# 2. Ejecutas deploy
npm run deploy
# 3. ¡Listo! Tu app se actualiza en GitHub Pages automáticamente
```

## 🚨 Solución de Problemas

### **Error: "Authentication failed"**
- Ejecuta: `.\setup-github-credentials.ps1`
- Reconfigura las credenciales

### **Error: "Repository not found"**
- Verifica que la URL del repositorio sea correcta
- Asegúrate de tener permisos de escritura

### **Error: "Permission denied"**
- Verifica que tu token tenga permisos de `repo`
- O que tu SSH key esté agregada a GitHub

## 📞 Soporte

Si tienes problemas:
1. Verifica la configuración: `git config --list`
2. Prueba la conexión: `git remote -v`
3. Revisa los logs del deploy

---

**🎉 ¡Disfruta del deploy automático!**
