# 🐕 Pura Pata - Plataforma de Adopción de Perros

Plataforma web para conectar perros en adopción con familias en Costa Rica.

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React Leaflet
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Auth/Storage**: Supabase

### Backend
- **Framework**: FastAPI (Python 3.12)
- **Database**: PostgreSQL (Supabase)
- **ORM**: SQLAlchemy
- **Auth**: Supabase Auth + JWT
- **Storage**: Supabase Storage

### Deployment
- **Frontend**: Vercel
- **Backend**: Railway
- **DNS**: Cloudflare
- **Domain**: pura-pata.fast-blocks.xyz

## 📁 Estructura del Proyecto

```
pura-pata-3.0/
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities, API client, Supabase
│   │   └── types/           # TypeScript types
│   ├── package.json
│   └── next.config.mjs
│
└── backend/                 # FastAPI Application
    ├── app/
    │   ├── api/v1/          # API endpoints
    │   ├── core/            # Config, DB, Security
    │   ├── models/          # SQLAlchemy models
    │   └── schemas/         # Pydantic schemas
    ├── requirements.txt
    └── Dockerfile
```

## 🛠️ Setup Local

### Prerequisitos
- Node.js 18+
- Python 3.12+
- PostgreSQL (o cuenta de Supabase)

### 1. Configurar Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Ejecutar las migraciones SQL (ver sección Database Schema)
3. Crear bucket `dog-photos` en Storage (público)
4. Copiar las credenciales

### 2. Frontend Setup

```bash
cd frontend
npm install

# Crear archivo .env.local
cp .env.example .env.local

# Editar .env.local con tus credenciales:
# NEXT_PUBLIC_API_URL=http://localhost:8000
# NEXT_PUBLIC_SUPABASE_URL=tu-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key
# NEXT_PUBLIC_GOOGLE_MAPS_KEY=tu-key (opcional)

# Iniciar desarrollo
npm run dev
```

Frontend disponible en: http://localhost:3000

### 3. Backend Setup

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
cp .env.example .env

# Editar .env con tus credenciales:
# DATABASE_URL=postgresql://user:pass@localhost:5432/pura_pata
# SUPABASE_URL=tu-url
# SUPABASE_KEY=tu-service-key
# SUPABASE_JWT_SECRET=tu-jwt-secret
# SECRET_KEY=genera-una-key-segura
# ALLOWED_ORIGINS=http://localhost:3000

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

Backend disponible en: http://localhost:8000
Documentación API: http://localhost:8000/docs

## 📊 Database Schema

Ejecutar en Supabase SQL Editor:

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

## 🚀 Deployment

### Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_API_URL (Railway backend URL)
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - NEXT_PUBLIC_GOOGLE_MAPS_KEY
```

### Backend (Railway)

1. Crear proyecto en [Railway](https://railway.app)
2. Conectar repositorio de GitHub
3. Configurar variables de entorno:
   - `DATABASE_URL` (de Railway PostgreSQL)
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_JWT_SECRET`
   - `SECRET_KEY`
   - `ALLOWED_ORIGINS` (URL de Vercel)
4. Railway detectará el Dockerfile automáticamente

### DNS (Cloudflare)

1. En Cloudflare, agregar registros DNS:
   ```
   CNAME  pura-pata  tu-app.vercel.app
   ```
2. En Vercel, agregar dominio custom: `pura-pata.fast-blocks.xyz`

## 📱 Funcionalidades

### MVP Implementado

✅ **Autenticación**
- Registro con email/contraseña
- Login/Logout
- Recuperación de contraseña
- Perfil de usuario

✅ **Publicación de Perros**
- Formulario completo con validaciones
- Upload de hasta 5 fotos
- Selección de ubicación en mapa
- Editar/eliminar publicaciones

✅ **Búsqueda y Filtros**
- Vista de mapa con markers
- Vista de lista con cards
- Filtros: tamaño, género, provincia, vacunado, castrado
- Búsqueda por ubicación

✅ **Vista de Detalle**
- Galería de fotos
- Información completa
- Mapa de ubicación
- Botón WhatsApp
- Compartir publicación

✅ **Gestión de Publicaciones**
- Vista "Mis Perros"
- Cambio de estados
- Historial de estados
- Confirmación de adopción

## 🔑 Variables de Entorno

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaXXX (opcional)
```

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx... (service_role key)
SUPABASE_JWT_SECRET=xxx (JWT Secret de Supabase)
SECRET_KEY=tu-secret-key-muy-segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://pura-pata.fast-blocks.xyz,http://localhost:3000
ENVIRONMENT=production
```

## 📖 API Endpoints

### Users
- `POST /api/v1/users` - Crear usuario
- `GET /api/v1/users/me` - Obtener perfil actual
- `PUT /api/v1/users/me` - Actualizar perfil
- `GET /api/v1/users/{id}` - Obtener usuario por ID

### Dogs
- `GET /api/v1/dogs` - Listar perros (con filtros)
- `GET /api/v1/dogs/me` - Mis perros
- `GET /api/v1/dogs/nearby` - Perros cercanos
- `GET /api/v1/dogs/{id}` - Detalle de perro
- `POST /api/v1/dogs` - Crear publicación
- `PUT /api/v1/dogs/{id}` - Actualizar publicación
- `PATCH /api/v1/dogs/{id}/status` - Cambiar estado
- `DELETE /api/v1/dogs/{id}` - Eliminar publicación
- `GET /api/v1/dogs/{id}/history` - Historial de estados

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint
npm run build

# Backend
cd backend
pytest  # (cuando se agreguen tests)
```

## 📝 Próximas Mejoras

- [ ] Integración con AI para detectar raza
- [ ] Sistema de favoritos
- [ ] Notificaciones por email
- [ ] Chat interno
- [ ] Sistema de reportes
- [ ] Panel de administración
- [ ] Analytics

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE

---

Hecho con ❤️ para los perritos de Costa Rica 🇨🇷
