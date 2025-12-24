# Trámites Express MX - Configuración con Supabase

## 🚀 Guía Rápida de Instalación

### 1. Configurar Supabase

#### 1.1. Crear las Tablas

1. Ve a tu [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral
4. Copia y pega el contenido del archivo `database-schema.sql`
5. Haz clic en **Run** para ejecutar el script

**✅ Esto creará:**
- Tabla `orders` (órdenes de trámites)
- Tabla `admins` (administradores)
- Índices para búsquedas rápidas
- Usuario admin por defecto (`admin` / `admin123`)
- Políticas de Row Level Security (RLS)

#### 1.2. Crear el Bucket de Storage

1. Ve a **Storage** en el menú lateral de Supabase
2. Haz clic en **New bucket**
3. Configuración:
   - **Name:** `payment-receipts`
   - **Public bucket:** ✅ Activado
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/jpeg`, `image/png`, `application/pdf`
4. Haz clic en **Create bucket**

#### 1.3. Configurar Variables de Entorno (Backend)

Edita el archivo `server/.env` (ya configurado):

```env
PORT=5000
SUPABASE_URL=https://kamxxawhqzrdgstltzps.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SESSION_SECRET=tramites-express-secret-key-2024
NODE_ENV=development
```

### 2. Ejecutar la Aplicación

#### Terminal 1: Backend

```bash
cd server
npm install  # (ya ejecutado)
npm run dev
```

**Salida esperada:**
```
🚀 Servidor corriendo en http://localhost:5000
📊 Ambiente: development
✅ Supabase configurado

⚠️  IMPORTANTE: Asegúrate de ejecutar el script database-schema.sql en Supabase Dashboard
```

#### Terminal 2: Frontend

```bash
cd client
npm run dev
```

**La aplicación estará en:** `http://localhost:5173`

## 🎯 Probar la Aplicación

### Flujo de Usuario

1. Abre `http://localhost:5173`
2. Selecciona un servicio (ej: Actas de Nacimiento - $50)
3. Ingresa CURP válido de prueba: `HEGG560427MVZRRL04`
4. Ingresa teléfono: `5512345678`
5. Ver número de referencia generado
6. Subir comprobante de pago (imagen o PDF)
7. Verificar confirmación

### Flujo de Administrador

1. Abre `http://localhost:5173/admin-gestor-seguro`
2. Login con:
   - **Usuario:** `admin`
   - **Contraseña:** `admin123`
3. Consultar órdenes en el dashboard
4. Cambiar estado de "Pendiente" a "Pagado"
5. Ver comprobantes subidos

## 📊 Verificar en Supabase Dashboard

### Ver Datos

1. **Table Editor → orders:** Ver todas las órdenes creadas
2. **Table Editor → admins:** Ver usuarios administradores
3. **Storage → payment-receipts:** Ver comprobantes subidos

### Consultas SQL Útiles

```sql
-- Ver todas las órdenes
SELECT * FROM orders ORDER BY created_at DESC;

-- Contar órdenes por estado
SELECT status, COUNT(*) FROM orders GROUP BY status;

-- Ver ingresos totales
SELECT SUM(service_price) as total_ingresos FROM orders;

-- Órdenes pendientes
SELECT * FROM orders WHERE status = 'Pendiente';
```

## 🔑 Credenciales

### Admin por Defecto
- **Usuario:** `admin`
- **Contraseña:** `admin123`

### CURP de Prueba
- `HEGG560427MVZRRL04` (válido con checksum correcto)
- `LOMP920202HDFLRR09` (válido)
- `SABC850612MDFNNN05` (válido)

## 📦 Estructura de Archivos Actualizada

```
server/
├── config/
│   └── supabase.js          # Cliente de Supabase
├── routes/
│   ├── orderRoutes.js       # ✅ Usa Supabase
│   └── adminRoutes.js       # ✅ Usa Supabase
├── utils/
│   ├── curpValidator.js
│   └── referenceGenerator.js
├── middleware/
│   └── auth.js
├── database-schema.sql      # 📝 Script para Supabase
├── server.js                # ✅ Configurado con Supabase
├── package.json             # ✅ Actualizado con @supabase/supabase-js
└── .env                     # 🔑 Credenciales de Supabase
```

## ✨ Cambios Realizados (MongoDB → Supabase)

### Backend

- ❌ **Removido:** `mongoose`, modelos de MongoDB
- ✅ **Agregado:** `@supabase/supabase-js`
- ✅ **Actualizado:** Todas las rutas usan Supabase queries
- ✅ **Storage:** Archivos en Supabase Storage (no local)

### Ventajas de Supabase

- ✅ **Sin instalación local** - Todo en la nube
- ✅ **PostgreSQL** - Base de datos robusta
- ✅ **Storage integrado** - Para comprobantes de pago
- ✅ **Dashboard visual** - Administración fácil
- ✅ **Backups automáticos** - Sin preocupaciones
- ✅ **Row Level Security** - Seguridad incorporada
- ✅ **Escalabilidad** - Crece con tu aplicación

## 🔒 Seguridad

### Row Level Security (RLS)

Las políticas de RLS permiten:
- Insertar órdenes (anon)
- Leer órdenes (anon)
- Actualizar órdenes (anon)
- Leer admins para autenticación (anon)

### Storage Security

- Bucket `payment-receipts` es público para lectura
- Solo la aplicación puede subir archivos (mediante backend)

## 🚨 Troubleshooting

### Error: "Missing Supabase environment variables"
**Solución:** Verifica que las variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` estén en `server/.env`

### Error: "relation 'orders' does not exist"
**Solución:** Ejecuta el script `database-schema.sql` en Supabase Dashboard → SQL Editor

### Error: "The resource you requested could not be found" (Storage)
**Solución:** Crea el bucket `payment-receipts` en Supabase Dashboard → Storage

### Error de autenticación admin
**Solución:** Verifica que la tabla `admins` tenga el usuario por defecto. Si no, ejecuta:
```sql
INSERT INTO admins (username, password) 
VALUES ('admin', '$2a$10$YQr5KLZH0z7LzZ8jQx3yYeK9vXh.mBr9kYXFfGKX8VzQJ0jZxNE2m');
```

## 📝 Notas Importantes

1. **Contraseña hasheada:** El hash `$2a$10$YQr5KLZH0z7LzZ8jQx3yYeK9vXh.mBr9kYXFfGKX8VzQJ0jZxNE2m` corresponde a `admin123`

2. **URLs de comprobantes:** Los archivos se almacenan en:
   ```
   https://kamxxawhqzrdgstltzps.supabase.co/storage/v1/object/public/payment-receipts/receipt-xxxxx.jpg
   ```

3. **CURP Validation:** La validación es simulada pero verifica formato y checksum correctamente

## 🎉 ¡Listo!

Tu aplicación ahora usa Supabase y no requiere MongoDB. Todo está en la nube y listo para usar.

**Próximo paso:** Ejecutar el script SQL en Supabase Dashboard y probar la aplicación.
