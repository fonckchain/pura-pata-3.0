# Guía para Eliminar Usuarios en Supabase

## Problema

Cuando eliminas un usuario de la tabla `public.users` en Supabase, el correo electrónico sigue apareciendo como "en uso" porque el usuario todavía existe en la tabla interna `auth.users` de Supabase Auth.

## Estructura de Usuarios en Supabase

Supabase mantiene dos tablas de usuarios:

1. **`auth.users`** - Tabla de autenticación (sistema interno de Supabase Auth)
   - Contiene credenciales, email, password hash, metadata
   - Es la fuente de verdad para la autenticación
   - Solo accesible con permisos de `service_role`

2. **`public.users`** - Tabla de perfiles de usuario (tu tabla personalizada)
   - Contiene información adicional del perfil (nombre, teléfono, ubicación)
   - Es la que ves en el Table Editor de Supabase

## Solución Inmediata: Eliminar Usuario Específico

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication → Users**
3. Busca el usuario por email (ej: `ops@fast-blocks.xyz`)
4. Haz clic en el menú de tres puntos (⋮) junto al usuario
5. Selecciona **"Delete user"**
6. Confirma la eliminación

Esto eliminará el usuario de `auth.users` y, si tienes los triggers configurados, también de `public.users`.

### Opción 2: Usando SQL Editor

1. Ve a **SQL Editor** en Supabase Dashboard
2. Ejecuta el script en `backend/migrations/delete_specific_user.sql`:

```sql
-- Verifica que el usuario existe
SELECT id, email, created_at
FROM auth.users
WHERE email = 'ops@fast-blocks.xyz';

-- Elimina el usuario
DELETE FROM auth.users WHERE email = 'ops@fast-blocks.xyz';

-- Verifica que se eliminó de ambas tablas
SELECT id, email FROM auth.users WHERE email = 'ops@fast-blocks.xyz';
SELECT id, email FROM public.users WHERE email = 'ops@fast-blocks.xyz';
```

## Solución a Largo Plazo: Sincronización Automática

Para evitar este problema en el futuro, ejecuta la migración `backend/migrations/sync_auth_and_public_users.sql` en el SQL Editor de Supabase.

### ¿Qué hace esta migración?

1. **Trigger de eliminación**: Cuando eliminas un usuario de `auth.users`, automáticamente se elimina de `public.users`
2. **Foreign key constraint**: Asegura que `public.users.id` siempre referencia a un usuario válido en `auth.users`
3. **Trigger de creación**: Cuando un usuario se registra (se crea en `auth.users`), automáticamente se crea su perfil en `public.users`
4. **Integridad de datos**: Previene usuarios huérfanos en cualquiera de las dos tablas

### Cómo ejecutar la migración

1. Ve a **SQL Editor** en Supabase Dashboard
2. Copia y pega el contenido completo de `backend/migrations/sync_auth_and_public_users.sql`
3. Haz clic en **Run**
4. Verifica que no haya errores

### Después de la migración

- **Para eliminar un usuario**: Siempre elimínalo desde **Authentication → Users** en el dashboard, o desde `auth.users` en SQL
- **NO elimines directamente** de `public.users` (la foreign key constraint lo impedirá)
- Los nuevos registros se sincronizarán automáticamente

## Verificación

Para verificar que la sincronización funciona:

```sql
-- Cuenta usuarios en auth.users
SELECT COUNT(*) as auth_users FROM auth.users;

-- Cuenta usuarios en public.users
SELECT COUNT(*) as public_users FROM public.users;

-- Ambos números deberían ser iguales

-- Ver usuarios que están en auth pero no en public (no debería haber ninguno)
SELECT au.id, au.email
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
```

## Resumen

- **Problema**: Eliminar de `public.users` no elimina de `auth.users`
- **Solución rápida**: Eliminar desde Authentication → Users en dashboard
- **Solución permanente**: Ejecutar migración de sincronización
- **Mejor práctica**: Siempre eliminar usuarios desde `auth.users` (dashboard o API de Auth)
