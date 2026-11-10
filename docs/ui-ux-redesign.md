# Nâng cấp UI/UX — 10 November 2026

Thực hiện trong `D:\drtien` theo yêu cầu làm giao diện hiện đại, đẹp và sang trọng hơn. Áp dụng hai skill `frontend-design-direction` và `make-interfaces-feel-better`. Hướng thiết kế: contemporary scholarly editorial, phối ngà, forest, sage và brass; giữ khả năng đọc và nội dung học thuật làm trọng tâm.

| Hạng mục | Trước | Sau |
| --- | --- | --- |
| Bảng màu / nhịp trang | Navy–ivory, nhiều section có cùng mức tương phản | Forest–ivory–sage; Research và Contact thành chapter đậm, bibliography trở lại nền sáng |
| Hero | Khối quote vuông bên cạnh tên | Folio bo vòm với personal monogram; tên serif nhẹ, trạng thái học thuật dạng badge, institution có icon vị trí |
| Typography | Phần lớn metadata/control 8–11px | Tăng body, navigation, label và author list; main content trên mobile 390px có label từ 10px; heading dùng balance, citation dài dùng pretty |
| Navigation | Header dạng thanh có đường kẻ | Header nổi, viền mềm, backdrop blur; Contact rõ hơn, có aria-current cho mục đang đọc; icon menu đổi sang đóng |
| Nút bấm | Chữ nhật, ít phản hồi | Pill 44–54px, icon căn quang học, hover/press/focus cụ thể; chuyển động có thể tắt qua reduced motion |
| Research | Ba cột chia bằng đường dọc | Ba thẻ nền tối có icon, số thứ tự, khoảng cách rộng và label theo chủ đề |
| Publications | Danh sách ruled rows | Thẻ citation sáng, năm dạng badge, trạng thái chưa xác minh rõ ràng; bộ lọc segmented pill và counter tabular |
| Expertise / awards | Chủ yếu số và text | Icon vòng tròn, tag kỹ thuật dạng pill, icon giải thưởng và khoảng cách nhất quán |
| Contact | Footer liền nền tối | Khối contact riêng bo góc; email/copy dễ thao tác, footer sáng tách rõ |
| Ảnh chia sẻ | Màu navy, panel chữ nhật | PNG 1200×630 cùng hệ màu và folio monogram mới; favicon cũng đồng bộ |

Không bổ sung ảnh chân dung giả hoặc biểu đồ khoa học. Monogram là dấu hiệu trang trí cá nhân. Trạng thái Ph.D. Candidate, mốc bảo vệ dự kiến, dữ liệu citation và các điều kiện phê duyệt tiếp tục lấy từ lớp dữ liệu hiện có.

## Kiểm chứng

- Build sau các thay đổi UI: thành công, 0 TypeScript errors/warnings/hints.
- Lượt Playwright cuối: **33/33 đạt** trên Chromium desktop 1440×900, tablet 768×1024 và mobile 390×844; thêm stress viewport 320px.
- Axe WCAG 2.2 AA: không có violation ở ba viewport sau khi animation kết thúc. Các trạng thái clipboard, no-JavaScript, reduced motion, filter, focus và menu được kiểm tra.
- Đã kiểm tra thêm `aria-current` sau khi đi tới Research; mobile menu đã đóng vẫn lưu trạng thái mục hiện tại.
- Đã xem desktop hero/toàn trang, tablet hero, mobile hero, Research desktop, Publications mobile và Contact desktop/mobile. Ảnh bằng chứng trong `.qa/redesign/`; evidence record ở `.qa/ui-evidence.json`.
- Công cụ screenshot được cập nhật để fast-forward animation, còn axe chờ animation thực kết thúc; tránh ghi nhận khung hình đang fade như thiết kế cuối cùng.
- Phạm vi QA là Chromium giả lập thiết bị, chưa phải Safari/Firefox hoặc thiết bị thật.

## File và tác dụng phụ trong lần nâng cấp này

- Sửa `src/styles/global.css`, các component Header, Hero, Icon, Research, ResearchCard, Expertise, Awards; `src/layouts/BaseLayout.astro`; `scripts/create-social-card.mjs`; `public/favicon.svg`; `tests/browser/portfolio.spec.ts`; README và design contract. Thêm báo cáo này.
- `dist/` đã tồn tại trước lượt này: hai lần build **ghi đè/tái tạo nội dung dist**, không chỉ tạo thêm file. `public/social-card.png` được **ghi đè** trong cả hai build; lần đầu còn cùng mẫu cũ nhưng mtime vẫn đổi, lần sau có hình và màu mới.
- `.astro/` và cache phục vụ build/typecheck được cập nhật. `.qa/node-compile-cache` và `.qa/npm-cache` có thể được cập nhật bởi CLI/npm. Không cài dependency mới hoặc sửa lockfile trong lượt này.
- Tạo `.qa/redesign/before/` chứa bản sao code/ảnh cũ để đối chiếu, baseline hash nội dung và ảnh section mới. Các screenshot `.qa/*-viewport.png`, `.qa/*-full.png`, Playwright report/test-results và evidence JSON đã được **ghi đè** bởi các lượt QA; các file này bị ignore nếu sau này dùng Git.
- Playwright khởi chạy rồi đóng server preview port 4321 và Chromium trong ba lượt kiểm thử. Browser profile/tệp tạm do Playwright quản lý có thể nằm ở TEMP; không kiểm kê đường dẫn ngoài phạm vi workspace. Bằng chứng tiến trình/port ở thời điểm kết thúc nằm trong `.qa/redesign/final-state.txt`.
- Các file chỉnh sửa, file sao chép, build và cache có mtime mới. Không hoàn tác file nào rồi tuyên bố không có dấu vết. Kết quả SHA-256 hiện tại so với baseline cho seed/approval/đặc tả/PDF nằm trong final-state; hash chứng minh nội dung byte, không chứng minh mtime.
- Không có thao tác triển khai website. Trạng thái Git được kiểm tra lại bằng `git status -sb` và `git reflog -5` trong final-state; thư mục chưa là Git repository.
