"use client";

import { useEffect, useState } from "react";
import { menuFromCsv, type MenuData } from "./menu-sheet";

const SHEET_URL = process.env.NEXT_PUBLIC_MENU_SHEET_CSV_URL;

/**
 * Starts with the menu baked into the page at build time, then (if a Google
 * Sheet is connected) quietly fetches the live sheet so price and Sold Out
 * changes appear without rebuilding the site. Any problem → keep what we have.
 */
export function useLiveMenu(initial: MenuData): MenuData {
  const [menu, setMenu] = useState(initial);
  useEffect(() => {
    if (!SHEET_URL) return;
    const ctrl = new AbortController();
    fetch(SHEET_URL, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((csv) => {
        const result = menuFromCsv(csv);
        if (result.ok) setMenu(result.menu);
        else console.warn("[NUKKAD] live menu ignored — sheet has problems:", result.errors);
      })
      .catch((e: unknown) => {
        if ((e as Error).name !== "AbortError") console.warn("[NUKKAD] live menu unavailable:", e);
      });
    return () => ctrl.abort();
  }, []);
  return menu;
}
