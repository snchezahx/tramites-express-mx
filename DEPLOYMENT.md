# Despliegue de Trámites Express MX

## 🚀 Guía de Despliegue a Producción

### Requisitos Previos
- Cuenta en Vercel (https://vercel.com)
- Cuenta en Railway (https://railway.app)
- Cuenta en GitHub (para conectar los repositorios)

---

## Parte 1: Subir Código a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un repositorio llamado `tramites-express-mx`
3. **NO inicialices** con README (hazlo vacío)

### 2. Subir el Código

```bash
cd /home/snchezahx/.gemini/antigravity/scratch/tramites-express-mx

# Inicializar git si no está inicializado
git init

# Crear .gitignore en la raíz
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
dist/
build/
.vite/
EOF

# Agregar archivos
git add .
git commit -m "Initial commit - Trámites Express MX"

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/tramites-express-mx.git
git branch -M main
git push -u origin main
```

---

## Parte 2: Desplegar Backend en Railway

### 1. Conectar Railway con GitHub

1. Ve a https://railway.app
2. Click **"Login"** → Usa GitHub
3. Click **"New Project"**
4. Selecciona **"Deploy from GitHub repo"**
5. Conecta y selecciona `tramites-express-mx`
6. Railway detectará automáticamente el servidor Node.js

### 2. Configurar Variables de Entorno

En Railway Dashboard:
1. Click en tu proyecto
2. Ve a **"Variables"**
3. Agrega estas variables:

```
PORT=5000
SUPABASE_URL=https://kamxxawhqzrdgstltzps.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbXh4YXdocXpyZGdzdGx0enBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg4MzEsImV4cCI6MjA4MjExNDgzMX0.0qx4zVoPf4mRUHAVAot-jizcetkGoPmw9qGXWISQB9w
SESSION_SECRET=tramites-express-secret-key-2024-production
NODE_ENV=production
FRONTEND_URL=(lo obtendrás en el paso 3)
```

### 3. Obtener URL del Backend

1. Railway generará una URL como: `https://tramites-express-mx-production.up.railway.app`
2. **Copia esta URL** (la necesitarás para el frontend)

---

## Parte 3: Desplegar Frontend en Vercel

### 1. Crear archivo de configuración de Vercel

En `/client`, crea `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "TU_URL_DE_RAILWAY/api/:path*"
    }
  ]
}
```

### 2. Actualizar .env para Producción

En `/client/.env`, agrega:

```
VITE_API_URL=TU_URL_DE_RAILWAY
```

### 3. Desplegar en Vercel

**Opción A: Desde la terminal**

```bash
cd client

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Sigue las instrucciones:
# - Set up and deploy? Y
# - Which scope? Tu cuenta
# - Link to existing project? N
# - Project name? tramites-express-mx
# - Directory? ./
# - Override settings? N

# Desplegar a producción
vercel --prod
```

**Opción B: Desde el Dashboard**

1. Ve a https://vercel.com/new
2. Importa el repositorio de GitHub
3. Configura:
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Agrega variables de entorno:
   ```
   VITE_API_URL=TU_URL_DE_RAILWAY
   VITE_SUPABASE_URL=https://kamxxawhqzrdgstltzps.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Click **"Deploy"**

### 4. Actualizar Railway con la URL de Vercel

1. Vercel te dará una URL como: `https://tramites-express-mx.vercel.app`
2. Ve a Railway → Variables
3. Actualiza `FRONTEND_URL` con la URL de Vercel
4. Railway redesplegará automáticamente

---

## Parte 4: Actualizar Frontend para usar API de Producción

En `/client/vite.config.js`, actualiza:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: process.env.NODE_ENV !== 'production' ? {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    } : undefined
  }
})
```

---

## ✅ Verificación Final

### URLs de tu aplicación:

- **Frontend (Usuarios):** `https://tramites-express-mx.vercel.app`
- **Admin Panel:** `https://tramites-express-mx.vercel.app/admin-gestor-seguro`
- **Backend API:** `https://tramites-express-mx-production.up.railway.app`

### Pruebas:

1. ✅ Abrir el frontend en Vercel
2. ✅ Seleccionar un servicio
3. ✅ Ingresar CURP y WhatsApp
4. ✅ Subir comprobante
5. ✅ Login en admin panel
6. ✅ Ver órdenes en dashboard

---

## 🔧 Solución de Problemas

### Error de CORS
- Verifica que `FRONTEND_URL` en Railway tenga la URL correcta de Vercel
- Asegúrate que no haya `/` al final de la URL

### Error 404 en Rutas
- En Vercel, agrega un archivo `_redirects` en `/client/public`:
  ```
  /*    /index.html   200
  ```

### Variables de Entorno no Funcionan
- En Vercel: deben empezar con `VITE_`
- En Railway: redeplegar después de cambiar variables

---

## 💰 Costos

- **Vercel:** Gratis (100GB bandwidth/mes)
- **Railway:** Gratis ($5 crédito mensual, suficiente para este proyecto)
- **Supabase:** Gratis (hasta 500MB database, 1GB storage)

**Total: $0/mes** ✅

---

## 🎉 ¡Listo!

Tu aplicación estará disponible públicamente en Internet con HTTPS automático, dominio personalizado (puedes agregar tu propio dominio después), y escalabilidad automática.
