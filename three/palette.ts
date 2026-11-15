/**
 * Scene colours. Brand colours come first; the rest are "material" colours
 * (wood, steel, plaster, sky) that the brand palette can't cover.
 * Keep in step with styles/globals.css @theme for the brand ones.
 */
export const PALETTE = {
  // brand
  red: "#8F2925",
  redDark: "#72211E",
  yellow: "#E9B83E",
  cream: "#F6EBD3",
  creamDark: "#E5D8BF",
  paper: "#FBF5E8",
  ink: "#2B1D16",
  clay: "#B5653A",
  // materials
  wood: "#7A4A2A",
  woodDark: "#4E2E1A",
  woodLight: "#A0693F",
  steel: "#A7ADB0",
  plaster: "#D9A75B",
  plasterAlt: "#C98E6B",
  plasterBlue: "#6F8F9A",
  stone: "#BDAE94",
  asphalt: "#3A312C",
  teal: "#2F7F7A",
  chai: "#B97A43",
  chalkboard: "#26302B",
  bulb: "#FFD38A",
  // evening light
  skyTop: "#2B2950",
  skyMid: "#8C4A63",
  skyLow: "#E58A4E",
  lampLight: "#FFB866",
  interiorLight: "#FFC27A",
} as const;
