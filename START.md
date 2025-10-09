# 🚀 Inicio Rápido - Pura Pata

## Opción 1: Docker (Recomendado - Más fácil) 🐳

### Prerrequisitos
- Docker y Docker Compose instalados

### Pasos

```bash
# 1. Levantar todos los servicios
docker-compose up -d

# 2. Ver logs (opcional)
docker-compose logs -f

# 3. Esperar 30 segundos y abrir:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs

# 4. Detener servicios
docker-compose down
```

**¡Listo!** La app está corriendo con:
- Frontend en puerto 3000
- Backend en puerto 8000
- PostgreSQL en puerto 5432
- 3 perros de demo pre-cargados

---

## Opción 2: Local (Sin Docker) 💻

### Prerrequisitos
- Node.js 18+
- Python 3.12+
- PostgreSQL 15+

### 1. Base de Datos

```bash
# Crear base de datos
psql -U postgres
CREATE DATABASE pura_pata;
\q

# Ejecutar schema
psql -U postgres -d pura_pata -f init.sql
```

### 2. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# El archivo .env ya está creado con valores demo

# Iniciar servidor
uvicorn app.main:app --reload
```

✅ Backend: http://localhost:8000

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# El archivo .env.local ya está creado con valores demo

# Iniciar desarrollo
npm run dev
```

✅ Frontend: http://localhost:3000

---

## 🧪 Probar la Aplicación

### Login Demo
- Email: `demo@purapata.com`
- Password: `cualquier cosa` (auth local deshabilitada en demo)

### Ver Perros Demo
1. Ir a http://localhost:3000
2. Ver 3 perros pre-cargados en el mapa
3. Click en un perro para ver detalles

### Endpoints API
```bash
# Health check
curl http://localhost:8000/health

# Listar perros
curl http://localhost:8000/api/v1/dogs

# Ver docs
# http://localhost:8000/docs
```

---

## 🔧 Problemas Comunes

### Puerto en uso
```bash
# Matar proceso en puerto
sudo lsof -ti:3000 | xargs kill
sudo lsof -ti:8000 | xargs kill
```

### Docker no levanta
```bash
# Limpiar y reiniciar
docker-compose down -v
docker-compose up --build
```

### Frontend no conecta al backend
- Verificar que backend esté en http://localhost:8000
- Verificar .env.local tiene `NEXT_PUBLIC_API_URL=http://localhost:8000`

---

## 📝 Archivos de Configuración Creados

✅ `frontend/.env.local` - Variables del frontend (ya creado)
✅ `backend/.env` - Variables del backend (ya creado)
✅ `docker-compose.yml` - Config de Docker (ya creado)
✅ `init.sql` - Schema de DB con datos demo (ya creado)

**No necesitas configurar nada más para desarrollo local!**

---

## 🚀 Para Producción

Cuando quieras deployar a producción con Supabase real:

1. Crear proyecto en [Supabase](https://supabase.com)
2. Reemplazar valores en `.env` y `.env.local`:
   - `SUPABASE_URL`
   - `SUPABASE_KEY` / `SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET`
   - `DATABASE_URL`
3. Seguir [DEPLOYMENT.md](DEPLOYMENT.md)

---

## ✨ Valores Demo Incluidos

Los archivos `.env` ya tienen valores demo que funcionan **sin necesidad de Supabase**:

- ✅ Base de datos local (PostgreSQL en Docker o local)
- ✅ Auth deshabilitada (cualquier password funciona en dev)
- ✅ 3 perros de demostración pre-cargados
- ✅ Usuario demo: demo@purapata.com

**Para desarrollo local, todo ya está configurado! 🎉**
