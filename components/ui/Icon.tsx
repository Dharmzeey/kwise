"use client";

/**
 * Kwise World — Icon component.
 * Renders SVG icons by name using inline path data.
 * Zero external dependencies.
 */

const PATHS: Record<string, string> = {
  phone:       '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><line x1="10.5" y1="18.5" x2="13.5" y2="18.5"/>',
  laptop:      '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2.5 19.5h19l-1-3.5H3.5z"/>',
  charger:     '<rect x="6" y="9" width="12" height="11" rx="2"/><path d="M9 9V5M15 9V5"/><path d="M11 13l-1.5 2.5h3L11 18" fill="none"/>',
  powerbank:   '<rect x="5.5" y="3" width="13" height="18" rx="2.5"/><rect x="9" y="6.5" width="6" height="2.2" rx="1.1"/><path d="M12 11.5v4M10 13.5h4"/>',
  cable:       '<path d="M6 4v3a2 2 0 0 0 2 2h0a2 2 0 0 1 2 2v6a3 3 0 0 0 6 0v-1" fill="none"/><rect x="4" y="2.5" width="4" height="2.5" rx="0.8"/>',
  case:        '<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><circle cx="12" cy="7" r="1.2"/>',
  shield:      '<path d="M12 2.5l7 2.5v6c0 4.5-3 8-7 10.5C8 19 5 15.5 5 11V5z"/><path d="M9 11.5l2 2 4-4" fill="none"/>',
  battery:     '<rect x="3" y="7" width="16" height="10" rx="2"/><rect x="20" y="10" width="2" height="4" rx="1"/><path d="M7 12h6"/>',
  search:      '<circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>',
  cart:        '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 3.5h2.5l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L21 6.5H6" fill="none"/>',
  user:        '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  menu:        '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close:       '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
  star:        '<path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.6 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9z"/>',
  chevron:     '<polyline points="9 6 15 12 9 18"/>',
  chevronDown: '<polyline points="6 9 12 15 18 9"/>',
  arrowRight:  '<line x1="4" y1="12" x2="20" y2="12"/><polyline points="14 6 20 12 14 18"/>',
  heart:       '<path d="M12 20.5C7 17 3.5 13.5 3.5 9.2 3.5 6.4 5.7 4.5 8.2 4.5c1.7 0 3.1.9 3.8 2.2.7-1.3 2.1-2.2 3.8-2.2 2.5 0 4.7 1.9 4.7 4.7 0 4.3-3.5 7.8-8.5 11.3z"/>',
  check:       '<polyline points="4 12 9 17 20 6"/>',
  minus:       '<line x1="5" y1="12" x2="19" y2="12"/>',
  plus:        '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  trash:       '<polyline points="4 7 20 7"/><path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7A1.5 1.5 0 0 0 17 20L18 7"/><path d="M9 7V4.5h6V7"/>',
  truck:       '<rect x="2" y="6" width="13" height="10" rx="1"/><path d="M15 9h4l3 3.5V16h-7z"/><circle cx="6.5" cy="18" r="1.6"/><circle cx="18" cy="18" r="1.6"/>',
  shieldCheck: '<path d="M12 2.5l7 2.5v6c0 4.5-3 8-7 10.5C8 19 5 15.5 5 11V5z"/><path d="M9 11.5l2 2 4-4" fill="none"/>',
  bolt:        '<path d="M13 2L4 14h6l-1 8 9-12h-6z"/>',
  tag:         '<path d="M3 12V4.5A1.5 1.5 0 0 1 4.5 3H12l9 9-7.5 7.5z"/><circle cx="7.5" cy="7.5" r="1.3"/>',
  refresh:     '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 4v4h-4" fill="none"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 20v-4h4" fill="none"/>',
  pin:         '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  mail:        '<rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3.5 6.5 12 13 20.5 6.5"/>',
  whatsapp:    '<path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none"/><path d="M8.5 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2 0 .4-.1.6l-.5.5c-.1.2-.2.3-.1.5.3.7 1.4 1.8 2.3 2.2.2.1.4.1.5-.1l.5-.6c.2-.2.3-.2.6-.1l1.5.7c.3.1.4.3.4.5 0 .6-.4 1.4-1.5 1.5-1 .1-3.2-.5-4.9-2.2-1.6-1.6-2.3-3.6-2.2-4.6 0-.4.2-.7.5-.9z"/>',
};

interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Icon({ name, size = 22, stroke = 1.7, className = "", style }: IconProps) {
  const inner = PATHS[name] ?? "";
  return (
    <svg
      className={"icon " + className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
