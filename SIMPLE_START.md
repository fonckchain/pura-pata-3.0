# 🚀 Iniciar Pura Pata - 3 Pasos Simples

## ✅ Lo que ya está hecho:
- ✅ Dependencias instaladas (frontend y backend)
- ✅ Variables de entorno configuradas (.env ya creados)
- ✅ Todo listo para correr

---

## 📋 PASO 1: Base de Datos

### Opción A: Docker (Más fácil)
```bash
docker run --name pura-pata-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=pura_pata \
  -p 5432:5432 \
  -d postgres:15

# Esperar 5 segundos
sleep 5

# Crear tablas
PGPASSWORD=postgres psql -h localhost -U postgres -d pura_pata -f init.sql
```

### Opción B: PostgreSQL Local
```bash
# Si ya tienes PostgreSQL instalado:
createdb pura_pata
psql -d pura_pata -f init.sql
```

---

## 📋 PASO 2: Iniciar Backend

Abrir una terminal:

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

✅ Backend corriendo en: **http://localhost:8000**
✅ API Docs: **http://localhost:8000/docs**

---

## 📋 PASO 3: Iniciar Frontend

Abrir OTRA terminal (dejar el backend corriendo):

```bash
cd frontend
npm run dev
```

✅ Frontend corriendo en: **http://localhost:3000**

---

## 🎉 ¡Listo!

Abrir en el navegador: **http://localhost:3000**

### Datos de prueba pre-cargados:
- ✅ Usuario demo: demo@purapata.com
- ✅ 3 perros de ejemplo en Costa Rica
- ✅ Mapa funcionando

---

## 🛑 Para Detener

En cada terminal: `Ctrl + C`

Para detener PostgreSQL (Docker):
```bash
docker stop pura-pata-db
```

---

## 🔍 Verificar que Todo Funciona

```bash
# Backend health
curl http://localhost:8000/health
# Debe responder: {"status":"healthy"}

# Listar perros
curl http://localhost:8000/api/v1/dogs
# Debe mostrar 3 perros de demo

# Frontend
# Abrir http://localhost:3000 en el navegador
```

---

## 🐛 Solución de Problemas

### "Puerto 8000 en uso"
```bash
sudo lsof -ti:8000 | xargs kill
```

### "Puerto 3000 en uso"
```bash
sudo lsof -ti:3000 | xargs kill
```

### "No puedo conectar a PostgreSQL"
```bash
# Verificar que está corriendo
docker ps | grep pura-pata-db

# O si es local:
pg_isready -h localhost
```

### "Frontend no carga"
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### "Backend error de base de datos"
Verificar que:
1. PostgreSQL está corriendo (puerto 5432)
2. Base de datos `pura_pata` existe
3. Tablas fueron creadas (ejecutar init.sql)

---

## 📱 URLs Importantes

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| API Health | http://localhost:8000/health |

---

## 🎯 Próximos Pasos

Una vez que todo funciona localmente:

1. Probar crear un perro
2. Probar filtros y búsqueda
3. Ver el mapa interactivo
4. Para producción: Ver [DEPLOYMENT.md](DEPLOYMENT.md)

---

**¿Preguntas?** Ver [START.md](START.md) para más opciones
