# 🚀 Guía de Deploy — RPG LOG

## Problema más común: "me redirige a otro proyecto"

Esto pasa porque el backend en Render tiene `CORS_ORIGIN` apuntando solo a `localhost`.
El navegador bloquea las peticiones y el frontend no puede conectarse.

---

## ✅ Solución en 2 pasos

### Paso 1 — Configurar CORS en el backend (Render)

1. Entra a [render.com](https://render.com) → tu servicio de **backend**
2. Ve a **Environment** (Variables de entorno)
3. Edita o añade `CORS_ORIGIN` con el dominio del frontend:

```
CORS_ORIGIN=https://TU-FRONTEND.onrender.com,http://localhost:3000,http://localhost:3001
```

> Reemplaza `TU-FRONTEND.onrender.com` con tu URL real de Render.
> Si tienes varios dominios, sepáralos con coma sin espacios.

4. Haz clic en **Save Changes** → Render reiniciará el servidor automáticamente.

---

### Paso 2 — Configurar la URL del backend en el frontend

El frontend ya apunta al backend correcto en `.env`:

```env
REACT_APP_API_URL=https://rpglog-backend.onrender.com
```

Si cambiaste el nombre del servicio en Render, actualiza esta URL.

**Para desarrollo local** — cambia `.env` a:
```env
REACT_APP_API_URL=http://localhost:3001
```

---

## Variables de entorno necesarias en Render (backend)

| Variable | Valor |
|---|---|
| `PORT` | `3001` (Render lo gestiona automáticamente) |
| `MONGO_URI` | Tu URI de MongoDB Atlas |
| `JWT_SECRET` | Una cadena larga y secreta |
| `CORS_ORIGIN` | El dominio de tu frontend |
| `NODE_ENV` | `production` |

---

## Variables de entorno en el frontend

Si deploys el frontend en Render como Static Site:

1. En Render → tu sitio estático → **Environment**
2. Añade `REACT_APP_API_URL=https://rpglog-backend.onrender.com`
3. En **Build Command**: `npm run build`
4. En **Publish Directory**: `build`

---

## Verificar que el backend responde

Visita en el navegador:
```
https://rpglog-backend.onrender.com/health
```

Respuesta esperada:
```json
{ "ok": true, "status": "healthy" }
```

Si no responde, el backend puede estar dormido (Render free tier duerme tras 15 min de inactividad).
Espera ~30 segundos la primera vez que lo visitas.

---

## Checklist rápido

- [ ] Backend responde en `/health`
- [ ] `CORS_ORIGIN` tiene el dominio del frontend
- [ ] `MONGO_URI` y `JWT_SECRET` están configurados
- [ ] Frontend tiene `REACT_APP_API_URL` correcta
- [ ] Tras hacer build (`npm run build`), el frontend usa las variables de `.env`

