# Configuración de Emails de Recuperación de Contraseña en Supabase

## Problema

Los emails de recuperación de contraseña:
- Vienen en inglés (plantilla por defecto)
- El enlace redirige a la página incorrecta (login de Vercel en lugar de /auth/reset-password)

## Solución

### Paso 1: Configurar la URL de Redirección

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Authentication → URL Configuration**
3. En **Redirect URLs**, agrega estas URLs:
   ```
   http://localhost:3000/auth/reset-password
   https://pura-pata.com/auth/reset-password
   https://pura-pata-3-0-andres-fonsecas-projects.vercel.app/auth/reset-password
   ```
4. En **Site URL**, configura tu dominio principal:
   ```
   https://pura-pata.com
   ```
   (O tu dominio de producción actual)

### Paso 2: Personalizar el Template del Email

1. Ve a **Authentication → Email Templates**
2. Selecciona **Reset Password** en el dropdown
3. Reemplaza el contenido con esta plantilla en español:

#### Subject (Asunto):
```
Recupera tu contraseña - Pura Pata
```

#### Email Body (HTML):
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperar Contraseña</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <h1 style="margin: 0; color: #d97706; font-size: 28px;">Pura Pata</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <h2 style="color: #111827; font-size: 24px; margin: 0 0 20px 0;">Recupera tu contraseña</h2>

              <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Hola,
              </p>

              <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                Recibimos una solicitud para recuperar la contraseña de tu cuenta en Pura Pata.
              </p>

              <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                Haz clic en el siguiente botón para crear una nueva contraseña:
              </p>

              <!-- Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background-color: #d97706;">
                    <a href="{{ .ConfirmationURL }}"
                       target="_blank"
                       style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">
                      Recuperar Contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 30px 0 0 0;">
                Este enlace expirará en 1 hora por razones de seguridad.
              </p>

              <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 20px 0 0 0;">
                Si no solicitaste recuperar tu contraseña, puedes ignorar este correo de forma segura.
              </p>

              <!-- Alternative Link -->
              <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px; line-height: 18px; margin: 0;">
                  Si el botón no funciona, copia y pega este enlace en tu navegador:
                </p>
                <p style="color: #3b82f6; font-size: 12px; line-height: 18px; margin: 10px 0 0 0; word-break: break-all;">
                  {{ .ConfirmationURL }}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="color: #6b7280; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                © {{ .CurrentYear }} Pura Pata - Adopción de Perros en Costa Rica
              </p>
              <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 10px 0 0 0; text-align: center;">
                Este es un correo automático, por favor no respondas a este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

4. Haz clic en **Save** para guardar los cambios

### Paso 3: Actualizar el código del frontend

El código en `frontend/src/lib/supabase.ts` necesita especificar la URL de redirección correcta.

Verifica que la función `resetPassword` tenga este código:

```typescript
export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { data, error };
};
```

### Paso 4: Configurar las Variables de Entorno (Opcional)

Si quieres personalizar más el email, puedes configurar:

1. Ve a **Project Settings → Auth**
2. Configura:
   - **Site URL**: Tu dominio principal
   - **Additional Redirect URLs**: Todas las URLs permitidas

### Verificación

Para verificar que todo funciona:

1. Ve a `/recuperar-password` en tu sitio
2. Ingresa un email válido
3. Revisa tu bandeja de entrada
4. El email debe:
   - ✅ Estar en español
   - ✅ Tener el diseño de Pura Pata
   - ✅ El enlace debe llevar a `/auth/reset-password`
   - ✅ Al hacer clic, debes poder cambiar la contraseña

### Solución de Problemas

**Problema**: El enlace sigue redirigiendo a la página incorrecta
- **Solución**: Verifica que agregaste la URL en **Redirect URLs** en Supabase
- Espera unos minutos para que los cambios se propaguen

**Problema**: El email sigue en inglés
- **Solución**: Asegúrate de guardar el template y de seleccionar "Reset Password" (no "Confirmation")

**Problema**: No recibo el email
- **Solución**:
  - Revisa la carpeta de spam
  - Verifica que el email esté registrado en Supabase Auth
  - Revisa los logs en Authentication → Logs

## Variables de Template Disponibles

Supabase proporciona estas variables para los templates:

- `{{ .ConfirmationURL }}` - URL con el token de recuperación
- `{{ .Token }}` - Token de recuperación (solo el código)
- `{{ .TokenHash }}` - Hash del token
- `{{ .SiteURL }}` - URL del sitio configurada
- `{{ .Email }}` - Email del usuario
- `{{ .CurrentYear }}` - Año actual

## Personalización Adicional

Si quieres personalizar más el email (logo, colores, etc.):

1. Sube tu logo a un servidor público (ej: Supabase Storage)
2. Agrega la imagen en el template:
   ```html
   <img src="https://tu-url.com/logo.png" alt="Pura Pata" style="max-width: 150px;">
   ```
3. Ajusta los colores (#d97706) según tu paleta
