# 🚂 Deploy Backend a Railway - Guía Paso a Paso

## ✅ Archivos ya Creados para Railway

- ✅ `backend/Procfile` - Comando de inicio
- ✅ `backend/runtime.txt` - Versión de Python
- ✅ `backend/requirements.txt` - Dependencias Python
- ✅ `backend/railway.json` - Configuración Railway
- ✅ `backend/Dockerfile` - Alternativa Docker

---

## 📋 Paso 1: Preparar el Proyecto

### Opción A: Desde el Root (Recomendado)

1. **Ir a Railway Dashboard**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Seleccionar tu repositorio**: `pura-pata-3.0`
4. **Root Directory**: Dejar `/` (Railway detectará el backend)

### Opción B: Solo Backend

Si solo quieres deployar el backend:

1. **New Project** → **Deploy from GitHub repo**
2. **Seleccionar repositorio**
3. **Settings** → **Root Directory** → Cambiar a `backend`

---

## 📋 Paso 2: Configurar Variables de Entorno

En Railway → **Variables** → Agregar estas:

### Variables Obligatorias:

```bash
# Database (usar PostgreSQL de Railway)
DATABASE_URL=postgresql://postgres:password@host:port/railway

# Supabase (obtener de supabase.com)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJxxx... (service_role key)
SUPABASE_JWT_SECRET=xxx (de Supabase settings)

# API Security
SECRET_KEY=genera-una-nueva-clave-segura-aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (tu dominio de frontend)
ALLOWED_ORIGINS=https://pura-pata.vercel.app,http://localhost:3000

# Environment
ENVIRONMENT=production
```

### Generar SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## 📋 Paso 3: Agregar PostgreSQL

### Opción A: PostgreSQL de Railway (Recomendado)

1. En tu proyecto de Railway → **New** → **Database** → **Add PostgreSQL**
2. Railway automáticamente creará la variable `DATABASE_URL`
3. Conectar a la DB y ejecutar schema:

```bash
# Copiar DATABASE_URL de Railway
# Ejecutar desde local:
PGPASSWORD=xxx psql "postgresql://postgres:xxx@xxx.railway.app:5432/railway" -f init.sql
```

### Opción B: Usar Supabase PostgreSQL

Usar el `DATABASE_URL` de Supabase (ya tienes las tablas)

---

## 📋 Paso 4: Deploy

### Método 1: Push a GitHub (Automático)

```bash
git add .
git commit -m "feat: railway deployment setup"
git push origin main
```

Railway detectará el push y hará deploy automáticamente.

### Método 2: Railway CLI

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Deploy
railway up
```

---

## 🔧 Solución de Problemas

### Error: "Could not determine how to build"

**Solución 1**: Verificar que `requirements.txt` esté en la raíz del proyecto o en backend/

**Solución 2**: En Railway Settings:
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

**Solución 3**: Cambiar a Dockerfile
En `railway.json`:
```json
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  }
}
```

### Error: "Module not found"

Verificar que todas las dependencias estén en `requirements.txt`:
```bash
pip freeze > requirements.txt
```

### Error: "Port already in use"

Railway automáticamente asigna el puerto. Usar `$PORT`:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Error de Database

1. Verificar `DATABASE_URL` en variables
2. Verificar que tablas existan (ejecutar `init.sql`)
3. Check logs: Railway → **Deployments** → Ver logs

---

## 📝 Checklist de Deployment

- [ ] Repositorio en GitHub actualizado
- [ ] Variables de entorno configuradas en Railway
- [ ] PostgreSQL agregado (Railway o Supabase)
- [ ] Schema de DB ejecutado (`init.sql`)
- [ ] Build exitoso (ver logs)
- [ ] Deploy exitoso (check health endpoint)
- [ ] CORS configurado con dominio de Vercel

---

## 🧪 Verificar Deploy

```bash
# Copiar URL de Railway (ej: https://pura-pata-backend.up.railway.app)

# Health check
curl https://tu-app.up.railway.app/health

# Debe responder:
# {"status":"healthy"}

# Ver API docs
https://tu-app.up.railway.app/docs
```

---

## 🔗 Conectar con Frontend (Vercel)

1. Copiar URL de Railway: `https://pura-pata-backend.up.railway.app`
2. En Vercel → Settings → Environment Variables
3. Agregar:
   ```
   NEXT_PUBLIC_API_URL=https://pura-pata-backend.up.railway.app
   ```
4. Redeploy frontend en Vercel

---

## 📊 Estructura Final

```
GitHub Repo
├── backend/ (Railway)
│   ├── app/
│   ├── requirements.txt ✅
│   ├── Procfile ✅
│   ├── runtime.txt ✅
│   ├── railway.json ✅
│   └── Dockerfile ✅
│
└── frontend/ (Vercel)
    ├── src/
    └── package.json
```

---

## 🎯 Configuración Railway (Settings)

### Build Settings:
- **Builder**: NIXPACKS (auto-detecta Python)
- **Build Command**: `pip install -r requirements.txt` (si no auto-detecta)
- **Root Directory**: `backend` (si el repo tiene frontend también)

### Deploy Settings:
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Healthcheck Path**: `/health`
- **Restart Policy**: ON_FAILURE

---

## 💡 Tips

1. **Ver logs en tiempo real**: Railway → Deployments → View Logs
2. **Usar Railway PostgreSQL**: Más fácil que Supabase para backend
3. **Variables de entorno**: Usar variables de Railway, no hardcodear
4. **Monitoreo**: Railway muestra uso de CPU, RAM, requests
5. **Custom Domain**: Railway → Settings → Domains → Add Custom Domain

---

## 🔄 CI/CD Automático

Railway hace auto-deploy cuando haces push a GitHub:

```bash
# Hacer cambios
git add .
git commit -m "update: feature X"
git push origin main

# Railway detecta el push y hace deploy automático
```

---

## 🆘 Comandos Útiles

```bash
# Ver logs
railway logs

# Abrir dashboard
railway open

# Ver variables
railway variables

# Ejecutar comando en Railway
railway run python manage.py migrate
```

---

## ✅ Resultado Final

Después de seguir esta guía tendrás:

- ✅ Backend en Railway: `https://xxx.up.railway.app`
- ✅ PostgreSQL funcionando
- ✅ API REST accesible
- ✅ Docs en `/docs`
- ✅ Auto-deploy en cada push

---

**🚂 ¡Tu backend está en Railway!**
