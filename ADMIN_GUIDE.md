# Base Land Quy Nhơn — Hướng dẫn quản trị (Admin CMS)

Tài liệu này dành cho người quản trị kỹ thuật (cài đặt/deploy) và nhân sự Admin/Sales sử dụng `/admin` hàng ngày. Nguyên tắc cốt lõi: **sửa nội dung không cần code** — mọi nội dung public (trang chủ, dự án, tin tức, menu, thông tin liên hệ) đều chỉnh được qua `/admin`, đổi là thấy ngay trên site.

---

## 1. Cài đặt lần đầu (kỹ thuật)

### 1.1. Yêu cầu
- Node.js 20+
- Một database Postgres (khuyến nghị [Neon](https://neon.tech) — free tier, serverless, hợp với Vercel)
- (Tuỳ chọn) Tài khoản [Resend](https://resend.com) để gửi email khi có lead mới

### 1.2. Biến môi trường
Copy `.env.example` thành `.env.local` và điền:

| Biến | Bắt buộc | Ghi chú |
|---|---|---|
| `DATABASE_URL` | Có | Connection string Postgres (Prisma) |
| `DIRECT_URL` | Chỉ khi dùng pooled connection (Neon/Supabase) | Kết nối trực tiếp, không qua pgbouncer, cần cho `prisma migrate` |
| `RESEND_API_KEY` | Không | Thiếu thì lead vẫn được lưu vào DB bình thường, chỉ không gửi được email thông báo |
| `LEAD_RECIPIENT_EMAIL` | Không | Email nhận thông báo lead mới |
| `LEAD_SENDER_EMAIL` | Không | Địa chỉ gửi đi (Resend) |
| `BLOB_READ_WRITE_TOKEN` | Không (bắt buộc để dùng Media Library) | Token Vercel Blob store — xem mục 9.1 |
| `NEXT_PUBLIC_SITE_URL` | Nên đặt khi lên production | Dùng cho canonical URL, Open Graph, sitemap.xml, robots.txt |

### 1.3. Khởi tạo database
```bash
npm install
npx prisma migrate deploy   # áp toàn bộ migration đã có
npx prisma db seed          # tạo 2 tài khoản dev + seed nội dung thật (4 dự án, 6 tin tức, homepage, menu, settings)
```
Khi phát triển local và cần tạo migration mới sau khi sửa `prisma/schema.prisma`, dùng `npx prisma migrate dev --name <tên>` thay vì `deploy`.

### 1.4. Chạy thử
```bash
npm run dev       # http://localhost:3000
```
`npm run build && npm run start` để kiểm tra bản production trước khi deploy.

### 1.5. Deploy (Vercel)
- Set toàn bộ biến môi trường ở mục 1.2 trong Vercel Project Settings.
- Build command mặc định (`next build`) đã đủ — không cần chạy migrate trong build; chạy `npx prisma migrate deploy` thủ công (hoặc qua CI) mỗi khi có migration mới trước khi deploy.
- Khi bật Media Library (mục 9), cần thêm biến `BLOB_READ_WRITE_TOKEN` từ một Vercel Blob store.

---

## 2. Đăng nhập & phân quyền

Truy cập `/admin/login`.

**Tài khoản dev-seed (đổi ngay sau lần đăng nhập đầu, đây chỉ là tài khoản demo):**
| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | `admin@baselandquynhon.dev` | `ChangeMe-Admin-2026!` |
| Sales | `sales@baselandquynhon.dev` | `ChangeMe-Sales-2026!` |

Hai vai trò cố định:
- **Admin**: toàn quyền — Trang chủ, Dự án, Tin tức, Lead, Cài đặt.
- **Sales**: chỉ Dashboard, xem Dự án (không sửa), và Lead (toàn quyền — xem/gán/đổi trạng thái/ghi chú/xuất CSV).

Đăng nhập sai 20 lần/5 phút từ cùng một IP sẽ bị tạm khoá (chống brute-force) — đợi vài phút rồi thử lại.

Chưa có UI tạo/sửa tài khoản người dùng (mục "Người dùng" trong sidebar đang "sắp có") — muốn thêm Admin/Sales mới hiện phải làm qua Prisma trực tiếp (liên hệ kỹ thuật).

---

## 3. Trang chủ (`/admin/homepage`)

Trang chủ gồm 9 section cố định: Hero, Giới thiệu, Vì sao Quy Nhơn, Dự án nổi bật, Dự án khác, Dịch vụ, Vì sao Base Land, Tin tức, CTA cuối trang.

- **Ẩn/hiện** một section: bật/tắt công tắc ngay trong danh sách — có hiệu lực tức thì trên site.
- **Sắp xếp lại**: kéo-thả để đổi thứ tự hiển thị (trang chủ là nơi DUY NHẤT cho phép đổi thứ tự section tự do — trang Dự án thì không, xem mục 4).
- **Sửa nội dung**: bấm vào tên section để vào form chỉnh từng field song ngữ VI/EN.

---

## 4. Quản lý Dự án (`/admin/projects`)

- **Danh sách**: xem tất cả dự án kèm trạng thái Draft/Published/Archived.
- **Tạo dự án mới**: điền slug (chỉ chữ thường/số/gạch ngang), tên, loại hình, trạng thái hiển thị → tạo ở trạng thái Draft.
- **Overview**: tên, loại hình, trạng thái hiển thị, theme màu (tuỳ chọn), Hero, CTA cuối trang, và **SEO override** (mục 8).
- **Nội dung (Sections)**: danh sách 21 mục nội dung (Giới thiệu, Thống kê, Toà tháp, Vị trí, Mặt bằng tổng thể, Kiến trúc, Vật liệu, Phong cách sống, Giáo dục, Tầm nhìn, Căn hộ, Video, Mặt bằng căn hộ, Đầu tư, Tin tức liên quan, Pháp lý, Tài liệu, Minh bạch dữ liệu, FAQ) — mỗi mục có công tắc **Ẩn/hiện** riêng và link vào form sửa nội dung.
  - **Thứ tự các section trên trang là CỐ ĐỊNH** (theo thiết kế UX gốc, ví dụ mục Video luôn nằm ngay sau Căn hộ) — Admin chỉ Ẩn/Hiện, không đổi được thứ tự giữa các section. Trong một số section có danh sách con (căn hộ, mặt bằng, tiện ích, thư viện ảnh, tài liệu), Admin **thêm/xoá/sắp xếp lại từng item** thoải mái.
  - Mục **Minh bạch dữ liệu** (Verification) có thêm cờ "Chỉ hiện field đã VERIFIED" ở Overview — bật lên thì thông tin chưa xác minh sẽ tự ẩn khỏi site thay vì hiện kèm nhãn "chưa xác minh".
- **Publish/Unpublish/Lưu trữ/Xoá**: nút ở đầu trang editor. Chỉ dự án **Published** mới xuất hiện trên site public, trong sitemap.xml, và trong danh sách "Dự án liên quan" của Tin tức.

Vai trò Sales chỉ xem được các trang này (không có nút Lưu/công tắc).

---

## 5. Quản lý Tin tức (`/admin/news`)

- **Danh mục** (Category): thêm/sửa/xoá ngay trong bảng mở rộng ở đầu trang danh sách. Không xoá được danh mục đang có bài viết dùng.
- **Tạo bài viết mới**: slug, tiêu đề VI/EN, danh mục → tạo Draft, vào editor để hoàn thiện.
- **Editor bài viết**: tiêu đề, ảnh đại diện (URL), tags, dự án liên quan (chọn nhiều), tóm tắt + nội dung song ngữ (soạn thảo rich text: H2/H3, in đậm/nghiêng, link, ảnh, quote, danh sách), và **SEO override** (mục 8).
  - Nội dung được **tự động lọc HTML** trước khi lưu (chỉ giữ đúng các thẻ soạn thảo cho phép) — dán nội dung từ nguồn khác vẫn an toàn, không tự ý chèn được script.
- **Publish/Unpublish/Xoá**: chỉ bài **Published** hiện trên `/news`, trang chủ, và sitemap.xml.

---

## 6. Quản lý Lead (`/admin/leads`)

Mọi lead gửi từ form trên site public (trang chủ, trang Dự án, trang Liên hệ...) được lưu vào đây ngay lập tức — **kể cả khi chưa cấu hình gửi email** (`RESEND_API_KEY`), lead vẫn không bị mất.

- **Lọc**: theo tên/SĐT/email, trạng thái, dự án, khoảng ngày tạo.
- **Xuất CSV**: nút "Export CSV" ở đầu trang, tải về toàn bộ danh sách đang lọc.
- **Chi tiết lead**: đổi **Trạng thái** (Mới/Đã liên hệ/Đã chuyển đổi/Lưu trữ), **Gán người phụ trách**, và **thêm ghi chú** (lưu lại lịch sử ai ghi, lúc nào).
- **Không có nút Xoá** — đây là chủ đích (dữ liệu lead không tự ý xoá qua UI để tránh mất dấu vết CSKH).

Đây là module duy nhất Sales có toàn quyền thao tác (như Admin).

---

## 7. Cài đặt (`/admin/settings`)

4 tab:
- **Liên hệ**: tên chi nhánh, hotline, email, địa chỉ, mạng xã hội, nhãn nút CTA trên Nav — đổi ở đây cập nhật ngay trên Nav/Footer/thanh CTA nổi ở MỌI trang.
- **Analytics**: dán **Google Analytics ID** (`G-XXXXXXX`), **Google Tag Manager ID** (`GTM-XXXXXXX`), **Meta Pixel ID** — chỉ cần dán ID, script tracking tự động được chèn vào site, không cần sửa code hay deploy lại. Để trống ô nào thì script tương ứng không chạy.
- **Chung**: tên site (hiển thị trong tab trình duyệt & Open Graph mặc định), ngôn ngữ mặc định, logo/favicon/ảnh Open Graph mặc định (URL ảnh).
- **Menu**: quản lý các mục trên thanh điều hướng (thêm/sửa/xoá/ẩn-hiện/sắp xếp), hỗ trợ 5 loại: liên kết nội bộ, liên kết ngoài, trỏ tới 1 Dự án, trỏ tới 1 Tin tức, hoặc anchor (`#id`) trong trang.

---

## 8. SEO

Mỗi **Dự án** và **Tin tức** có phần "SEO (tuỳ chọn)" ở cuối form chỉnh sửa:
- **Tiêu đề SEO / Mô tả SEO** (ghi đè `<title>`/meta description) — để trống thì hệ thống tự tạo từ tên dự án + mô tả hero (hoặc tiêu đề + tóm tắt bài viết).
- Dự án có thêm **Ảnh Open Graph** riêng (ghi đè ảnh hero khi chia sẻ lên Facebook/Zalo...).

`sitemap.xml` và `robots.txt` được tạo tự động, **chỉ liệt kê nội dung đã Published** — dự án/tin tức Draft hoặc Archived không xuất hiện trong sitemap và không được Google index qua đường này.

---

## 9. Media Library (`/admin/media`)

Upload ảnh/video/tài liệu trực tiếp trong Admin, không cần đụng code hay `public/images`.

### 9.1. Kích hoạt (bắt buộc trước khi dùng)
1. Vào [Vercel Dashboard](https://vercel.com/dashboard) → project → **Storage** → **Create Database** → **Blob**.
2. Tạo store xong, copy giá trị **`BLOB_READ_WRITE_TOKEN`**.
3. Thêm vào `.env.local` (dev) hoặc Environment Variables của project trên Vercel (production):
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxx
   ```
4. Restart dev server / redeploy. Không cần migrate gì thêm — bảng `Media` đã có sẵn trong schema.

**Chưa cấu hình token?** Trang `/admin/media` vẫn dùng được bình thường (xem/sửa media đã có), chỉ riêng nút tải lên sẽ báo lỗi rõ ràng thay vì crash: *"Không thể upload — có thể chưa cấu hình BLOB_READ_WRITE_TOKEN trên server"*.

### 9.2. Sử dụng
- **Tải lên**: chọn file ở đầu trang `/admin/media` — ảnh JPG/PNG/WEBP/GIF (tối đa 10MB), video MP4 (tối đa 200MB), PDF (tối đa 20MB). File đi thẳng từ trình duyệt lên Vercel Blob (không qua server Next.js), nên upload video lớn không bị giới hạn dung lượng request của serverless function.
- **Sửa thông tin**: bấm vào từng thẻ media để mở rộng — sửa tiêu đề/alt text/chú thích song ngữ VI-EN, điểm lấy nét (ảnh), cờ "yêu cầu điền form trước khi tải" (tài liệu).
- **Xoá**: xoá cả bản ghi DB lẫn file trên Blob storage — không hoàn tác được.
- **Chọn ảnh từ nơi khác dùng nó**: các trường ảnh ở Dự án (ảnh Hero, ảnh Open Graph), Tin tức (ảnh đại diện), và Cài đặt (Logo/Favicon/Ảnh OG mặc định) đều có nút **"Chọn từ Media"** cạnh ô nhập URL — bấm vào để chọn nhanh từ thư viện thay vì gõ tay đường dẫn.
- Ảnh cũ trong `public/images` (dùng cho 4 dự án, tin tức, trang chủ có sẵn) **không** được đưa vào Media Library — vẫn hoạt động bình thường qua đường dẫn cũ, Media Library chỉ quản lý các file upload mới từ nay.

### 9.3. Giới hạn hiện tại (biết trước, không phải lỗi)
- **Không hỗ trợ upload SVG** — chặn có chủ đích để tránh rủi ro chèn script qua file SVG.
- File đi thẳng trình duyệt → Blob storage (để video lớn upload được trên hạ tầng serverless), nên server **không quét lại nội dung byte thực tế của file** — chỉ giới hạn định dạng (Content-Type) và dung lượng ở bước cấp quyền upload. Vì chỉ tài khoản Admin đã đăng nhập mới xin được quyền upload, và file được phục vụ từ domain Blob riêng (khác domain chính), rủi ro này chấp nhận được — tương tự cách hầu hết dịch vụ dùng S3/Cloud Storage cho việc upload nội bộ.
- **Điểm lấy nét (focal point)** và **"yêu cầu điền form trước khi tải"** đã lưu được trong Media, nhưng **chưa có component public nào đọc và áp dụng** hai giá trị này (ví dụ: ảnh vẫn hiển thị `object-cover` mặc định, tài liệu vẫn tải trực tiếp không bị chặn) — đây là phần chờ làm tiếp khi có nhu cầu thực tế, dữ liệu đã sẵn sàng để dùng sau.

---

## 10. Ghi chú bảo mật

- **Đổi mật khẩu 2 tài khoản dev-seed ngay** sau khi deploy thật (mục 2) — đây là mật khẩu demo, không dùng cho production.
- Mật khẩu được hash bằng bcrypt, không lưu plaintext. Phiên đăng nhập (session) là token ngẫu nhiên lưu DB (không phải JWT) — **Đăng xuất sẽ vô hiệu hoá session ngay lập tức**.
- Cookie session: `httpOnly`, `sameSite=lax`, và `secure` khi chạy production (HTTPS).
- Đăng nhập bị giới hạn tốc độ (20 lần/5 phút/IP); form lead public bị giới hạn tương tự (8 lần/10 phút/IP) để chống spam.
- Mọi hành động sửa nội dung đều kiểm tra lại quyền ở phía server (không chỉ ẩn nút trên giao diện) — kể cả khi có ai đó cố gọi thẳng API mà không qua UI.
- Nội dung Tin tức được lọc HTML (sanitize) trước khi lưu — chặn script/thẻ lạ dù dán từ nguồn ngoài.
- Toàn bộ hành động sửa nội dung nhạy cảm (giá, pháp lý, trạng thái publish...) được ghi lại trong "Hoạt động gần đây" ở Dashboard — biết ai sửa gì, lúc nào.
- Chưa cấu hình `RESEND_API_KEY`? Không sao — lead vẫn được lưu đầy đủ vào database, chỉ là sẽ không có email thông báo tức thời; vẫn xem được lead mới trong `/admin/leads` hoặc số liệu ở Dashboard.
