import Script from "next/script";
import type { SiteMetaSettings } from "@/lib/server/mappers/siteChrome";

// Renders nothing when the corresponding Settings field is empty — Admin
// fills in an ID in Cài đặt > Analytics and it goes live on next request,
// no deploy needed. Scripts load after the page is interactive so they
// never block first paint.
export function Analytics({ gaId, gtmId }: Pick<SiteMetaSettings, "gaId" | "gtmId">) {
  // Meta Pixel ID comes only from the Vercel env var; unset → no pixel script.
  const metaPixelId = sanitizeId(process.env.NEXT_PUBLIC_META_PIXEL_ID);
  const zaloPixelId = sanitizeId(process.env.NEXT_PUBLIC_ZALO_PIXEL_ID);
  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {metaPixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');
(window.__blPixelQ||[]).forEach(function(a){fbq.apply(null,a)});window.__blPixelQ=null;`}
        </Script>
      )}
      {zaloPixelId && <ZaloPixel id={zaloPixelId} />}
    </>
  );
}

/** Pixel IDs are digits/letters only — anything else is dropped rather than
 * interpolated into an inline script. */
function sanitizeId(v: string | null | undefined) {
  const id = (v ?? "").trim();
  return /^[A-Za-z0-9_-]{1,64}$/.test(id) ? id : "";
}

/**
 * Zalo pixel loader (NEXT_PUBLIC_ZALO_PIXEL_ID).
 * TODO: paste Zalo's official base snippet here (Zalo Ads → Công cụ → Zalo
 * Pixel → "Cài đặt thủ công") and map events to it. The snippet is not
 * public documentation we can verify, so nothing is guessed: until then this
 * renders nothing even when the env var is set.
 */
function ZaloPixel({ id }: { id: string }) {
  void id;
  return null;
}
