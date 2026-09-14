# LandingKUBO
Landing page de KUBO con herramientas DevOps

## Demo de balanceo y tolerancia a fallos

La demo levanta tres backends, tres frontends, un reverse proxy Nginx, Redis y un aggregator interno. El único acceso publicado es `http://localhost:8080`.

### Levantar

```bash
docker compose up --build
```

Abrí `http://localhost:8080` y usá `/demo`. El panel flotante muestra el frontend actual, el último backend que respondió y sus métricas. La sección `ver estado de los demas contenedores` consulta el estado del resto.

### Simular la caída de un nodo

Mientras la demo está activa, detené un backend y repetí una acción de la demo:

```bash
docker compose stop backend-1
```

El reverse proxy detecta el fallo y reintenta con otro backend. Para observar failover del frontend, detené `frontend-1` y recargá la página:

```bash
docker compose stop frontend-1
```
