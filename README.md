# Cyber Security

## My Information
- Phoonnaphalin Kachat
- 0568604050XX-X 
- คาดหวังว่าจะได้เรียนรู้รูปแบบของภัยคุกคามทางไซเบอร์ในปัจจุบัน และแนวทางการป้องกันเบื้องต้น เพื่อนำไปปรับใช้ทั้งในการเรียนและการทำงานในสายไอที

---

## โครงสร้างโปรเจกต์

```
.
├── .env.example            # ตัวอย่างค่า env (template — commit ได้)
├── .env                    # ค่าจริงของ local (secrets — ถูก gitignore)
├── docker-compose.yaml     # จัดการ service ทั้งหมด (db / pgadmin / app / web)
├── api.http.example        # ตัวอย่าง request สำหรับ REST client
├── api.http                # ไฟล์ request ของ local (ถูก gitignore)
├── app/                    # ส่วน overrides ของ Strapi ที่ mount เข้า container
│   ├── config/
│   │   ├── admin.js        #   admin JWT (8 ชม.) + token salts
│   │   └── plugins.js      #   user JWT (7 วัน) + rate limit ของ users-permissions
│   └── extensions/
│       └── users-permissions/
│           └── strapi-server.js   # password policy (≥10 ตัว, upper/lower/digit/special)
└── infra/
    └── nginx/              # reverse proxy ชั้นหน้า
        ├── nginx.conf      #   rate limit + basic auth + audit log
        ├── .htpasswd       #   basic-auth user (ถูก gitignore)
        └── logs/           #   access/error log (audit)
```

## วิธีเริ่มระบบ

```bash
cp .env.example .env        # แล้วแก้ค่า secrets ใน .env
docker compose up -d
```

- Web UI (ผ่าน nginx): `http://localhost:9092`
- pgAdmin (local เท่านั้น): `http://localhost:8082`
- PostgreSQL (local เท่านั้น): `localhost:5432`

## หมายเหตุความปลอดภัย (ตามหลัก IAAA)

- ทุก service ผูกกับ `127.0.0.1` — ไม่เปิดสู่เครือข่ายภายนอก
- `/admin/*` ต้องผ่าน **basic auth** เพิ่มอีกชั้น (ทดแทน MFA) + rate limit ตาม nginx
- register (public) ถูกปิด — ใครสมัครเองไม่ได้
- password policy บังคับความยาว/ความซับซ้อน ทุกจุดที่ตั้งรหัสใหม่
- JWT อายุสั้น: user 7 วัน / admin 8 ชม. + secrets ถาวรใน `.env`
- reset token เป็นแบบ single-use และถูก wipe ทันทีหลังใช้
- audit log อยู่ที่ `infra/nginx/logs/access.log`