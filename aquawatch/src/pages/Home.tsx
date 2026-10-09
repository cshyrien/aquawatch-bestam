import { useEffect, useState, type CSSProperties } from 'react'
import { AlertBanner, Button, Card, CountUp, Icon, Logo, NeutralBadge, Reveal, StatCard, StatusBadge } from '../ui'
import type { Page } from '../data'

type Props = { go: (p: Page, room?: string | null) => void }

function HeroScore() {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(78)
    let raf = 0
    const start = performance.now() + 700
    const tick = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - start) / 1500))
      setV(Math.round(78 * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  const C = 2 * Math.PI * 54
  const rows: [string, 'Baik' | 'Pantau'][] = [
    ['Kejernihan visual', 'Baik'],
    ['Frekuensi laporan', 'Pantau'],
    ['Kestabilan aliran', 'Baik'],
    ['Anomali terbaru', 'Pantau'],
  ]
  return (
    <div className="rise" style={{ animationDelay: '300ms' }}>
      <div className="deco-float rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(8,47,73,0.35)]" style={{ animationDuration: '7s' }}>
        <h2 className="t-h3 text-ink">Skor Kesehatan Sistem Air</h2>
        <div className="my-4 flex items-center gap-6">
          <div className="relative h-[136px] w-[136px] shrink-0" role="img" aria-label="Skor 78 dari 100, Stabil">
            <svg viewBox="0 0 136 136" className="-rotate-90">
              <circle cx="68" cy="68" r="54" fill="none" stroke="#DCFCE7" strokeWidth="12" />
              <circle
                cx="68"
                cy="68"
                r="54"
                fill="none"
                stroke="#16A34A"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - v / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[48px] font-bold text-primary-dark">{v}</div>
          </div>
          <div className="space-y-2">
            <StatusBadge status="normal">Stabil</StatusBadge>
            <p className="t-cap text-muted">Diperbarui 08.42 dari 12 laporan 24 jam terakhir.</p>
          </div>
        </div>
        <ul className="divide-y divide-line border-t border-line">
          {rows.map(([l, s]) => (
            <li key={l} className="flex items-center justify-between py-2.5">
              <span className="text-[15px] text-slate-700">{l}</span>
              <StatusBadge status={s === 'Baik' ? 'normal' : 'perhatian'}>{s}</StatusBadge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Hero({ go }: Props) {
  const d = (i: number): CSSProperties => ({ animationDelay: `${i * 120}ms` })
  return (
    <section className="wrap pt-6">
      <div className="relative min-h-[640px] overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#164E63_0%,#0E7490_55%,#22B8D6_100%)]">
        <div aria-hidden="true" className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-white/[0.08]" />
        <div aria-hidden="true" className="absolute -bottom-40 -left-32 h-[460px] w-[460px] rounded-full bg-white/[0.08]" />
        {[
          ['left-[44%] top-[16%]', 'h-5 w-5', '0s'],
          ['left-[8%] top-[56%]', 'h-4 w-4', '-2s'],
          ['left-[90%] top-[62%]', 'h-6 w-6', '-4s'],
        ].map(([p, s, dl], i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`deco-float absolute ${p} ${s} rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-white/25`}
            style={{ animationDelay: dl }}
          />
        ))}
        {[
          ['right-[10%] top-[10%]', '0s'],
          ['left-[30%] bottom-[22%]', '-2s'],
        ].map(([p, dl], i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`deco-ripple absolute ${p} h-40 w-40 rounded-full border-2 border-white/40`}
            style={{ animationDelay: dl }}
          />
        ))}

        <div className="relative z-10 grid items-center gap-10 px-6 pb-28 pt-14 lg:grid-cols-12 lg:px-16">
          <div className="lg:col-span-7">
            <span className="rise inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-[13px] font-semibold text-white" style={d(0)}>
              <Icon name="drop" size={14} /> Pemantauan air asrama
            </span>
            <h1 className="t-h1 rise mt-5 max-w-[560px] text-[40px] text-white sm:text-[52px] sm:leading-[60px]" style={d(1)}>
              Lihat airnya. Bertindak sebelum memburuk.
            </h1>
            <p className="rise mt-5 max-w-[520px] text-[18px] leading-7 text-white/90" style={d(2)}>
              Penghuni melapor, sistem menemukan pola, pengelola menindak dengan bukti. Hanya penilaian visual, bukan uji laboratorium.
            </p>
            <div className="rise mt-8 flex flex-wrap gap-3" style={d(3)}>
              <Button variant="white" icon="drop" onClick={() => go('lapor')}>Laporkan Masalah Air</Button>
              <Button variant="outlineWhite" icon="map" onClick={() => go('peta')}>Buka Peta Air</Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <HeroScore />
          </div>
        </div>

        <svg
          aria-hidden="true"
          className="deco-wave absolute bottom-[-1px] left-0 h-[72px] w-[200%]"
          viewBox="0 0 2880 80"
          preserveAspectRatio="none"
        >
          <path d="M0 40Q180 0 360 40T720 40T1080 40T1440 40T1800 40T2160 40T2520 40T2880 40V80H0Z" fill="#F0F9FF" />
        </svg>
      </div>
    </section>
  )
}

const steps = [
  { i: 'camera', t: 'Lapor', d: 'Penghuni memilih kamar, mengisi kondisi air, dan melampirkan foto dalam sekitar semenit.' },
  { i: 'eye', t: 'Nilai', d: 'Sistem memberi Penilaian Visual dari foto dan laporan, bukan hasil uji laboratorium.' },
  { i: 'trend', t: 'Temukan pola', d: 'Laporan serupa dari kamar berdekatan digabung menjadi area terdampak dan tren.' },
  { i: 'check', t: 'Tindak dan verifikasi', d: 'Pembina memverifikasi, pengelola menindak, lalu penghuni memeriksa hasilnya.' },
]

const features = [
  { i: 'map', t: 'Peta Air', d: 'Status tiap kamar sesuai denah Max Planck, dari Normal sampai Siaga.', p: 'peta' as Page, cta: 'Buka Peta Air' },
  { i: 'id', t: 'Water Passport', d: 'Riwayat laporan dan perawatan tiap titik air, lengkap dengan masalah berulang.', p: 'peta' as Page, cta: 'Lihat contoh' },
  { i: 'list', t: 'Pelacak Laporan', d: '6 tahap dari Lapor sampai Diverifikasi ulang, bisa dipantau penghuni.', p: 'dasbor' as Page, cta: 'Lihat pelacak' },
]

export default function Home({ go }: Props) {
  return (
    <main>
      <Hero go={go} />

      <section className="wrap mt-10">
        <AlertBanner
          tone="siaga"
          pulse
          title="Peringatan air: Lantai 2, K2.09 sampai K2.11"
          action={<Button variant="primary" className="!bg-alert hover:!bg-[#B91C1C]" onClick={() => go('peta', 'K2.10')}>Lihat area terdampak</Button>}
        >
          Kondisi air tidak biasa dilaporkan. Diperbarui 08.42. Hindari memakai air terdampak untuk minum sampai ada pemberitahuan.
        </AlertBanner>
      </section>

      <section className="wrap mt-10 grid gap-6 md:grid-cols-3" aria-label="Statistik">
        <Reveal>
          <StatCard
            label="Laporan 24 jam terakhir"
            value={<CountUp to={12} />}
            badge={<NeutralBadge tone="red"><Icon name="trend" size={14} /> +4 dari kemarin</NeutralBadge>}
          />
        </Reveal>
        <Reveal delay={90}>
          <StatCard
            label="Peringatan aktif"
            value={<CountUp to={1} />}
            badge={<StatusBadge status="siaga">Lantai 2</StatusBadge>}
          />
        </Reveal>
        <Reveal delay={180}>
          <StatCard label="Titik air normal" value={<CountUp to={45} />} hint="/ 50">
            <div className="mt-1" role="progressbar" aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} aria-label="45 dari 50 titik air normal">
              <div className="h-2.5 overflow-hidden rounded-full bg-[#DCFCE7]">
                <div className="h-full w-[90%] rounded-full bg-ok" />
              </div>
              <div className="t-cap mt-1 text-slate-600">90% titik air Normal</div>
            </div>
          </StatCard>
        </Reveal>
      </section>

      <section className="wrap mt-24">
        <Reveal>
          <h2 className="t-h2 text-[32px] leading-10">Air tampak jernih belum tentu bersih</h2>
          <p className="mt-2 text-[18px] text-slate-700">Penghuni tidak bisa melihat isi airnya, dan keluhan jarang disertai bukti.</p>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            ['8 dari 10', 'penghuni melihat air tidak jernih minimal seminggu sekali'],
            ['0', 'catatan terbuka pengurasan tangki terakhir'],
            ['Tidak jelas', 'apakah keluhan pernah ditindaklanjuti'],
          ].map(([n, t], i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="lift h-full rounded-2xl bg-primary p-8 text-white shadow-card">
                <div className="text-[48px] font-bold leading-[56px]">{n}</div>
                <p className="mt-2 text-[17px] leading-7 text-white/95">{t}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="t-cap mt-4 text-muted">Data contoh</p>
      </section>

      <section className="wrap mt-24">
        <Reveal>
          <h2 className="t-h2 text-[32px] leading-10">Cara kerja</h2>
          <p className="mt-2 text-[18px] text-slate-700">Dari satu laporan sampai air terverifikasi.</p>
        </Reveal>
        <div className="relative mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div aria-hidden="true" className="absolute left-[12%] right-[12%] top-[52px] hidden border-t-2 border-dashed border-line lg:block" />
          {steps.map((s, i) => (
            <Reveal key={s.t} delay={i * 90}>
              <Card hover className="relative h-full">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
                  <Icon name={s.i} size={26} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-dark text-[13px] font-bold ring-2 ring-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="t-h3 mt-4">{s.t}</h3>
                <p className="mt-1 text-[15px] text-slate-700">{s.d}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap mt-24">
        <Reveal>
          <h2 className="t-h2 text-[32px] leading-10">Fitur utama</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 90}>
              <Card hover className="flex h-full flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E0F4F8] text-primary">
                  <Icon name={f.i} size={24} />
                </div>
                <h3 className="t-h3 mt-4">{f.t}</h3>
                <p className="mt-1 flex-1 text-[15px] text-slate-700">{f.d}</p>
                <button
                  type="button"
                  onClick={() => go(f.p)}
                  className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-1 self-start text-[15px] font-semibold text-primary hover:text-primary-dark"
                >
                  {f.cta} <Icon name="arrow" size={16} />
                </button>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap mt-24">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border-2 border-primary bg-white p-8 shadow-card lg:p-12">
            <div>
              <h2 className="t-h2 text-[32px] leading-10">Ada yang aneh dengan airmu?</h2>
              <p className="mt-2 text-[18px] text-slate-700">Hanya semenit, dan laporanmu membantu seluruh asrama.</p>
            </div>
            <Button icon="drop" onClick={() => go('lapor')}>Laporkan Masalah Air</Button>
          </div>
        </Reveal>
      </section>

      <footer className="wrap mt-24 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="t-cap text-slate-600">Tim AquaWatch · Asrama Max Planck</span>
          </div>
          <p className="t-cap text-slate-600">Penilaian Visual bukan pengganti uji laboratorium.</p>
        </div>
      </footer>
    </main>
  )
}
