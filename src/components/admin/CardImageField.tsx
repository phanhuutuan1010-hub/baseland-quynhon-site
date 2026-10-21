"use client";

import { useEffect, useState, useTransition } from "react";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { getMediaFocalByUrl, setMediaFocalByUrl } from "@/app/admin/(protected)/media/actions";

/**
 * 4:3 card image picker with a live 4:3 preview. Clicking the preview sets
 * the image's focal point (saved on its Media row right away), which every
 * `object-cover` crop of it on the site follows.
 */
export function CardImageField({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [focal, setFocal] = useState<{ x: number; y: number } | null>(null);
  const [isMedia, setIsMedia] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [msg, setMsg] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    if (!value) return;
    getMediaFocalByUrl(value).then((m) => {
      if (!alive) return;
      setIsMedia(!!m);
      setFocal(m ? { x: m.focalX, y: m.focalY } : { x: 0.5, y: 0.5 });
      setSize(m?.width && m.height ? { w: m.width, h: m.height } : null);
      setMsg("");
    });
    return () => {
      alive = false;
    };
  }, [value]);

  function pickFocal(e: React.MouseEvent<HTMLDivElement>) {
    if (!isMedia) return;
    const r = e.currentTarget.getBoundingClientRect();
    const next = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    setFocal(next);
    startTransition(async () => {
      const res = await setMediaFocalByUrl(value, next.x, next.y);
      setMsg(res.error ?? "Đã lưu điểm lấy nét.");
    });
  }

  const ratioOff = size && Math.abs(size.w / size.h - 4 / 3) > 0.02;
  const f = focal ?? { x: 0.5, y: 0.5 };

  return (
    <div className="flex flex-col gap-2">
      <MediaPickerField label="Ảnh đại diện — thẻ dự án (/projects, Trang chủ)" value={value} onChange={onChange} kindFilter="IMAGE" />
      <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
        Khuyến nghị 1600×1200 (4:3). Để trống = dùng ảnh hero.
        {ratioOff && size && <strong className="text-[var(--color-error)]"> Ảnh đang là {size.w}×{size.h} — khác 4:3, sẽ bị cắt.</strong>}
      </p>
      {value && (
        <div className="flex flex-col gap-1.5">
          <div
            onClick={pickFocal}
            className={`relative aspect-4/3 w-full max-w-90 overflow-hidden rounded-xs border border-[var(--color-border)] bg-[var(--color-sand)] ${isMedia ? "cursor-crosshair" : ""}`}
            title={isMedia ? "Bấm vào điểm quan trọng nhất của ảnh" : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of any URL */}
            <img src={value} alt="" className="h-full w-full object-cover" style={{ objectPosition: `${f.x * 100}% ${f.y * 100}%` }} />
            {isMedia && (
              <span
                aria-hidden
                className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.5)]"
                style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%` }}
              />
            )}
          </div>
          <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">
            {isMedia
              ? pending
                ? "Đang lưu…"
                : msg || "Xem trước khung 4:3 — bấm vào ảnh để chọn điểm lấy nét."
              : "Ảnh ngoài Thư viện Media: chỉ xem trước, không chọn được điểm lấy nét."}
          </p>
        </div>
      )}
    </div>
  );
}
