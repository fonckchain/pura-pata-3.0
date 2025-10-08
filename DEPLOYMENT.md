# 🚀 Guía de Deployment - Pura Pata

Esta guía te llevará paso a paso para deployar la plataforma completa en producción.

## 📋 Pre-requisitos

- [ ] Cuenta de GitHub (código fuente)
- [ ] Cuenta de Supabase (base de datos, auth, storage)
- [ ] Cuenta de Vercel (frontend)
- [ ] Cuenta de Railway (backend)
- [ ] Cuenta de Cloudflare (DNS)
- [ ] Dominio: pura-pata.fast-blocks.xyz

## 1️⃣ Setup Supabase (Base de Datos & Auth)

### Crear Proyecto

1. Ir a [supabase.com](https://supabase.com)
2. Click en "New Project"
3. Nombre: `pura-pata`
4. Región: `South America` (más cercana a Costa Rica)
5. Database Password: Guardar en lugar seguro
6. Click "Create new project"

### Configurar Base de Datos

1. En el dashboard, ir a **SQL Editor**
2. Click "New query"
3. Pegar y ejecutar este SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dogs table
CREATE TABLE dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  age_years INT NOT NULL,
  age_months INT DEFAULT 0,
  breed VARCHAR(100) NOT NULL,
  size VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  color VARCHAR(100) NOT NULL,
  description TEXT,
  vaccinated BOOLEAN DEFAULT FALSE,
  sterilized BOOLEAN DEFAULT FALSE,
  dewormed BOOLEAN DEFAULT FALSE,
  special_needs TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT,
  province VARCHAR(50),
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255),
  photos TEXT[] NOT NULL,
  certificate TEXT,
  status VARCHAR(20) DEFAULT 'disponible',
  publisher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  adopted_at TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('disponible', 'reservado', 'adoptado'))
);

-- Dog status history table
CREATE TABLE dog_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dogs_status ON dogs(status);
CREATE INDEX idx_dogs_publisher ON dogs(publisher_id);
CREATE INDEX idx_dogs_province ON dogs(province);
```

### Configurar Storage

1. Ir a **Storage** en el sidebar
2. Click "Create a new bucket"
3. Nombre: `dog-photos`
4. **Importante**: Marcar como **Public bucket**
5. Click "Create bucket"

### Configurar Authentication

1. Ir a **Authentication > Providers**
2. Asegurarse que **Email** esté habilitado
3. En **Email Auth** → **Confirm email**: Desactivar (para MVP)
4. Guardar cambios

### Obtener Credenciales

1. Ir a **Settings > API**
2. Copiar y guardar:
   - **Project URL** (ej: `https://xxx.supabase.co`)
   - **anon/public key** (para frontend)
   - **service_role key** (para backend) ⚠️ NUNCA exponer públicamente
3. Ir a **Settings > API > JWT Settings**
4. Copiar **JWT Secret**

## 2️⃣ Deploy Backend en Railway

### Crear Proyecto

1. Ir a [railway.app](https://railway.app)
2. Click "New Project"
3. Seleccionar "Deploy from GitHub repo"
4. Conectar tu GitHub y seleccionar el repositorio `pura-pata-3.0`
5. En "Root Directory" poner: `backend`

### Agregar PostgreSQL (Opcional - usar Supabase)

Si prefieres usar Railway PostgreSQL en vez de Supabase:
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway generará `DATABASE_URL` automáticamente

**Recomendado**: Usar Supabase PostgreSQL por consistencia

### Configurar Variables de Entorno

1. En tu servicio de backend, ir a "Variables"
2. Agregar estas variables:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=tu-service-role-key-de-supabase
SUPABASE_JWT_SECRET=tu-jwt-secret-de-supabase
SECRET_KEY=genera-una-key-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://pura-pata.fast-blocks.xyz,http://localhost:3000
ENVIRONMENT=production
PORT=8000
```

**Generar SECRET_KEY segura:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Obtener URL del Backend

1. Después del deploy, Railway te dará una URL como:
   `https://pura-pata-backend.railway.app`
2. Copiar esta URL (la necesitarás para el frontend)

### Verificar Deployment

1. Visitar: `https://tu-app.railway.app/health`
2. Deberías ver: `{"status": "healthy"}`
3. Visitar: `https://tu-app.railway.app/docs`
4. Deberías ver la documentación de FastAPI

## 3️⃣ Deploy Frontend en Vercel

### Crear Proyecto

1. Ir a [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Importar tu repositorio de GitHub
4. En "Root Directory" poner: `frontend`
5. Framework Preset: Next.js (auto-detectado)

### Configurar Variables de Entorno

En "Environment Variables" agregar:

```env
NEXT_PUBLIC_API_URL=https://tu-app.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
NEXT_PUBLIC_GOOGLE_MAPS_KEY=tu-google-maps-key (opcional)
```

### Deploy

1. Click "Deploy"
2. Esperar 2-3 minutos
3. Vercel te dará una URL como: `https://pura-pata-xxx.vercel.app`

### Verificar Deployment

1. Visitar la URL de Vercel
2. La página debe cargar correctamente
3. Probar login/registro

## 4️⃣ Configurar Dominio en Cloudflare

### Agregar Dominio a Vercel

1. En Vercel, ir a tu proyecto → "Settings" → "Domains"
2. Agregar: `pura-pata.fast-blocks.xyz`
3. Vercel te dará un registro CNAME

### Configurar DNS en Cloudflare

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Seleccionar tu dominio `fast-blocks.xyz`
3. Ir a **DNS > Records**
4. Agregar registro:
   ```
   Type: CNAME
   Name: pura-pata
   Target: cname.vercel-dns.com
   Proxy status: Proxied (naranja)
   TTL: Auto
   ```
5. Click "Save"

### Configurar SSL

1. En Cloudflare → **SSL/TLS**
2. Encryption mode: **Full (strict)**
3. Edge Certificates: Activar "Always Use HTTPS"
4. Activar "Automatic HTTPS Rewrites"

### Actualizar CORS en Backend

1. En Railway, agregar tu dominio a `ALLOWED_ORIGINS`:
   ```env
   ALLOWED_ORIGINS=https://pura-pata.fast-blocks.xyz,http://localhost:3000
   ```
2. Railway re-deployará automáticamente

## 5️⃣ Verificación Final

### Checklist de Pruebas

- [ ] Visitar `https://pura-pata.fast-blocks.xyz`
- [ ] Página carga sin errores de CORS
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Publicar perro funciona
- [ ] Upload de fotos funciona
- [ ] Mapa se muestra correctamente
- [ ] Búsqueda y filtros funcionan
- [ ] Vista de detalle funciona
- [ ] Botón WhatsApp funciona
- [ ] "Mis Perros" funciona
- [ ] Editar perro funciona
- [ ] Cambiar estado funciona
- [ ] Eliminar perro funciona

### Solución de Problemas Comunes

**Error CORS:**
- Verificar `ALLOWED_ORIGINS` en Railway
- Debe incluir tu dominio HTTPS

**Error 401 en API:**
- Verificar que `SUPABASE_JWT_SECRET` esté correcto
- Verificar que usuario esté logueado

**Imágenes no cargan:**
- Verificar que bucket `dog-photos` sea público
- Verificar URLs en Supabase Storage

**Error de base de datos:**
- Verificar `DATABASE_URL` en Railway
- Verificar que tablas existan en Supabase

## 6️⃣ Configuración Adicional

### Google Maps (Opcional)

1. Ir a [Google Cloud Console](https://console.cloud.google.com)
2. Crear proyecto
3. Habilitar "Maps JavaScript API"
4. Crear credencial (API Key)
5. Restringir por dominio: `pura-pata.fast-blocks.xyz`
6. Agregar a Vercel: `NEXT_PUBLIC_GOOGLE_MAPS_KEY`

### Supabase Auth Email Templates

1. En Supabase → **Authentication > Email Templates**
2. Personalizar:
   - Confirm signup
   - Magic Link
   - Reset Password

### Monitoring

**Vercel:**
- Analytics: Habilitado automáticamente
- Logs: En dashboard de Vercel

**Railway:**
- Logs: En dashboard de Railway
- Metrics: CPU, Memory, Network

**Supabase:**
- Database: Monitoring de queries
- Auth: Logs de autenticación

## 7️⃣ Backup y Mantenimiento

### Backups de Base de Datos

Supabase hace backups automáticos, pero puedes hacer manuales:
```bash
# Exportar
pg_dump [DATABASE_URL] > backup.sql

# Importar
psql [DATABASE_URL] < backup.sql
```

### Actualizar Deployment

**Frontend:**
```bash
git push origin main
# Vercel auto-deploys
```

**Backend:**
```bash
git push origin main
# Railway auto-deploys
```

## 📞 Soporte

Si tienes problemas:
1. Revisar logs en Vercel/Railway
2. Verificar variables de entorno
3. Consultar documentación de cada servicio

---

## 🎉 ¡Listo!

Tu plataforma Pura Pata está ahora en producción en:
**https://pura-pata.fast-blocks.xyz**

¡A encontrar hogares para perritos! 🐕❤️
