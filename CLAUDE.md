@AGENTS.md

## Trang dự án

Trang dự án luôn theo layout chuẩn Q'Terra; khác biệt chỉ qua theme và module đặc thù.

- Thứ tự cố định trong `CompactProjectPage` (`components/project-detail/ProjectPage.tsx`): Hero → Vì sao → Vị trí → Kiến trúc → Chọn căn → 360° → Tiện ích → Video → Giá & lộ trình → Kiểm chứng & Base Land → Form, kèm thanh mục lục, sticky Tư vấn nhanh, form rút gọn, popup lead.
- Theme qua `Project.theme` (`data-project-theme`); module đặc thù đặt đúng ô tương ứng (2 tháp trong "Vì sao", Masterplan trước "Chọn căn", Education sau "Kiến trúc", Verification/FAQ/News sau "Kiểm chứng").
- Mục chưa có dữ liệu thì tự ẩn — không điền giả. Giá/phương thức thanh toán chỉ hiện khi dự án có `priceFacts`/`paymentPlans`; còn lại chỉ nút "Nhận bảng giá mới nhất". Tour 360° chỉ hiện khi có link.
- `hero.layout = "full"` (Admin → Tổng quan) là lối thoát về bố cục cũ, không dùng cho dự án mới.

## Quy tắc layout bắt buộc

- **Heading:** `text-wrap: balance` (đã đặt chung cho h1–h3 trong `globals.css`; tiêu đề viết bằng thẻ khác thì thêm `[text-wrap:balance]`). Không để 1 từ/cụm ngắn rớt dòng lẻ.
- **Label / nút / tên:** không truncate (`…`, `line-clamp`, `truncate`), không cắt chữ. Cho xuống dòng (`flex-wrap`) hoặc giảm cỡ chữ theo breakpoint.
- **Ảnh:** khung theo tỉ lệ gốc từ Media `width/height` — mapper gắn sẵn `width/height/focalX/focalY` cho mọi `src` (`lib/server/imageMeta.ts`), đọc bằng `frameRatio()` / `focalPosition()` trong `components/project-detail/imageFrame.ts`.
  - Ảnh có chữ / poster / mặt bằng / bản đồ: `object-contain`, không crop.
  - Chỉ ảnh nền mới được `object-cover`, và phải đặt `objectPosition: focalPosition(img)`.
- **Hàng thẻ tràn ngang:** luôn dùng `components/project-detail/Carousel.tsx` (snap + thẻ sau ló ra một phần + mũi tên). Không để phần tử bị cắt mà không có dấu hiệu cuộn. Hàng chip/tab thì cho `flex-wrap` thay vì cuộn ngang.
- **Sau khi sửa giao diện:** chụp màn hình 390px và 1440px, tự kiểm tra các lỗi trên trước khi báo xong.
