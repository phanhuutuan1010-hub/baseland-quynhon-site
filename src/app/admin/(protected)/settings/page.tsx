import { requireRole } from "@/lib/server/auth";
import { prisma } from "@/lib/server/db";
import { SettingsTabs } from "./SettingsTabs";

export const metadata = { title: "Cài đặt" };

type SocialLinks = { facebook?: string | null; zalo?: string | null; youtube?: string | null };

export default async function AdminSettingsPage() {
  await requireRole("ADMIN");

  const [settings, menuItems] = await Promise.all([
    prisma.settings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        branchName: "Base Land Quy Nhơn",
        navCtaLabelVi: "Nhận tư vấn",
        navCtaLabelEn: "Get in Touch",
        hotline: "0373 910 109",
        hotlineHref: "tel:+84373910109",
        contactEmail: "baselandquynhon@gmail.com",
        contactEmailHref: "mailto:baselandquynhon@gmail.com",
        addressVi: "41 Hoa Lư, Phường Quy Nhơn, Tỉnh Gia Lai",
        addressEn: "41 Hoa Lư, Quy Nhơn Ward, Gia Lai Province",
        siteName: "Base Land Quy Nhơn",
      },
    }),
    prisma.menuItem.findMany({ orderBy: { order: "asc" } }),
  ]);

  const social = (settings.socialLinks as SocialLinks | null) ?? {};

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="m-0 font-ui text-2xl font-bold text-[var(--color-charcoal)]">Cài đặt</h1>
        <p className="m-0 mt-1 font-body text-sm text-[var(--color-text-muted)]">
          Thông tin liên hệ, tracking, cấu hình chung và menu — thay đổi ở đây phản ánh ngay ra site public.
        </p>
      </div>

      <SettingsTabs
        contact={{
          branchName: settings.branchName,
          navCtaLabelVi: settings.navCtaLabelVi,
          navCtaLabelEn: settings.navCtaLabelEn,
          hotline: settings.hotline,
          hotlineHref: settings.hotlineHref,
          contactEmail: settings.contactEmail,
          contactEmailHref: settings.contactEmailHref,
          addressVi: settings.addressVi,
          addressEn: settings.addressEn,
          mapsUrl: settings.mapsUrl ?? "",
          facebookUrl: social.facebook ?? "",
          zaloUrl: social.zalo ?? "",
          youtubeUrl: social.youtube ?? "",
        }}
        analytics={{
          gaId: settings.gaId ?? "",
          gtmId: settings.gtmId ?? "",
          metaPixelId: settings.metaPixelId ?? "",
        }}
        global={{
          siteName: settings.siteName,
          defaultLanguage: settings.defaultLanguage === "en" ? "en" : "vi",
          logoUrl: settings.logoUrl ?? "",
          faviconUrl: settings.faviconUrl ?? "",
          defaultOgImageUrl: settings.defaultOgImageUrl ?? "",
        }}
        menu={menuItems.map((m) => ({
          id: m.id,
          labelVi: m.labelVi,
          labelEn: m.labelEn,
          type: m.type,
          href: m.href ?? "",
          targetSlug: m.targetSlug ?? "",
          enabled: m.enabled,
        }))}
      />
    </div>
  );
}
