import eventsPhotos from "@/content/generated/events-photos.json";
import menuPhotos from "@/content/generated/menu-photos.json";

/** Photos produced by scripts/build-photos.mjs from photos/<collection>/. */
export type PhotoCollection = "menu" | "events";
type PhotoManifest = Record<string, { width: number; height: number; sample: boolean }>;

const manifests: Record<PhotoCollection, PhotoManifest> = {
  menu: menuPhotos as PhotoManifest,
  events: eventsPhotos as PhotoManifest,
};

export type PhotoSource = { src: string; srcSet?: string; width?: number; height?: number; sample: boolean };

/** Resolve a photo reference: a processed local photo name (with srcset) or an https URL. */
export function photoSourceFor(collection: PhotoCollection, photo: string | undefined): PhotoSource | null {
  if (!photo) return null;
  if (photo.startsWith("https://")) return { src: photo, sample: false };
  const p = manifests[collection][photo];
  if (!p) return null;
  const base = `/images/${collection}/${photo}`;
  return {
    src: `${base}-960.webp`,
    srcSet: `${base}-240.webp 240w, ${base}-480.webp 480w, ${base}-960.webp 960w`,
    width: p.width,
    height: p.height,
    sample: p.sample,
  };
}
