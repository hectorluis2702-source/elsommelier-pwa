type IconProps = { className?: string; active?: boolean };

const stroke = (active?: boolean) =>
  active ? "var(--gold)" : "currentColor";

export function IconHome({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path
        d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z"
        stroke={stroke(active)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconWine({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path
        d="M8 3h8l-1 7a4 4 0 0 1-6 0L8 3z"
        stroke={stroke(active)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 14v5M9 21h6" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconUtensils({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M7 3v8M5 3v4a2 2 0 0 0 4 0V3" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 11v10M17 3v7a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2V3" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15 12v9" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconMap({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path
        d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"
        stroke={stroke(active)}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 4v14M15 6v14" stroke={stroke(active)} strokeWidth="1.5" />
    </svg>
  );
}

export function IconPlay({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="12" r="9" stroke={stroke(active)} strokeWidth="1.5" />
      <path d="M10 8.5v7l6-3.5-6-3.5z" fill={stroke(active)} />
    </svg>
  );
}

export function IconMore({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="6" cy="12" r="1.5" fill={stroke(active)} />
      <circle cx="12" cy="12" r="1.5" fill={stroke(active)} />
      <circle cx="18" cy="12" r="1.5" fill={stroke(active)} />
    </svg>
  );
}

export function IconSun({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="18" height="18">
      <circle cx="12" cy="12" r="4" stroke="var(--gold)" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconMoon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="18" height="18">
      <path
        d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z"
        stroke="var(--gold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconGraduation({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M2 9l10-5 10 5-10 5L2 9z" stroke={stroke(active)} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5" stroke={stroke(active)} strokeWidth="1.5" />
      <path d="M22 9v6" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconCamera({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <rect x="3" y="7" width="18" height="13" rx="2" stroke={stroke(active)} strokeWidth="1.5" />
      <circle cx="12" cy="13.5" r="3.5" stroke={stroke(active)} strokeWidth="1.5" />
      <path d="M8 7l1.5-3h5L16 7" stroke={stroke(active)} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCellar({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <path d="M4 20V8l8-4 8 4v12" stroke={stroke(active)} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 12h16M4 16h16M12 8v12" stroke={stroke(active)} strokeWidth="1.5" />
    </svg>
  );
}

export function IconUser({ className, active }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" width="22" height="22">
      <circle cx="12" cy="8" r="3.5" stroke={stroke(active)} strokeWidth="1.5" />
      <path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
