import { motion } from 'framer-motion'

// Vektörel Peluş Oyuncak İllüstrasyonları (viewBox 0 0 200 220)
// Fil ve Penguen hariç diğer tüm peluşlar (Ayıcık, Tavşan, Kedi, Köpek, Kuzu)
// renk paletine göre özelleşebilir; kontrast ve yüz detayları daima korunur.

/* ===== PALETLER ===== */

const BEAR_PALETTES = {
  classic: {
    body: '#b07342', dark: '#9e6237', light: '#b57a48',
    patch: '#ecd0b2', stitch: '#9e6237',
    nose: '#3b2314', bow: '#e11d48', bowDark: '#be123c',
    blush: '#f43f5e',
  },
  pink: {
    body: '#f472b6', dark: '#db2777', light: '#f9a8d4',
    patch: '#fdf2f8', stitch: '#db2777',
    nose: '#831843', bow: '#8b5cf6', bowDark: '#6d28d9',
    blush: '#fb7185',
  },
  blue: {
    body: '#60a5fa', dark: '#2563eb', light: '#93c5fd',
    patch: '#eff6ff', stitch: '#3b82f6',
    nose: '#1e3a8a', bow: '#f43f5e', bowDark: '#e11d48',
    blush: '#fb7185',
  },
  white: {
    body: '#f8fafc', dark: '#cbd5e1', light: '#ffffff',
    patch: '#fff1f2', stitch: '#cbd5e1',
    nose: '#334155', bow: '#e11d48', bowDark: '#be123c',
    blush: '#f43f5e',
  },
  red: {
    body: '#e11d48', dark: '#9f1239', light: '#fb7185',
    patch: '#ffe4e6', stitch: '#be123c',
    nose: '#4c0519', bow: '#fbbf24', bowDark: '#f59e0b',
    blush: '#fda4af',
  },
  purple: {
    body: '#c084fc', dark: '#9333ea', light: '#e9d5ff',
    patch: '#faf5ff', stitch: '#a855f7',
    nose: '#581c87', bow: '#ec4899', bowDark: '#db2777',
    blush: '#f472b6',
  },
}

const RABBIT_PALETTES = {
  classic: {
    body: '#f8f5ee', dark: '#f0eae0', light: '#fdfaf3',
    earInner: '#fbcfe8', patch: '#ffffff',
    nose: '#f472b6', mouth: '#4a3e3d',
    flower: '#fda4af', blush: '#f472b6',
  },
  pink: {
    body: '#fce7f3', dark: '#f472b6', light: '#fdf2f8',
    earInner: '#ffffff', patch: '#fff5f9',
    nose: '#db2777', mouth: '#831843',
    flower: '#c084fc', blush: '#ec4899',
  },
  blue: {
    body: '#dbeafe', dark: '#60a5fa', light: '#eff6ff',
    earInner: '#ffffff', patch: '#f0f9ff',
    nose: '#2563eb', mouth: '#1e3a8a',
    flower: '#f472b6', blush: '#60a5fa',
  },
  white: {
    body: '#ffffff', dark: '#e2e8f0', light: '#ffffff',
    earInner: '#fbcfe8', patch: '#f8fafc',
    nose: '#f472b6', mouth: '#475569',
    flower: '#fb7185', blush: '#f472b6',
  },
  red: {
    body: '#fecdd3', dark: '#e11d48', light: '#ffe4e6',
    earInner: '#fff1f2', patch: '#ffffff',
    nose: '#be123c', mouth: '#4c0519',
    flower: '#fbbf24', blush: '#e11d48',
  },
  purple: {
    body: '#ede9fe', dark: '#a855f7', light: '#faf5ff',
    earInner: '#ffffff', patch: '#f5f3ff',
    nose: '#7e22ce', mouth: '#581c87',
    flower: '#f472b6', blush: '#a855f7',
  },
}

const CAT_PALETTES = {
  classic: {
    body: '#fbbf24', dark: '#f59e0b', stripes: '#d97706',
    chest: '#fffbeb', collar: '#06b6d4', bell: '#fbbf24',
    nose: '#f43f5e', mouth: '#451a03', blush: '#fb7185',
  },
  pink: {
    body: '#f9a8d4', dark: '#ec4899', stripes: '#db2777',
    chest: '#fff1f2', collar: '#8b5cf6', bell: '#fbbf24',
    nose: '#e11d48', mouth: '#831843', blush: '#db2777',
  },
  blue: {
    body: '#93c5fd', dark: '#3b82f6', stripes: '#1d4ed8',
    chest: '#eff6ff', collar: '#f43f5e', bell: '#fbbf24',
    nose: '#e11d48', mouth: '#1e3a8a', blush: '#60a5fa',
  },
  white: {
    body: '#f8fafc', dark: '#cbd5e1', stripes: '#94a3b8',
    chest: '#ffffff', collar: '#e11d48', bell: '#fbbf24',
    nose: '#f43f5e', mouth: '#334155', blush: '#fb7185',
  },
  red: {
    body: '#f87171', dark: '#dc2626', stripes: '#991b1b',
    chest: '#fee2e2', collar: '#fbbf24', bell: '#fef08a',
    nose: '#7f1d1d', mouth: '#450a0a', blush: '#ef4444',
  },
  purple: {
    body: '#c084fc', dark: '#9333ea', stripes: '#6b21a8',
    chest: '#faf5ff', collar: '#06b6d4', bell: '#fbbf24',
    nose: '#db2777', mouth: '#581c87', blush: '#a855f7',
  },
}

const DOG_PALETTES = {
  classic: {
    body: '#d97706', dark: '#92400e', spot: '#92400e',
    chest: '#fef3c7', bandanna: '#dc2626', nose: '#1c1917',
    blush: '#ef4444',
  },
  pink: {
    body: '#f472b6', dark: '#be185d', spot: '#9d174d',
    chest: '#fdf2f8', bandanna: '#6366f1', nose: '#1c1917',
    blush: '#be185d',
  },
  blue: {
    body: '#60a5fa', dark: '#2563eb', spot: '#1e40af',
    chest: '#eff6ff', bandanna: '#ef4444', nose: '#1c1917',
    blush: '#3b82f6',
  },
  white: {
    body: '#f8fafc', dark: '#94a3b8', spot: '#64748b',
    chest: '#ffffff', bandanna: '#dc2626', nose: '#1c1917',
    blush: '#ef4444',
  },
  red: {
    body: '#ef4444', dark: '#b91c1c', spot: '#7f1d1d',
    chest: '#fee2e2', bandanna: '#fbbf24', nose: '#1c1917',
    blush: '#991b1b',
  },
  purple: {
    body: '#a855f7', dark: '#7e22ce', spot: '#581c87',
    chest: '#faf5ff', bandanna: '#06b6d4', nose: '#1c1917',
    blush: '#7e22ce',
  },
}

const LAMB_PALETTES = {
  classic: {
    wool: '#f5f0e6', woolTop: '#fdfbf7', face: '#faeee3',
    earInner: '#fbcfe8', hoof: '#8d7465', ribbon: '#f472b6',
    bell: '#fbbf24', blush: '#fb7185', mouth: '#57423f',
  },
  pink: {
    wool: '#fce7f3', woolTop: '#fdf2f8', face: '#fdf2f8',
    earInner: '#ffffff', hoof: '#be185d', ribbon: '#8b5cf6',
    bell: '#fbbf24', blush: '#ec4899', mouth: '#831843',
  },
  blue: {
    wool: '#e0f2fe', woolTop: '#f0f9ff', face: '#f0f9ff',
    earInner: '#ffffff', hoof: '#0369a1', ribbon: '#f43f5e',
    bell: '#fbbf24', blush: '#60a5fa', mouth: '#1e3a8a',
  },
  white: {
    wool: '#ffffff', woolTop: '#f8fafc', face: '#faeee3',
    earInner: '#fbcfe8', hoof: '#78716c', ribbon: '#e11d48',
    bell: '#fbbf24', blush: '#fb7185', mouth: '#475569',
  },
  red: {
    wool: '#ffe4e6', woolTop: '#fff1f2', face: '#fee2e2',
    earInner: '#fff1f2', hoof: '#9f1239', ribbon: '#f59e0b',
    bell: '#fde047', blush: '#e11d48', mouth: '#4c0519',
  },
  purple: {
    wool: '#f3e8ff', woolTop: '#faf5ff', face: '#faf5ff',
    earInner: '#ffffff', hoof: '#6b21a8', ribbon: '#ec4899',
    bell: '#fbbf24', blush: '#a855f7', mouth: '#581c87',
  },
}

/* ----- Ayıcık (Bear) ----- */
function BearPlush({ color = 'classic' }) {
  const c = BEAR_PALETTES[color] || BEAR_PALETTES.classic

  return (
    <g>
      {/* Kulaklar */}
      <circle cx="62" cy="54" r="22" fill={c.dark} />
      <circle cx="62" cy="54" r="14" fill={c.patch} />
      <circle cx="138" cy="54" r="22" fill={c.dark} />
      <circle cx="138" cy="54" r="14" fill={c.patch} />

      {/* Gövde */}
      <ellipse cx="100" cy="148" rx="48" ry="46" fill={c.body} />
      {/* Göbek Yaması */}
      <ellipse cx="100" cy="150" rx="32" ry="30" fill={c.patch} />
      {/* Göbek Dikişleri */}
      <ellipse
        cx="100"
        cy="150"
        rx="32"
        ry="30"
        fill="none"
        stroke={c.stitch}
        strokeWidth="1.2"
        strokeDasharray="3 3"
        opacity="0.65"
      />

      {/* Bacaklar / Patiler */}
      <ellipse cx="64" cy="188" rx="20" ry="16" fill={c.dark} />
      <ellipse cx="64" cy="189" rx="13" ry="10" fill={c.patch} />
      <ellipse cx="136" cy="188" rx="20" ry="16" fill={c.dark} />
      <ellipse cx="136" cy="189" rx="13" ry="10" fill={c.patch} />

      {/* Kollar */}
      <ellipse cx="50" cy="136" rx="14" ry="24" fill={c.dark} transform="rotate(22 50 136)" />
      <ellipse cx="150" cy="136" rx="14" ry="24" fill={c.dark} transform="rotate(-22 150 136)" />

      {/* Kafa */}
      <ellipse cx="100" cy="88" rx="46" ry="42" fill={c.light} />

      {/* Burun / Ağız Bölgesi (Muzzle) */}
      <ellipse cx="100" cy="98" rx="22" ry="17" fill={c.patch} />
      <path
        d="M93 90 C95 86, 105 86, 107 90 C107 96, 93 96, 93 90 Z"
        fill={c.nose}
      />
      <path d="M100 94 L100 102 M94 102 C96 106, 100 106, 100 102 C100 106, 104 106, 106 102" stroke={c.nose} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Boncuk Gözler (Daima parlayan derin siyah boncuklar) */}
      <circle cx="80" cy="80" r="6" fill="#18181b" />
      <circle cx="78" cy="78" r="2.2" fill="#ffffff" />
      <circle cx="82" cy="82" r="1" fill="#ffffff" opacity="0.8" />

      <circle cx="120" cy="80" r="6" fill="#18181b" />
      <circle cx="118" cy="78" r="2.2" fill="#ffffff" />
      <circle cx="122" cy="82" r="1" fill="#ffffff" opacity="0.8" />

      {/* Allık */}
      <ellipse cx="68" cy="96" rx="8" ry="5" fill={c.blush} opacity="0.4" />
      <ellipse cx="132" cy="96" rx="8" ry="5" fill={c.blush} opacity="0.4" />

      {/* Sevimli Papyon */}
      <g transform="translate(100 120)">
        <path d="M0 0 L-14 -8 L-14 8 Z" fill={c.bow} />
        <path d="M0 0 L14 -8 L14 8 Z" fill={c.bow} />
        <circle cx="0" cy="0" r="4.5" fill={c.bowDark} />
        <circle cx="-1" cy="-1" r="1.5" fill="#ffffff" opacity="0.6" />
      </g>
    </g>
  )
}

/* ----- Tavşan (Rabbit) ----- */
function RabbitPlush({ color = 'classic' }) {
  const c = RABBIT_PALETTES[color] || RABBIT_PALETTES.classic

  return (
    <g>
      {/* Kulaklar (Uzun ve sevimli) */}
      <g transform="rotate(-9 74 65)">
        <ellipse cx="74" cy="38" rx="14" ry="38" fill={c.dark} />
        <ellipse cx="74" cy="40" rx="8" ry="28" fill={c.earInner} />
      </g>
      <g transform="rotate(11 126 65)">
        <ellipse cx="126" cy="38" rx="14" ry="38" fill={c.dark} />
        <ellipse cx="126" cy="40" rx="8" ry="28" fill={c.earInner} />
      </g>

      {/* Gövde */}
      <ellipse cx="100" cy="150" rx="44" ry="42" fill={c.body} />
      {/* Göbek */}
      <ellipse cx="100" cy="152" rx="30" ry="26" fill={c.patch} />

      {/* Patiler (ayaklar) */}
      <ellipse cx="66" cy="188" rx="18" ry="14" fill={c.dark} />
      <ellipse cx="66" cy="189" rx="11" ry="8" fill={c.earInner} />
      <ellipse cx="134" cy="188" rx="18" ry="14" fill={c.dark} />
      <ellipse cx="134" cy="189" rx="11" ry="8" fill={c.earInner} />

      {/* Kollar */}
      <ellipse cx="56" cy="140" rx="12" ry="20" fill={c.dark} transform="rotate(20 56 140)" />
      <ellipse cx="144" cy="140" rx="12" ry="20" fill={c.dark} transform="rotate(-20 144 140)" />

      {/* Kafa */}
      <ellipse cx="100" cy="94" rx="44" ry="38" fill={c.light} />

      {/* Burun (Kalp şeklinde) */}
      <path
        d="M100 97 C98 94, 94 94, 94 97 C94 100, 100 103, 100 103 C100 103, 106 100, 106 97 C106 94, 102 94, 100 97 Z"
        fill={c.nose}
      />
      {/* Ağız */}
      <path d="M100 103 L100 107 M95 107 C97 110, 100 110, 100 107 C100 110, 103 110, 105 107" stroke={c.mouth} strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Bıyıklar */}
      <path d="M72 101 L58 99 M72 105 L56 107 M128 101 L142 99 M128 105 L144 107" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />

      {/* Gözler */}
      <circle cx="82" cy="88" r="5.5" fill="#18181b" />
      <circle cx="80.5" cy="86" r="2" fill="#ffffff" />
      <circle cx="83.5" cy="89.5" r="0.9" fill="#ffffff" opacity="0.8" />

      <circle cx="118" cy="88" r="5.5" fill="#18181b" />
      <circle cx="116.5" cy="86" r="2" fill="#ffffff" />
      <circle cx="119.5" cy="89.5" r="0.9" fill="#ffffff" opacity="0.8" />

      {/* Yanaklar */}
      <ellipse cx="72" cy="100" rx="9" ry="6" fill={c.blush} opacity="0.4" />
      <ellipse cx="128" cy="100" rx="9" ry="6" fill={c.blush} opacity="0.4" />

      {/* Kulak Kenarı Minik Çiçek */}
      <g transform="translate(126 62)">
        <circle cx="0" cy="-4" r="3.5" fill={c.flower} />
        <circle cx="4" cy="0" r="3.5" fill={c.flower} />
        <circle cx="0" cy="4" r="3.5" fill={c.flower} />
        <circle cx="-4" cy="0" r="3.5" fill={c.flower} />
        <circle cx="0" cy="0" r="2.8" fill="#fde047" />
      </g>
    </g>
  )
}

/* ----- Kedi (Cat) ----- */
function CatPlush({ color = 'classic' }) {
  const c = CAT_PALETTES[color] || CAT_PALETTES.classic

  return (
    <g>
      {/* Kuyruk */}
      <path
        d="M136 170 C162 172, 178 152, 172 134 C168 126, 160 128, 162 136 C164 144, 154 156, 134 158"
        fill={c.dark}
        stroke={c.stripes}
        strokeWidth="1"
      />

      {/* Kulaklar */}
      <polygon points="56,76 70,40 88,64" fill={c.dark} />
      <polygon points="62,72 71,46 84,64" fill={c.chest} />
      <polygon points="144,76 130,40 112,64" fill={c.dark} />
      <polygon points="138,72 129,46 116,64" fill={c.chest} />

      {/* Gövde */}
      <ellipse cx="100" cy="148" rx="45" ry="42" fill={c.body} />
      {/* Göğüs */}
      <path d="M82 126 C82 126, 100 134, 118 126 C124 146, 120 174, 100 176 C80 174, 76 146, 82 126 Z" fill={c.chest} />

      {/* Patiler (ayaklar) */}
      <ellipse cx="68" cy="186" rx="18" ry="14" fill={c.dark} />
      <circle cx="68" cy="186" r="6" fill={c.chest} />
      <ellipse cx="132" cy="186" rx="18" ry="14" fill={c.dark} />
      <circle cx="132" cy="186" r="6" fill={c.chest} />

      {/* Ön Patiler */}
      <ellipse cx="78" cy="146" rx="11" ry="18" fill={c.body} transform="rotate(10 78 146)" />
      <ellipse cx="122" cy="146" rx="11" ry="18" fill={c.body} transform="rotate(-10 122 146)" />

      {/* Kafa */}
      <ellipse cx="100" cy="90" rx="46" ry="38" fill={c.body} />

      {/* Alındaki sevimli tekir çizgileri */}
      <path d="M100 62 L100 70 M92 64 L95 72 M108 64 L105 72" stroke={c.stripes} strokeWidth="2.5" strokeLinecap="round" />

      {/* Burun & Ağız */}
      <polygon points="96,93 104,93 100,98" fill={c.nose} />
      <path d="M100 98 L100 102 M93 102 C96 106, 100 106, 100 102 C100 106, 104 106, 107 102" stroke={c.mouth} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Bıyıklar */}
      <path d="M68 96 L48 93 M68 101 L46 103 M132 96 L152 93 M132 101 L154 103" stroke="#334155" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />

      {/* Gözler */}
      <ellipse cx="80" cy="85" rx="6" ry="6.5" fill="#18181b" />
      <circle cx="78" cy="83" r="2.4" fill="#ffffff" />
      <circle cx="82" cy="86.5" r="1.1" fill="#ffffff" opacity="0.8" />

      <ellipse cx="120" cy="85" rx="6" ry="6.5" fill="#18181b" />
      <circle cx="118" cy="83" r="2.4" fill="#ffffff" />
      <circle cx="122" cy="86.5" r="1.1" fill="#ffffff" opacity="0.8" />

      {/* Yanaklar */}
      <ellipse cx="68" cy="95" rx="8" ry="5" fill={c.blush} opacity="0.4" />
      <ellipse cx="132" cy="95" rx="8" ry="5" fill={c.blush} opacity="0.4" />

      {/* Boyun Tasması ve Çıngırak (Bell) */}
      <rect x="76" y="118" width="48" height="6" rx="3" fill={c.collar} />
      <circle cx="100" cy="124" r="6" fill={c.bell} stroke="#d97706" strokeWidth="1" />
      <circle cx="100" cy="125" r="1.5" fill="#78350f" />
    </g>
  )
}

/* ----- Köpek (Dog) ----- */
function DogPlush({ color = 'classic' }) {
  const c = DOG_PALETTES[color] || DOG_PALETTES.classic

  return (
    <g>
      {/* Sarkık Kulaklar */}
      <path
        d="M62 66 C42 70, 36 104, 52 118 C58 122, 68 116, 68 100 Z"
        fill={c.dark}
      />
      <path
        d="M138 66 C158 70, 164 104, 148 118 C142 122, 132 116, 132 100 Z"
        fill={c.dark}
      />

      {/* Gövde */}
      <ellipse cx="100" cy="150" rx="46" ry="42" fill={c.body} />
      {/* Göğüs Yaması */}
      <ellipse cx="100" cy="152" rx="30" ry="28" fill={c.chest} />

      {/* Patiler (ayaklar) */}
      <ellipse cx="65" cy="188" rx="19" ry="14" fill={c.dark} />
      <circle cx="65" cy="189" r="6" fill={c.chest} />
      <ellipse cx="135" cy="188" rx="19" ry="14" fill={c.dark} />
      <circle cx="135" cy="189" r="6" fill={c.chest} />

      {/* Kollar */}
      <ellipse cx="54" cy="144" rx="13" ry="20" fill={c.dark} transform="rotate(18 54 144)" />
      <ellipse cx="146" cy="144" rx="13" ry="20" fill={c.dark} transform="rotate(-18 146 144)" />

      {/* Kafa */}
      <ellipse cx="100" cy="90" rx="45" ry="40" fill={c.body} />

      {/* Sağ Göz Çevresinde Sevimli Benek */}
      <ellipse cx="120" cy="85" rx="16" ry="18" fill={c.spot} opacity="0.9" />

      {/* Sevimli Ağız / Burun Bölgesi */}
      <ellipse cx="100" cy="100" rx="22" ry="16" fill={c.chest} />
      <path
        d="M92 92 C94 88, 106 88, 108 92 C108 97, 92 97, 92 92 Z"
        fill={c.nose}
      />
      <path d="M100 95 L100 103 M94 103 C97 107, 100 107, 100 103 C100 107, 103 107, 106 103" stroke={c.nose} strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Minik Dışarı Çıkan Dil */}
      <path d="M98 106 C98 111, 104 111, 104 106 Z" fill="#f43f5e" />

      {/* Boncuk Gözler */}
      <circle cx="80" cy="83" r="5.5" fill="#18181b" />
      <circle cx="78.5" cy="81" r="2.2" fill="#ffffff" />

      <circle cx="120" cy="83" r="5.5" fill="#18181b" />
      <circle cx="118.5" cy="81" r="2.2" fill="#ffffff" />

      {/* Yanak Allığı */}
      <ellipse cx="68" cy="98" rx="8" ry="5" fill={c.blush} opacity="0.38" />
      <ellipse cx="132" cy="98" rx="8" ry="5" fill={c.blush} opacity="0.38" />

      {/* Fular (Bandanna) */}
      <polygon points="76,122 124,122 100,140" fill={c.bandanna} />
      <circle cx="92" cy="128" r="1.8" fill="#ffffff" />
      <circle cx="108" cy="128" r="1.8" fill="#ffffff" />
      <circle cx="100" cy="133" r="1.8" fill="#ffffff" />
    </g>
  )
}

/* ----- Fil (Elephant) — Orijinal Doğal İllüstrasyon (Değişmez) ----- */
function ElephantPlush() {
  return (
    <g>
      {/* Büyük Sevimli Fil Kulakları */}
      <ellipse cx="48" cy="85" rx="34" ry="40" fill="#94a3b8" />
      <ellipse cx="48" cy="86" rx="22" ry="28" fill="#fce7f3" />

      <ellipse cx="152" cy="85" rx="34" ry="40" fill="#94a3b8" />
      <ellipse cx="152" cy="86" rx="22" ry="28" fill="#fce7f3" />

      {/* Gövde */}
      <ellipse cx="100" cy="150" rx="48" ry="44" fill="#94a3b8" />
      {/* Göbek */}
      <ellipse cx="100" cy="152" rx="34" ry="30" fill="#cbd5e1" />

      {/* Pofuduk Bacaklar & Patiler */}
      <ellipse cx="66" cy="188" rx="20" ry="15" fill="#64748b" />
      <circle cx="58" cy="190" r="3.5" fill="#ffffff" opacity="0.8" />
      <circle cx="66" cy="192" r="3.5" fill="#ffffff" opacity="0.8" />
      <circle cx="74" cy="190" r="3.5" fill="#ffffff" opacity="0.8" />

      <ellipse cx="134" cy="188" rx="20" ry="15" fill="#64748b" />
      <circle cx="126" cy="190" r="3.5" fill="#ffffff" opacity="0.8" />
      <circle cx="134" cy="192" r="3.5" fill="#ffffff" opacity="0.8" />
      <circle cx="142" cy="190" r="3.5" fill="#ffffff" opacity="0.8" />

      {/* Kollar */}
      <ellipse cx="50" cy="144" rx="14" ry="22" fill="#8294a8" transform="rotate(18 50 144)" />
      <ellipse cx="150" cy="144" rx="14" ry="22" fill="#8294a8" transform="rotate(-18 150 144)" />

      {/* Kafa */}
      <ellipse cx="100" cy="90" rx="44" ry="38" fill="#94a3b8" />

      {/* Sevimli Yukarı Kıvrık Hortum */}
      <path
        d="M93 92 C93 114, 90 124, 102 124 C112 124, 114 112, 108 106 C105 104, 103 108, 105 110 C107 114, 104 118, 100 117 C96 116, 99 104, 107 92 Z"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="1"
      />
      {/* Hortum boğum çizgileri */}
      <path d="M96 99 Q100 102 104 99 M96 105 Q100 108 103 105" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Gözler */}
      <circle cx="78" cy="82" r="5.5" fill="#1e293b" />
      <circle cx="76.5" cy="80" r="2.2" fill="#ffffff" />
      <path d="M72 76 Q78 72 84 76" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      <circle cx="122" cy="82" r="5.5" fill="#1e293b" />
      <circle cx="120.5" cy="80" r="2.2" fill="#ffffff" />
      <path d="M116 76 Q122 72 128 76" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Yanaklar */}
      <ellipse cx="68" cy="94" rx="8" ry="5" fill="#f43f5e" opacity="0.34" />
      <ellipse cx="132" cy="94" rx="8" ry="5" fill="#f43f5e" opacity="0.34" />

      {/* Boyun Kurdelesi */}
      <path d="M90 126 C96 130, 104 130, 110 126" stroke="#a855f7" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="128" r="3.5" fill="#c084fc" />
    </g>
  )
}

/* ----- Penguen (Penguin) — Orijinal Klasik İllüstrasyon (Değişmez) ----- */
function PenguinPlush() {
  return (
    <g>
      {/* Kanatlar / Paletler */}
      <ellipse cx="46" cy="136" rx="12" ry="32" fill="#1e293b" transform="rotate(24 46 136)" />
      <ellipse cx="154" cy="136" rx="12" ry="32" fill="#1e293b" transform="rotate(-24 154 136)" />

      {/* Gövde & Kafa */}
      <ellipse cx="100" cy="132" rx="54" ry="62" fill="#1e293b" />

      {/* Beyaz Göbek / Yüz Maskesi */}
      <path
        d="M74 88 C74 72, 86 64, 100 64 C114 64, 126 72, 126 88 C126 100, 134 116, 134 146 C134 176, 118 186, 100 186 C82 186, 66 176, 66 146 C66 116, 74 100, 74 88 Z"
        fill="#ffffff"
      />

      {/* Turuncu Ayaklar */}
      <ellipse cx="76" cy="192" rx="16" ry="10" fill="#f59e0b" />
      <ellipse cx="124" cy="192" rx="16" ry="10" fill="#f59e0b" />

      {/* Boncuk Gözler */}
      <circle cx="86" cy="88" r="5.5" fill="#0f172a" />
      <circle cx="84.5" cy="86" r="2.2" fill="#ffffff" />

      <circle cx="114" cy="88" r="5.5" fill="#0f172a" />
      <circle cx="112.5" cy="86" r="2.2" fill="#ffffff" />

      {/* Turuncu Gaga */}
      <polygon points="93,95 107,95 100,105" fill="#f59e0b" />
      <polygon points="95,95 105,95 100,99" fill="#fbbf24" />

      {/* Pembe Yanak Allığı */}
      <ellipse cx="74" cy="98" rx="8" ry="5" fill="#f43f5e" opacity="0.38" />
      <ellipse cx="126" cy="98" rx="8" ry="5" fill="#f43f5e" opacity="0.38" />

      {/* Kırmızı Fiyonk */}
      <g transform="translate(100 120)">
        <path d="M0 0 L-14 -8 L-14 8 Z" fill="#ef4444" />
        <path d="M0 0 L14 -8 L14 8 Z" fill="#ef4444" />
        <circle cx="0" cy="0" r="4.5" fill="#b91c1c" />
        <circle cx="-1" cy="-1" r="1.5" fill="#ffffff" opacity="0.6" />
      </g>
    </g>
  )
}

/* ----- Kuzu (Lamb) ----- */
function LambPlush({ color = 'classic' }) {
  const c = LAMB_PALETTES[color] || LAMB_PALETTES.classic

  return (
    <g>
      {/* Sarkık Kuzu Kulakları */}
      <g transform="rotate(-15 62 82)">
        <ellipse cx="50" cy="88" rx="18" ry="10" fill={c.wool} />
        <ellipse cx="50" cy="88" rx="12" ry="6" fill={c.earInner} />
      </g>
      <g transform="rotate(15 138 82)">
        <ellipse cx="150" cy="88" rx="18" ry="10" fill={c.wool} />
        <ellipse cx="150" cy="88" rx="12" ry="6" fill={c.earInner} />
      </g>

      {/* Gövde: Pofuduk Yün Bulutları */}
      <g fill={c.wool}>
        <circle cx="100" cy="148" r="42" />
        <circle cx="70" cy="140" r="20" />
        <circle cx="130" cy="140" r="20" />
        <circle cx="68" cy="164" r="18" />
        <circle cx="132" cy="164" r="18" />
        <circle cx="100" cy="176" r="22" />
      </g>

      {/* Küçük Ayaklar */}
      <rect x="76" y="180" width="14" height="16" rx="7" fill={c.face} />
      <rect x="76" y="190" width="14" height="6" rx="3" fill={c.hoof} />
      <rect x="110" y="180" width="14" height="16" rx="7" fill={c.face} />
      <rect x="110" y="190" width="14" height="6" rx="3" fill={c.hoof} />

      {/* Yüz Bölgesi */}
      <ellipse cx="100" cy="100" rx="36" ry="32" fill={c.face} />

      {/* Başın Üstündeki Pofuduk Yün Tacı */}
      <g fill={c.woolTop}>
        <circle cx="82" cy="72" r="14" />
        <circle cx="100" cy="66" r="16" />
        <circle cx="118" cy="72" r="14" />
      </g>

      {/* Burun & Ağız */}
      <path
        d="M96 103 C96 101, 104 101, 104 103 C104 107, 96 107, 96 103 Z"
        fill="#f472b6"
      />
      <path d="M100 106 L100 111 M94 111 C97 114, 100 114, 100 111 C100 114, 103 114, 106 111" stroke={c.mouth} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Gözler */}
      <circle cx="84" cy="94" r="5" fill="#18181b" />
      <circle cx="82.5" cy="92.5" r="2" fill="#ffffff" />

      <circle cx="116" cy="94" r="5" fill="#18181b" />
      <circle cx="114.5" cy="92.5" r="2" fill="#ffffff" />

      {/* Yanak Allığı */}
      <ellipse cx="74" cy="106" rx="8" ry="5" fill={c.blush} opacity="0.4" />
      <ellipse cx="126" cy="106" rx="8" ry="5" fill={c.blush} opacity="0.4" />

      {/* Çıngıraklı Kurdele */}
      <path d="M84 130 C94 135, 106 135, 116 130" stroke={c.ribbon} strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="100" cy="133" r="5" fill={c.bell} stroke="#d97706" strokeWidth="1" />
      <circle cx="100" cy="134" r="1.2" fill="#78350f" />
    </g>
  )
}

const ART_MAP = {
  bear: BearPlush,
  rabbit: RabbitPlush,
  cat: CatPlush,
  dog: DogPlush,
  elephant: ElephantPlush,
  penguin: PenguinPlush,
  lamb: LambPlush,
}

export default function PlushArt({
  type = 'bear',
  color = 'classic',
  size = 160,
  sway = false,
  onClick,
  className = '',
}) {
  const Component = ART_MAP[type] || BearPlush

  const swayAnim = sway
    ? {
        animate: {
          rotate: [-2.5, 2.5, -2.5],
          y: [0, -3, 0],
          scale: [1, 1.02, 1],
        },
        transition: {
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : {}

  return (
    <motion.div
      className={`plush-art-wrap ${className}`}
      style={{
        width: size,
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      onClick={onClick}
      {...swayAnim}
    >
      <svg
        viewBox="0 0 200 220"
        width={size}
        height={Math.round((size * 220) / 200)}
        style={{ display: 'block', overflow: 'visible' }}
        filter="drop-shadow(0 10px 18px rgba(0,0,0,0.12))"
      >
        {/* Zemin Yumuşak Peluş Gölgesi */}
        <ellipse cx="100" cy="202" rx="58" ry="12" fill="#000000" opacity="0.12" />
        <Component color={color} />
      </svg>
    </motion.div>
  )
}
