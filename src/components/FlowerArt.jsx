import { motion } from 'framer-motion'

// Vektörel çiçek ve buket illüstrasyonları (viewBox 0 0 200 260).
// Gerçekçi çiçekçi buketi: katmanlı origami tül kağıdı, cipso (baby's breath),
// ipeksi saten kurdele ve saksıda kalması gerekenler için modern seramik saksı.

/* ----- Cipso (Baby's Breath / Gypsophila) ----- */
function Gypsophila({ cx, cy, rot = 0, s = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`}>
      {/* İnce yeşil dallar */}
      <path
        d="M0 24 L0 8 M0 14 L-10 0 M0 11 L10 -1 M-10 0 L-16 -12 M-10 0 L-6 -14 M10 -1 L6 -15 M10 -1 L16 -12 M-6 -14 L-2 -22 M6 -15 L2 -22"
        stroke="#7ca884"
        strokeWidth="0.85"
        strokeLinecap="round"
        fill="none"
      />
      {/* Minik beyaz çiçek tomurcukları */}
      <circle cx="-16" cy="-12" r="2.6" fill="#ffffff" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.12))" />
      <circle cx="-6" cy="-14" r="2.4" fill="#ffffff" />
      <circle cx="-2" cy="-22" r="2.8" fill="#ffffff" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.12))" />
      <circle cx="2" cy="-22" r="2.8" fill="#ffffff" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.12))" />
      <circle cx="6" cy="-15" r="2.4" fill="#ffffff" />
      <circle cx="16" cy="-12" r="2.6" fill="#ffffff" filter="drop-shadow(0 1px 1px rgba(0,0,0,0.12))" />
      <circle cx="-10" cy="0" r="2.2" fill="#ffffff" />
      <circle cx="10" cy="-1" r="2.2" fill="#ffffff" />
      <circle cx="0" cy="8" r="2.2" fill="#ffffff" />
      {/* Çiçek merkezlerinde hafif sarımsı pırıltı */}
      <circle cx="-2" cy="-22" r="0.8" fill="#fff5cc" />
      <circle cx="2" cy="-22" r="0.8" fill="#fff5cc" />
      <circle cx="-16" cy="-12" r="0.8" fill="#fff5cc" />
      <circle cx="16" cy="-12" r="0.8" fill="#fff5cc" />
    </g>
  )
}

/* ----- Okaliptüs Yaprağı (Eucalyptus) ----- */
function EucalyptusLeaf({ x, y, rot = 0, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C-12 -12 -14 -32 0 -44 C14 -32 12 -12 0 0Z" fill="#5b8268" />
      <path d="M0 0 C-9 -10 -10 -26 0 -36 C10 -26 9 -10 0 0Z" fill="#6d987b" opacity="0.6" />
      <path d="M0 0 L0 -40" stroke="#446350" strokeWidth="1.2" fill="none" opacity="0.75" />
    </g>
  )
}

/* ----- Buket Arka Kağıdı (Katmanlı Origami / Tül Fiyonk Arkası) ----- */
function BouquetWrapBack({ tone = 'white' }) {
  const isKraft = tone === 'kraft'
  return (
    <g>
      {/* 1. Dış en yüksek açılı tül katmanı */}
      <polygon
        points="14,80 44,32 90,56 100,50 110,56 156,32 186,80 152,190 48,190"
        fill={isKraft ? '#ebd8be' : '#f5f7fc'}
        opacity="0.9"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.06))"
      />
      {/* Dış kanat gölgeleri ve kat çizgileri */}
      <polygon
        points="14,80 44,32 58,80 40,150"
        fill={isKraft ? '#ddc7ab' : '#e6eaf2'}
        opacity="0.6"
      />
      <polygon
        points="186,80 156,32 142,80 160,150"
        fill={isKraft ? '#ddc7ab' : '#e6eaf2'}
        opacity="0.6"
      />

      {/* 2. İç yarı saydam tül / tissue kağıdı katmanı */}
      <polygon
        points="26,92 60,48 94,68 100,64 106,68 140,48 174,92 146,192 54,192"
        fill={isKraft ? '#f3e6d3' : '#ffffff'}
        opacity="0.96"
      />
      {/* Çiçekler arkasında derinlik veren gölge katmanı */}
      <ellipse cx="100" cy="140" rx="55" ry="35" fill="#000000" opacity="0.08" />
    </g>
  )
}

/* ----- Buket Ön Kağıdı ve Saten Fiyonk ----- */
function BouquetWrapFront({ ribbonColor = '#7a96b8', ribbonDark = '#567294', tone = 'white' }) {
  const isKraft = tone === 'kraft'
  return (
    <g>
      {/* Ön çapraz sarma kağıdı (sol kanat) */}
      <path
        d="M42 162 L158 186 L144 252 L56 252 Z"
        fill={isKraft ? '#ebd8be' : '#f7f9fd'}
        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))"
      />
      {/* Ön çapraz sarma kağıdı (sağ kanat - üstte katlanan) */}
      <path
        d="M158 162 L42 188 L54 252 L144 252 Z"
        fill={isKraft ? '#f5e4cc' : '#ffffff'}
        filter="drop-shadow(0 3px 6px rgba(0,0,0,0.1))"
      />
      {/* Kıvrım gölgesi */}
      <path d="M42 188 L158 162 L150 178 L50 200 Z" fill="#000000" opacity="0.06" />

      {/* Yarı saydam tül kemer */}
      <path
        d="M48 170 Q100 196 152 170 L146 214 Q100 230 54 214 Z"
        fill="#ffffff"
        opacity="0.38"
      />

      {/* Saten Fiyonk - Arka kanat gölgeleri */}
      <ellipse cx="78" cy="210" rx="19" ry="12" fill={ribbonDark} opacity="0.3" transform="rotate(-15 78 210)" />
      <ellipse cx="122" cy="210" rx="19" ry="12" fill={ribbonDark} opacity="0.3" transform="rotate(15 122 210)" />

      {/* Sol Fiyonk Kanadı */}
      <path
        d="M100 206 C70 188 62 214 96 211 Z"
        fill={ribbonColor}
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.18))"
      />
      <path d="M100 206 C78 194 72 208 96 211 Z" fill={ribbonDark} opacity="0.45" />

      {/* Sağ Fiyonk Kanadı */}
      <path
        d="M100 206 C130 188 138 214 104 211 Z"
        fill={ribbonColor}
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.18))"
      />
      <path d="M100 206 C122 194 128 208 104 211 Z" fill={ribbonDark} opacity="0.45" />

      {/* Fiyonk Düğümü */}
      <ellipse cx="100" cy="207" rx="7.5" ry="6" fill={ribbonDark} />
      <ellipse cx="100" cy="206" rx="6.5" ry="5" fill={ribbonColor} />
      <ellipse cx="98.5" cy="204.5" rx="3.5" ry="2" fill="#ffffff" opacity="0.5" />

      {/* Fiyonk Kuyrukları (Aşağı sarkan saten kurdeleler - V kesimli uçlar) */}
      <path
        d="M96 210 C88 226 80 242 74 256 L83 252 L94 240 L99 212 Z"
        fill={ribbonColor}
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
      />
      <path d="M96 210 C90 224 84 238 80 250 L83 252 L94 240 Z" fill={ribbonDark} opacity="0.35" />

      <path
        d="M104 210 C112 226 120 242 126 256 L117 252 L106 240 L101 212 Z"
        fill={ribbonColor}
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.15))"
      />
      <path d="M104 210 C110 224 116 238 120 250 L117 252 L106 240 Z" fill={ribbonDark} opacity="0.35" />
    </g>
  )
}

/* ----- Katmanlı Gül (Layered Florist Rose) ----- */
function FloristRose({ cx, cy, r = 26, c = '#d6223a', dk = '#850e1e', hl = '#ff6378' }) {
  return (
    <g transform={`translate(${cx} ${cy})`} filter="drop-shadow(0 3px 5px rgba(0,0,0,0.22))">
      {/* Dış taban gölgesi */}
      <circle r={r} fill={dk} />

      {/* Dış taç yapraklar */}
      <path
        d={`M${-r * 0.95} 0 C${-r * 0.9} ${-r * 0.8} 0 ${-r * 0.95} ${r * 0.7} ${-r * 0.65} C${r * 0.95} ${-r * 0.2} ${r * 0.9} ${r * 0.6} 0 ${r * 0.92} C${-r * 0.7} ${r * 0.8} ${-r * 0.95} ${r * 0.4} ${-r * 0.95} 0Z`}
        fill={c}
      />

      {/* Orta kıvrımlı yaprak katmanları */}
      <path
        d={`M${-r * 0.7} ${-r * 0.3} Q${-r * 0.4} ${-r * 0.9} 0 ${-r * 0.8} Q${r * 0.6} ${-r * 0.75} ${r * 0.75} ${-r * 0.15} Q${r * 0.6} ${r * 0.6} 0 ${r * 0.7} Q${-r * 0.7} ${r * 0.5} ${-r * 0.7} ${-r * 0.3}Z`}
        fill={dk}
        opacity="0.85"
      />
      <path
        d={`M${-r * 0.65} ${-r * 0.25} C${-r * 0.4} ${-r * 0.75} 0 ${-r * 0.7} ${r * 0.65} ${-r * 0.1} C${r * 0.45} ${r * 0.5} 0 ${r * 0.6} ${-r * 0.6} ${-r * 0.2}Z`}
        fill={c}
      />

      {/* İç spiral gül göbeği */}
      <path
        d={`M${-r * 0.35} ${-r * 0.1} a${r * 0.28} ${r * 0.28} 0 1 1 ${r * 0.55} 0 a${r * 0.45} ${r * 0.45} 0 1 1 ${-r * 0.85} 0 a${r * 0.65} ${r * 0.65} 0 0 1 ${r * 1.25} ${-r * 0.25}`}
        fill="none"
        stroke={dk}
        strokeWidth={r * 0.08}
        strokeLinecap="round"
      />

      {/* Kadife ışıltı / Highlight */}
      <ellipse
        cx={-r * 0.35}
        cy={-r * 0.42}
        rx={r * 0.3}
        ry={r * 0.14}
        fill={hl}
        opacity="0.6"
        transform={`rotate(-28 ${-r * 0.35} ${-r * 0.42})`}
      />
      <ellipse
        cx={r * 0.32}
        cy={r * 0.25}
        rx={r * 0.22}
        ry={r * 0.1}
        fill={hl}
        opacity="0.45"
        transform={`rotate(25 ${r * 0.32} ${r * 0.25})`}
      />
    </g>
  )
}

/* ----- Papatya (Daisy) ----- */
function FloristDaisy({ cx, cy, r = 26 }) {
  return (
    <g transform={`translate(${cx} ${cy})`} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.16))">
      {/* 16 Taç yaprak */}
      {Array.from({ length: 16 }).map((_, i) => (
        <ellipse
          key={i}
          cx="0"
          cy={-r * 0.64}
          rx={r * 0.18}
          ry={r * 0.48}
          fill="#ffffff"
          stroke="#e0e4ee"
          strokeWidth="0.8"
          transform={`rotate(${(360 / 16) * i})`}
        />
      ))}
      {/* Sarı polen göbeği */}
      <circle r={r * 0.34} fill="#fca311" />
      <circle r={r * 0.34} fill="none" stroke="#d48208" strokeWidth="1.2" />
      <circle cx={-r * 0.08} cy={-r * 0.08} r={r * 0.12} fill="#ffdd66" />
      {/* Minik polen noktaları */}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={i}
          cx={Math.cos((i * Math.PI) / 4) * r * 0.2}
          cy={Math.sin((i * Math.PI) / 4) * r * 0.2}
          r={r * 0.035}
          fill="#c47200"
        />
      ))}
    </g>
  )
}

/* ----- Lale (Tulip) ----- */
function FloristTulip({ cx, cy, s = 1, c = '#ff5478', l = '#ff829e', d = '#c92a4e', rot = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`} filter="drop-shadow(0 3px 5px rgba(0,0,0,0.18))">
      <path d="M-16 0 C-22 -28 -10 -44 0 -52 C10 -44 22 -28 16 0 C10 12 -10 12 -16 0Z" fill={c} />
      <path d="M-16 0 C-20 -24 -10 -40 0 -52 C-4 -28 -7 -10 -8 8 C-13 6 -15 3 -16 0Z" fill={l} />
      <path d="M16 0 C20 -24 10 -40 0 -52 C4 -28 7 -10 8 8 C13 6 15 3 16 0Z" fill={d} opacity="0.6" />
      <path d="M-5 -38 L0 -52 L5 -38 L0 -22Z" fill={d} opacity="0.3" />
      <ellipse cx="-4" cy="-22" rx="3" ry="12" fill="#ffffff" opacity="0.3" transform="rotate(-10 -4 -22)" />
    </g>
  )
}

/* ----- Lavanta Dalı (Lavender Stem) ----- */
function LavenderSpike({ cx, cy, rot = 0, s = 1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`} filter="drop-shadow(0 2px 3px rgba(0,0,0,0.14))">
      {/* Yeşil sap */}
      <path d="M0 45 L0 -45" stroke="#5d8263" strokeWidth="2.4" strokeLinecap="round" />
      {/* Lavanta taneleri / buğdayımsı katmanlar */}
      {[-42, -34, -26, -18, -10, -2, 6, 14, 22].map((y, idx) => {
        const w = Math.max(5, 12 - Math.abs(idx - 5) * 1.2)
        return (
          <g key={y} transform={`translate(0 ${y})`}>
            <ellipse cx={-w * 0.65} cy="-1" rx={w * 0.55} ry={4} fill="#8252bd" transform="rotate(-25)" />
            <ellipse cx={w * 0.65} cy="-1" rx={w * 0.55} ry={4} fill="#8252bd" transform="rotate(25)" />
            <ellipse cx="0" cy="-2" rx={w * 0.45} ry={3.5} fill="#a478dc" />
            <ellipse cx="-1.5" cy="-2.5" rx={w * 0.22} ry={1.8} fill="#cca8f8" opacity="0.75" />
          </g>
        )
      })}
    </g>
  )
}

/* ----- Ayçiçeği (Sunflower) ----- */
function FloristSunflower({ cx, cy, r = 42 }) {
  return (
    <g transform={`translate(${cx} ${cy})`} filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))">
      {/* Arka petal katmanı */}
      {Array.from({ length: 18 }).map((_, i) => (
        <ellipse
          key={`back${i}`}
          cx="0"
          cy={-r * 0.72}
          rx={r * 0.16}
          ry={r * 0.38}
          fill="#f39c12"
          transform={`rotate(${(360 / 18) * i + 10})`}
        />
      ))}
      {/* Ön parlak petal katmanı */}
      {Array.from({ length: 18 }).map((_, i) => (
        <ellipse
          key={`front${i}`}
          cx="0"
          cy={-r * 0.68}
          rx={r * 0.17}
          ry={r * 0.39}
          fill="#f1c40f"
          transform={`rotate(${(360 / 18) * i})`}
        />
      ))}
      {/* Çekirdek disk */}
      <circle r={r * 0.44} fill="#543015" />
      <circle r={r * 0.44} fill="none" stroke="#361a06" strokeWidth="2" />
      {/* Çekirdek dokusu spirali */}
      {Array.from({ length: 32 }).map((_, i) => {
        const a = i * 2.4
        const dist = Math.sqrt(i / 32) * r * 0.37
        return (
          <circle
            key={i}
            cx={Math.cos(a) * dist}
            cy={Math.sin(a) * dist}
            r={r * 0.03}
            fill="#8e5a2d"
          />
        )
      })}
    </g>
  )
}

/* ----- Orkide Çiçeği (Phalaenopsis Blossom) ----- */
function OrchidFlower({ cx, cy, s = 1, rot = 0 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot}) scale(${s})`} filter="drop-shadow(0 3px 4px rgba(0,0,0,0.18))">
      {/* Üst taç yapraklar */}
      <ellipse cx="0" cy="-16" rx="14" ry="17" fill="#bc8be6" />
      <ellipse cx="-16" cy="-6" rx="15" ry="17" fill="#b17bdf" transform="rotate(-30 -16 -6)" />
      <ellipse cx="16" cy="-6" rx="15" ry="17" fill="#b17bdf" transform="rotate(30 16 -6)" />
      {/* Alt yan taç yapraklar */}
      <ellipse cx="-14" cy="11" rx="17" ry="11" fill="#9f63d6" transform="rotate(18 -14 11)" />
      <ellipse cx="14" cy="11" rx="17" ry="11" fill="#9f63d6" transform="rotate(-18 14 11)" />
      {/* Dudak / Labellum */}
      <path d="M-8 10 C-12 18 0 24 0 24 C0 24 12 18 8 10 C4 14 -4 14 -8 10 Z" fill="#d9489e" />
      <ellipse cx="0" cy="13" rx="6" ry="7" fill="#f4bbf0" />
      <circle cx="0" cy="8" r="3.5" fill="#fff5b3" />
      <circle cx="0" cy="8" r="1.5" fill="#f39c12" />
    </g>
  )
}

/* ----- Saksıda Mor Orkide (Potted Orchid) ----- */
function PottedOrchid() {
  return (
    <g>
      {/* Zemin gölgesi */}
      <ellipse cx="100" cy="254" rx="46" ry="6" fill="#000000" opacity="0.18" filter="blur(3px)" />

      {/* Bambu Destek Çubuğu */}
      <line x1="90" y1="190" x2="108" y2="44" stroke="#8d6e49" strokeWidth="3.2" strokeLinecap="round" />
      {/* Bambu boğumları */}
      <line x1="93" y1="150" x2="97" y2="150" stroke="#684e31" strokeWidth="2.5" />
      <line x1="98" y1="110" x2="102" y2="110" stroke="#684e31" strokeWidth="2.5" />
      <line x1="103" y1="70" x2="107" y2="70" stroke="#684e31" strokeWidth="2.5" />

      {/* Klipsler */}
      <rect x="91" y="146" width="7" height="6" rx="2" fill="#58855e" />
      <rect x="97" y="102" width="7" height="6" rx="2" fill="#58855e" />

      {/* Kavisli Orkide Dalı */}
      <path
        d="M90 190 Q94 130 106 80 Q118 36 150 48"
        stroke="#4f7a55"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Çiçekler (Daldan aşağı süzülen Phalaenopsis orkideleri) */}
      <OrchidFlower cx={146} cy={52} s={0.72} rot={22} />
      <OrchidFlower cx={130} cy={76} s={0.88} rot={8} />
      <OrchidFlower cx={108} cy={108} s={0.96} rot={-12} />
      <OrchidFlower cx={80} cy={144} s={0.82} rot={-26} />

      {/* Dal ucundaki minik yeşil tomurcuklar */}
      <circle cx={158} cy={44} r="3.5" fill="#629b6a" />
      <circle cx={164} cy={42} r="2.5" fill="#75b37e" />

      {/* Saksı Tabanı & Etli Geniş Orkide Yaprakları */}
      <g>
        <path d="M88 190 C62 184 46 195 38 206 C54 212 76 206 90 192 Z" fill="#3f6645" />
        <path d="M112 190 C138 184 154 195 162 206 C146 212 124 206 110 192 Z" fill="#4b7852" />
        <path d="M96 192 C80 178 70 188 64 202 C78 204 92 199 98 192 Z" fill="#568a5e" />
        <path d="M104 192 C120 178 130 188 136 202 C122 204 108 199 102 192 Z" fill="#426b48" />
        {/* Hava kökleri */}
        <path d="M86 190 Q74 204 68 214" stroke="#8fa88a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M114 190 Q124 202 130 216" stroke="#8fa88a" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>

      {/* Modern Seramik Saksı */}
      <g filter="drop-shadow(0 6px 12px rgba(0,0,0,0.14))">
        {/* Saksı tabağı */}
        <ellipse cx="100" cy="248" rx="42" ry="7" fill="#e2ddd5" />
        <ellipse cx="100" cy="246" rx="40" ry="5.5" fill="#f7f5f0" />

        {/* Saksı gövdesi (hafif konik zarif seramik) */}
        <path d="M62 188 L138 188 L130 245 L70 245 Z" fill="#fbfaf7" />
        <path d="M62 188 L85 188 L78 245 L70 245 Z" fill="#ede8df" opacity="0.75" />
        <path d="M138 188 L126 188 L122 245 L130 245 Z" fill="#ffffff" opacity="0.5" />

        {/* Saksı ağız çemberi */}
        <ellipse cx="100" cy="188" rx="38" ry="7" fill="#f3efe7" stroke="#e0dad0" strokeWidth="1" />

        {/* Toprak / Ağaç kabuğu substratı */}
        <ellipse cx="100" cy="188" rx="35" ry="5.5" fill="#3a2517" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle
            key={i}
            cx={75 + (i * 51) % 48}
            cy={186 + (i * 17) % 5}
            r={1.4}
            fill="#5a3d28"
          />
        ))}

        {/* Saksı üzerinde şık yatay altın varak detay */}
        <rect x="66" y="202" width="68" height="2.5" rx="1" fill="#d4af37" opacity="0.8" />
        <line x1="68" y1="207" x2="132" y2="207" stroke="#e0dad0" strokeWidth="1" strokeDasharray="3 3" />
      </g>
    </g>
  )
}

/* ----- Ana Çiçek Sanat Motoru ----- */
function Art({ type, color = 'red' }) {
  switch (type) {
    /* 1. Gül Buketi (Renk varyasyonları: mavi, kırmızı, beyaz, pembe, rengarenk) */
    case 'rose':
    default: {
      const isBlue = color === 'blue'
      const isWhite = color === 'white'
      const isPink = color === 'pink'
      const isMix = color === 'mix'

      // Kırmızı gül tonları
      const redTone = { c: '#cf1b32', dk: '#7c0b1a', hl: '#ff5e72' }
      const redCenter = { c: '#e0243b', dk: '#8e1022', hl: '#ff6b7e' }
      const redDeep = { c: '#b81227', dk: '#6d0815', hl: '#f24d62' }

      // Gece mavisi gül tonları (Pinterest referans tarzı)
      const blueTone = { c: '#1c4285', dk: '#0d2248', hl: '#3f6ec9' }
      const blueCenter = { c: '#2352a1', dk: '#102b5c', hl: '#5487df' }
      const blueDeep = { c: '#153366', dk: '#091730', hl: '#2b549e' }

      // Kuğu beyazı gül tonları
      const whiteTone = { c: '#f3f6fa', dk: '#c2cbd8', hl: '#ffffff' }
      const whiteCenter = { c: '#fafbfd', dk: '#d3dbe6', hl: '#ffffff' }
      const whiteDeep = { c: '#e6ecf5', dk: '#b0bcca', hl: '#ffffff' }

      // Pudra pembe gül tonları
      const pinkTone = { c: '#ea5a86', dk: '#9c2448', hl: '#ff8fb1' }
      const pinkCenter = { c: '#f4739a', dk: '#b32e54', hl: '#ffa8c2' }
      const pinkDeep = { c: '#d94773', dk: '#8a1b3b', hl: '#f77399' }

      let r1, r2, r3, r4, r5, r6, r7
      let ribbonColor = '#7b94b2'
      let ribbonDark = '#55708f'

      if (isBlue) {
        r1 = blueTone
        r2 = blueTone
        r3 = blueCenter
        r4 = blueDeep
        r5 = blueDeep
        r6 = blueCenter
        r7 = blueTone
        ribbonColor = '#6b89ae'
        ribbonDark = '#48668a'
      } else if (isWhite) {
        r1 = whiteTone
        r2 = whiteTone
        r3 = whiteCenter
        r4 = whiteDeep
        r5 = whiteDeep
        r6 = whiteCenter
        r7 = whiteTone
        ribbonColor = '#d4af37'
        ribbonDark = '#a88922'
      } else if (isPink) {
        r1 = pinkTone
        r2 = pinkTone
        r3 = pinkCenter
        r4 = pinkDeep
        r5 = pinkDeep
        r6 = pinkCenter
        r7 = pinkTone
        ribbonColor = '#e8789d'
        ribbonDark = '#b84d70'
      } else if (isMix) {
        // Rengarenk buket: Mavi, Kırmızı, Pembe ve Beyaz güllerin zengin harmonisi
        r1 = blueTone
        r2 = pinkTone
        r3 = redCenter
        r4 = redDeep
        r5 = blueDeep
        r6 = whiteCenter
        r7 = pinkTone
        ribbonColor = '#9b82be'
        ribbonDark = '#6e5691'
      } else {
        // Standart kırmızı
        r1 = redTone
        r2 = redTone
        r3 = redCenter
        r4 = redDeep
        r5 = redDeep
        r6 = redCenter
        r7 = redTone
        ribbonColor = '#7b94b2'
        ribbonDark = '#55708f'
      }

      return (
        <>
          <BouquetWrapBack tone="white" />

          {/* Arka Cipso & Okaliptüs Katmanı */}
          <EucalyptusLeaf x={56} y={115} rot={-45} s={0.9} />
          <EucalyptusLeaf x={144} y={115} rot={45} s={0.9} />
          <Gypsophila cx={46} cy={88} rot={-28} s={0.95} />
          <Gypsophila cx={154} cy={88} rot={28} s={0.95} />
          <Gypsophila cx={100} cy={60} rot={0} s={0.9} />

          {/* Gül Düzenlemesi (7'li zengin buket) */}
          {/* Üst sıra */}
          <FloristRose cx={72} cy={82} r={22} c={r1.c} dk={r1.dk} hl={r1.hl} />
          <FloristRose cx={128} cy={82} r={22} c={r2.c} dk={r2.dk} hl={r2.hl} />
          <FloristRose cx={100} cy={68} r={24} c={r3.c} dk={r3.dk} hl={r3.hl} />

          {/* Orta cipso dolgusu */}
          <Gypsophila cx={72} cy={118} rot={-15} s={0.8} />
          <Gypsophila cx={128} cy={118} rot={15} s={0.8} />

          {/* Orta sıra */}
          <FloristRose cx={60} cy={120} r={24} c={r4.c} dk={r4.dk} hl={r4.hl} />
          <FloristRose cx={140} cy={120} r={24} c={r5.c} dk={r5.dk} hl={r5.hl} />
          <FloristRose cx={100} cy={108} r={27} c={r6.c} dk={r6.dk} hl={r6.hl} />

          {/* Alt merkez gül */}
          <FloristRose cx={100} cy={148} r={25} c={r7.c} dk={r7.dk} hl={r7.hl} />

          {/* Ön tül sarma ve ipeksi saten fiyonk */}
          <BouquetWrapFront ribbonColor={ribbonColor} ribbonDark={ribbonDark} tone="white" />
        </>
      )
    }

    /* 2. Beyaz Papatya Buketi (Cipsolu kır papatyaları) */
    case 'daisy':
      return (
        <>
          <BouquetWrapBack tone="kraft" />

          {/* Yeşillik ve cipsolar */}
          <EucalyptusLeaf x={50} y={118} rot={-42} s={0.85} />
          <EucalyptusLeaf x={150} y={118} rot={42} s={0.85} />
          <Gypsophila cx={46} cy={82} rot={-25} s={0.9} />
          <Gypsophila cx={154} cy={82} rot={25} s={0.9} />
          <Gypsophila cx={100} cy={54} rot={0} s={0.85} />

          {/* Papatya çiçekleri (Zengin demet) */}
          <FloristDaisy cx={66} cy={76} r={24} />
          <FloristDaisy cx={134} cy={76} r={24} />
          <FloristDaisy cx={100} cy={64} r={27} />
          <Gypsophila cx={80} cy={114} rot={-12} s={0.75} />
          <Gypsophila cx={120} cy={114} rot={12} s={0.75} />
          <FloristDaisy cx={58} cy={118} r={25} />
          <FloristDaisy cx={142} cy={118} r={25} />
          <FloristDaisy cx={100} cy={110} r={28} />
          <FloristDaisy cx={100} cy={150} r={24} />

          <BouquetWrapFront ribbonColor="#e6b843" ribbonDark="#b88920" tone="kraft" />
        </>
      )

    /* 3. Lale Buketi (Zarif tül sargılı renkli laleler) */
    case 'tulip':
      return (
        <>
          <BouquetWrapBack tone="white" />

          {/* Zarif lale yaprakları */}
          <path d="M72 170 C50 130 40 90 48 64 C60 90 74 130 84 170 Z" fill="#679b72" opacity="0.9" />
          <path d="M128 170 C150 130 160 90 152 64 C140 90 126 130 116 170 Z" fill="#588a63" opacity="0.9" />
          <path d="M95 170 C90 120 86 80 94 50 C102 80 102 120 100 170 Z" fill="#75ab80" opacity="0.85" />

          {/* Minik cipso dokunuşları */}
          <Gypsophila cx={46} cy={94} rot={-30} s={0.8} />
          <Gypsophila cx={154} cy={94} rot={30} s={0.8} />

          {/* Lale çiçekleri */}
          <FloristTulip cx={64} cy={88} s={0.92} c="#ff5d8f" l="#ff8fb3" d="#d93a6c" rot={-14} />
          <FloristTulip cx={136} cy={88} s={0.92} c="#ff9e3b" l="#ffbf69" d="#d97514" rot={14} />
          <FloristTulip cx={100} cy={68} s={1.05} c="#ff4d6d" l="#ff758f" d="#c9184a" rot={0} />

          <FloristTulip cx={74} cy={126} s={1.0} c="#f72585" l="#b5179e" d="#7209b7" rot={-8} />
          <FloristTulip cx={126} cy={126} s={1.0} c="#ffb703" l="#ffd166" d="#fb8500" rot={8} />
          <FloristTulip cx={100} cy={138} s={1.08} c="#e63946" l="#ff6b6b" d="#ba181b" rot={0} />

          <BouquetWrapFront ribbonColor="#e85d75" ribbonDark="#b83248" tone="white" />
        </>
      )

    /* 4. Lavanta Buketi (Mor lavanta başakları, cipso ve saten fiyonk) */
    case 'lavender':
      return (
        <>
          <BouquetWrapBack tone="kraft" />

          {/* İnce yeşil lavanta yaprakları */}
          <path d="M70 170 C54 130 50 100 58 75 C66 100 74 130 80 170 Z" fill="#678d6b" opacity="0.8" />
          <path d="M130 170 C146 130 150 100 142 75 C134 100 126 130 120 170 Z" fill="#597d5d" opacity="0.8" />

          {/* Cipso serpintisi */}
          <Gypsophila cx={46} cy={88} rot={-25} s={0.85} />
          <Gypsophila cx={154} cy={88} rot={25} s={0.85} />
          <Gypsophila cx={100} cy={54} rot={0} s={0.8} />

          {/* Lavanta Başakları */}
          <LavenderSpike cx={58} cy={95} rot={-18} s={0.85} />
          <LavenderSpike cx={142} cy={95} rot={18} s={0.85} />
          <LavenderSpike cx={76} cy={80} rot={-8} s={0.92} />
          <LavenderSpike cx={124} cy={80} rot={8} s={0.92} />
          <LavenderSpike cx={100} cy={66} rot={0} s={1.0} />

          {/* Ön dolgun lavantalar */}
          <LavenderSpike cx={70} cy={128} rot={-12} s={0.95} />
          <LavenderSpike cx={130} cy={128} rot={12} s={0.95} />
          <LavenderSpike cx={90} cy={116} rot={-4} s={1.02} />
          <LavenderSpike cx={110} cy={116} rot={4} s={1.02} />
          <LavenderSpike cx={100} cy={142} rot={0} s={0.92} />

          <BouquetWrapFront ribbonColor="#8f65c9" ribbonDark="#67419e" tone="kraft" />
        </>
      )

    /* 5. Ayçiçeği Buketi (Güneş sarısı çiçekler, cipso & kraft buket sargısı) */
    case 'sunflower':
      return (
        <>
          <BouquetWrapBack tone="kraft" />

          {/* Okaliptüs & cipso */}
          <EucalyptusLeaf x={50} y={116} rot={-45} s={0.9} />
          <EucalyptusLeaf x={150} y={116} rot={45} s={0.9} />
          <Gypsophila cx={46} cy={84} rot={-24} s={0.9} />
          <Gypsophila cx={154} cy={84} rot={24} s={0.9} />
          <Gypsophila cx={100} cy={52} rot={0} s={0.85} />

          {/* Ayçiçekleri (Büyük merkez ve zarif yan çiçekler) */}
          <FloristSunflower cx={66} cy={84} r={32} />
          <FloristSunflower cx={134} cy={84} r={32} />
          <FloristSunflower cx={100} cy={72} r={38} />

          <Gypsophila cx={80} cy={122} rot={-10} s={0.8} />
          <Gypsophila cx={120} cy={122} rot={10} s={0.8} />

          <FloristSunflower cx={100} cy={124} r={44} />

          <BouquetWrapFront ribbonColor="#c98a3e" ribbonDark="#98611f" tone="kraft" />
        </>
      )

    /* 6. Saksıda Mor Orkide (Özel seramik saksıda kalıcı orkide) */
    case 'orchid':
      return <PottedOrchid />
  }
}

export default function FlowerArt({ type = 'rose', color = 'red', size = 200, sway = true, className = '' }) {
  return (
    <motion.svg
      viewBox="0 0 200 260"
      width={size}
      height={(size * 260) / 200}
      className={className}
      style={{
        originX: '50%',
        originY: '96%',
        overflow: 'visible',
        filter: 'drop-shadow(0 12px 18px rgba(0,0,0,.16))',
      }}
      animate={sway ? { rotate: [-1.6, 1.6, -1.6] } : undefined}
      transition={sway ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      aria-hidden="true"
    >
      <Art type={type} color={color} />
    </motion.svg>
  )
}
