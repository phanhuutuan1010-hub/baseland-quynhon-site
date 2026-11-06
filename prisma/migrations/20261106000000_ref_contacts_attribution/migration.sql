-- Bảng ?ref= → số điện thoại (Admin → Cài đặt → Liên hệ) và attribution của lead
ALTER TABLE "settings" ADD COLUMN "refContacts" JSONB;
ALTER TABLE "leads" ADD COLUMN "ref" TEXT;
ALTER TABLE "leads" ADD COLUMN "utm" JSONB;
