#!/bin/bash

# Script de despliegue rápido
# Este script te guía paso a paso para desplegar la aplicación

echo "🚀 Trámites Express MX - Despliegue a Producción"
echo "================================================"
echo ""

# Paso 1: Verificar que estamos en el directorio correcto
if [ ! -f "README.md" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo "✅ Proyecto encontrado"
echo ""

# Paso 2: GitHub
echo "📦 PASO 1: Crear Repositorio en GitHub"
echo "--------------------------------------"
echo "1. Ve a: https://github.com/new"
echo "2. Nombre del repo: tramites-express-mx"
echo "3. Visibilidad: Public o Private (tu elección)"
echo "4. NO inicialices con README"
echo "5. Click 'Create repository'"
echo ""
read -p "¿Ya creaste el repositorio en GitHub? (s/n): " github_ready

if [ "$github_ready" != "s" ]; then
    echo "⏸️  Crea el repositorio y vuelve a ejecutar este script"
    exit 0
fi

echo ""
read -p "Ingresa tu usuario de GitHub: " github_user
read -p "Ingresa el nombre del repositorio (tramites-express-mx): " repo_name
repo_name=${repo_name:-tramites-express-mx}

echo ""
echo "Conectando con GitHub..."
git remote add origin "https://github.com/$github_user/$repo_name.git" 2>/dev/null || git remote set-url origin "https://github.com/$github_user/$repo_name.git"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Código subido a GitHub exitosamente!"
else
    echo "❌ Error al subir código. Verifica tus credenciales de GitHub."
    echo "Puedes subirlo manualmente con:"
    echo "  git remote add origin https://github.com/$github_user/$repo_name.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    exit 1
fi

echo ""
echo "========================================"
echo "📡 PASO 2: Desplegar Backend en Railway"
echo "========================================"
echo ""
echo "1. Ve a: https://railway.app"
echo "2. Login con GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Selecciona: $github_user/$repo_name"
echo "5. Railway detectará automáticamente Node.js"
echo ""
echo "6. Agrega estas Variables de Entorno en Railway:"
echo "   ----------------------------------------"
echo "   PORT=5000"
echo "   SUPABASE_URL=https://kamxxawhqzrdgstltzps.supabase.co"
echo "   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbXh4YXdocXpyZGdzdGx0enBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg4MzEsImV4cCI6MjA4MjExNDgzMX0.0qx4zVoPf4mRUHAVAot-jizcetkGoPmw9qGXWISQB9w"
echo "   SESSION_SECRET=tramites-express-secret-key-2024-production"
echo "   NODE_ENV=production"
echo "   ----------------------------------------"
echo ""
read -p "¿Ya desplegaste el backend en Railway? (s/n): " railway_ready

if [ "$railway_ready" != "s" ]; then
    echo "⏸️  Despliega el backend y vuelve a ejecutar este script"
    exit 0
fi

echo ""
read -p "Ingresa la URL de tu backend en Railway (ej: https://tuapp.up.railway.app): " backend_url

echo ""
echo "========================================="
echo "🌐 PASO 3: Desplegar Frontend en Vercel"
echo "========================================="
echo ""
echo "Opción A: Usando Vercel CLI (Más Rápido)"
echo "-----------------------------------------"
echo "cd client"
echo "npx vercel"
echo ""
echo "Opción B: Desde el Dashboard"
echo "----------------------------"
echo "1. Ve a: https://vercel.com/new"
echo "2. Importa: $github_user/$repo_name"
echo "3. Configuración:"
echo "   - Root Directory: client"
echo "   - Framework: Vite"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""
echo "4. Variables de Entorno:"
echo "   VITE_API_URL=$backend_url"
echo "   VITE_SUPABASE_URL=https://kamxxawhqzrdgstltzps.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbXh4YXdocXpyZGdzdGx0enBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1Mzg4MzEsImV4cCI6MjA4MjExNDgzMX0.0qx4zVoPf4mRUHAVAot-jizcetkGoPmw9qGXWISQB9w"
echo ""
read -p "¿Ya desplegaste el frontend en Vercel? (s/n): " vercel_ready

if [ "$vercel_ready" != "s" ]; then
    echo "⏸️  Despliega el frontend y continúa"
    exit 0
fi

echo ""
read -p "Ingresa la URL de tu frontend en Vercel (ej: https://tuapp.vercel.app): " frontend_url

echo ""
echo "============================================"
echo "🔄 PASO 4: Actualizar Variable en Railway"
echo "============================================"
echo ""
echo "Ve a Railway → Variables y agrega:"
echo "FRONTEND_URL=$frontend_url"
echo ""
echo "Railway redesplegará automáticamente."
echo ""

echo "✅ ¡DESPLIEGUE COMPLETADO!"
echo "========================="
echo ""
echo "🌐 URLs de tu aplicación:"
echo "  Frontend: $frontend_url"
echo "  Admin:    $frontend_url/admin-gestor-seguro"
echo "  Backend:  $backend_url"
echo ""
echo "🔑 Credenciales Admin:"
echo "  Usuario: admin"
echo "  Contraseña: admin123"
echo ""
echo "🎉 ¡Tu aplicación ya está en línea!"
