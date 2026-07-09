Tóm tắt: Quy trình để 1 coder máy khác dùng Docker chỉnh sửa dự án
Bước 1 — Cài Docker (chỉ làm 1 lần nếu máy chưa có)
powershellwinget install Docker.DockerDesktop
Khởi động lại máy → mở Docker Desktop → đợi nó chạy xong (icon cá voi 🐳 hết loading) → kiểm tra:
powershelldocker --version
docker compose version

Bước 2 — Clone dự án về máy
powershellgit clone <link-repo-github>
cd VisualAlignPosBackend\VisualAlign

Bước 3 — Kiểm tra có cần file .env không
powershelldir | findstr env
Nếu thấy .env.example → copy thành .env rồi điền giá trị cần thiết (hỏi leader nếu không biết điền gì):
powershellcopy .env.example .env

Bước 4 — Build và chạy Docker
Nếu dự án có docker-compose.yml:
powershelldocker compose up --build
Nếu chỉ có Dockerfile (như dự án bạn):
powershelldocker build -t visualalign-backend .
docker run -d --name test-container -p 5000:5000 visualalign-backend

Bước 5 — Kiểm tra chạy thành công chưa
powershelldocker ps
docker logs test-container
Mở trình duyệt: http://localhost:5000

Bước 6 — Tạo branch riêng để sửa code (KHÔNG sửa trực tiếp trên main)
powershellgit checkout -b feature/ten-tinh-nang

Bước 7 — Sửa code → test lại bằng Docker
Sửa xong, build lại để kiểm tra thay đổi không làm lỗi:
powershelldocker rm -f test-container
docker build -t visualalign-backend .
docker run -d --name test-container -p 5000:5000 visualalign-backend
docker logs test-container

Bước 8 — Commit và push code
powershellgit add .
git commit -m "Mô tả ngắn gọn đã sửa gì"
git push origin feature/ten-tinh-nang

Bước 9 — Tạo Pull Request trên GitHub
Vào GitHub → repo → Pull requests → New Pull Request → chọn branch vừa push → mô tả thay đổi → gửi để team review.

Bước 10 — Dọn dẹp container test (sau khi xong việc)
powershelldocker rm -f test-container






# Build và chạy tất cả services (lần đầu hoặc sau khi sửa code)
docker compose up --build

# Chạy ở chế độ nền (không chiếm terminal)
docker compose up -d

# Build + chạy nền cùng lúc
docker compose up --build -d

# Xem logs khi đang chạy nền
docker compose logs -f

# Xem logs của 1 service cụ thể (vd: backend)
docker compose logs -f backend

# Dừng tất cả containers
docker compose down

# Dừng và xóa luôn volumes (xóa data DB nếu có)
docker compose down -v

# Restart 1 service cụ thể
docker compose restart backend

# Xem danh sách container đang chạy
docker compose ps
