# Production Deploy Guide (GitHub Actions -> GHCR -> VPS)

Tai lieu nay tong hop cac buoc thiet lap de moi lan push code len nhanh main thi VPS production tu dong cap nhat.

## 1) Kien truc tu dong

Luong chay hien tai trong workflow:

1. Push code len GitHub (nhanh main)
2. GitHub Actions build backend + frontend
3. Build Docker image va push len GHCR
4. GitHub Actions SSH vao VPS
5. VPS chay docker compose pull va docker compose up -d

Neu setup dung, ban chi can push code len main la production update.

## 2) Tao SSH key cho GitHub Actions (tren may local)

### Windows PowerShell

```powershell
ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$env:USERPROFILE\.ssh\gh_actions_vps"
Get-Content "$env:USERPROFILE\.ssh\gh_actions_vps.pub"
Get-Content "$env:USERPROFILE\.ssh\gh_actions_vps"
```

- Lenh dau tao 2 file key
- Lenh thu 2 lay public key de them vao VPS
- Lenh thu 3 lay private key de luu vao GitHub Secret VPS_SSH_KEY

### Linux/macOS

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/gh_actions_vps
cat ~/.ssh/gh_actions_vps.pub
cat ~/.ssh/gh_actions_vps
```

## 3) Them public key vao VPS

SSH vao VPS bang user deploy (vi du ubuntu), sau do chay:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Dan noi dung file gh_actions_vps.pub vao cuoi file ~/.ssh/authorized_keys.

## 4) Chuan bi thu muc deploy tren VPS

Vi du dung duong dan /opt/visualalign:

```bash
sudo mkdir -p /opt/visualalign
sudo chown -R $USER:$USER /opt/visualalign
cd /opt/visualalign
```

Tao file compose.yaml trong thu muc nay, noi dung mau:

```yaml
services:
  backend:
    image: ghcr.io/<owner>/visualalign-backend:latest
    restart: always
    ports:
      - "8080:8080"

  frontend:
    image: ghcr.io/<owner>/visualalign-frontend:latest
    restart: always
    ports:
      - "80:80"
```

Thay <owner> bang GitHub username hoac org name dang so huu image GHCR.

## 5) Tao GitHub Secrets (Repository -> Settings -> Secrets and variables -> Actions)

Tao dung 7 secret sau:

1. VPS_HOST
2. VPS_USER
3. VPS_SSH_KEY
4. VPS_PORT
5. VPS_DEPLOY_PATH
6. GHCR_USERNAME
7. GHCR_TOKEN

Gia tri mau:

- VPS_HOST: IP hoac domain VPS (vi du 103.x.x.x)
- VPS_USER: user SSH tren VPS (vi du ubuntu)
- VPS_SSH_KEY: toan bo private key (bat dau tu -----BEGIN OPENSSH PRIVATE KEY-----)
- VPS_PORT: 22 (neu khong doi cong)
- VPS_DEPLOY_PATH: /opt/visualalign
- GHCR_USERNAME: GitHub username hoac org co quyen pull image
- GHCR_TOKEN: Personal Access Token co quyen read:packages
  - Neu image private, them quyen repo

## 6) Tao GHCR token

GitHub -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic) -> Generate new token (classic)

Chon toi thieu:

- read:packages
- Neu package private: them repo

Luu token vao secret GHCR_TOKEN.

## 7) Kiem tra quyen docker tren VPS

User VPS_USER phai chay duoc docker khong can sudo:

```bash
docker --version
docker compose version
docker ps
```

Neu bi permission denied:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

## 8) Chay lan dau de verify

### Local

```bash
git add .
git commit -m "chore: setup production deploy"
git push origin main
```

### GitHub Actions

Vao tab Actions, kiem tra workflow POS CI/CD:

- backend-ci xanh
- frontend-ci xanh
- docker-cd xanh
- deploy-vps xanh

### VPS

```bash
cd /opt/visualalign
docker compose ps
docker compose logs -f --tail=200 backend
docker compose logs -f --tail=200 frontend
```

## 9) Quy trinh moi lan update code (hang ngay)

1. Code o local
2. Commit + push len main
3. Cho Actions chay xong
4. Kiem tra production

Lenh co ban:

```bash
git add .
git commit -m "feat: your change"
git push origin main
```

## 10) Rollback nhanh neu ban moi loi

Cach don gian:

1. Sua compose.yaml, doi tag latest thanh tag cu on dinh (SHA cu)
2. Chay:

```bash
cd /opt/visualalign
docker compose pull
docker compose up -d
```

Khuyen nghi: ve sau nen pin image bang SHA trong compose de rollback de hon.

## 11) Loi thuong gap va cach xu ly nhanh

1. SSH khong vao duoc VPS
- Kiem tra VPS_HOST, VPS_PORT, VPS_USER
- Kiem tra public key da nam trong ~/.ssh/authorized_keys
- Kiem tra VPS_SSH_KEY da dan dung private key

2. Pull image GHCR bi denied
- Kiem tra GHCR_USERNAME, GHCR_TOKEN
- Kiem tra token co read:packages
- Neu private repo/package: them quyen repo

3. deploy-vps xanh nhung app khong len
- Kiem tra compose.yaml co dung ten image
- Kiem tra port mapping 80/8080
- Xem logs backend/frontend de bat loi runtime

---

Neu ban muon, co the tao them 1 file compose production day du (DB, volume, healthcheck, reverse proxy) de dung ngay cho he thong that.
