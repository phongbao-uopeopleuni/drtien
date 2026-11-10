# Báo cáo triển khai ban đầu — 10 November 2026

Đã triển khai tại `D:\drtien` từ bản đặc tả v1.2 và JSON được người dùng chỉ định. Thư mục khởi đầu chỉ có PDF nguồn, chưa phải Git repository.

## Kết quả

- Astro 7.4.8 + TypeScript, prerender static, website tiếng Anh một trang.
- Hero typography, About, ba research themes, bốn citation draft, nhóm kỹ thuật, học vấn/nghiên cứu, giải thưởng, liên hệ và footer.
- Navigation sticky, menu di động, Escape/focus, bộ lọc năm, sao chép email có thông báo thành công/lỗi, mailto và fallback khi tắt JavaScript.
- Font variable được phục vụ nội bộ; responsive desktop/tablet/mobile; tôn trọng reduced motion.
- Không có portrait/CV/LinkedIn đã duyệt: dùng fallback và ẩn link tương ứng. Không có link DOI hoặc tuyên bố co-first author chưa xác minh.
- Mặc định là preview có banner, noindex/nofollow, robots chặn crawl. Release có cổng kiểm tra metadata/phê duyệt trong cả script và cấu hình Astro.
- Ảnh Open Graph PNG, favicon, metadata; canonical và sitemap thực chỉ có khi cấu hình domain và release.

## Kiểm chứng đã thực hiện

- `npm run build`: thành công; Astro check báo 0 errors, 0 warnings, 0 hints.
- `npm test`: 7/7 đạt.
- `npm run test:e2e`: 33/33 đạt, Chromium ở 1440×900, 768×1024, 390×844; thêm kiểm tra tràn ngang 320 px.
- Axe scan WCAG 2.2 AA không trả về vi phạm tại ba viewport. Đã kiểm tra bàn phím, skip link, reduced motion, các anchor, menu, bộ lọc, clipboard thành công/từ chối và JavaScript bị tắt.
- Request PDF nguồn ở root và JSON source đều trả 404 trên bản static preview. Asset tải thành công, không ghi nhận page error trong bài kiểm thử.
- Đã xem ảnh render thực tế desktop toàn trang, tablet và mobile. `.qa/ui-evidence.json` được checker của skill `frontend-design-direction` chấp nhận.
- `npm run build:release`: thất bại có chủ đích trước build vì các cờ duyệt, domain và metadata citation còn thiếu. Đây là kiểm tra cổng chặn; chưa kiểm thử một release đã được duyệt hoàn chỉnh.
- SHA-256 của hai file nguồn được chỉ định và PDF gốc trùng với baseline đầu phiên. Baseline nằm trong `.qa/source-baseline.json`; kết quả cuối phiên nằm trong `.qa/final-state.txt`.

## Những việc chưa có đủ đầu vào

Chưa phát hành website, chưa chọn hosting/domain. Cần candidate duyệt tiểu sử/copy, xác minh citation và tên tổ chức/giải thưởng. Có thể bổ sung ảnh, CV công khai đã kiểm tra riêng tư và URL profile khi được cung cấp. Chưa kiểm thử Safari, Firefox, thiết bị thật hoặc trình đọc màn hình. Placeholder cho bibliography rỗng đã có nhưng chưa được render riêng trong kiểm thử trình duyệt; thiếu portrait/CV/profile đã được render và kiểm tra.

## Dấu vết và tác dụng phụ

1. Tạo mới code/config/docs/tests, `package.json`, `.npmrc`, `.gitignore`, `package-lock.json`, `public/favicon.svg` và `public/social-card.png`. Lockfile đã được cập nhật khi bổ sung dependency kiểm thử/type/image. File social card được tạo rồi **ghi đè** trong lần build tiếp theo.
2. Sao chép bản MD vào `docs/sources/` và JSON vào `src/data/`. Không chỉnh sửa hai file trong Downloads. PDF nguồn không được sao chép vào `public/`.
3. `dist/` ban đầu chưa tồn tại: đã tạo ở lần build thành công đầu và **ghi đè/tái tạo nội dung** khi build lại sau sửa CSS/script. Bản build cuối có 14 file, khoảng 0.36 MiB.
4. `.astro/` được tạo/cập nhật qua check/build; `node_modules/` được tạo/cập nhật khi cài dependency, khoảng 209.52 MiB ở lần kiểm kê.
5. `.qa/` giữ Chromium/headless browser, FFmpeg, Winldd, npm cache/log, Node compile cache, screenshot, báo cáo và kết quả Playwright, baseline/evidence. Khoảng 1083.77 MiB tại lần kiểm kê trước khi thêm báo cáo cuối; đây chủ yếu là browser và package cache. Test results/report và screenshot đã được **ghi đè** bởi lượt kiểm thử sau. Các file này bị ignore khi sau này dùng Git.
6. Playwright đã khởi chạy server preview cục bộ port 4321 và các tiến trình trình duyệt tạm thời cho hai lượt QA. Trạng thái kết thúc được kiểm tra bằng `netstat` và liệt kê tiến trình; xem bằng chứng mới sinh trong `.qa/final-state.txt`.
7. Lệnh Astro check đầu tiên in thông báo telemetry mặc định. Theo mã dependency tại `node_modules/@astrojs/telemetry/dist/`, vị trí config mặc định trên Windows là `%APPDATA%\astro\Config\config.json`; luồng đó có thao tác ghi config và gửi telemetry ẩn danh. Các lệnh npm/npx ban đầu cũng có thể dùng cache/log mặc định. Không kiểm kê hoặc sửa các đường dẫn hệ thống này vì nằm ngoài phạm vi dự án; không khẳng định mọi dấu vết tự động chỉ nằm trong workspace. Các lệnh Astro tiếp theo đã tắt telemetry; CLI wrapper hiện tắt telemetry và đưa compile cache vào `.qa/`, `.npmrc` đưa npm cache vào `.qa/npm-cache`.
8. Nhiều file mới và output sinh ra có mtime của phiên này. Không có thao tác sửa rồi hoàn tác file nguồn; hash chỉ chứng minh nội dung byte, không thay thế bằng chứng mtime. Trạng thái Git được ghi bằng lệnh mới sinh trong `.qa/final-state.txt`.

Không cài package toàn cục, không tạo worktree, không cấu hình dịch vụ hệ thống. Các file cache/QA được giữ lại để có thể chạy lại kiểm thử.
