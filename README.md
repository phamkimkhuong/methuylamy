# LTW10 — Portfolio Mẹ Thủy Làm Y

Website giới thiệu thương hiệu cá nhân Mẹ Thủy Làm Y (Thanh Thủy VPC), xây dựng trên nền tảng Nuxt 4 SSG (Static Site Generation) độc lập, tối ưu Core Web Vitals, hỗ trợ phát video streaming HLS kết nối hệ thống Van Phuc Care, tích hợp schema dữ liệu có cấu trúc đạt chuẩn Google Rich Results (ProfilePage / Person).

## Chạy local

Yêu cầu Node **24 LTS (>=24.11)** và npm. Node 20 của các app cũ không đáp ứng Nuxt mới; không cần nâng dependency của các app đó. `.nvmrc` và CI dùng Node 24 riêng cho portfolio.

```sh
cd portfolio-methuylamy
npm ci
npm run dev
```

Mở http://localhost:3103. Kiểm tra toàn bộ nền và xem artifact tĩnh:

```sh
npm run check
npm run preview
```

`check` chạy test hành vi biên, `nuxt typecheck` (các project TS của Nuxt 4), generate và kiểm tra HTML/assets/SEO. Không chỉ chạy vue-tsc trên tsconfig gốc có `files: []`, vì có thể bỏ sót project con. Có thể kiểm tra app riêng bằng `npx vue-tsc --noEmit -p .nuxt/tsconfig.app.json`.

## Nội dung và tái sử dụng

- `content/profiles/thanh-thuy.json`: hồ sơ chính; `content/books.json`, `content/courses.json`: danh sách tùy chọn.
- `shared/schemas/profile.ts`: kiểu PersonProfile và validation Zod. JSON lỗi hoặc URL nguy hiểm làm build thất bại.
- `app/components/ui/`: container, section, button/link, ảnh có width/height.
- `app/components/profile/`: thành phần dùng dữ liệu hồ sơ; không gắn cứng Thanh Thủy trong component.
- Mục trống tự ẩn. Không dùng bằng cấp, nhận xét, số người theo dõi, sách hoặc giá khóa học giả.
- Logo, font bản quyền, biểu tượng thương hiệu (Khiên y tế Mẹ Thủy Làm Y) và hệ thống Favicon (SVG/ICO/Apple Touch Icon) đã được chuẩn hóa đồng bộ theo Figma design system.
- Nếu thêm ảnh, lưu file trong `public/images/`, nhập `portrait: {src, alt, width, height}`. Tối ưu ảnh trước khi commit. Chưa có bộ tạo srcset/AVIF tự động trong đợt này.
- Sửa JSON rồi build lại. File tĩnh không cập nhật bằng environment runtime hoặc API tự động.
- Type dùng được cho hồ sơ điều dưỡng, nhưng chưa tạo route hàng loạt hoặc Staff CMS.

## SEO theo môi trường

Mặc định **staging**: trang có `noindex, nofollow`, sitemap rỗng, llms chỉ có thông báo preview. robots cho phép crawl để bot đọc noindex. Trên host staging cần cấu hình thêm `X-Robots-Tag: noindex, nofollow` cho mọi tài nguyên và bảo vệ truy cập nếu nội dung chưa công bố; robots không phải bảo mật.

Các biến là **build-time** (không dùng NODE_ENV để quyết định index):

| Biến | Staging/local | Production |
|---|---|---|
| PORTFOLIO_ENV | staging (mặc định) | production |
| PORTFOLIO_SITE_URL | http://localhost:3103 (mặc định), hoặc origin staging thật | https://methuylamy.vn (bắt buộc) |

Ví dụ PowerShell, áp dụng cho cả build lẫn verify:

```powershell
$env:PORTFOLIO_ENV = 'production'
$env:PORTFOLIO_SITE_URL = 'https://methuylamy.vn'
npm run check
```

Khi quay lại local, xóa hai biến trên hoặc đặt lại staging. Với Bash dùng `PORTFOLIO_ENV=production PORTFOLIO_SITE_URL=https://methuylamy.vn npm run check`. `npm run verify:output` độc lập phải dùng cùng biến với lần generate.

- `.output/public/` là **toàn bộ artifact để phát hành**. Các handler ở `server/routes/` chỉ sinh robots/sitemap/llms lúc prerender, không cần chạy Node trên server đích.
- HTML chứa metadata và một schema graph ProfilePage → Person; dữ liệu có mặt không cần JS. Không khai lastmod/ngày sửa giả.
- sameAs chỉ chứa tài khoản chính chủ của người đó. Không sửa schema hay link ngược trong E-learning ở đợt nền.
- llms.txt không bảo đảm được AI trích dẫn hoặc xếp hạng.
- JSON-LD được escape trước khi chèn vào script; không render nội dung JSON bằng v-html.

---

## Hướng dẫn Mở Khóa SEO & Lập Chỉ Mục (Go-Live Production)

### 1. Bản chất cơ chế bảo vệ 2 lớp khi ở Staging/Preview
Khi website đang trong quá trình phát triển hoặc thử nghiệm, hệ thống kích hoạt **2 lớp chặn lập chỉ mục (Defense in Depth)** để tránh việc Google cào các nội dung dở dang và lưu cache sai lệch lên kết quả tìm kiếm:
1. **Lớp HTML:** Thẻ `<meta name="robots" content="noindex, nofollow">` sinh ra từ Nuxt SSG qua [`app/composables/useProfileSeo.ts`](app/composables/useProfileSeo.ts) khi `PORTFOLIO_ENV !== 'production'`.
2. **Lớp HTTP Header:** `X-Robots-Tag: noindex, nofollow` được cấu hình tại Web Server Nginx trên VPS (`103.216.119.114`) để chặn bot ngay từ tầng phản hồi mạng cho cả HTML và toàn bộ tài nguyên tĩnh.

Google Rich Results Test phát hiện `ProfilePage` hợp lệ nhưng báo chưa được lập chỉ mục chính là do cơ chế này đang hoạt động đúng thiết kế.

---

### 2. Quy trình 3 bước mở khóa SEO chính thức

#### Bước 1: Cấu hình Build Production & cập nhật CI/CD
Trong file [`.github/workflows/methuylamy-ci-cd.yml`](.github/workflows/methuylamy-ci-cd.yml):
1. Đổi biến môi trường build sang `production`:
   ```yaml
   env:
     PORTFOLIO_ENV: production
     PORTFOLIO_SITE_URL: https://methuylamy.vn
   ```
2. Cập nhật 2 lệnh kiểm tra artifact (dòng 85 và dòng 128) từ kiểm tra `noindex` sang kiểm tra `index, follow`:
   ```bash
   grep -qi 'index, follow' site/index.html
   # và
   grep -qi 'index, follow' '$DEST/index.html'
   ```

*Khi build với `PORTFOLIO_ENV=production`:*
- Trang HTML tự động mang: `<meta name="robots" content="index, follow">`.
- `sitemap.xml` tự động xuất bản URL chính thức: `<loc>https://methuylamy.vn/</loc>`.
- `robots.txt` tự động công khai liên kết sitemap:
  ```text
  User-agent: *
  Allow: /
  Sitemap: https://methuylamy.vn/sitemap.xml
  ```
- `llms.txt` xuất bản đầy đủ thông tin hồ sơ, chuyên môn y khoa và khóa học của Mẹ Thủy.

#### Bước 2: Gỡ bỏ header `X-Robots-Tag` trên Web Server Nginx (VPS)
1. Đăng nhập SSH vào máy chủ VPS iNET (`103.216.119.114`):
   ```bash
   ssh -p 24700 user@103.216.119.114
   ```
2. Mở file cấu hình Nginx của domain `methuylamy.vn` (thường nằm tại `/etc/nginx/conf.d/` hoặc `/etc/nginx/sites-available/`).
3. Tìm và xóa (hoặc comment lại) dòng:
   ```nginx
   # add_header X-Robots-Tag "noindex, nofollow";
   ```
4. Kiểm tra cú pháp cấu hình và tải lại Nginx:
   ```bash
   sudo nginx -t && sudo systemctl reload nginx
   ```

#### Bước 3: Xác minh 3 đầu & Khai báo Google Search Console
1. **Kiểm tra bằng dòng lệnh:**
   ```bash
   # Kiểm tra HTTP Header (đảm bảo không còn header X-Robots-Tag: noindex)
   curl -I https://methuylamy.vn/

   # Kiểm tra robots.txt (đảm bảo trỏ đến sitemap.xml)
   curl -s https://methuylamy.vn/robots.txt

   # Kiểm tra sitemap.xml (đảm bảo chứa URL https://methuylamy.vn/)
   curl -s https://methuylamy.vn/sitemap.xml
   ```
2. **Khai báo Google Search Console:**
   - Đăng nhập [Google Search Console](https://search.google.com/search-console).
   - Chọn thuộc tính `https://methuylamy.vn/`.
   - Vào mục **Sơ đồ trang web (Sitemaps)** -> Nhập `sitemap.xml` -> Bấm **Gửi (Submit)**.
   - Sử dụng công cụ **Kiểm tra URL (URL Inspection)** đối với `https://methuylamy.vn/` -> Bấm **Yêu cầu lập chỉ mục (Request Indexing)**.

---

## CI và phát hành

Pipeline CI/CD chính của dự án được cấu hình tại [`.github/workflows/methuylamy-ci-cd.yml`](.github/workflows/methuylamy-ci-cd.yml). Pipeline tự động chạy khi có Pull Request hoặc Push lên nhánh `main`:
1. **Build & Test:** Cài đặt Node 24, chạy bộ test `npm run check` (Unit test, type-check, lint, Nuxt generate và kiểm tra verify output).
2. **Deploy preview / production (iNET VPS):** Tải artifact lên VPS `103.216.119.114` qua SSH (port 24700, user `methuylamy-deploy`), release nguyên khối vào `/opt/methuylamy/releases/` và chuyển atomic symlink `/opt/methuylamy/current`. Đồng thời bảo lưu các asset hashed cũ trong `/_nuxt/` để người dùng đang mở tab không bị lỗi giao diện.

Khi cấu hình Nginx trên server: phục vụ các file route tồn tại, URL không tồn tại trả về HTTP 404 thật bằng `404.html` (không fallback mọi URL về `index.html` gây lỗi SEO). Thiết lập cache dài hạn cho `/_nuxt/` có hash; HTML cần revalidate (`no-cache`).

## Phần kế tiếp

1. Nhận FINAL_DEV Desktop/Tablet/Mobile và nội dung/ảnh/font được duyệt; thay token và triển khai section theo thiết kế, QA hai vòng.
2. Chốt API Lead công khai ở server-vpc: validation server, captcha, rate limit, idempotency; frontend loading/lỗi/retry có TTL và cleanup. Form không dùng endpoint đăng ký dịch vụ yêu cầu đăng nhập hiện tại.
3. Tích hợp Admin, Zalo và tracking sau khi lưu Lead thành công; không giả lập gửi thành công trên trang hiện tại.
4. Cấu hình Nginx/SSL/staging/deploy, đo hiệu năng thật, kiểm tra crawl và duyệt trước production.

## Kết quả kiểm tra nền — 02/10/2026

- `npm ci` từ lockfile thành công trên Node 24.
- Portfolio: 4 test đạt, Nuxt type-check đạt, generate và kiểm tra artifact staging/production đạt. Đã kiểm tra HTML ban đầu, canonical, schema, sitemap, robots, llms, liên kết neo, assets và mục dữ liệu trống.
- Preview local: trang chính và các file SEO trả 200; URL không tồn tại trả 404 với trang lỗi có noindex. Giao diện đã kiểm tra tại 375, 768 và 1440 px; không tràn ngang, không có console error/warning ở trang chính.
- YAML của hai workflow đã parse và kiểm tra bộ lọc đường dẫn. Chưa chạy GitHub Actions trên remote, chưa deploy.
- Đối chiếu hệ thống cũ: `server-vpc` type-check đạt. E-learning còn lỗi có sẵn: 116 lỗi ở project app và 12 lỗi ở project server khi kiểm tra trực tiếp các tsconfig con. Lệnh vue-tsc với tsconfig gốc `files: []` không phản ánh những lỗi này. Đợt setup portfolio không sửa mã của hai ứng dụng đó.
- Đây là kiểm tra nền kỹ thuật, chưa phải Design QA theo Figma, kiểm thử Lead hoặc nghiệm thu hiệu năng production.

## Nguồn kỹ thuật

- https://nuxt.com/docs/4.x/guide/concepts/typescript
- https://nuxt.com/docs/4.x/getting-started/prerendering
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
