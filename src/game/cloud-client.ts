const local = import.meta.env.VITE_STATIC_HUNT === "1";

export async function loadCloudSave(): Promise<string | null> {
  if (local) return null;
  const mod = await import("./cloud-save");
  return mod.loadCloudSave();
}

export async function writeCloudSave(args: { data: string }): Promise<boolean> {
  if (local) return false;
  const mod = await import("./cloud-save");
  return mod.writeCloudSave(args);
}
