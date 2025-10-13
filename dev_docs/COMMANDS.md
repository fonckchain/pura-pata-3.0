# 🛠️ Comandos Útiles - Pura Pata

## 📦 Instalación

```bash
# Instalación automática (recomendado)
./install.sh

# O manualmente:
cd frontend && npm install && cd ..
cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && cd ..
```

## 🚀 Desarrollo

### Frontend (Next.js)

```bash
cd frontend

# Desarrollo
npm run dev                    # http://localhost:3000

# Build
npm run build                  # Crear build de producción
npm run start                  # Servidor de producción

# Linting
npm run lint                   # Ejecutar ESLint
npm run lint --fix             # Fix automático

# Otros
npm install [package]          # Instalar nueva dependencia
npm update                     # Actualizar dependencias
```

### Backend (FastAPI)

```bash
cd backend

# Activar entorno virtual
source venv/bin/activate       # Linux/Mac
venv\Scripts\activate          # Windows

# Desarrollo
uvicorn app.main:app --reload                    # http://localhost:8000
uvicorn app.main:app --reload --port 8001        # Puerto custom
uvicorn app.main:app --reload --host 0.0.0.0     # Accesible externamente

# Producción
uvicorn app.main:app --host 0.0.0.0 --port 8000

# Ver docs
# http://localhost:8000/docs     (Swagger UI)
# http://localhost:8000/redoc    (ReDoc)

# Dependencias
pip install [package]          # Instalar paquete
pip freeze > requirements.txt  # Actualizar requirements
pip install -r requirements.txt # Instalar todas
```

## 🗄️ Base de Datos

### Supabase SQL

```sql
-- Conectar a Supabase SQL Editor y ejecutar:

-- Ver todas las tablas
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Ver usuarios
SELECT * FROM users;

-- Ver perros
SELECT * FROM dogs WHERE status = 'disponible';

-- Ver historial de estados
SELECT * FROM dog_status_history ORDER BY changed_at DESC;

-- Limpiar datos (¡CUIDADO EN PRODUCCIÓN!)
TRUNCATE TABLE dog_status_history CASCADE;
TRUNCATE TABLE dogs CASCADE;
TRUNCATE TABLE users CASCADE;

-- Resetear base de datos
DROP TABLE IF EXISTS dog_status_history CASCADE;
DROP TABLE IF EXISTS dogs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
-- Luego ejecutar el schema completo de nuevo
```

### Backup

```bash
# Exportar
pg_dump "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" > backup.sql

# Importar
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" < backup.sql
```

## 🔧 Git

```bash
# Primer commit
git add .
git commit -m "Initial commit - Pura Pata MVP"
git branch -M main
git remote add origin [tu-repo-url]
git push -u origin main

# Workflow normal
git add .
git commit -m "feat: descripción del cambio"
git push

# Branches
git checkout -b feature/nueva-funcionalidad
git checkout main
git merge feature/nueva-funcionalidad

# Ver cambios
git status
git diff
git log --oneline
```

## 🚀 Deployment

### Vercel (Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel                         # Deploy a preview
vercel --prod                  # Deploy a producción

# Logs
vercel logs [deployment-url]

# Variables de entorno
vercel env add NEXT_PUBLIC_API_URL
vercel env ls
```

### Railway (Backend)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Deploy
railway up

# Logs
railway logs

# Variables
railway variables set DATABASE_URL=...
railway variables
```

## 🧪 Testing (Future)

```bash
# Frontend
npm run test                   # Jest
npm run test:e2e              # Playwright/Cypress

# Backend
pytest                         # Todos los tests
pytest tests/test_dogs.py     # Test específico
pytest -v                      # Verbose
pytest --cov                   # Coverage
```

## 🔍 Debug

### Frontend

```bash
# Ver logs del build
npm run build 2>&1 | tee build.log

# Limpiar cache
rm -rf .next
npm run build

# Verificar variables de entorno
echo $NEXT_PUBLIC_API_URL
```

### Backend

```bash
# Logs detallados
uvicorn app.main:app --reload --log-level debug

# Python shell interactivo
python
>>> from app.core.database import SessionLocal
>>> db = SessionLocal()
>>> from app.models.dog import Dog
>>> dogs = db.query(Dog).all()
>>> print(len(dogs))

# Verificar variables
python -c "from app.core.config import settings; print(settings.DATABASE_URL)"
```

## 🛠️ Utilidades

### Generar SECRET_KEY

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL
openssl rand -hex 32
```

### Matar procesos en puertos

```bash
# Linux/Mac
lsof -ti:3000 | xargs kill
lsof -ti:8000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

### Verificar servicios

```bash
# Frontend corriendo
curl http://localhost:3000

# Backend corriendo
curl http://localhost:8000/health

# API disponible
curl http://localhost:8000/api/v1/dogs
```

## 📊 Monitoreo

### Logs en producción

```bash
# Vercel
vercel logs --follow

# Railway
railway logs --follow

# Supabase
# Ver en dashboard: Settings > API > Logs
```

### Health checks

```bash
# Backend health
curl https://tu-backend.railway.app/health

# Frontend
curl https://pura-pata.fast-blocks.xyz

# Database
psql "postgresql://..." -c "SELECT 1"
```

## 🔄 Actualizar dependencias

### Frontend

```bash
cd frontend

# Ver outdated
npm outdated

# Update interactivo
npx npm-check-updates -u
npm install

# Update específico
npm update next
```

### Backend

```bash
cd backend
source venv/bin/activate

# Ver outdated
pip list --outdated

# Update específico
pip install --upgrade fastapi

# Update all
pip install --upgrade -r requirements.txt
```

## 🧹 Limpieza

```bash
# Frontend
cd frontend
rm -rf node_modules .next
npm install

# Backend
cd backend
rm -rf venv __pycache__ **/__pycache__
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Git
git clean -fdx                 # ¡CUIDADO! Elimina todo lo no trackeado
```

## 📱 Mobile Development (Future)

```bash
# React Native setup
npx react-native init PuraPataMobile
cd PuraPataMobile

# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

## 🎨 UI/UX

```bash
# Tailwind
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch

# Generar componentes
# Usar shadcn/ui
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
```

## 🔐 Seguridad

```bash
# Audit de dependencias
npm audit                      # Frontend
pip-audit                      # Backend

# Fix vulnerabilidades
npm audit fix
npm audit fix --force          # Si es necesario
```

---

## 📝 Aliases útiles (agregar a ~/.bashrc o ~/.zshrc)

```bash
# Pura Pata
alias pp-dev='cd ~/pura-pata-3.0'
alias pp-front='cd ~/pura-pata-3.0/frontend && npm run dev'
alias pp-back='cd ~/pura-pata-3.0/backend && source venv/bin/activate && uvicorn app.main:app --reload'
alias pp-logs='tail -f ~/pura-pata-3.0/backend/app.log'
```

---

**Tip:** Guarda este archivo para referencia rápida! 🚀
