# Deployment Guide — GBN Polytechnic V2

## Server

- **VPS IP:** 187.127.139.76
- **OS:** Ubuntu 24.04 (Noble)
- **Docker:** 29.3.1 with Compose v5.1.1
- **SSH:** `ssh root@187.127.139.76`

## Testing Domains

| Subdomain | Points To | Service |
|-----------|-----------|---------|
| `gpn.repoassistant.com` | 187.127.139.76 | Frontend (Next.js :3000) |
| `gpn-admin.repoassistant.com` | 187.127.139.76 | Admin Panel (Next.js :3001) |
| `gpn-api.repoassistant.com` | 187.127.139.76 | Backend API (Express :4000) |
| `gpn-storage.repoassistant.com` | 187.127.139.76 | MinIO S3 API (file serving) |

DNS managed on Cloudflare. All records are **A records, DNS only (grey cloud)**.

When switching to production domain (`gpnilokheri.ac.in`), just update the Traefik labels and DNS records.

## Infrastructure (`/opt/infra/`)

### Files

```
/opt/infra/
├── .env                 ← credentials (chmod 600, root only)
└── docker-compose.yml   ← Traefik + PostgreSQL + MinIO
```

### Services

| Service | Image | Public Access | Internal Access |
|---------|-------|---------------|-----------------|
| Traefik | `traefik:latest` | Ports 80/443 | — |
| PostgreSQL | `postgres:16-alpine` | None (internal only) | `postgres:5432` on `proxy` network |
| MinIO | `minio/minio` | S3 API via `gpn-storage.repoassistant.com` | `minio:9000` (S3), `minio:9001` (console) |

MinIO console (9001) is **not** exposed publicly. Only the S3 API (9000) is routed via Traefik for serving files/images.

### Credentials

Stored in `/opt/infra/.env` on the server. **Never commit this file.**

| Key | Usage |
|-----|-------|
| `POSTGRES_DB` | Database name (`gpn`) |
| `POSTGRES_USER` | Database user (`gpn`) |
| `POSTGRES_PASSWORD` | Auto-generated 40-char password |
| `MINIO_ROOT_USER` | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | Auto-generated 40-char password |
| `ACME_EMAIL` | Email for Let's Encrypt SSL certs |
| `DOMAIN` | Base domain (`repoassistant.com`) |

### Data Volumes

| Volume | Contents | Location on disk |
|--------|----------|-----------------|
| `infra_pgdata` | PostgreSQL data (tables, rows) | `/var/lib/docker/volumes/infra_pgdata/` |
| `infra_minio-data` | Uploaded files/images | `/var/lib/docker/volumes/infra_minio-data/` |
| `infra_certs` | SSL certificates (Let's Encrypt) | `/var/lib/docker/volumes/infra_certs/` |

Volumes persist across container restarts, updates, and recreates.

### Commands

```bash
# SSH into server
ssh root@187.127.139.76

# Start/restart infra
cd /opt/infra && docker compose up -d

# View logs
docker compose logs traefik --tail 20
docker compose logs postgres --tail 20
docker compose logs minio --tail 20

# Check status
docker compose ps

# Connect to database manually
docker compose exec postgres psql -U gpn -d gpn
```

## How Traefik Routing Works

1. All HTTP/HTTPS traffic hits Traefik on ports 80/443
2. HTTP auto-redirects to HTTPS
3. Traefik reads Docker labels on containers to discover routes
4. Each container gets labels like:
   ```yaml
   labels:
     - "traefik.enable=true"
     - "traefik.http.routers.NAME.rule=Host(`subdomain.domain.com`)"
     - "traefik.http.routers.NAME.tls.certresolver=le"
     - "traefik.http.services.NAME.loadbalancer.server.port=PORT"
   ```
5. Traefik auto-issues SSL certs via Let's Encrypt TLS challenge
6. No manual nginx/SSL config needed

## App Deployment (TODO)

Apps will be deployed as Docker containers on the same `proxy` network. Each gets Traefik labels for routing.

```
/opt/app/
├── .env                 ← app credentials (DB connection, JWT secret, etc.)
├── docker-compose.yml   ← frontend + admin + backend containers
├── backend/Dockerfile
├── frontend/Dockerfile
└── admin/Dockerfile
```

Backend connects to Postgres as `postgres://gpn:PASSWORD@postgres:5432/gpn` and MinIO as `http://minio:9000` — both via Docker internal network.
