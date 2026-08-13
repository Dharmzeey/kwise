export interface Laptop {
  id: number;
  name: string;
  brand: "hp" | "dell" | "lenovo" | "acer" | "asus";
  processor: "pentium" | "celeron" | "amd" | "i3" | "i5" | "i7";
  gen: number;          // Intel gen (0 = N/A for Pentium/AMD)
  ram: number;          // GB
  storage: number;      // GB
  storageType: "ssd" | "hdd";
  screen: number;       // inches
  price: number;        // full Naira, e.g. 155000
  touch: boolean;
  kbl: boolean;         // keyboard backlight
  convertible: boolean;
  gpu: boolean;         // dedicated GPU
}

export const LAPTOPS: Laptop[] = [
  // ── Pentium / Celeron ──────────────────────────────────────────────────────
  { id:  1, name: "Lenovo ThinkPad Yoga 11e", brand: "lenovo", processor: "pentium", gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 11.6, price: 155000, touch: true,  kbl: false, convertible: true,  gpu: false },
  { id:  2, name: "Lenovo 300e",              brand: "lenovo", processor: "pentium", gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 11.6, price: 150000, touch: true,  kbl: false, convertible: true,  gpu: false },
  { id:  3, name: "Dell Latitude 3190 x360",  brand: "dell",   processor: "pentium", gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 11.6, price: 120000, touch: false, kbl: false, convertible: true,  gpu: false },
  { id:  4, name: "Dell Latitude 3190",       brand: "dell",   processor: "pentium", gen:  0, ram: 4, storage:   64, storageType: "ssd", screen: 11.6, price:  95000, touch: false, kbl: false, convertible: false, gpu: false },
  { id:  5, name: "Acer Travelmate B118",     brand: "acer",   processor: "celeron", gen:  0, ram: 4, storage:   64, storageType: "ssd", screen: 11.6, price:  95000, touch: false, kbl: false, convertible: false, gpu: false },
  { id:  6, name: "Acer Travelmate Spin B3",  brand: "acer",   processor: "celeron", gen:  0, ram: 4, storage:   64, storageType: "ssd", screen: 11.6, price:  95000, touch: false, kbl: false, convertible: true,  gpu: false },
  { id:  7, name: "HP 250 G4 (Pentium)",      brand: "hp",     processor: "pentium", gen:  0, ram: 4, storage:  500, storageType: "hdd", screen: 15.6, price: 105000, touch: false, kbl: false, convertible: false, gpu: false },
  { id:  8, name: "Asus E201N",               brand: "asus",   processor: "celeron", gen:  0, ram: 4, storage:   64, storageType: "ssd", screen: 11.6, price:  95000, touch: false, kbl: false, convertible: false, gpu: false },
  { id:  9, name: "Asus E410M",               brand: "asus",   processor: "pentium", gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 14.0, price: 130000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 10, name: "HP 250 G7 (Pentium)",      brand: "hp",     processor: "pentium", gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 15.6, price: 155000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 11, name: "HP 240 G7 (Pentium)",      brand: "hp",     processor: "pentium", gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 14.0, price: 160000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 12, name: "Asus E402M",               brand: "asus",   processor: "celeron", gen:  0, ram: 2, storage:  128, storageType: "ssd", screen: 14.0, price: 120000, touch: false, kbl: false, convertible: false, gpu: false },

  // ── AMD ────────────────────────────────────────────────────────────────────
  { id: 13, name: "HP Laptop 15 (AMD)",       brand: "hp",     processor: "amd",     gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 15.6, price: 150000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 14, name: "HP 245 G8 (AMD)",          brand: "hp",     processor: "amd",     gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 14.0, price: 160000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 15, name: "HP 255 G7 (AMD)",          brand: "hp",     processor: "amd",     gen:  0, ram: 4, storage:  128, storageType: "ssd", screen: 15.6, price: 155000, touch: false, kbl: false, convertible: false, gpu: false },

  // ── Core i3 ────────────────────────────────────────────────────────────────
  { id: 16, name: "Dell Vostro 15-3568",      brand: "dell",   processor: "i3",      gen:  7, ram: 4, storage:  128, storageType: "ssd", screen: 15.6, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 17, name: "Dell Latitude 3380",       brand: "dell",   processor: "i3",      gen:  6, ram: 4, storage:  128, storageType: "ssd", screen: 13.0, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 18, name: "Acer Aspire E5-475",       brand: "acer",   processor: "i3",      gen:  6, ram: 4, storage:  128, storageType: "ssd", screen: 14.0, price: 120000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 19, name: "HP ProBook 450 G2",        brand: "hp",     processor: "i3",      gen:  0, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 125000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 20, name: "HP Pavilion Notebook (i3)",brand: "hp",     processor: "i3",      gen:  5, ram: 8, storage: 1000, storageType: "hdd", screen: 15.6, price: 150000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 21, name: "HP 250 G5",               brand: "hp",     processor: "i3",      gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 130000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 22, name: "Lenovo B50-80 / B50-70",  brand: "lenovo", processor: "i3",      gen:  5, ram: 8, storage:  640, storageType: "hdd", screen: 15.6, price: 100000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 23, name: "Lenovo B50-50 (i3)",      brand: "lenovo", processor: "i3",      gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 120000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 24, name: "HP EliteBook 840 G1 (i3)",brand: "hp",     processor: "i3",      gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 14.0, price: 180000, touch: true,  kbl: false, convertible: false, gpu: false },
  { id: 25, name: "HP EliteBook 820 G1",     brand: "hp",     processor: "i3",      gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 12.5, price: 160000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 26, name: "Dell Latitude 3340 (i3)", brand: "dell",   processor: "i3",      gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 13.3, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 27, name: "Dell Latitude 3550 (i3)", brand: "dell",   processor: "i3",      gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 140000, touch: false, kbl: true,  convertible: false, gpu: false },

  // ── Core i5 ────────────────────────────────────────────────────────────────
  { id: 28, name: "Dell Latitude 3420",          brand: "dell", processor: "i5", gen: 11, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 360000, touch: true,  kbl: true,  convertible: false, gpu: false },
  { id: 29, name: "Dell Latitude 3410",          brand: "dell", processor: "i5", gen: 10, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 290000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 30, name: "HP 250 G7 (i5, 10th gen)",   brand: "hp",   processor: "i5", gen: 10, ram: 8, storage:  256, storageType: "ssd", screen: 15.6, price: 250000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 31, name: "Dell Latitude 5300 2-in-1",  brand: "dell", processor: "i5", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 13.0, price: 310000, touch: true,  kbl: true,  convertible: true,  gpu: false },
  { id: 32, name: "HP EliteBook 830 G6",        brand: "hp",   processor: "i5", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 13.0, price: 300000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 33, name: "Dell Latitude 7490",         brand: "dell", processor: "i5", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 290000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 34, name: "Dell Latitude 7290",         brand: "dell", processor: "i5", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 12.5, price: 240000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 35, name: "Dell Latitude 5490",         brand: "dell", processor: "i5", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 220000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 36, name: "HP EliteBook 840 G5/G6",     brand: "hp",   processor: "i5", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 300000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 37, name: "HP EliteBook 1030 G2",       brand: "hp",   processor: "i5", gen:  7, ram: 8, storage:  256, storageType: "ssd", screen: 13.0, price: 385000, touch: true,  kbl: false, convertible: true,  gpu: false },
  { id: 38, name: "Dell Latitude 5480",         brand: "dell", processor: "i5", gen:  7, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 220000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 39, name: "Dell Latitude 7280",         brand: "dell", processor: "i5", gen:  7, ram: 8, storage:  256, storageType: "ssd", screen: 12.5, price: 230000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 40, name: "HP EliteBook 840 G4",        brand: "hp",   processor: "i5", gen:  7, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 260000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 41, name: "HP EliteBook 840 G4 Touch",  brand: "hp",   processor: "i5", gen:  7, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 280000, touch: true,  kbl: true,  convertible: false, gpu: false },
  { id: 42, name: "HP EliteBook 840 G3 Touch",  brand: "hp",   processor: "i5", gen:  6, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 270000, touch: true,  kbl: true,  convertible: false, gpu: false },
  { id: 43, name: "HP EliteBook 840 G3",        brand: "hp",   processor: "i5", gen:  6, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 250000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 44, name: "HP 250 G4 (i5, 6th gen)",   brand: "hp",   processor: "i5", gen:  6, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 45, name: "Dell Latitude 3570",         brand: "dell", processor: "i5", gen:  6, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 160000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 46, name: "Acer Travelmate P258",       brand: "acer", processor: "i5", gen:  6, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 47, name: "Dell Latitude E5450 (KBL)",  brand: "dell", processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 160000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 48, name: "Dell Latitude E5450",        brand: "dell", processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 145000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 49, name: "HP EliteBook 840 G2 (i5)",  brand: "hp",   processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 195000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 50, name: "HP 250 G4 (i5, 5th gen)",   brand: "hp",   processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 51, name: "Dell Latitude 3550 (i5, 1TB)",brand:"dell", processor: "i5", gen:  5, ram: 8, storage: 1000, storageType: "hdd", screen: 15.6, price: 160000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 52, name: "Dell Latitude 3550 (i5)",    brand: "dell", processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 150000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 53, name: "Dell Latitude 3550 (no KBL)",brand: "dell", processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 54, name: "Dell Latitude 3450",         brand: "dell", processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 150000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 55, name: "Lenovo B50-50 (i5)",        brand: "lenovo",processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 135000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 56, name: "Dell Latitude E7250",        brand: "dell", processor: "i5", gen:  5, ram: 8, storage:  128, storageType: "ssd", screen: 12.5, price: 155000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 57, name: "Acer Aspire E5-573",         brand: "acer", processor: "i5", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 130000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 58, name: "HP EliteBook Revolve 810 G2",brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  256, storageType: "ssd", screen: 12.5, price: 150000, touch: false, kbl: true,  convertible: true,  gpu: false },
  { id: 59, name: "HP EliteBook 840 G1 (i5)",  brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 210000, touch: true,  kbl: true,  convertible: false, gpu: false },
  { id: 60, name: "HP EliteBook Folio 9480m",   brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 180000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 61, name: "Dell Latitude E7440",        brand: "dell", processor: "i5", gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 14.0, price: 155000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 62, name: "Dell Latitude E7240",        brand: "dell", processor: "i5", gen:  4, ram: 8, storage:  256, storageType: "ssd", screen: 12.5, price: 165000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 63, name: "Dell Latitude 3340 (i5)",   brand: "dell", processor: "i5", gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 13.3, price: 155000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 64, name: "HP EliteBook Folio 9470m",   brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 14.0, price: 175000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 65, name: "HP Pavilion 15 (i5)",        brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 140000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 66, name: "HP EliteBook 850 G1",        brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 170000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 67, name: "HP ProBook 640 G1",          brand: "hp",   processor: "i5", gen:  4, ram: 8, storage:  128, storageType: "ssd", screen: 14.0, price: 160000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 68, name: "Acer Travelmate P257",       brand: "acer", processor: "i5", gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 130000, touch: false, kbl: false, convertible: false, gpu: false },
  { id: 69, name: "Acer Travelmate P253",       brand: "acer", processor: "i5", gen:  0, ram: 8, storage:  500, storageType: "hdd", screen: 15.6, price: 100000, touch: false, kbl: false, convertible: false, gpu: false },

  // ── Core i7 ────────────────────────────────────────────────────────────────
  { id: 70, name: "HP EliteBook 840 G5 (i7)",  brand: "hp",   processor: "i7", gen:  8, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 370000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 71, name: "HP EliteBook 840 G3 (i7)",  brand: "hp",   processor: "i7", gen:  6, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 270000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 72, name: "Dell Latitude 7470",         brand: "dell", processor: "i7", gen:  6, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 255000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 73, name: "HP EliteBook 840 G2 (i7)",  brand: "hp",   processor: "i7", gen:  5, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 215000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 74, name: "HP EliteBook 820 G2 (i7)",  brand: "hp",   processor: "i7", gen:  5, ram: 8, storage:  128, storageType: "ssd", screen: 12.5, price: 190000, touch: false, kbl: true,  convertible: false, gpu: false },
  { id: 75, name: "Dell Latitude 7450 (Nvidia)",brand: "dell", processor: "i7", gen:  5, ram: 8, storage:  256, storageType: "ssd", screen: 14.0, price: 230000, touch: false, kbl: false, convertible: false, gpu: true  },
  { id: 76, name: "HP EliteBook 840 G1 (i7)",  brand: "hp",   processor: "i7", gen:  4, ram: 8, storage:  500, storageType: "hdd", screen: 14.0, price: 210000, touch: false, kbl: true,  convertible: false, gpu: false },
];
