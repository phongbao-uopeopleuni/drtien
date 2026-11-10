# Huyen Ton Nu Bao Tien — Research Portfolio

Website học thuật một trang, tiếng Anh, dựng tĩnh bằng Astro + TypeScript. Giao diện editorial hiện đại: nền ngà, xanh rêu đậm, điểm nhấn brass, Newsreader + DM Sans được phục vụ từ chính website. Header nổi, hero monogram dạng folio, các chapter sáng/tối xen kẽ và nút dạng pill. Không có backend, form thu thập thông tin hoặc thư viện animation.

Lần nâng cấp UI/UX ngày 10 November 2026: xem `docs/ui-ux-redesign.md` và ảnh render trong `.qa/redesign/`.

## Chạy trên máy

Yêu cầu Node.js **24.12 trở lên**, npm 9.6.5 trở lên.

```powershell
cd D:\drtien
npm ci --cache .qa\npm-cache
npm run dev
```

Mở địa chỉ do terminal in ra, mặc định `http://127.0.0.1:4321`. Dùng `Ctrl+C` để dừng. Chỉ phục vụ trên loopback theo mặc định.

```powershell
npm run build      # kiểm tra kiểu + dữ liệu, sinh ảnh chia sẻ, build preview vào dist/
npm run preview    # xem bản đã build
npm test           # kiểm thử chính sách nội dung
```

Kiểm thử trình duyệt, sau khi build:

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = 'D:\drtien\.qa\browsers'
npx playwright install chromium
npm run test:e2e
```

Playwright tự khởi động và dừng server preview. Kết quả và ảnh chụp được ghi vào `.qa/`. Thiết lập kiểm thử dùng Chromium cho cả desktop, tablet và mobile; đây là giả lập viewport/device, chưa phải kiểm thử Safari hoặc thiết bị thật.

## Cấu trúc và cập nhật

| Đường dẫn | Vai trò |
| --- | --- |
| `src/data/portfolio-content.seed.json` | Nguồn nội dung chính, sao chép từ JSON được cung cấp |
| `src/data/types.ts` | Mô hình dữ liệu TypeScript |
| `src/data/approval.json` | Trạng thái phê duyệt nội dung/tài sản và xác minh profile |
| `src/data/portfolio.ts` | Chuẩn hóa dữ liệu, chọn phần được hiển thị |
| `src/lib/content-policy.ts` | Điều kiện hiển thị bài báo/link và kiểm tra URL |
| `src/components/` | Các phần của trang; không cần sửa layout để cập nhật hồ sơ |
| `src/styles/global.css` | Design tokens, giao diện và breakpoint |
| `scripts/content-validation.mjs` | Kiểm tra preview và điều kiện release |
| `docs/sources/RESEARCH_PORTFOLIO_SPEC_V1_2.md` | Bản đặc tả nguồn tham khảo |
| `docs/design-contract.md` | Hướng thiết kế và các trạng thái giao diện |

Đổi tên, chức danh, affiliation, mốc bảo vệ, tiểu sử, chủ đề nghiên cứu, kỹ thuật, học vấn, giải thưởng và email trong JSON. Giữ mốc bảo vệ là **Anticipated Dissertation Defense: August 2027**, không diễn giải thành ngày cấp bằng. Khi trạng thái học thuật thực sự thay đổi, cập nhật các trường này và duyệt lại nội dung.

Các vai trò/affiliation kinh nghiệm còn thiếu xác nhận được giữ trong JSON nhưng không hiển thị. DNA barcoding và microspore culture không được tự chuyển thành kỹ năng đã xác nhận.

### Bài báo

Hiện cả bốn citation đều chưa xác minh. Preview hiển thị chúng với nhãn **CV citation · unverified**, không bật DOI/publisher link hoặc tuyên bố đồng tác giả thứ nhất.

Sau khi đối chiếu nguồn chính thức, bổ sung cho từng record:

- `canonicalTitle`: tên bài chính thức.
- `journal`: tên tạp chí chính thức.
- `authors`: danh sách tác giả đầy đủ.
- `doi`: DOI hợp lệ, hoặc `publisherUrl`: link HTTPS chính thức.
- `canonicalTitleNeedsVerification: false` nếu có cờ này.
- `verified: true` và `publicReleaseReady: true` sau khi thực sự xác minh.
- `authorshipNote` cùng `authorshipVerified: true` chỉ khi có bằng chứng về vai trò tác giả.

Đặt `visible: false` để giữ một citation trong nguồn mà ẩn khỏi cả preview và release. Không đưa bản thảo nội bộ hoặc kết quả chưa công bố vào mảng `publications`.

### Ảnh, CV và profile ngoài

Chưa có ảnh đã duyệt: hero dùng typography. Muốn thêm ảnh, đặt ảnh tối ưu trong `public/images/`, điền `profile.portraitPath` dạng `/images/portrait.webp`, rồi đặt `portraitApproved: true`.

Chưa có CV công khai đã duyệt: không hiển thị nút tải. Chỉ đặt PDF đã kiểm tra riêng tư vào `public/cv/`, điền `profile.publicCvPath` dạng `/cv/academic-cv.pdf` và đặt `publicCvApproved: true`. Không sao chép PDF TopCV gốc vào `public/`: mọi file trong `public/` sẽ được đưa vào bản build.

LinkedIn/ORCID/Google Scholar chỉ hiện khi URL HTTPS hợp lệ và cờ xác minh tương ứng là `true`. Không suy đoán URL.

## Preview và phát hành

`npm run build` tạo **editorial preview**, có banner chờ duyệt, `noindex, nofollow`, robots chặn crawl và sitemap trống. Đây không phải cơ chế kiểm soát truy cập; không đưa thông tin bí mật vào source hiển thị.

Để chuẩn bị bản công khai:

1. Duyệt tiểu sử (`bioApproved`) và các nhóm nội dung trong `approval.json`.
2. Hoàn thiện hoặc ẩn citation chưa xác minh; xử lý tên trường/affiliation chưa rõ.
3. Bổ sung tài sản/link đã duyệt nếu có; thiếu ảnh/CV có thể tiếp tục dùng fallback.
4. Chọn domain/hosting rồi khai báo biến môi trường.

```powershell
$env:SITE_URL = 'https://your-approved-domain.example'
# Nếu hosting trong subpath, ví dụ GitHub Pages project:
# $env:BASE_PATH = '/repository-name/'
npm run build:release
```

Release script dừng trước khi build nếu thiếu phê duyệt hoặc metadata bắt buộc. Nó kiểm tra kiểu, tạo ảnh chia sẻ PNG 1200×630, sinh canonical/sitemap theo domain và cho phép indexing. Thiết lập `PORTFOLIO_RELEASE=true` trực tiếp vẫn chịu kiểm tra từ cấu hình Astro.

Chưa cấu hình triển khai và chưa phát hành website. Đọc hướng dẫn [cài đặt Astro](https://docs.astro.build/en/install-and-setup/) nếu cần tham khảo nền tảng.

## File sinh ra và riêng tư

`dist/` được tạo mới hoặc **ghi đè khi build lại**. `.astro/`, `node_modules/`, `.qa/` và lockfile là các sản phẩm của quá trình cài đặt/build/QA. `public/social-card.png` được tạo lại khi build. CLI wrapper tắt Astro telemetry và đặt Node compile cache trong `.qa/` cho các lệnh của dự án.

PDF TopCV ở thư mục gốc chỉ là nguồn riêng; nó không nằm trong `public/` và không được phục vụ bởi bản static. `.gitignore` loại PDF gốc, cache và output build. Nếu sau này tạo Git repo, kiểm tra lại file được track trước khi đưa repo lên mạng.
