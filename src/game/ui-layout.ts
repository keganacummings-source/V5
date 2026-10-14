import { useSyncExternalStore } from "react";

export type WinRect = { x: number; y: number; w: number; h?: number; pinned?: boolean; collapsed?: boolean };
type Layout = Record<string, WinRect>;

const KEY = "turbz-ui-layout-v1";
const local = import.meta.env.VITE_STATIC_HUNT === "1";
let layout: Layout = readLocal();
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let cloudLoaded = false;

function readLocal(): Layout {
  if (typeof window === "undefined") return {};
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(layout));
  } catch {
    /* storage full */
  }
  if (local || !cloudLoaded) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void import("./layout-api").then((m) => m.saveLayout({ data: JSON.stringify(layout) })).catch(() => {});
  }, 1200);
}

export function setWin(id: string, patch: Partial<WinRect>, base: WinRect) {
  layout = { ...layout, [id]: { ...base, ...layout[id], ...patch } };
  emit();
  persist();
}

export function resetLayout() {
  layout = {};
  emit();
  persist();
}

export async function loadAccountLayout() {
  if (local) return;
  try {
    const m = await import("./layout-api");
    const text = await m.loadLayout();
    if (typeof text === "string" && text.length > 2) {
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === "object") {
        layout = parsed;
        emit();
        window.localStorage.setItem(KEY, text);
      }
    }
  } catch {
    /* keep local layout */
  } finally {
    cloudLoaded = true;
  }
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useLayout(): Layout {
  return useSyncExternalStore(subscribe, () => layout, () => layout);
}

export function isPinned(id: string): boolean {
  return !!layout[id]?.pinned;
}
