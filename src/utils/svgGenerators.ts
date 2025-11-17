// Small helpers that return SVG data URLs for piping bags, filling bowls, and layered cake slices.
export function getPipingBagSvg(hex: string, label = ''): string {
  const safeHex = hex.replace('#', '%23');
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='240' height='160' viewBox='0 0 240 160'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0' stop-color='${hex}' stop-opacity='1'/>
        <stop offset='1' stop-color='#ffffff' stop-opacity='0.6'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' rx='12' fill='#FFF8F0'/>
    <g transform='translate(40,20)'>
      <path d='M10 10 C 20 6, 40 6, 60 12 L 110 60 C 118 66, 118 76, 110 82 L 60 120 C 40 126, 20 126, 10 122 C 4 119, 2 112, 6 106 L 30 80 L 10 10 Z' fill='url(#g)' stroke='#E6E6E6' stroke-width='2'/>
      <rect x='100' y='54' width='14' height='18' rx='4' fill='#F2F2F2' stroke='#DDD'/>
    </g>
    <text x='50%' y='150' font-family='Poppins, sans-serif' font-size='12' fill='#5A3825' text-anchor='middle'>${label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getFillingBowlSvg(hex: string, label = ''): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='240' height='160' viewBox='0 0 240 160'>
    <rect width='100%' height='100%' rx='12' fill='#FFF8F0'/>
    <g transform='translate(30,30)'>
      <ellipse cx='90' cy='70' rx='90' ry='36' fill='#EDEDED'/>
      <ellipse cx='90' cy='60' rx='80' ry='28' fill='${hex}' stroke='#E6E6E6' stroke-width='2'/>
      <path d='M10 60 Q 90 10 170 60' fill='${hex}' opacity='0.9'/>
    </g>
    <text x='50%' y='150' font-family='Poppins, sans-serif' font-size='12' fill='#5A3825' text-anchor='middle'>${label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getLayeredCakeSliceSvg(fillHex: string, label = ''): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='300' height='160' viewBox='0 0 300 160'>
    <rect width='100%' height='100%' rx='12' fill='#FFF8F0'/>
    <g transform='translate(40,20)'>
      <path d='M0 100 L220 100 L180 20 L40 20 Z' fill='#F6F0EC' stroke='#E0D6D1'/>
      <!-- layers -->
      <rect x='20' y='40' width='160' height='18' fill='${fillHex}' stroke='#D0C0B8' />
      <rect x='20' y='60' width='160' height='18' fill='#F6F0EC' stroke='#D0C0B8' />
      <rect x='20' y='80' width='160' height='18' fill='${fillHex}' stroke='#D0C0B8' />
      <circle cx='190' cy='30' r='10' fill='${fillHex}'/>
    </g>
    <text x='50%' y='150' font-family='Poppins, sans-serif' font-size='12' fill='#5A3825' text-anchor='middle'>${label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
