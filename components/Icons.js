// Inline SVG icons (stroke style, RTL-safe). No emoji, no external assets.
const I = ({ children, size = 20, ...rest }) => (
  <svg className="icn" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>{children}</svg>
);
export const StoreIcon = (p) => <I {...p}><path d="M3 9l1.5-5h15L21 9" /><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" /><path d="M5 13v7h14v-7" /><path d="M9 20v-5h6v5" /></I>;
export const CartIcon = (p) => <I {...p}><circle cx="9" cy="20" r="1.6" /><circle cx="17" cy="20" r="1.6" /><path d="M3 3h2l2.6 12.4a1.5 1.5 0 0 0 1.5 1.1h7.9a1.5 1.5 0 0 0 1.5-1.2L20.5 7H6" /></I>;
export const SearchIcon = (p) => <I {...p}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></I>;
export const TruckIcon = (p) => <I {...p}><path d="M1 7h13v9H1z" /><path d="M14 10h4l3.5 3.5V16H14z" /><circle cx="5.5" cy="18.5" r="1.8" /><circle cx="17.5" cy="18.5" r="1.8" /></I>;
export const ShieldIcon = (p) => <I {...p}><path d="M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5z" /><path d="M8.5 11.5l2.4 2.4 4.6-4.6" /></I>;
export const CashIcon = (p) => <I {...p}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.6" /><path d="M5.5 9.5h.01M18.5 14.5h.01" /></I>;
export const CheckIcon = (p) => <I {...p}><path d="M4 12.5l5 5L20 6.5" /></I>;
export const ChartIcon = (p) => <I {...p}><path d="M3 3v18h18" /><path d="M7 15l4-5 3 3 5-7" /></I>;
export const ReportIcon = (p) => <I {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" /></I>;
export const BoxIcon = (p) => <I {...p}><path d="M21 8l-9-5-9 5v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></I>;
export const GearIcon = (p) => <I {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.6 1.6 0 0 0 15 19.4a1.6 1.6 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.6 1.6 0 0 0-1-1.51 1.6 1.6 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.6 15a1.6 1.6 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.6 1.6 0 0 0 1.51-1 1.6 1.6 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.6a1.6 1.6 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.6 1.6 0 0 0 1 1.51 1.6 1.6 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.4 9c.23.58.84 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.67 0-1.28.42-1.51 1z" /></I>;
export const LogoutIcon = (p) => <I {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></I>;
export const OrdersIcon = (p) => <I {...p}><path d="M9 4h11M9 9h11M9 14h11M9 19h11" /><path d="M3.5 4h.01M3.5 9h.01M3.5 14h.01M3.5 19h.01" strokeWidth="3" /></I>;
export const TagIcon = (p) => <I {...p}><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.2" /></I>;
export const UsersIcon = (p) => <I {...p}><circle cx="9" cy="8" r="3.4" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 5a3.4 3.4 0 0 1 0 6.5M22 20a6.5 6.5 0 0 0-4-6" /></I>;
export const BellIcon = (p) => <I {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></I>;
export const WalletIcon = (p) => <I {...p}><path d="M20 7H4a2 2 0 0 1 0-4h14v4" /><path d="M4 7a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h17a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1z" /><circle cx="16.5" cy="14" r="1.2" /></I>;
export const PhoneIcon = (p) => <I {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" /></I>;
export const StarIcon = (p) => <I {...p}><path d="M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.05 1.1-6.5L2.6 9.35l6.5-.95z" fill="currentColor" stroke="none" /></I>;
export const ReturnIcon = (p) => <I {...p}><path d="M9 14l-4-4 4-4" /><path d="M5 10h9a5 5 0 0 1 0 10h-3" /></I>;
