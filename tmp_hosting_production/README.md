# TRONG THAI EVENT

Website gioi thieu dich vu to chuc su kien duoc xay dung bang Next.js App Router.

## Chay local

1. Tao file `.env.local` tu `.env.example`
2. Cai dependency bang `npm install`
3. Chay local bang `npm run dev`
4. Mo `http://localhost:3000`

## Bien moi truong

- `GMAIL_USER`: tai khoan Gmail dung de gui email tu form lien he
- `GMAIL_APP_PASSWORD`: App Password cua Gmail
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: ma project Sanity
- `NEXT_PUBLIC_SANITY_DATASET`: dataset Sanity dang dung
- `ADMIN_USERNAME`: tai khoan dang nhap khu admin
- `ADMIN_PASSWORD`: mat khau dang nhap khu admin
- `ADMIN_SESSION_SECRET`: secret ky cookie session admin
- `SUPABASE_URL`: URL project Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: service role key de server doc/ghi du lieu

## Scripts

- `npm run dev`: chay local development
- `npm run lint`: kiem tra ESLint
- `npm run build`: build production
- `npm run start`: chay ban production sau khi build

## SEO va metadata

Project da co:

- metadata tong cho site
- metadata rieng cho trang dich vu, du an, tin tuc
- `robots.txt`
- `sitemap.xml`
- `manifest.webmanifest`
- anh chia se Open Graph va Twitter qua metadata routes

## Admin

- Dang nhap tai `/admin/login`
- Sau khi dang nhap se vao `/admin`
- He thong admin hien la dashboard co bao ve session, phu hop de mo rong thanh CRUD o buoc tiep theo

## Supabase

- Chay SQL trong `supabase/schema.sql` de tao bang
- Khi da them `SUPABASE_URL` va `SUPABASE_SERVICE_ROLE_KEY`, app se uu tien doc/ghi tren Supabase
- Neu chua cau hinh Supabase, app van fallback ve file JSON noi bo de khong bi vo luong hien tai

## Ghi chu deploy

- Build trong sandbox co the loi `spawn EPERM` do moi truong, nhung lint va TypeScript van pass.
- Domain canonical hien dang la `https://trongthaievent.vn`.
- Khong commit `.env.local` len git.
