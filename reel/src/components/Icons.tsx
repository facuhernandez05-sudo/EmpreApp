// Íconos vectoriales (sin depender de fuentes emoji)
type P = { size?: number; color?: string };
const S: React.FC<P & { children: React.ReactNode }> = ({ size = 56, color = "#fff", children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const Calendar: React.FC<P> = (p) => (
  <S {...p}><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></S>
);
export const Clock: React.FC<P> = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>
);
export const Pin: React.FC<P> = (p) => (
  <S {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></S>
);
export const Road: React.FC<P> = (p) => (
  <S {...p}><path d="M8 3 5 21M16 3l3 18M12 4v3M12 10.5v3M12 17v3" /></S>
);
export const Music: React.FC<P> = (p) => (
  <S {...p}><path d="M9 18V5l11-2v13" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="17.5" cy="16" r="2.5" /></S>
);
export const Dance: React.FC<P> = (p) => (
  <S {...p}><circle cx="13" cy="4" r="2" /><path d="M13 6.5 11 13l4 3 1 5M11 13l-3 3-3 1M12 8.5l4 2 3-2M12 8.5 8 8l-2-3" /></S>
);
export const Food: React.FC<P> = (p) => (
  <S {...p}><path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1-3 4-3 7s1 4 3 4" /></S>
);
export const Parking: React.FC<P> = (p) => (
  <S {...p}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5" /></S>
);
export const Ticket: React.FC<P> = (p) => (
  <S {...p}><path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z" transform="translate(0 -1)" /><path d="M14 5v2M14 10v2M14 15v2" /></S>
);
export const Tv: React.FC<P> = (p) => (
  <S {...p}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="m8 2 4 4 4-4" /></S>
);
export const Star: React.FC<P> = (p) => (
  <S {...p}><path d="m12 3 2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z" /></S>
);
export const Check: React.FC<P> = (p) => (
  <S {...p}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 2.7 2.7L16 9.8" /></S>
);
export const Store: React.FC<P> = (p) => (
  <S {...p}><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3" /><path d="M10 20v-5h4v5" /></S>
);
