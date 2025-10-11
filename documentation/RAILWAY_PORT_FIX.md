# 🔧 Fix: Railway PORT Variable Issue

## ❌ Problema

Railway mostraba este error:
```
Error: Invalid value for '--port': '$PORT' is not a valid integer.
```

## ✅ Solución

El problema era que uvicorn no expande variables de entorno directamente. Necesita un script bash.

### Cambios Realizados:

1. **Actualizado `start.sh`** para usar la variable PORT correctamente:
   ```bash
   exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
   ```

2. **Actualizado `Procfile`**:
   ```
   web: bash start.sh
   ```

3. **Actualizado `railway.json`**:
   ```json
   {
     "deploy": {
       "startCommand": "bash start.sh"
     }
   }
   ```

4. **Actualizado `Dockerfile`**:
   ```dockerfile
   CMD ["bash", "start.sh"]
   ```

## 🚀 Deployar el Fix

```bash
git add .
git commit -m "fix: Railway PORT variable expansion"
git push origin main
```

Railway auto-deployará con el fix.

## ✅ Verificar

Después del deploy, el error debe desaparecer y en los logs deberías ver:
```
Starting Pura Pata Backend on port XXXX...
Application startup complete.
```

## 📝 Nota sobre la Variable PORT

- Railway automáticamente establece la variable `PORT`
- No necesitas configurarla manualmente en las variables de entorno
- El script `start.sh` usa `${PORT:-8000}` (default 8000 si no existe)

---

**✅ Fix aplicado y listo para deploy!**
