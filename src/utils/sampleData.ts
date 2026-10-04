import { SampleProduct } from "../types";

// Helper to generate SVG Data URLs with realistic product mockups on cluttered backgrounds
function createSvgDataUrl(svgContent: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
}

const cosmeticSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Background textures simulating bathroom counter -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#b8a99a" />
      <stop offset="40%" stop-color="#8c7866" />
      <stop offset="100%" stop-color="#5a493b" />
    </linearGradient>
    <linearGradient id="tileGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#d4c8bc" />
      <stop offset="100%" stop-color="#ab9d8f" />
    </linearGradient>
    <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#e8a87c" stop-opacity="0.9" />
      <stop offset="25%" stop-color="#ffdda1" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#c38d9e" stop-opacity="0.85" />
      <stop offset="80%" stop-color="#e27d60" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#85586f" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="goldCap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d4af37" />
      <stop offset="35%" stop-color="#fff2b2" />
      <stop offset="65%" stop-color="#d4af37" />
      <stop offset="100%" stop-color="#997a15" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="-10" dy="25" stdDeviation="20" flood-color="#2c1e14" flood-opacity="0.6"/>
    </filter>
    <filter id="glassReflect">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>

  <!-- Cluttered background -->
  <rect width="800" height="800" fill="url(#bgGrad)" />
  
  <!-- Bathroom wall tiles with grout lines (clutter) -->
  <g opacity="0.35">
    <rect x="0" y="0" width="260" height="200" fill="url(#tileGrad)" stroke="#4a3b2c" stroke-width="3"/>
    <rect x="270" y="0" width="260" height="200" fill="url(#tileGrad)" stroke="#4a3b2c" stroke-width="3"/>
    <rect x="540" y="0" width="260" height="200" fill="url(#tileGrad)" stroke="#4a3b2c" stroke-width="3"/>
    <rect x="0" y="210" width="260" height="200" fill="url(#tileGrad)" stroke="#4a3b2c" stroke-width="3"/>
    <rect x="270" y="210" width="260" height="200" fill="url(#tileGrad)" stroke="#4a3b2c" stroke-width="3"/>
    <rect x="540" y="210" width="260" height="200" fill="url(#tileGrad)" stroke="#4a3b2c" stroke-width="3"/>
  </g>

  <!-- Distracting background objects (leaf, towel, toothbrush holder) -->
  <path d="M 50 150 Q 120 80 200 130 Q 150 220 50 150 Z" fill="#4d533c" opacity="0.6"/>
  <path d="M 120 180 Q 220 120 280 190 Q 200 270 120 180 Z" fill="#38432a" opacity="0.5"/>
  <rect x="620" y="280" width="120" height="180" rx="15" fill="#dedede" opacity="0.4" stroke="#888"/>
  <line x1="650" y1="280" x2="630" y2="180" stroke="#ff7675" stroke-width="12" stroke-linecap="round"/>
  <line x1="680" y1="280" x2="690" y2="160" stroke="#74b9ff" stroke-width="10" stroke-linecap="round"/>

  <!-- Countertop edge line -->
  <rect x="0" y="440" width="800" height="360" fill="#6d5947" opacity="0.85"/>
  <line x1="0" y1="440" x2="800" y2="440" stroke="#423427" stroke-width="8"/>
  <ellipse cx="400" cy="650" rx="200" ry="40" fill="#241911" opacity="0.6" filter="url(#shadow)"/>

  <!-- HERO PRODUCT: Glass Dropper Serum Bottle -->
  <g filter="url(#shadow)">
    <!-- Dropper Pipette Top -->
    <path d="M 380 160 C 380 135, 420 135, 420 160 L 420 185 L 380 185 Z" fill="#2d3436" />
    <!-- Gold Pipette Ring -->
    <rect x="365" y="185" width="70" height="50" rx="5" fill="url(#goldCap)" stroke="#b8972e" stroke-width="1.5"/>
    <line x1="365" y1="205" x2="435" y2="205" stroke="#fff" stroke-width="2" opacity="0.6"/>
    <!-- Glass Bottle Shoulder -->
    <path d="M 365 235 L 340 310 Q 330 340 330 380 L 330 610 Q 330 640 360 640 L 440 640 Q 470 640 470 610 L 470 380 Q 470 340 460 310 L 435 235 Z" fill="url(#bottleGrad)" stroke="#ffdda1" stroke-width="2" />
    
    <!-- Serum Liquid Inside Glass -->
    <path d="M 338 410 L 338 600 Q 338 628 365 628 L 435 628 Q 462 628 462 600 L 462 410 Q 400 425 338 410 Z" fill="#e17055" opacity="0.85" />
    
    <!-- Internal Glass Pipette Tube -->
    <rect x="394" y="235" width="12" height="340" fill="#ffffff" opacity="0.4"/>
    
    <!-- Luxury Minimalist Label -->
    <rect x="345" y="440" width="110" height="130" rx="6" fill="#fffaf5" stroke="#d5c7b8" stroke-width="1"/>
    <text x="400" y="475" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#2d3436" text-anchor="middle" letter-spacing="3">L'AURA</text>
    <text x="400" y="495" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="500" fill="#e17055" text-anchor="middle" letter-spacing="2">BOTANIQUE</text>
    <line x1="375" y1="510" x2="425" y2="510" stroke="#d5c7b8" stroke-width="1"/>
    <text x="400" y="530" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" fill="#636e72" text-anchor="middle">Hydrating Glow Serum</text>
    <text x="400" y="546" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" fill="#b2bec3" text-anchor="middle">30 ml / 1.0 fl. oz</text>

    <!-- Glass Specular Reflection Highlight -->
    <path d="M 345 330 Q 340 370 340 590" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.6" />
    <path d="M 353 340 Q 350 370 350 560" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.4" />
  </g>
</svg>
`;

const sneakerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Cluttered asphalt pavement texture -->
    <linearGradient id="pavement" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4a4a4a" />
      <stop offset="50%" stop-color="#363636" />
      <stop offset="100%" stop-color="#242424" />
    </linearGradient>
    <linearGradient id="soleGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="50%" stop-color="#f0f2f5" />
      <stop offset="100%" stop-color="#d6dadf" />
    </linearGradient>
    <linearGradient id="upperGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0984e3" />
      <stop offset="40%" stop-color="#00cec9" />
      <stop offset="80%" stop-color="#6c5ce7" />
      <stop offset="100%" stop-color="#2d3436" />
    </linearGradient>
    <linearGradient id="neonSwoosh" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00ff87" />
      <stop offset="100%" stop-color="#60efff" />
    </linearGradient>
    <filter id="sneakerShadow">
      <feDropShadow dx="-15" dy="30" stdDeviation="18" flood-color="#0a0d11" flood-opacity="0.75"/>
    </filter>
  </defs>

  <!-- Cluttered Street Asphalt -->
  <rect width="800" height="800" fill="url(#pavement)" />
  
  <!-- Pavement cracks, chewing gum marks, grit clutter -->
  <path d="M 50 720 Q 200 680 400 750 T 780 710" stroke="#1f1f1f" stroke-width="4" fill="none" opacity="0.8"/>
  <path d="M 300 200 L 350 280 L 390 320" stroke="#222" stroke-width="3" fill="none" opacity="0.6"/>
  <circle cx="180" cy="620" r="14" fill="#666" opacity="0.5"/>
  <circle cx="680" cy="580" r="8" fill="#555" opacity="0.6"/>
  <polygon points="620,680 670,690 640,730" fill="#a0522d" opacity="0.5"/> <!-- Dead leaf clutter -->
  <polygon points="120,480 160,490 140,520" fill="#8b5a2b" opacity="0.6"/>
  <rect x="0" y="0" width="800" height="240" fill="#57585a" opacity="0.7"/> <!-- Distracting curb background -->
  <line x1="0" y1="240" x2="800" y2="240" stroke="#fbc531" stroke-width="16" opacity="0.4"/> <!-- Yellow curb line -->

  <!-- Harsh ground shadow -->
  <ellipse cx="400" cy="590" rx="310" ry="55" fill="#0c0e12" opacity="0.7" filter="url(#sneakerShadow)"/>

  <!-- HERO PRODUCT: Running Sneaker -->
  <g filter="url(#sneakerShadow)">
    <!-- Main Shoe Sole Platform -->
    <path d="M 120 540 Q 150 490 260 520 Q 400 525 560 500 Q 660 480 710 520 Q 690 580 580 585 Q 400 590 220 585 Q 140 580 120 540 Z" fill="url(#soleGrad)" stroke="#cbd5e1" stroke-width="3"/>
    
    <!-- Sole Tread Accents & Air Cushion Bubble -->
    <path d="M 280 545 Q 360 545 420 540 L 420 570 Q 350 575 280 572 Z" fill="#00cec9" opacity="0.85"/>
    <rect x="300" y="550" width="20" height="15" rx="3" fill="#ffffff" opacity="0.7"/>
    <rect x="330" y="550" width="20" height="15" rx="3" fill="#ffffff" opacity="0.7"/>
    <rect x="360" y="550" width="20" height="15" rx="3" fill="#ffffff" opacity="0.7"/>
    <rect x="390" y="550" width="20" height="15" rx="3" fill="#ffffff" opacity="0.7"/>

    <!-- Mesh Upper Body -->
    <path d="M 140 525 Q 180 430 260 400 Q 320 370 380 320 Q 430 270 480 280 Q 520 330 520 410 Q 590 410 650 450 Q 690 480 705 520 Q 580 490 430 515 Q 270 515 140 525 Z" fill="url(#upperGrad)" stroke="#1e293b" stroke-width="2"/>

    <!-- Collar & Tongue -->
    <path d="M 460 275 Q 490 240 530 250 Q 560 300 520 370 Z" fill="#2d3436" />
    <path d="M 400 310 Q 430 250 460 260 L 480 310 Z" fill="#00cec9" />

    <!-- Lacing System -->
    <path d="M 370 350 L 420 370 M 350 380 L 400 400 M 330 410 L 380 430 M 310 440 L 360 460" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>

    <!-- Dynamic Neon Side Swoosh Wave -->
    <path d="M 230 490 Q 360 420 480 370 Q 580 350 630 420 Q 530 430 430 460 Q 330 495 230 490 Z" fill="url(#neonSwoosh)" stroke="#ffffff" stroke-width="1.5"/>

    <!-- Heel Pull Tab -->
    <path d="M 525 280 Q 555 270 545 320 Z" fill="#ff7675" stroke="#d63031" stroke-width="2"/>
  </g>
</svg>
`;

const watchSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Messy office wooden desk clutter -->
    <linearGradient id="deskWood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8a532d" />
      <stop offset="50%" stop-color="#5c3417" />
      <stop offset="100%" stop-color="#3d210b" />
    </linearGradient>
    <linearGradient id="steelBezel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e2e8f0" />
      <stop offset="25%" stop-color="#94a3b8" />
      <stop offset="50%" stop-color="#f8fafc" />
      <stop offset="75%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
    <linearGradient id="watchDial" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="watchShadow">
      <feDropShadow dx="-12" dy="25" stdDeviation="22" flood-color="#180e05" flood-opacity="0.8"/>
    </filter>
  </defs>

  <!-- Cluttered Desk Background -->
  <rect width="800" height="800" fill="url(#deskWood)" />

  <!-- Messy desk clutter: papers, pen, coffee cup stain -->
  <polygon points="40,40 320,80 290,440 20,400" fill="#f8fafc" opacity="0.6"/>
  <line x1="80" y1="120" x2="260" y2="140" stroke="#cbd5e1" stroke-width="4"/>
  <line x1="80" y1="160" x2="240" y2="180" stroke="#cbd5e1" stroke-width="4"/>
  <line x1="80" y1="200" x2="200" y2="215" stroke="#cbd5e1" stroke-width="4"/>
  
  <!-- Coffee Ring Stain -->
  <circle cx="680" cy="220" r="75" stroke="#4a2408" stroke-width="6" fill="none" opacity="0.45"/>
  <circle cx="683" cy="223" r="68" stroke="#3b1c06" stroke-width="3" fill="none" opacity="0.3"/>

  <!-- Metal Ballpoint Pen -->
  <line x1="580" y1="620" x2="740" y2="480" stroke="#475569" stroke-width="12" stroke-linecap="round"/>
  <line x1="740" y1="480" x2="755" y2="465" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>

  <!-- HERO PRODUCT: Stainless Steel Chronograph Watch -->
  <g filter="url(#watchShadow)">
    <!-- Steel Link Bracelet Strap (Top & Bottom) -->
    <path d="M 345 60 L 455 60 L 450 250 L 350 250 Z" fill="url(#steelBezel)" stroke="#475569" stroke-width="3"/>
    <line x1="348" y1="110" x2="452" y2="110" stroke="#475569" stroke-width="3"/>
    <line x1="349" y1="160" x2="451" y2="160" stroke="#475569" stroke-width="3"/>
    <line x1="350" y1="210" x2="450" y2="210" stroke="#475569" stroke-width="3"/>

    <path d="M 350 550 L 450 550 L 455 740 L 345 740 Z" fill="url(#steelBezel)" stroke="#475569" stroke-width="3"/>
    <line x1="350" y1="590" x2="450" y2="590" stroke="#475569" stroke-width="3"/>
    <line x1="349" y1="640" x2="451" y2="640" stroke="#475569" stroke-width="3"/>
    <line x1="348" y1="690" x2="452" y2="690" stroke="#475569" stroke-width="3"/>

    <!-- Watch Lugs -->
    <path d="M 320 220 L 360 220 L 360 300 L 310 270 Z" fill="url(#steelBezel)" />
    <path d="M 480 220 L 440 220 L 440 300 L 490 270 Z" fill="url(#steelBezel)" />
    <path d="M 320 580 L 360 580 L 360 500 L 310 530 Z" fill="url(#steelBezel)" />
    <path d="M 480 580 L 440 580 L 440 500 L 490 530 Z" fill="url(#steelBezel)" />

    <!-- Crown & Chrono Pushers -->
    <rect x="560" y="380" width="25" height="40" rx="4" fill="url(#steelBezel)" stroke="#334155" stroke-width="2"/>
    <rect x="548" y="325" width="20" height="25" rx="3" fill="url(#steelBezel)" stroke="#334155" stroke-width="2"/>
    <rect x="548" y="450" width="20" height="25" rx="3" fill="url(#steelBezel)" stroke="#334155" stroke-width="2"/>

    <!-- Circular Bezel -->
    <circle cx="400" cy="400" r="175" fill="url(#steelBezel)" stroke="#334155" stroke-width="4"/>
    <circle cx="400" cy="400" r="150" fill="#090d16" stroke="#475569" stroke-width="3"/>

    <!-- Sunray Dial -->
    <circle cx="400" cy="400" r="140" fill="url(#watchDial)"/>

    <!-- Hour Markers & Tachymeter -->
    <circle cx="400" cy="400" r="132" stroke="#64748b" stroke-width="2" stroke-dasharray="2, 10" fill="none"/>
    <line x1="400" y1="275" x2="400" y2="295" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <line x1="525" y1="400" x2="505" y2="400" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <line x1="400" y1="525" x2="400" y2="505" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>
    <line x1="275" y1="400" x2="295" y2="400" stroke="#f8fafc" stroke-width="5" stroke-linecap="round"/>

    <!-- Chronograph Subdials -->
    <circle cx="340" cy="400" r="32" stroke="#475569" stroke-width="2" fill="#0b1120"/>
    <circle cx="460" cy="400" r="32" stroke="#475569" stroke-width="2" fill="#0b1120"/>
    <circle cx="400" cy="455" r="32" stroke="#475569" stroke-width="2" fill="#0b1120"/>

    <!-- Brand Typography -->
    <text x="400" y="345" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="700" fill="#f8fafc" text-anchor="middle" letter-spacing="4">CHRONOS</text>
    <text x="400" y="362" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" fill="#38bdf8" text-anchor="middle" letter-spacing="2">AUTOMATIC</text>

    <!-- Hands (Chrono Orange Seconds, Luminescent Hours & Minutes) -->
    <line x1="400" y1="400" x2="330" y2="350" stroke="#ffffff" stroke-width="7" stroke-linecap="round"/>
    <line x1="400" y1="400" x2="480" y2="320" stroke="#ffffff" stroke-width="5" stroke-linecap="round"/>
    <line x1="400" y1="440" x2="400" y2="280" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="400" cy="400" r="8" fill="#f97316"/>

    <!-- Crystal Reflection Flare -->
    <path d="M 280 320 Q 400 280 500 340" stroke="#ffffff" stroke-width="4" stroke-linecap="round" opacity="0.35"/>
  </g>
</svg>
`;

const headphonesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <!-- Living room wooden table & sofa clutter -->
    <linearGradient id="livingWood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#b08968" />
      <stop offset="50%" stop-color="#7f5539" />
      <stop offset="100%" stop-color="#9c6644" />
    </linearGradient>
    <linearGradient id="headbandGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2d3436" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="earcupGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="hpShadow">
      <feDropShadow dx="-10" dy="28" stdDeviation="20" flood-color="#26170d" flood-opacity="0.75"/>
    </filter>
  </defs>

  <!-- Cluttered Wooden Table Background -->
  <rect width="800" height="800" fill="url(#livingWood)" />

  <!-- Living room clutter: patterned rug at top, magazine, remote control -->
  <rect x="0" y="0" width="800" height="220" fill="#4a5568" opacity="0.6"/>
  <path d="M 0 100 L 800 100 M 0 160 L 800 160" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="15, 15" opacity="0.4"/>
  
  <!-- Glossy magazine on table -->
  <polygon points="50,480 250,440 310,720 100,760" fill="#f1f5f9" opacity="0.7"/>
  <rect x="120" y="490" width="100" height="80" fill="#3b82f6" opacity="0.5"/>
  <line x1="120" y1="600" x2="240" y2="580" stroke="#64748b" stroke-width="4"/>

  <!-- TV Remote control clutter -->
  <rect x="620" y="420" width="85" height="220" rx="15" fill="#1e293b" opacity="0.7" transform="rotate(-15 620 420)"/>

  <!-- Soft ground contact shadow -->
  <ellipse cx="400" cy="620" rx="260" ry="50" fill="#1b120c" opacity="0.7" filter="url(#hpShadow)"/>

  <!-- HERO PRODUCT: Wireless Over-Ear Headphones -->
  <g filter="url(#hpShadow)">
    <!-- Arching Headband -->
    <path d="M 230 460 C 210 180, 590 180, 570 460" fill="none" stroke="url(#headbandGrad)" stroke-width="42" stroke-linecap="round"/>
    
    <!-- Cushioned Headband Inner Liner -->
    <path d="M 270 410 C 270 240, 530 240, 530 410" fill="none" stroke="#475569" stroke-width="20" stroke-linecap="round" opacity="0.8"/>

    <!-- Left Ear Cup Assembly -->
    <!-- Metal Yoke Fork -->
    <path d="M 220 440 L 220 510 Q 220 540 185 540" fill="none" stroke="#94a3b8" stroke-width="9" stroke-linecap="round"/>
    <!-- Ear Cushion -->
    <ellipse cx="230" cy="535" rx="55" ry="95" fill="#0f172a" stroke="#334155" stroke-width="4" transform="rotate(-10 230 535)"/>
    <!-- Outer Matte Shell -->
    <ellipse cx="215" cy="535" rx="42" ry="80" fill="url(#earcupGrad)" stroke="#475569" stroke-width="2" transform="rotate(-10 215 535)"/>
    <circle cx="210" cy="535" r="18" fill="#1e293b" stroke="#00cec9" stroke-width="2"/>

    <!-- Right Ear Cup Assembly -->
    <!-- Metal Yoke Fork -->
    <path d="M 580 440 L 580 510 Q 580 540 615 540" fill="none" stroke="#94a3b8" stroke-width="9" stroke-linecap="round"/>
    <!-- Ear Cushion -->
    <ellipse cx="570" cy="535" rx="55" ry="95" fill="#0f172a" stroke="#334155" stroke-width="4" transform="rotate(10 570 535)"/>
    <!-- Outer Matte Shell -->
    <ellipse cx="585" cy="535" rx="42" ry="80" fill="url(#earcupGrad)" stroke="#475569" stroke-width="2" transform="rotate(10 585 535)"/>
    <circle cx="590" cy="535" r="18" fill="#1e293b" stroke="#00cec9" stroke-width="2"/>

    <!-- Headband Sleek Brand Accent -->
    <rect x="375" y="195" width="50" height="10" rx="3" fill="#00cec9"/>
  </g>
</svg>
`;

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: "serum-cosmetic",
    name: "Velvet Glow Serum",
    category: "Cosmetics & Beauty",
    description: "Glass dropper bottle on a cluttered bathroom counter with tiles and reflections",
    dataUrl: createSvgDataUrl(cosmeticSvg),
    defaultPrompt: "Remove the background completely and isolate the serum bottle on a pure white studio background with a soft, natural contact shadow for Amazon.",
  },
  {
    id: "sneaker-runner",
    name: "AeroPulse Speed Runner",
    category: "Footwear & Apparel",
    description: "High-tech running sneaker sitting on textured street asphalt and yellow curb",
    dataUrl: createSvgDataUrl(sneakerSvg),
    defaultPrompt: "Remove the street pavement and background completely. Clean up dirt and shadows, and place the sneaker on an immaculate transparent background.",
  },
  {
    id: "luxury-watch",
    name: "Chronos Heritage Steel Watch",
    category: "Jewelry & Luxury",
    description: "Stainless steel chronograph watch on a cluttered wooden office desk with papers",
    dataUrl: createSvgDataUrl(watchSvg),
    defaultPrompt: "Clean up the desk clutter and glare. Place the steel watch on a sleek minimalist dark slate stone podium with soft dramatic studio lighting.",
  },
  {
    id: "wireless-headphones",
    name: "StudioPulse Wireless ANC",
    category: "Consumer Tech",
    description: "Matte black headphones resting on a coffee table with living room clutter",
    dataUrl: createSvgDataUrl(headphonesSvg),
    defaultPrompt: "Remove background completely, leaving only the headphones. Clean dust off the ear cushions and output on clean pure white backdrop.",
  },
];

export const QUICK_RECIPES = [
  {
    id: "pure-white",
    label: "Pure White Studio",
    icon: "⚪",
    prompt: "Remove the background completely. Place the product on pure seamless white (#FFFFFF) with a realistic, soft grounded contact shadow.",
    badge: "Amazon / Shopify",
  },
  {
    id: "transparent",
    label: "Transparent PNG Cutout",
    icon: "🏁",
    prompt: "Isolate the main product with pin-sharp edges and complete background removal. Export with full transparency alpha channel.",
    badge: "E-Commerce Cutout",
  },
  {
    id: "minimal-podium",
    label: "Stone Pedestal Stage",
    icon: "🏛️",
    prompt: "Remove messy background. Place the product on an elegant circular matte stone podium with soft ambient studio illumination and subtle warm depth.",
    badge: "Editorial Staging",
  },
  {
    id: "cleanup-polish",
    label: "Clean Glare & Blemishes",
    icon: "✨",
    prompt: "Keep the current setting but clean up all dust specks, finger smudges, specular lens flare, and awkward harsh shadows on the product surfaces.",
    badge: "Product Retouch",
  },
  {
    id: "botanical-spa",
    label: "Warm Botanical Stage",
    icon: "🌿",
    prompt: "Place the product on a warm neutral travertine slab with subtle soft-focus botanical palm leaf shadows and gentle morning sunlight.",
    badge: "Lifestyle Lookbook",
  },
  {
    id: "dark-luxury",
    label: "Midnight Matte Luxury",
    icon: "🌑",
    prompt: "Isolate product on a deep obsidian black backdrop with soft edge rim-lighting and delicate reflective glass base reflection.",
    badge: "Luxury Goods",
  },
];
