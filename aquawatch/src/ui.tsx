import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Page, Status } from './data'
import { statusLabel } from './data'

/* ---------- Icons ---------- */
const paths: Record<string, ReactNode> = {
  drop: <path d="M12 2.5s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 9.5 12 2.5 12 2.5z" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 3l10 18H2L12 3z" />
      <path d="M12 10v5M12 18v.01" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  id: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="M6 16c.8-1.6 2-2 3-2s2.2.4 3 2M14 10h4M14 13h4" />
    </>
  ),
  list: <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="M6 9l6 6 6-6" />,
  upload: <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />,
  trash: <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  trend: <path d="M3 17l5-6 4 3 8-9M15 5h5v5" />,
  download: <path d="M12 4v12M7 11l5 5 5-5M4 20h16" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.01" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.800 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.6-4 3.3-6 7-6s6.4 2 7 6" />
    </>
  ),
  wrench: <path d="M14 7a4 4 0 0 0 5 5l-9 9a2 2 0 0 1-3-3l9-9z" />,
  shield: <path d="M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6l8-3z" />,
  cup: <path d="M6 4h12l-1.500 16h-9L6 4zM7 10h10" />,
  paper: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="1" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
}

export function Icon({
  name,
  size = 20,
  fill,
  className,
}: {
  name: keyof typeof paths | string
  size?: number
  fill?: string
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill ?? 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {paths[name]}
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 font-extrabold text-[20px] tracking-tight">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22B8D6" />
            <stop offset="1" stopColor="#0E7490" />
          </linearGradient>
        </defs>
        <path d="M16 2.500s9 9.200 9 15.500a9 9 0 0 1-18 0C7 11.700 16 2.500 16 2.500z" fill="url(#lg)" />
        <path d="M11.500 18.500a4.500 4.500 0 0 0 4 4.300" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" opacity=".85" />
      </svg>
      <span className={light ? 'text-white' : 'text-primary-dark'}>AquaWatch</span>
    </span>
  )
}

/* ---------- Motion helpers ---------- */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`reveal ${on ? 'in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export function CountUp({ to, duration = 1400, suffix = '' }: { to: number; duration?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      if (reduce) return setV(to)
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration)
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, duration])
  return (
    <span ref={ref}>
      {v}
      {suffix}
    </span>
  )
}

/* ---------- Button ---------- */
type BtnVariant = 'primary' | 'secondary' | 'white' | 'outlineWhite'
export function Button({
  variant = 'primary',
  icon,
  full,
  disabled,
  softDisabled,
  onClick,
  children,
  className = '',
  type = 'button',
}: {
  variant?: BtnVariant
  icon?: string
  full?: boolean
  disabled?: boolean
  softDisabled?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
  type?: 'button' | 'submit'
}) {
  const off = disabled || softDisabled
  const styles: Record<BtnVariant, string> = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-bg',
    white: 'bg-white text-primary-dark hover:bg-bg',
    outlineWhite: 'border-2 border-white text-white hover:bg-white/15',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      aria-disabled={off || undefined}
      onClick={onClick}
      className={`inline-flex h-12 min-w-11 items-center justify-center gap-2 rounded-xl px-6 text-[16px] font-semibold ${
        off ? 'cursor-not-allowed bg-slate-200 text-slate-600' : `lift cursor-pointer ${styles[variant]}`
      } ${full ? 'w-full' : ''} ${className}`}
    >
      {icon && <Icon name={icon} size={20} />}
      {children}
    </button>
  )
}

/* ---------- Status Badge ---------- */
export function StatusBadge({
  status,
  children,
  noIcon,
}: {
  status: Status
  children?: ReactNode
  noIcon?: boolean
}) {
  const s: Record<Status, string> = {
    normal: 'bg-ok text-white',
    perhatian: 'bg-warn text-ink',
    siaga: 'bg-alert text-white',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-bold leading-[18px] ${s[status]}`}
    >
      {!noIcon && <Icon name={status === 'normal' ? 'check' : 'alert'} size={14} />}
      {children ?? statusLabel[status]}
    </span>
  )
}

export function NeutralBadge({ children, tone = 'teal' }: { children: ReactNode; tone?: 'teal' | 'slate' | 'red' }) {
  const t = {
    teal: 'bg-[#E0F4F8] text-primary-dark',
    slate: 'bg-slate-100 text-slate-700',
    red: 'bg-[#FEE2E2] text-[#991B1B]',
  }
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold leading-[18px] ${t[tone]}`}>
      {children}
    </span>
  )
}

/* ---------- Card / Stat Card ---------- */
export function Card({
  children,
  className = '',
  hover = false,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  as?: 'div' | 'section' | 'article'
}) {
  return (
    <Tag className={`rounded-2xl bg-white p-6 shadow-card ${hover ? 'lift' : ''} ${className}`}>{children}</Tag>
  )
}

export function StatCard({
  label,
  value,
  badge,
  children,
  hint,
}: {
  label: string
  value: ReactNode
  badge?: ReactNode
  children?: ReactNode
  hint?: string
}) {
  return (
    <Card hover className="flex h-full flex-col gap-2">
      <div className="text-[14px] font-medium text-slate-600">{label}</div>
      <div className="flex items-end gap-3">
        <div className="text-[48px] font-bold leading-[52px] text-primary-dark">{value}</div>
        {hint && <div className="pb-1 text-[16px] font-semibold text-slate-600">{hint}</div>}
      </div>
      {badge && <div>{badge}</div>}
      {children}
    </Card>
  )
}

/* ---------- Form controls ---------- */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[16px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-2 flex items-center gap-1 text-[13px] font-semibold leading-[18px] text-alert">
          <Icon name="alert" size={14} />
          {error}
        </p>
      ) : (
        hint && <p className="t-cap mt-2 text-muted">{hint}</p>
      )}
    </div>
  )
}

export function SelectInput({
  id,
  value,
  onChange,
  invalid,
  children,
  className = '',
}: {
  id?: string
  value: string
  onChange: (v: string) => void
  invalid?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        id={id}
        value={value}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 w-full cursor-pointer appearance-none rounded-xl border-2 bg-white pl-4 pr-11 text-[16px] transition-colors duration-200 ease-out ${
          invalid ? 'border-alert' : 'border-line hover:border-primary'
        } ${value ? 'text-ink' : 'text-muted'}`}
      >
        {children}
      </select>
      <Icon name="chevron" size={20} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
    </div>
  )
}

export function Chip({
  selected,
  tone = 'green',
  onClick,
  children,
  role,
}: {
  selected?: boolean
  tone?: 'green' | 'teal'
  onClick?: () => void
  children: ReactNode
  role?: string
}) {
  const on = tone === 'green' ? 'border-ok bg-ok text-white' : 'border-primary bg-primary text-white'
  return (
    <button
      type="button"
      role={role}
      aria-pressed={role ? undefined : !!selected}
      aria-checked={role ? !!selected : undefined}
      onClick={onClick}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-[15px] font-semibold transition-colors duration-200 ease-out ${
        selected ? on : 'border-line bg-white text-ink hover:border-primary'
      }`}
    >
      {selected && <Icon name="check" size={16} />}
      {children}
    </button>
  )
}

/* ---------- Alert Banner ---------- */
export function AlertBanner({
  tone,
  title,
  children,
  action,
  pulse,
}: {
  tone: Status
  title: string
  children: ReactNode
  action?: ReactNode
  pulse?: boolean
}) {
  const t = {
    siaga: 'border-alert bg-[#FEF2F2]',
    perhatian: 'border-warn bg-[#FFFBEB]',
    normal: 'border-ok bg-[#F0FDF4]',
  }
  const dot = { siaga: 'bg-alert', perhatian: 'bg-warn', normal: 'bg-ok' }
  return (
    <div
      role={tone === 'siaga' ? 'alert' : 'status'}
      className={`flex flex-wrap items-center gap-4 rounded-2xl border-2 p-5 ${t[tone]}`}
    >
      {pulse ? (
        <span aria-hidden="true" className={`pulse-dot h-3 w-3 shrink-0 rounded-full ${dot[tone]}`} />
      ) : (
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${dot[tone]} ${tone === 'perhatian' ? '!text-ink' : ''}`}
        >
          <Icon name={tone === 'normal' ? 'check' : 'alert'} size={18} />
        </span>
      )}
      <div className="min-w-[240px] flex-1">
        <div className="text-[16px] font-bold text-ink">{title}</div>
        <div className="text-[15px] text-slate-700">{children}</div>
      </div>
      {action}
    </div>
  )
}

/* ---------- Timeline Step ---------- */
export function TimelineStep({
  label,
  state,
  last,
  note,
}: {
  label: string
  state: 'done' | 'next' | 'todo'
  last?: boolean
  note?: string
}) {
  return (
    <li className="relative flex gap-4 pb-5 last:pb-0">
      {!last && (
        <span
          aria-hidden="true"
          className={`absolute left-[13px] top-7 h-[calc(100%-20px)] w-0.5 ${state === 'done' ? 'bg-ok' : 'bg-line'}`}
        />
      )}
      <span
        aria-hidden="true"
        className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          state === 'done'
            ? 'bg-ok text-white'
            : state === 'next'
              ? 'border-2 border-primary bg-white'
              : 'bg-slate-200'
        }`}
      >
        {state === 'done' && <Icon name="check" size={16} />}
        {state === 'next' && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <div className="pt-0.5">
        <div className={`text-[16px] font-semibold ${state === 'todo' ? 'text-slate-600' : 'text-ink'}`}>
          {label}
          <span className="sr-only">{state === 'done' ? ' (selesai)' : ' (belum)'}</span>
        </div>
        {note && <div className="t-cap text-muted">{note}</div>}
      </div>
    </li>
  )
}

/* ---------- Navbar ---------- */
const links: { p: Page; label: string }[] = [
  { p: 'home', label: 'Beranda' },
  { p: 'lapor', label: 'Lapor' },
  { p: 'peta', label: 'Peta Air' },
  { p: 'dasbor', label: 'Dasbor Pengelola' },
]

export function Navbar({ page, go }: { page: Page; go: (p: Page) => void }) {
  const active = page === 'hasil' ? 'lapor' : page
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="wrap flex flex-wrap items-center justify-between gap-2 py-3">
        <button
          type="button"
          onClick={() => go('home')}
          aria-label="AquaWatch, ke Beranda"
          className="flex min-h-11 cursor-pointer items-center rounded-lg"
        >
          <Logo />
        </button>
        <nav aria-label="Navigasi utama" className="flex flex-wrap gap-1">
          {links.map((l) => (
            <button
              key={l.p}
              type="button"
              onClick={() => go(l.p)}
              aria-current={active === l.p ? 'page' : undefined}
              className={`min-h-11 cursor-pointer rounded-full px-4 text-[15px] font-semibold transition-colors duration-200 ease-out ${
                active === l.p ? 'bg-primary text-white' : 'text-slate-700 hover:bg-bg hover:text-primary-dark'
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function PageHeader({
  title,
  caption,
  children,
}: {
  title: string
  caption: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-[760px]">
        <h1 className="t-h2">{title}</h1>
        <p className="t-cap mt-1 text-[14px] text-slate-600">{caption}</p>
      </div>
      {children}
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T
  onChange: (v: T) => void
  options: { v: T; label: string }[]
  label: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-white p-1">
      {options.map((o) => (
        <button
          key={o.v}
          type="button"
          role="radio"
          aria-checked={value === o.v}
          onClick={() => onChange(o.v)}
          className={`min-h-11 cursor-pointer rounded-lg px-4 text-[14px] font-semibold transition-colors duration-200 ease-out ${
            value === o.v ? 'bg-primary text-white' : 'text-slate-700 hover:bg-bg'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="t-cap flex items-start gap-1.5 text-slate-600">
      <Icon name="info" size={14} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

/* ---------- Demo photos (illustrations) ---------- */
export function DemoPhoto({ kind }: { kind: 'sample' | 'tissue' }) {
  if (kind === 'sample') {
    return (
      <svg viewBox="0 0 200 150" className="h-full w-full" role="img" aria-label="Foto sampel air keruh dalam gelas">
        <rect width="200" height="150" fill="#E8E4DC" />
        <rect y="112" width="200" height="38" fill="#D6D0C4" />
        <path d="M62 24h76l-8 94a6 6 0 0 1-6 5H76a6 6 0 0 1-6-5L62 24z" fill="#F4F1EA" opacity=".6" stroke="#fff" strokeWidth="2" />
        <path d="M65 48h70l-6 69a5 5 0 0 1-5 4H76a5 5 0 0 1-5-4L65 48z" fill="#B58B4E" />
        <path d="M65 48h70" stroke="#CDA66B" strokeWidth="3" />
        {[[85, 70], [105, 90], [95, 105], [118, 66], [80, 98], [112, 108], [100, 60]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.800 + (i % 3) * 0.6} fill="#7A5A2C" opacity=".7" />
        ))}
        <path d="M74 30l-3 70" stroke="#fff" strokeWidth="3" opacity=".5" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 200 150" className="h-full w-full" role="img" aria-label="Foto saringan tisu dengan bercak partikel">
      <rect width="200" height="150" fill="#CFE3EA" />
      <rect x="40" y="18" width="120" height="114" rx="6" fill="#FFFFFF" />
      <rect x="40" y="18" width="120" height="114" rx="6" fill="none" stroke="#E2E8F0" />
      <ellipse cx="100" cy="76" rx="42" ry="38" fill="#D9C39B" opacity=".55" />
      <ellipse cx="100" cy="76" rx="26" ry="23" fill="#B58B4E" opacity=".45" />
      {[[84, 66], [110, 62], [96, 86], [118, 84], [78, 82], [104, 74], [90, 56]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.500 + (i % 3)} fill="#6B4A20" opacity=".75" />
      ))}
    </svg>
  )
}
