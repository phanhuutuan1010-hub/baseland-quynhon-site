// Lead pop-up content for /projects/qterra (20/10/2026) — written into the
// Admin CMS row (Dự án → Nội dung → Popup thu lead). Re-running is safe.
//
//   npx tsx prisma/updates/2026-10-20-qterra-lead-popup.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const L = (vi: string, en: string) => ({ vi, en });

const leadPopup = {
  title: L("Ưu tiên chọn căn đẹp Q'Terra", "Get first pick of the best units at Q'Terra"),
  subtitle: L("Đang nhận booking · Tháp đôi 39 tầng, 01 Ngô Mây", "Now taking bookings · Twin 39-storey towers, 01 Ngo May"),
  benefits: [
    L("Bảng giá & chính sách thanh toán", "Price list & payment plans"),
    L("Mặt bằng 24 căn/tầng theo hướng view", "Floor plans: 24 units per floor, by outlook"),
    L("Tư vấn chọn căn & tài chính miễn phí", "Free advice on choosing a unit & financing"),
  ],
  phoneLabel: L("Số điện thoại / Zalo", "Phone / Zalo"),
  phonePlaceholder: L("VD: 0901 234 567", "e.g. 0901 234 567"),
  phoneError: L("Số điện thoại chưa đúng (VD: 0901 234 567).", "Please enter a valid Vietnamese phone number (e.g. 0901 234 567)."),
  nameLabel: L("Họ tên (không bắt buộc)", "Name (optional)"),
  submitLabel: L("Nhận bảng giá & giữ ưu tiên", "Get prices & hold my priority"),
  submittingLabel: L("Đang gửi…", "Sending…"),
  privacyNote: L("Bảo mật thông tin · Không spam ·", "Your details stay private · No spam ·"),
  privacyLinkLabel: L("Chính sách bảo mật", "Privacy policy"),
  successMessage: L(
    "Đã nhận thông tin. Chuyên viên Base Land Quy Nhơn sẽ liên hệ sớm nhất.",
    "Thank you — a Base Land Quy Nhon advisor will contact you as soon as possible.",
  ),
  errorMessage: L(
    "Chưa gửi được, có thể do mạng. Thông tin bạn nhập vẫn còn — vui lòng thử lại hoặc gọi hotline.",
    "We couldn't send that, possibly a connection issue. Your details are still here — please try again or call our hotline.",
  ),
  callLabel: L("Gọi ngay", "Call now"),
  zaloLabel: L("Nhắn Zalo", "Message on Zalo"),
  zaloUrl: "https://zalo.me/0373910109",
  closeLabel: L("Đóng", "Close"),
  delaySeconds: 35,
  scrollPercent: 50,
  dismissDays: 7,
  leadSource: "qterra-popup",
  fallbackName: "Khách để lại SĐT (popup Q'Terra)",
};

async function main() {
  const project = await prisma.project.findUniqueOrThrow({ where: { slug: "qterra" } });
  await prisma.project.update({
    where: { id: project.id },
    data: { sections: { ...(project.sections as object), leadPopup: true } },
  });
  await prisma.projectSection.upsert({
    where: { projectId_type: { projectId: project.id, type: "LEAD_POPUP" } },
    update: { content: leadPopup },
    create: { projectId: project.id, type: "LEAD_POPUP", content: leadPopup },
  });
  console.log("Q'Terra lead popup saved.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
