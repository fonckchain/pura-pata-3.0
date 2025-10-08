# 🚀 Quick Start - Pura Pata

Guía rápida para levantar el proyecto en desarrollo local.

## ⚡ Setup Rápido (5 minutos)

### 1. Clonar y Setup Supabase

```bash
# Clonar repo
git clone <tu-repo>
cd pura-pata-3.0
```

**Crear proyecto Supabase:**
1. Ir a [supabase.com](https://supabase.com) → New Project
2. SQL Editor → Ejecutar el SQL del archivo `database-schema.sql` (abajo)
3. Storage → Crear bucket `dog-photos` (público)
4. Settings → API → Copiar credenciales

### 2. Frontend

```bash
cd frontend
npm install

# Crear .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
EOF

# Iniciar
npm run dev
```

✅ Frontend: http://localhost:3000

### 3. Backend

```bash
cd backend

# Crear venv
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar
pip install -r requirements.txt

# Crear .env
cat > .env << EOF
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=tu-service-role-key
SUPABASE_JWT_SECRET=tu-jwt-secret
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
EOF

# Iniciar
uvicorn app.main:app --reload --port 8000
```

✅ Backend: http://localhost:8000
✅ API Docs: http://localhost:8000/docs

## 📊 Database Schema

Ejecutar en Supabase SQL Editor:

```sql
-- Enable UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dogs
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

-- Status History
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

## ✅ Verificar

1. Abrir http://localhost:3000
2. Registrar usuario
3. Login
4. Publicar un perro de prueba
5. Ver en mapa
6. Ver detalle

## 🛠️ Comandos Útiles

```bash
# Frontend
npm run dev          # Desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # Linter

# Backend
uvicorn app.main:app --reload           # Desarrollo
uvicorn app.main:app --port 8000        # Producción
python -m pytest                        # Tests
```

## 📝 Próximos Pasos

1. Leer [README.md](README.md) para arquitectura completa
2. Ver [DEPLOYMENT.md](DEPLOYMENT.md) para deployment
3. Explorar código en `frontend/src` y `backend/app`

## 🐛 Problemas Comunes

**Puerto en uso:**
```bash
# Frontend
npx kill-port 3000

# Backend
npx kill-port 8000
```

**Error de base de datos:**
- Verificar que tablas existan en Supabase
- Verificar DATABASE_URL

**Error CORS:**
- Verificar que backend esté corriendo
- Verificar ALLOWED_ORIGINS en backend

**Fotos no suben:**
- Verificar que bucket `dog-photos` exista
- Verificar que sea público

---

¡Listo para desarrollar! 🐕✨
