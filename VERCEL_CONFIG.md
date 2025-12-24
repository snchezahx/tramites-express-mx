# 🚀 Configuración de Vercel - Instrucciones

## ❌ Problema Actual
Vercel no encuentra el directorio `client` porque necesita configuración adicional.

## ✅ Solución Rápida (Dashboard de Vercel)

### Paso 1: Ve a la configuración del proyecto
1. Abre https://vercel.com/dashboard
2. Selecciona tu proyecto "tramites-express-mx"
3. Ve a **Settings** (Configuración)

### Paso 2: Configura el Root Directory
1. En el menú lateral, busca **General**
2. Encuentra la sección **Root Directory**
3. Cambia de `.` (raíz) a `client`
4. Haz clic en **Save** (Guardar)

### Paso 3: Configura Build & Development Settings
1. En **General**, busca **Build & Development Settings**
2. Marca **Override** si es necesario
3. Configura:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Paso 4: Variables de Entorno
1. Ve a **Environment Variables**
2. Agrega (si no están):
   ```
   VITE_SUPABASE_URL = https://kamxxawhqzrdgstltzps.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbXh4YXdocXpyZGdzdGx0enBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg4MzEsImV4cCI6MjA4MjExNDgzMX0.0qx4zVoPf4mRUHAVAot-jizcetkGoPmw9qGXWISQB9w
   ```
3. Aplica para: **Production**, **Preview**, y **Development**

### Paso 5: Redesplegar
1. Ve a **Deployments**
2. Haz clic en los tres puntos (...) del deployment más reciente
3. Selecciona **Redeploy**
4. Confirma

---

## 📝 Alternativa: Vercel CLI

Si prefieres usar CLI:

```bash
cd /home/snchezahx/.gemini/antigravity/scratch/tramites-express-mx
vercel --cwd client --prod
```

Esto le dice a Vercel que use `client` como directorio de trabajo.

---

## ✅ Después del Deployment

Tu app estará en:
- **URL:** https://tramites-express-mx.vercel.app
- **Admin:** https://tramites-express-mx.vercel.app/admin-gestor-seguro
