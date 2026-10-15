# LTW10 — Portfolio Mẹ Thủy Làm Y

Nền Nuxt 4 SSG độc lập trong repo VPC. Đây là **trang khung kỹ thuật**, chưa phải bản cắt Figma FINAL_DEV hoặc bản nghiệm thu production. Không có API runtime, form Lead, đăng nhập, pixel hay CMS trong đợt này.

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
- Nội dung khởi đầu dựa trên proposal người dùng và `elerning-vpc-v3/constants/instructorProfiles.ts`; vẫn cần PO duyệt trước production. Chưa có ảnh chân dung, font hay logo FINAL_DEV. Favicon chữ T, bảng màu và bố cục hiện tại chỉ là giá trị tạm cho trang khung.
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

## CI và phát hành

`.github/workflows/portfolio-check.yml` chạy riêng theo thay đổi portfolio, kiểm tra cả staging và production và upload hai artifact. URL `portfolio-staging.example.com` chỉ phục vụ CI; phải dùng domain staging thật khi build để triển khai.

Workflow **không deploy**, không có secret và không gọi `deploy.sh` chung (script đó dừng cả stack). Việc cấu hình server, DNS, SSL và tự deploy sẽ thực hiện ở bước tích hợp hạ tầng. Không gộp artifact staging với production; phải rebuild đúng môi trường.

Workflow Docker cũ có `paths-ignore` cho portfolio và workflow mới: commit chỉ đổi các file này không kích hoạt deploy toàn bộ VPC. Commit có thêm thay đổi ngoài hai đường dẫn đó vẫn chạy pipeline cũ. Nếu GitHub đang yêu cầu check của workflow Docker cho mọi PR, cần đối chiếu branch protection khi mở PR portfolio.

### Giới hạn dependency đã ghi nhận

Ở lần setup 02/10/2026, `npm audit` báo 7 mục high cùng một chuỗi phụ thuộc `node-forge → listhen → Nuxt/Nitro`. Không tự chạy `npm audit fix --force` vì npm đề xuất hạ Nuxt về major cũ. Các package này thuộc công cụ Node dùng local/build, không nằm trong `.output/public` được phát hành; điều đó không loại bỏ rủi ro của môi trường build. Dev/preview bind localhost, không cấu hình HTTPS development tự ký. Cần theo dõi bản vá upstream và chạy lại audit trước khi production.

Khi cấu hình Nginx: phục vụ các file route tồn tại, URL lạ trả HTTP 404 thật bằng `404.html`; không fallback mọi URL về `index.html`. Cache dài cho `/_nuxt/` có hash; HTML cần revalidate. Release vào thư mục mới rồi chuyển symlink, giữ release trước để rollback và giữ assets hash cũ đủ lâu để tránh lỗi tab đang mở. Không xóa artifact đang được phục vụ trong lúc upload.

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
