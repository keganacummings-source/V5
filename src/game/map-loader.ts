import { buildWorld, type WorldData } from "./world";
import { fetchMapFile, mapToWorld, type MapFile } from "./map-format";
import { loadTileCatalog } from "./tile-atlas";

let cachedMain: WorldData | null = null;
let cachedMainFile: MapFile | null = null;
let loadPromise: Promise<WorldData> | null = null;

export async function loadMainWorld(seed = 42): Promise<WorldData> {
  void loadTileCatalog();
  if (cachedMain) return cachedMain;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    const file = await fetchMapFile("main");
    if (file) {
      cachedMainFile = file;
      cachedMain = mapToWorld(file);
      return cachedMain;
    }
    cachedMain = buildWorld(seed);
    return cachedMain;
  })();
  return loadPromise;
}

export function getMainWorldSync(seed = 42): WorldData {
  if (cachedMain) return cachedMain;
  return buildWorld(seed);
}

export function getMainMapFile(): MapFile | null {
  return cachedMainFile;
}

export async function loadNamedMap(id: string, seed = 42): Promise<WorldData> {
  if (id === "main" || id === "world") return loadMainWorld(seed);
  const file = await fetchMapFile(id);
  if (file) return mapToWorld(file);
  if (id === "crypt" || id === "kiln") {
    const { buildDungeon } = await import("./world");
    return buildDungeon(id as "crypt" | "kiln", seed);
  }
  return buildWorld(seed);
}

export function clearMapCache(): void {
  cachedMain = null;
  cachedMainFile = null;
  loadPromise = null;
}
