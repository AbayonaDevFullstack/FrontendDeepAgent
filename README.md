# 🤖 Lois Deep Agent - Frontend

Interfaz web para el agente de razonamiento profundo Lois, construido con Next.js 15 y React 19.

## 🚀 Deployment en Vercel

Este frontend está configurado para deployment automático en Vercel.

### Variables de Entorno Requeridas

```env
NEXT_PUBLIC_DEPLOYMENT_URL=https://lois-agent-backend.onrender.com
NEXT_PUBLIC_AGENT_ID=deepagent
```

### Comandos Disponibles

```bash
# Desarrollo local
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint
```

## 🏗️ Arquitectura

- **Framework**: Next.js 15 con App Router
- **Styling**: SCSS + Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React hooks + nuqs para URL state
- **Backend**: Conecta con LangGraph API en Render

## 🔗 Enlaces

- **Frontend**: [Desplegado en Vercel]
- **Backend**: https://lois-agent-backend.onrender.com
- **Health Check**: https://lois-agent-backend.onrender.com/health

## 📋 Funcionalidades

- ✅ Chat interface con el agente
- ✅ Visualización de todos y archivos
- ✅ Historial de conversaciones
- ✅ Subagentes y tool calls
- ✅ Markdown rendering con syntax highlighting
- ✅ Responsive design
- ✅ Loading states y error handling

## 🛠️ Desarrollo Local

Para conectar con backend local:

```env
NEXT_PUBLIC_DEPLOYMENT_URL=http://127.0.0.1:2024
NEXT_PUBLIC_AGENT_ID=deepagent
```

```bash
npm install
npm run dev
```

¡Listo para interactuar con tu agente de razonamiento profundo! 🎯
