@AGENTS.md

## Quy tắc layout bắt buộc

- **Heading:** `text-wrap: balance` (đã đặt chung cho h1–h3 trong `globals.css`; tiêu đề viết bằng thẻ khác thì thêm `[text-wrap:balance]`). Không để 1 từ/cụm ngắn rớt dòng lẻ.
- **Label / nút / tên:** không truncate (`…`, `line-clamp`, `truncate`), không cắt chữ. Cho xuống dòng (`flex-wrap`) hoặc giảm cỡ chữ theo breakpoint.
- **Ảnh:** khung theo tỉ lệ gốc từ Media `width/height` — mapper gắn sẵn `width/height/focalX/focalY` cho mọi `src` (`lib/server/imageMeta.ts`), đọc bằng `frameRatio()` / `focalPosition()` trong `components/project-detail/imageFrame.ts`.
  - Ảnh có chữ / poster / mặt bằng / bản đồ: `object-contain`, không crop.
  - Chỉ ảnh nền mới được `object-cover`, và phải đặt `objectPosition: focalPosition(img)`.
- **Hàng thẻ tràn ngang:** luôn dùng `components/project-detail/Carousel.tsx` (snap + thẻ sau ló ra một phần + mũi tên). Không để phần tử bị cắt mà không có dấu hiệu cuộn. Hàng chip/tab thì cho `flex-wrap` thay vì cuộn ngang.
- **Sau khi sửa giao diện:** chụp màn hình 390px và 1440px, tự kiểm tra các lỗi trên trước khi báo xong.
