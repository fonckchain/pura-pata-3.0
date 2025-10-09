# 🚂 Railway Deploy - Configuración Rápida

## ✅ Ya está todo listo en el código

Los archivos necesarios ya están creados:
- ✅ `backend/Procfile`
- ✅ `backend/runtime.txt`
- ✅ `backend/requirements.txt`
- ✅ `backend/Dockerfile`
- ✅ `backend/railway.json`

---

## 📋 PASO 1: Configuración en Railway

### 1. Crear Servicio Backend

1. Ir a https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. Seleccionar: `pura-pata-3.0`
4. Railway detectará Python automáticamente

### 2. Configurar Root Directory

**Si tienes frontend también en el repo:**

- Settings → **Root Directory** → `backend`

**Si solo es backend:**
- Dejar como está (`/`)

---

## 📋 PASO 2: Variables de Entorno

En Railway → **Variables** → Agregar:

```bash
# Database (Railway PostgreSQL - ver paso 3)
DATABASE_URL=postgresql://postgres:pass@host:port/railway

# Supabase (de tu proyecto en supabase.com)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx... (service_role key)
SUPABASE_JWT_SECRET=tu-jwt-secret

# Security (generar nueva)
SECRET_KEY=tu-secret-key-aqui-32-chars-min
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (tu dominio Vercel)
ALLOWED_ORIGINS=https://pura-pata.vercel.app,http://localhost:3000

# Environment
ENVIRONMENT=production
```

### Generar SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 📋 PASO 3: PostgreSQL

### Opción A: Railway PostgreSQL (Más Fácil)

1. En tu proyecto → **New** → **Database** → **PostgreSQL**
2. Railway crea `DATABASE_URL` automáticamente
3. Ejecutar schema desde local:
   ```bash
   # Copiar DATABASE_URL de Railway
   export DB_URL="postgresql://..."
   PGPASSWORD=xxx psql "$DB_URL" -f init.sql
   ```

### Opción B: Supabase PostgreSQL

Usar el `DATABASE_URL` de Supabase (las tablas ya existen si seguiste QUICKSTART.md)

---

## 📋 PASO 4: Deploy

### Método 1: Push a GitHub (Automático)

```bash
git push origin main
```

Railway detecta el push y hace deploy automático.

### Método 2: Manual en Railway

1. Railway → **Deployments** → **Deploy Now**

---

## 🧪 Verificar que Funciona

```bash
# Copiar URL de Railway (ej: pura-pata-production.up.railway.app)

# Test health
curl https://tu-app.up.railway.app/health

# Debe responder:
{"status":"healthy"}

# Ver docs
https://tu-app.up.railway.app/docs
```

---

## ⚙️ Configuración Railway Settings

Si no auto-detecta, configura manualmente:

**Settings → Build:**
- Builder: `NIXPACKS` (auto-detecta Python)
- Build Command: (dejar vacío, usa Procfile)
- Root Directory: `backend` (si tienes frontend también)

**Settings → Deploy:**
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Custom Health Check: `/health`

---

## 🐛 Solución de Problemas

### "Could not determine how to build"

**Solución**: En Settings:
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### "Module 'app' not found"

**Verificar Root Directory**:
- Si el repo tiene `frontend/` y `backend/`, poner `backend` en Root Directory

### Errores de Database

1. Verificar `DATABASE_URL` en Variables
2. Ejecutar `init.sql` en la DB
3. Ver logs: Deployments → View Logs

---

## 🔗 Conectar con Vercel (Frontend)

1. Copiar URL de Railway: `https://xxx.up.railway.app`
2. En Vercel → Settings → Environment Variables
3. Agregar:
   ```
   NEXT_PUBLIC_API_URL=https://xxx.up.railway.app
   ```
4. Redeploy en Vercel

---

## ✅ Checklist Final

- [ ] Proyecto creado en Railway
- [ ] Root Directory = `backend` (si es necesario)
- [ ] Variables de entorno configuradas
- [ ] PostgreSQL agregado y schema ejecutado
- [ ] Deploy exitoso (check logs)
- [ ] Health endpoint funciona
- [ ] API docs accesible
- [ ] Frontend conectado (Vercel)

---

## 📖 Documentación Completa

Para más detalles ver: [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)

---

**🚂 ¡Tu backend estará en Railway en 5 minutos!**
