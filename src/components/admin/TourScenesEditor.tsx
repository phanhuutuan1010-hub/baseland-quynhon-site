"use client";

import { useEffect, useRef, useState } from "react";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { loadPannellum, type PannellumViewer } from "@/lib/pannellum";
import type { ProjectTourHotspot, ProjectTourScene } from "@/lib/project-detail/types";

type Lang = "vi" | "en";
type Loc = { vi: string; en: string };

const inputClass =
  "w-full rounded-xs border border-[var(--color-border)] bg-[var(--color-warm-white)] px-3 py-2 font-body text-sm text-[var(--color-charcoal)]";
const labelClass = "mb-1 block font-ui text-[11px] font-semibold tracking-[0.04em] text-[var(--color-text-muted)] uppercase";
const smallBtn =
  "rounded-xs border border-[var(--color-border)] px-3 py-1.5 font-ui text-[11px] font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)] disabled:opacity-40";

function loc(v: unknown): Loc {
  const o = (v ?? {}) as Partial<Loc>;
  return { vi: typeof o.vi === "string" ? o.vi : "", en: typeof o.en === "string" ? o.en : "" };
}
function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
const round1 = (n: number) => Math.round(n * 10) / 10;

function normalize(value: unknown): ProjectTourScene[] {
  if (!Array.isArray(value)) return [];
  return value.map((raw, i) => {
    const s = (raw ?? {}) as Record<string, unknown>;
    return {
      id: typeof s.id === "string" && s.id ? s.id : `scene-${i + 1}`,
      name: loc(s.name),
      src: typeof s.src === "string" ? s.src : "",
      yaw: num(s.yaw),
      pitch: num(s.pitch),
      hfov: num(s.hfov, 100) || 100,
      hotspots: Array.isArray(s.hotspots)
        ? (s.hotspots as Record<string, unknown>[]).map((h) => ({
            target: typeof h?.target === "string" ? h.target : "",
            yaw: num(h?.yaw),
            pitch: num(h?.pitch),
            label: loc(h?.label),
          }))
        : [],
    };
  });
}

/**
 * Admin editor for a self-hosted 360° tour (`virtualTour.scenes`): add /
 * delete / reorder scenes (the first one opens the tour), pick each 360°
 * image from the Media Library (360° upload pipeline), set the initial view
 * from the live preview, and place "go to scene" hotspots by clicking on
 * the preview.
 */
export function TourScenesEditor({ value, lang, onChange }: { value: unknown; lang: Lang; onChange: (next: ProjectTourScene[]) => void }) {
  const scenes = normalize(value);
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(0, scenes.length - 1));
  const scene = scenes[index];

  const update = (i: number, patch: Partial<ProjectTourScene>) => onChange(scenes.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  function addScene() {
    const id = `scene-${crypto.randomUUID().slice(0, 8)}`;
    onChange([...scenes, { id, name: { vi: "", en: "" }, src: "", yaw: 0, pitch: 0, hfov: 100, hotspots: [] }]);
    setSelected(scenes.length);
  }
  function removeScene(i: number) {
    const gone = scenes[i];
    if (!window.confirm(`Xoá cảnh "${gone.name.vi || gone.id}"? Các hotspot dẫn tới cảnh này cũng bị xoá.`)) return;
    onChange(scenes.filter((_, j) => j !== i).map((s) => ({ ...s, hotspots: s.hotspots.filter((h) => h.target !== gone.id) })));
    setSelected(Math.max(0, i - 1));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= scenes.length) return;
    const next = [...scenes];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setSelected(j);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xs border border-[var(--color-border)] p-3">
      <div>
        <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Cảnh 360° (tour tự host)</p>
        <p className="m-0 mt-1 font-body text-xs text-[var(--color-text-muted)]">
          Dùng khi “Link tour 360°” để trống. Cảnh đầu tiên mở trước. Chưa có cảnh nào có ảnh thì mục 360° tự ẩn trên trang.
        </p>
      </div>

      {scenes.length > 0 && (
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {scenes.map((s, i) => (
            <li
              key={s.id}
              className={`flex flex-wrap items-center gap-2 rounded-xs border px-2.5 py-2 ${
                i === index ? "border-[var(--color-brand-green)] bg-[var(--color-sand)]" : "border-[var(--color-border)]"
              }`}
            >
              <button type="button" onClick={() => setSelected(i)} className="min-w-0 flex-1 cursor-pointer border-none bg-transparent p-0 text-left font-body text-sm">
                <strong className="font-ui text-xs">{i + 1}.</strong> {s[`name`][lang] || s.name.vi || <em className="text-[var(--color-text-muted)]">(chưa đặt tên)</em>}
                <span className="ml-2 font-body text-xs text-[var(--color-text-muted)]">
                  {s.src ? "có ảnh" : "chưa có ảnh"} · {s.hotspots.length} hotspot
                </span>
              </button>
              <button type="button" className={smallBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Lên">
                ↑
              </button>
              <button type="button" className={smallBtn} disabled={i === scenes.length - 1} onClick={() => move(i, 1)} aria-label="Xuống">
                ↓
              </button>
              <button type="button" className={`${smallBtn} text-[var(--color-error)]`} onClick={() => removeScene(i)}>
                Xoá
              </button>
            </li>
          ))}
        </ol>
      )}
      <button
        type="button"
        onClick={addScene}
        className="self-start rounded-xs border border-dashed border-[var(--color-border)] px-4 py-2 font-ui text-xs font-bold tracking-[0.04em] uppercase hover:bg-[var(--color-sand)]"
      >
        + Thêm cảnh
      </button>

      {scene && <SceneEditor key={scene.id} scene={scene} scenes={scenes} lang={lang} onChange={(patch) => update(index, patch)} />}
    </div>
  );
}

function SceneEditor({
  scene,
  scenes,
  lang,
  onChange,
}: {
  scene: ProjectTourScene;
  scenes: ProjectTourScene[];
  lang: Lang;
  onChange: (patch: Partial<ProjectTourScene>) => void;
}) {
  const others = scenes.filter((s) => s.id !== scene.id);
  const [placing, setPlacing] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewer | null>(null);
  const addedRef = useRef<string[]>([]);
  const downRef = useRef<{ x: number; y: number } | null>(null);
  // Latest values for the async viewer callbacks.
  const sceneRef = useRef(scene);
  useEffect(() => {
    sceneRef.current = scene;
  });

  // (Re)build the preview when the image changes.
  useEffect(() => {
    if (!scene.src || !boxRef.current) return;
    let cancelled = false;
    let viewer: PannellumViewer | null = null;
    loadPannellum()
      .then((pannellum) => {
        if (cancelled || !boxRef.current) return;
        const s = sceneRef.current;
        viewer = pannellum.viewer(boxRef.current, {
          type: "equirectangular",
          panorama: s.src,
          autoLoad: true,
          yaw: s.yaw,
          pitch: s.pitch,
          hfov: s.hfov || 100,
          showFullscreenCtrl: false,
          compass: false,
          hotSpots: [],
        });
        viewerRef.current = viewer;
        addedRef.current = [];
        viewer.on("load", () => syncHotspots());
        viewer.on("error", (msg) => setPreviewError(String(msg ?? "Lỗi tải ảnh")));
      })
      .catch(() => setPreviewError("Không tải được trình xem 360°."));
    return () => {
      cancelled = true;
      viewerRef.current = null;
      try {
        viewer?.destroy();
      } catch {
        /* noop */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.src]);

  function syncHotspots() {
    const viewer = viewerRef.current;
    if (!viewer) return;
    for (const id of addedRef.current) viewer.removeHotSpot(id);
    addedRef.current = [];
    sceneRef.current.hotspots.forEach((h, i) => {
      const id = `hs-${i}`;
      const target = scenes.find((s) => s.id === h.target);
      viewer.addHotSpot({ id, pitch: h.pitch, yaw: h.yaw, type: "info", text: `${i + 1}. → ${h.label[lang] || target?.name[lang] || target?.name.vi || "(chưa chọn cảnh)"}` });
      addedRef.current.push(id);
    });
  }

  // Keep the preview's markers in step with the list.
  useEffect(() => {
    syncHotspots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.hotspots, lang]);

  function setHotspots(hotspots: ProjectTourHotspot[]) {
    onChange({ hotspots });
  }

  function onPointerUp(e: React.PointerEvent) {
    const down = downRef.current;
    downRef.current = null;
    if (!placing || !down || !viewerRef.current) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return; // a drag, not a click
    const [pitch, yaw] = viewerRef.current.mouseEventToCoords(e.nativeEvent);
    setHotspots([...scene.hotspots, { target: others[0]?.id ?? "", yaw: round1(yaw), pitch: round1(pitch), label: { vi: "", en: "" } }]);
    setPlacing(false);
  }

  function useCurrentView() {
    const v = viewerRef.current;
    if (!v) return;
    onChange({ yaw: round1(v.getYaw()), pitch: round1(v.getPitch()), hfov: round1(v.getHfov()) });
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] pt-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label>
          <span className={labelClass}>Tên cảnh ({lang.toUpperCase()})</span>
          <input className={inputClass} value={scene.name[lang]} onChange={(e) => onChange({ name: { ...scene.name, [lang]: e.target.value } })} />
        </label>
        <label>
          <span className={labelClass}>Mã cảnh (tự tạo, dùng cho hotspot)</span>
          <input className={`${inputClass} text-[var(--color-text-muted)]`} value={scene.id} readOnly />
        </label>
      </div>

      <MediaPickerField label="Ảnh 360° (equirectangular 2:1)" value={scene.src} onChange={(src) => onChange({ src })} kindFilter="IMAGE" pano />

      {scene.src ? (
        <>
          <div
            className={`relative aspect-[2/1] max-h-[440px] w-full overflow-hidden rounded-xs bg-[var(--color-charcoal)] ${placing ? "cursor-crosshair ring-2 ring-[var(--color-brand-green)]" : ""}`}
            onPointerDownCapture={(e) => (downRef.current = { x: e.clientX, y: e.clientY })}
            onPointerUpCapture={onPointerUp}
          >
            <div ref={boxRef} className="absolute inset-0" />
            {placing && (
              <div className="pointer-events-none absolute top-2 left-1/2 z-[5] -translate-x-1/2 rounded-full bg-[var(--color-brand-green)] px-3 py-1 font-ui text-[11px] font-bold text-white">
                Click vào vị trí đặt hotspot (kéo để xoay vẫn được)
              </div>
            )}
          </div>
          {previewError && <p className="m-0 font-body text-xs text-[var(--color-error)]">{previewError}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="button" className={smallBtn} onClick={useCurrentView}>
              Lấy góc đang xem làm góc ban đầu
            </button>
            <button
              type="button"
              className={`${smallBtn} ${placing ? "border-[var(--color-brand-green)] bg-[var(--color-brand-green)] text-white" : ""}`}
              onClick={() => setPlacing((p) => !p)}
              disabled={!others.length}
              title={others.length ? "" : "Cần ít nhất 2 cảnh để đặt hotspot chuyển cảnh"}
            >
              {placing ? "Huỷ đặt hotspot" : "+ Đặt hotspot bằng click"}
            </button>
          </div>
        </>
      ) : (
        <p className="m-0 rounded-xs border border-dashed border-[var(--color-border)] p-4 font-body text-xs text-[var(--color-text-muted)]">
          Chọn hoặc tải ảnh 360° để xem trước và đặt hotspot.
        </p>
      )}

      <div className="grid grid-cols-3 gap-3">
        {(["yaw", "pitch", "hfov"] as const).map((k) => (
          <label key={k}>
            <span className={labelClass}>{k === "yaw" ? "Góc ngang (yaw)" : k === "pitch" ? "Góc dọc (pitch)" : "Độ rộng (hfov)"}</span>
            <input type="number" step="0.1" className={inputClass} value={scene[k]} onChange={(e) => onChange({ [k]: Number(e.target.value) || 0 })} />
          </label>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="m-0 font-ui text-xs font-bold tracking-[0.04em] text-[var(--color-text-muted)] uppercase">Hotspot chuyển cảnh</p>
        {!scene.hotspots.length && <p className="m-0 font-body text-xs text-[var(--color-text-muted)]">Chưa có hotspot.</p>}
        {scene.hotspots.map((h, i) => (
          <div key={i} className="grid grid-cols-2 items-end gap-2 rounded-xs border border-[var(--color-border)] p-2 sm:grid-cols-[1.4fr_0.7fr_0.7fr_1.4fr_auto]">
            <label>
              <span className={labelClass}>{i + 1}. Đến cảnh</span>
              <select
                className={inputClass}
                value={h.target}
                onChange={(e) => setHotspots(scene.hotspots.map((x, j) => (j === i ? { ...x, target: e.target.value } : x)))}
              >
                <option value="">— chọn —</option>
                {others.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name[lang] || s.name.vi || s.id}
                  </option>
                ))}
              </select>
            </label>
            {(["yaw", "pitch"] as const).map((k) => (
              <label key={k}>
                <span className={labelClass}>{k}</span>
                <input
                  type="number"
                  step="0.1"
                  className={inputClass}
                  value={h[k]}
                  onChange={(e) => setHotspots(scene.hotspots.map((x, j) => (j === i ? { ...x, [k]: Number(e.target.value) || 0 } : x)))}
                />
              </label>
            ))}
            <label>
              <span className={labelClass}>Nhãn ({lang.toUpperCase()}, trống = tên cảnh)</span>
              <input
                className={inputClass}
                value={h.label[lang]}
                onChange={(e) => setHotspots(scene.hotspots.map((x, j) => (j === i ? { ...x, label: { ...x.label, [lang]: e.target.value } } : x)))}
              />
            </label>
            <div className="flex gap-1.5">
              <button type="button" className={smallBtn} onClick={() => viewerRef.current?.lookAt(h.pitch, h.yaw, undefined, 600)}>
                Xem
              </button>
              <button type="button" className={`${smallBtn} text-[var(--color-error)]`} onClick={() => setHotspots(scene.hotspots.filter((_, j) => j !== i))}>
                Xoá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
