/**
 * Self-hosted Pannellum (public/vendor/pannellum-2.5.7, MIT) — loaded only
 * on demand (the visitor clicks "Bắt đầu tham quan", or an admin opens a
 * scene preview), never with the page bundle. One shared promise, so the
 * script and stylesheet are injected at most once per page.
 */
export const PANNELLUM_BASE = "/vendor/pannellum-2.5.7";

export type PannellumHotSpot = {
  id?: string;
  pitch: number;
  yaw: number;
  type: "scene" | "info";
  text?: string;
  sceneId?: string;
  cssClass?: string;
  clickHandlerFunc?: (e: Event, args: unknown) => void;
  clickHandlerArgs?: unknown;
};

export type PannellumScene = {
  type: "equirectangular";
  panorama: string;
  title?: string;
  yaw?: number;
  pitch?: number;
  hfov?: number;
  hotSpots?: PannellumHotSpot[];
};

export type PannellumViewer = {
  on(event: "load" | "scenechange" | "error" | "fullscreenchange" | "mousedown" | "mouseup", cb: (arg?: unknown) => void): PannellumViewer;
  loadScene(id: string, pitch?: number | "same", yaw?: number | "same", hfov?: number | "same"): PannellumViewer;
  getScene(): string;
  getYaw(): number;
  getPitch(): number;
  getHfov(): number;
  lookAt(pitch?: number, yaw?: number, hfov?: number, animated?: boolean | number): PannellumViewer;
  addHotSpot(hs: PannellumHotSpot, sceneId?: string): PannellumViewer;
  removeHotSpot(id: string, sceneId?: string): boolean;
  mouseEventToCoords(e: MouseEvent | PointerEvent): [number, number];
  startOrientation(): void;
  stopOrientation(): void;
  isOrientationActive(): boolean;
  isOrientationSupported(): boolean;
  startAutoRotate(speed?: number, pitch?: number): PannellumViewer;
  stopAutoRotate(): PannellumViewer;
  resize(): void;
  destroy(): void;
};

type PannellumGlobal = { viewer(container: HTMLElement, config: Record<string, unknown>): PannellumViewer };

let loading: Promise<PannellumGlobal> | null = null;

export function loadPannellum(): Promise<PannellumGlobal> {
  const w = window as unknown as { pannellum?: PannellumGlobal };
  if (w.pannellum) return Promise.resolve(w.pannellum);
  if (loading) return loading;
  loading = new Promise<PannellumGlobal>((resolve, reject) => {
    if (!document.querySelector(`link[data-pannellum]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = `${PANNELLUM_BASE}/pannellum.css`;
      css.dataset.pannellum = "";
      document.head.appendChild(css);
    }
    const script = document.createElement("script");
    script.src = `${PANNELLUM_BASE}/pannellum.js`;
    script.async = true;
    script.onload = () => (w.pannellum ? resolve(w.pannellum) : reject(new Error("pannellum missing")));
    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new Error("pannellum load failed"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** iOS 13+ asks for motion permission from a user gesture; elsewhere the
 * API either needs nothing or doesn't exist. */
export async function requestMotionPermission(): Promise<boolean> {
  const DOE = (window as unknown as { DeviceOrientationEvent?: { requestPermission?: () => Promise<string> } }).DeviceOrientationEvent;
  if (!DOE) return false;
  if (typeof DOE.requestPermission !== "function") return true;
  try {
    return (await DOE.requestPermission()) === "granted";
  } catch {
    return false;
  }
}
