# Trámites Express MX - Despliegue en Vercel (Solo Frontend + Supabase)

## 🚀 Configuración Simplificada (Sin Backend)

Esta aplicación ahora funciona **100% en Vercel** usando solo Supabase, sin necesidad de servidor backend.

---

## 📋 Pasos para Desplegar

### 1. Configurar Supabase

#### A. Ejecutar SQL Schema
1. Ve a [Supabase Dashboard](https://supabase.com)
2. Ve a **SQL Editor**
3. Ejecuta el contenido de `server/database-schema.sql`

#### B. Crear Bucket de Storage
1. Ve a **Storage** → **New Bucket**
2. Nombre: `payment-receipts`
3. **Public:** ✅ Activado
4. Límite: 5MB
5. MIME types: `image/jpeg`, `image/png`, `application/pdf`

#### C. Crear Usuario Admin
1. Ve a **Authentication** → **Users** → **Invite User**
2. Email: `admin@tramites.mx` (o el que prefieras)
3. Password: `TuContraseñaSegura123!`
4. Confirma el email

---

### 2. Desplegar en Vercel

#### Opción A: Dashboard de Vercel

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. **Root Directory:** Déjalo en blanco (raíz del proyecto
)
4. **Framework Preset:** Vite
5. Vercel detectará automáticamente la configuración

#### Configurar Variables de Entorno:
Agrega estas variables en Vercel:
```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

6. Click **Deploy**

#### Opción B: Vercel CLI

```bash
cd tramites-express-mx

# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod
```

---

### 3. Configuración de Variables de Entorno Local

Para desarrollo local, crea `client/.env`:
```
VITE_SUPABASE_URL=https://kamxxawhqzrdgstltzps.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbXh4YXdocXpyZGdzdGx0enBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg4MzEsImV4cCI6MjA4MjExNDgzMX0.0qx4zVoPf4mRUHAVAot-jizcetkGoPmw9qGXWISQB9w
```

---

## ✅ URLs de tu Aplicación

- **Frontend:** `https://tramites-express-mx.vercel.app`
- **Admin Panel:** `https://tramites-express-mx.vercel.app/admin-gestor-seguro`

---

## 🧪 Probar la Aplicación

### Flujo de Usuario
1. Abre `https://tramites-express-mx.vercel.app`
2. Selecciona un servicio
3. Ingresa CURP y teléfono
4. Sube comprobante de pago
5. Verifica confirmación

### Flujo Admin
1. Abre `/admin-gestor-seguro`
2. Login con email y password de Supabase
3. Ver órdenes en dashboard
4. Cambiar estados de pedidos

---

## 🔧 Cambios Realizados

### ❌ Removido:
- Backend Express/Node.js
- Railway deployment
- API routes (`/api/*`)
- Axios para API calls

### ✅ Agregado:
- Supabase Auth para admin
- Queries directas a Supabase
- Upload directo a Supabase Storage
- Configuración simplificada de Vercel

---

## 💰 Costos

- **Vercel:** Gratis (100GB bandwidth/mes)
- **Supabase:** Gratis (500MB database, 1GB storage)

**Total: $0/mes** ✅

---

## 🎉 ¡Listo!

Tu aplicación está 100% en la nube, sin servidor backend, completamente gratis y escalable.
