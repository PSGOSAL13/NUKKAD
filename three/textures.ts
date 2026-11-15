import * as THREE from "three";
import { PALETTE as P } from "./palette";

/**
 * Hand-painted textures drawn with <canvas> at runtime: zero image downloads,
 * crisp at any size, and fully on-brand. Text uses the site's Yatra One font
 * once it has loaded (with a serif fallback until then).
 */

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function brandFont(px: number, weight = ""): string {
  const family =
    typeof document !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue("--font-yatra").trim()
      : "";
  return `${weight} ${px}px ${family || "Georgia, serif"}`.trim();
}

/** Create a CanvasTexture and redraw it once web fonts are ready. */
export function canvasTexture(w: number, h: number, draw: Draw, opts: { repeat?: [number, number] } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  if (opts.repeat) {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(...opts.repeat);
  }
  const paint = () => {
    ctx.clearRect(0, 0, w, h);
    draw(ctx, w, h);
    tex.needsUpdate = true;
  };
  paint();
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.load(brandFont(40)).then(paint, () => {});
  }
  return tex;
}

/** Light paper/plaster grain so flat colours don't look plasticky. */
function grain(ctx: CanvasRenderingContext2D, w: number, h: number, alpha = 0.06, n = 2200) {
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = `rgba(43,29,22,${Math.random() * alpha})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

// ---------- Street ----------

export const plasterTexture = (base: string) =>
  canvasTexture(
    256,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 26; i++) {
        ctx.fillStyle = `rgba(255,240,210,${Math.random() * 0.08})`;
        ctx.beginPath();
        ctx.ellipse(
          Math.random() * w,
          Math.random() * h,
          10 + Math.random() * 40,
          6 + Math.random() * 24,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      grain(ctx, w, h, 0.08);
    },
    { repeat: [2, 2] },
  );

export const awningTexture = () =>
  canvasTexture(512, 160, (ctx, w, h) => {
    const stripes = 10;
    const sw = w / stripes;
    const band = h - sw / 2;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 ? P.yellow : P.red;
      ctx.fillRect(i * sw, 0, sw, band);
      ctx.beginPath();
      ctx.arc(i * sw + sw / 2, band, sw / 2, 0, Math.PI);
      ctx.fill();
    }
    grain(ctx, w, band, 0.1, 900);
  });

/** Wooden signboard with the reverse NUKKAD logo painted on. */
export function signboardTexture() {
  const tex = canvasTexture(1024, 220, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, P.woodLight);
    g.addColorStop(1, P.wood);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(43,29,22,0.25)";
    for (let y = 8; y < h; y += 14 + Math.random() * 10) {
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y + 6, w * 0.6, y - 6, w, y + 3);
      ctx.stroke();
    }
    ctx.strokeStyle = P.yellow;
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 14, w - 28, h - 28);
  });
  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    const canvas = tex.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const targetH = canvas.height * 0.62;
    const ratio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 4.6;
    const targetW = Math.min(canvas.width * 0.86, targetH * ratio);
    ctx.drawImage(
      img,
      (canvas.width - targetW) / 2,
      (canvas.height - targetW / ratio) / 2,
      targetW,
      targetW / ratio,
    );
    tex.needsUpdate = true;
  };
  img.src = "/brand/nukkad-secondary-reverse.svg";
  return tex;
}

/** Corrugated rolling shutter, painted with a welcome. */
export const shutterTexture = () =>
  canvasTexture(512, 512, (ctx, w, h) => {
    for (let y = 0; y < h; y += 16) {
      const g = ctx.createLinearGradient(0, y, 0, y + 16);
      g.addColorStop(0, "#7E8C83");
      g.addColorStop(0.5, "#A9B4AA");
      g.addColorStop(1, "#5E6A62");
      ctx.fillStyle = g;
      ctx.fillRect(0, y, w, 16);
    }
    ctx.fillStyle = "rgba(140,70,30,0.18)";
    for (let i = 0; i < 40; i++)
      ctx.fillRect(Math.random() * w, h * 0.7 + Math.random() * h * 0.3, 4 + Math.random() * 18, 3);
    ctx.fillStyle = P.yellow;
    ctx.font = brandFont(86);
    ctx.textAlign = "center";
    ctx.fillText("Aaiye!", w / 2, h * 0.45);
    ctx.font = brandFont(40);
    ctx.fillStyle = P.cream;
    ctx.fillText("Chai taiyaar hai", w / 2, h * 0.58);
  });

/** Painted counter front: bold stripes and a "Garam Chai" sign. */
export const counterFrontTexture = () =>
  canvasTexture(512, 256, (ctx, w, h) => {
    ctx.fillStyle = P.teal;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = P.yellow;
    ctx.fillRect(0, 0, w, 26);
    ctx.fillStyle = P.red;
    ctx.fillRect(0, h - 30, w, 30);
    for (let x = 0; x < w; x += 32) {
      ctx.fillStyle = P.cream;
      ctx.beginPath();
      ctx.moveTo(x, 26);
      ctx.lineTo(x + 16, 46);
      ctx.lineTo(x + 32, 26);
      ctx.fill();
    }
    ctx.fillStyle = P.cream;
    ctx.font = brandFont(70);
    ctx.textAlign = "center";
    ctx.fillText("Garam Chai", w / 2, h * 0.62);
    ctx.fillStyle = P.yellow;
    ctx.font = brandFont(34);
    ctx.fillText("★ Kulhad Special ★", w / 2, h * 0.8);
    grain(ctx, w, h, 0.12, 1200);
  });

/** Invented vintage posters (no real brands). */
const POSTERS = [
  { bg: P.yellow, fg: P.red, title: "CHAI", sub: "Har mausam, har mood", motif: "cup" },
  { bg: P.red, fg: P.cream, title: "Radio Sangeet", sub: "Sandhya 7 baje", motif: "radio" },
  { bg: P.teal, fg: P.yellow, title: "Cycle Mela", sub: "Puncture? Ho jayega!", motif: "wheel" },
  { bg: P.cream, fg: P.red, title: "Talkies", sub: "Aaj ka show — housefull", motif: "star" },
] as const;

export const posterTexture = (index: number) =>
  canvasTexture(256, 360, (ctx, w, h) => {
    const p = POSTERS[index % POSTERS.length];
    ctx.fillStyle = p.bg;
    ctx.fillRect(0, 0, w, h);
    // halftone dots
    ctx.fillStyle = "rgba(43,29,22,0.12)";
    for (let y = 8; y < h; y += 10)
      for (let x = (y / 10) % 2 ? 5 : 0; x < w; x += 10) ctx.fillRect(x, y, 2.5, 2.5);
    ctx.strokeStyle = p.fg;
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.fillStyle = p.fg;
    ctx.textAlign = "center";
    ctx.font = brandFont(p.title.length > 6 ? 38 : 64);
    ctx.fillText(p.title, w / 2, 86);
    // motif
    ctx.lineWidth = 7;
    const cx = w / 2,
      cy = h * 0.56;
    ctx.beginPath();
    if (p.motif === "cup") {
      ctx.moveTo(cx - 45, cy - 30);
      ctx.lineTo(cx + 45, cy - 30);
      ctx.lineTo(cx + 32, cy + 45);
      ctx.lineTo(cx - 32, cy + 45);
      ctx.closePath();
      ctx.fill();
      for (const dx of [-18, 0, 18]) {
        ctx.moveTo(cx + dx, cy - 40);
        ctx.bezierCurveTo(cx + dx - 10, cy - 55, cx + dx + 10, cy - 65, cx + dx, cy - 80);
      }
      ctx.stroke();
    } else if (p.motif === "radio") {
      ctx.roundRect(cx - 60, cy - 35, 120, 75, 12);
      ctx.fill();
      ctx.fillStyle = p.bg;
      ctx.beginPath();
      ctx.arc(cx - 25, cy + 3, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(cx + 10, cy - 15, 38, 8);
      ctx.fillRect(cx + 10, cy + 5, 38, 8);
    } else if (p.motif === "wheel") {
      ctx.arc(cx, cy, 52, 0, Math.PI * 2);
      for (let a = 0; a < Math.PI; a += Math.PI / 6) {
        ctx.moveTo(cx + Math.cos(a) * 52, cy + Math.sin(a) * 52);
        ctx.lineTo(cx - Math.cos(a) * 52, cy - Math.sin(a) * 52);
      }
      ctx.stroke();
    } else {
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 26 : 58;
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = p.fg;
    ctx.font = brandFont(24);
    ctx.fillText(p.sub, w / 2, h - 40);
    grain(ctx, w, h, 0.14, 1600);
  });

// ---------- Interior ----------

export const floorTexture = () =>
  canvasTexture(
    512,
    512,
    (ctx, w, h) => {
      const plank = 64;
      for (let i = 0; i < w / plank; i++) {
        const shade = 0.85 + Math.random() * 0.25;
        ctx.fillStyle = `rgb(${Math.round(122 * shade)},${Math.round(74 * shade)},${Math.round(42 * shade)})`;
        ctx.fillRect(i * plank, 0, plank, h);
        ctx.fillStyle = "rgba(43,29,22,0.45)";
        ctx.fillRect(i * plank, 0, 2, h);
        const cut = Math.random() * h;
        ctx.fillRect(i * plank, cut, plank, 2);
      }
      grain(ctx, w, h, 0.1, 3000);
    },
    { repeat: [3, 3] },
  );

/** The "Chai & Conversations" chalkboard wall. */
export const chalkboardTexture = () =>
  canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = P.chalkboard;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < 60; i++)
      ctx.fillRect(Math.random() * w, Math.random() * h, 80 + Math.random() * 160, 18);
    ctx.textAlign = "center";
    ctx.fillStyle = P.yellow;
    ctx.font = brandFont(78);
    ctx.fillText("Chai & Conversations", w / 2, 110);
    ctx.fillStyle = P.cream;
    ctx.font = brandFont(40);
    const lines = [
      "Ek cutting ho jaaye?",
      "Kya haal hai, dost?",
      "Yaaron ki mehfil",
      "Baatein kam, chai zyada… ya ulta?",
    ];
    lines.forEach((l, i) => ctx.fillText(l, w / 2 + (i % 2 ? 60 : -60), 200 + i * 70));
    ctx.strokeStyle = P.cream;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.25, 135);
    ctx.bezierCurveTo(w * 0.4, 145, w * 0.6, 128, w * 0.75, 138);
    ctx.stroke();
  });

/** Sepia "old photo" frames for the nostalgia wall (illustrated, not real photos). */
const SCENES = ["train", "talkies", "hills", "tonga", "kite"] as const;
export const nostalgiaTexture = (index: number) =>
  canvasTexture(256, 200, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#E9D3A8");
    g.addColorStop(1, "#B48A5A");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#5A3C24";
    ctx.strokeStyle = "#5A3C24";
    ctx.lineWidth = 4;
    const s = SCENES[index % SCENES.length];
    if (s === "train") {
      ctx.fillRect(20, 120, 150, 40);
      ctx.fillRect(150, 95, 40, 65);
      for (let x = 40; x < 190; x += 40) {
        ctx.beginPath();
        ctx.arc(x, 165, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(205, 80, 14, 0, Math.PI * 2);
      ctx.arc(225, 62, 18, 0, Math.PI * 2);
      ctx.fill();
    } else if (s === "talkies") {
      ctx.fillRect(40, 70, 176, 110);
      ctx.fillStyle = "#E9D3A8";
      ctx.font = brandFont(30);
      ctx.textAlign = "center";
      ctx.fillText("TALKIES", w / 2, 110);
      ctx.fillRect(110, 130, 36, 50);
    } else if (s === "hills") {
      ctx.beginPath();
      ctx.moveTo(0, 170);
      ctx.lineTo(70, 80);
      ctx.lineTo(120, 140);
      ctx.lineTo(180, 60);
      ctx.lineTo(256, 170);
      ctx.fill();
    } else if (s === "tonga") {
      ctx.beginPath();
      ctx.arc(150, 150, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillRect(110, 100, 90, 22);
      ctx.fillRect(40, 110, 60, 30);
      ctx.fillRect(48, 140, 6, 30);
      ctx.fillRect(86, 140, 6, 30);
    } else {
      ctx.beginPath();
      ctx.moveTo(150, 40);
      ctx.lineTo(185, 80);
      ctx.lineTo(150, 120);
      ctx.lineTo(115, 80);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(150, 120);
      ctx.bezierCurveTo(120, 150, 90, 140, 60, 190);
      ctx.stroke();
    }
    grain(ctx, w, h, 0.18, 1500);
  });

export const carromTexture = () =>
  canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#E7C98F";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = P.red;
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, w - 60, h - 60);
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 34, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = P.ink;
    for (const [x, y] of [
      [14, 14],
      [w - 14, 14],
      [14, h - 14],
      [w - 14, h - 14],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();
    }
    const coins = ["#F6EBD3", "#2B1D16", "#F6EBD3", "#2B1D16", "#8F2925", "#F6EBD3", "#2B1D16"];
    coins.forEach((c, i) => {
      const a = (i / coins.length) * Math.PI * 2;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(
        w / 2 + Math.cos(a) * (i === 4 ? 0 : 14),
        h / 2 + Math.sin(a) * (i === 4 ? 0 : 14),
        7,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    });
  });

export const ludoTexture = () =>
  canvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = P.paper;
    ctx.fillRect(0, 0, w, h);
    const q = w * 0.4;
    [
      [0, 0, P.red],
      [w - q, 0, "#2F6F3A"],
      [0, h - q, P.yellow],
      [w - q, h - q, "#2E5E8C"],
    ].forEach(([x, y, c]) => {
      ctx.fillStyle = c as string;
      ctx.fillRect(x as number, y as number, q, q);
      ctx.fillStyle = P.paper;
      ctx.fillRect((x as number) + q * 0.18, (y as number) + q * 0.18, q * 0.64, q * 0.64);
    });
    ctx.strokeStyle = "rgba(43,29,22,0.4)";
    for (let i = 0; i <= 15; i++) {
      ctx.beginPath();
      ctx.moveTo((i * w) / 15, q);
      ctx.lineTo((i * w) / 15, h - q);
      ctx.moveTo(q, (i * h) / 15);
      ctx.lineTo(w - q, (i * h) / 15);
      ctx.stroke();
    }
  });

/** Soft round puff used by the steam particles. */
export const puffTexture = () =>
  canvasTexture(64, 64, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });

/** Dusk sky gradient for the backdrop. */
export const skyTexture = () =>
  canvasTexture(16, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, P.skyTop);
    g.addColorStop(0.55, P.skyMid);
    g.addColorStop(1, P.skyLow);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
