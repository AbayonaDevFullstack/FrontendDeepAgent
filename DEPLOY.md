# 🚀 Frontend Deployment Guide - Vercel

## ✅ **Vulnerabilidades Resueltas**
- 🔒 **Next.js SSRF vulnerability** - Actualizado a v15.5.2
- 🔒 **PrismJS DOM Clobbering** - Forzado a v1.30.0+ con overrides
- 🔒 **Security headers** añadidos en vercel.json
- ✅ **0 vulnerabilidades** en npm audit

## 📁 **Archivos de Configuración**

### ✅ Archivos ya configurados:
- `vercel.json` - Configuración optimizada para Vercel
- `package.json` - Dependencies sin vulnerabilidades
- `.nvmrc` - Node.js 20.18.0
- `next.config.js` - Configuración de Next.js

## 🚀 **Deployment en Vercel**

### 1. **Configuración del Proyecto**
- **Framework Preset**: `Next.js`
- **Root Directory**: `Frontend` 
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Node.js Version**: `20.x`

### 2. **Variables de Entorno Requeridas**

Configura estas variables en el dashboard de Vercel:

```bash
# OBLIGATORIO - URL del backend deployado
NEXT_PUBLIC_DEPLOYMENT_URL=https://tu-backend-render.onrender.com

# OPCIONAL - ID del agente (por defecto: deepagent)
NEXT_PUBLIC_AGENT_ID=deepagent
```

### 3. **Pasos de Deployment**

1. **Conecta tu repositorio a Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `FrontendDeepAgent`

2. **Configura el proyecto**
   - Framework: `Next.js`
   - Root Directory: Dejar en blanco o poner `Frontend` si es monorepo
   - Build Command: `npm run build` (detectado automáticamente)
   - Output Directory: `.next` (detectado automáticamente)

3. **Agrega variables de entorno**
   - Ve a Settings → Environment Variables
   - Agrega `NEXT_PUBLIC_DEPLOYMENT_URL` con tu URL de Render
   - Opcionalmente agrega `NEXT_PUBLIC_AGENT_ID`

4. **Deploy**
   - Haz clic en "Deploy"
   - Espera 2-3 minutos para el first deploy
   - ✅ Frontend estará disponible en tu dominio de Vercel

## 🌐 **URLs de Producción**

Una vez deployado:
- **Frontend**: `https://tu-app.vercel.app`
- **Custom Domain** (opcional): Configurable en Vercel

## 🔍 **Verificación del Deployment**

```bash
# Test la aplicación
curl https://tu-app.vercel.app

# Verificar que carga correctamente
open https://tu-app.vercel.app
```

## ⚙️ **Configuración de Seguridad**

El `vercel.json` incluye headers de seguridad:
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: DENY`  
- ✅ `Referrer-Policy: strict-origin-when-cross-origin`
- ✅ `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 🔄 **Actualizaciones Automáticas**

- ✅ **Auto-deploy** en push a rama main
- ✅ **Preview deploys** en pull requests
- ✅ **Build cache** optimizado para Next.js

## 🐛 **Troubleshooting**

### **Error: Environment variables not found**
```bash
# Verifica que las variables estén configuradas en Vercel
NEXT_PUBLIC_DEPLOYMENT_URL=https://tu-backend.onrender.com
```

### **Error: Build failed - vulnerabilities**
```bash
# Ya resuelto con package.json actualizado
npm audit  # Debería mostrar 0 vulnerabilities
```

### **Error: Can't connect to backend**
```bash
# Verifica que el backend esté corriendo
curl https://tu-backend.onrender.com/health
```

### **Error: CORS issues**
```bash
# El backend ya tiene CORS configurado para Vercel
# Verifica que NEXT_PUBLIC_DEPLOYMENT_URL apunte al backend correcto
```

## 🎯 **Optimizaciones Incluidas**

- 🚀 **Next.js 15.5.2** con las últimas optimizaciones
- 🔒 **0 vulnerabilidades de seguridad** 
- 🌍 **Headers de seguridad** configurados
- ⚡ **Build optimizado** para Vercel
- 📱 **Responsive design** ya implementado
- 🎨 **Tailwind CSS 4** para estilos optimizados

## ✅ **Configuración Completa**

El frontend está completamente listo para deployment en producción con:
- ✅ Seguridad optimizada
- ✅ Performance optimizada  
- ✅ SEO-ready
- ✅ Mobile-responsive
- ✅ Error handling robusto