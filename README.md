# LandingKUBO
Landing page de KUBO con herramientas DevOps.

## Diferencias entre `main` y `demoreplicación`

`main` contiene la aplicación base. `demoreplicación` conserva esa aplicación y agrega una arquitectura distribuida para mostrar balanceo, failover y observabilidad de réplicas.

| Aspecto | `main` | `demoreplicación` |
| --- | --- | --- |
| Servicios | Un frontend, un backend y Redis | Tres frontends (`frontend-1` a `frontend-3`), tres backends (`backend-1` a `backend-3`), Redis, reverse proxy y agregador de estadísticas |
| Entrada | El frontend publica `http://localhost:8080`; el backend y Redis también exponen sus puertos (`3000` y `6379`) | Solo se publica `http://localhost:8080`, a través del reverse proxy; los demás servicios permanecen en la red interna de Docker |
| Enrutamiento | El frontend se conecta directamente con un único backend | Nginx distribuye las peticiones entre las réplicas con round-robin y reintenta contra otra réplica cuando una falla |
| Salud e identidad | No se identifica la réplica que atiende cada petición | Cada backend expone `/health` e informa su nombre mediante el header `X-Backend-Node` |
| Observabilidad | No incluye el panel de réplicas | El panel muestra el backend que respondió y el estado, CPU y RAM de los tres backends; actualiza los datos cada 3 segundos |
| Objetivo | Ejecutar y probar la aplicación | Demostrar replicación, balanceo y recuperación ante fallos |

### Ejecutar `main`

```bash
docker compose up --build
```

La aplicación queda disponible en <http://localhost:8080>. En esta rama también se puede acceder directamente al backend en `http://localhost:3000`.

### Probar `demoreplicación`

```bash
git switch demoreplicación
docker compose up --build
```

Abrí <http://localhost:8080> y realizá acciones de la demo, como cambiar entre prompts sugeridos, para observar cómo cambian los backends. Para simular fallos:

```bash
docker compose stop backend-1

```

Después de detener `backend-1`, repetí la acción de la demo: Nginx debe derivar la petición a otra réplica. 

El agregador de estadísticas necesita acceso de solo lectura al socket de Docker (`/var/run/docker.sock`); por eso esta configuración está pensada para una demostración local.
