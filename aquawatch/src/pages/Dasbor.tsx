import { useState } from 'react'
import { FloorCard } from '../FloorPlan'
import { Button, Card, Icon, Note, NeutralBadge, PageHeader, Reveal, SelectInput, StatCard, StatusBadge } from '../ui'
import { MiniBars } from './Peta'
import { floorOf, pembina, type Page } from '../data'

const steps = ['Lapor', 'Terverifikasi', 'Ditugaskan', 'Diperiksa', 'Diperbaiki', 'Diverifikasi ulang']

type Row = { id: string; room: string; level: number; who: string | null }

function Progress({ level }: { level: number }) {
  return (
    <div>
      <div className="flex gap-1" role="img" aria-label={`Progres ${level} dari 6: ${steps[level - 1]}`}>
        {steps.map((s, i) => (
          <span key={s} title={s} className={`h-2 w-7 rounded-full ${i < level ? (level === 6 ? 'bg-ok' : 'bg-primary') : 'bg-line'}`} />
        ))}
      </div>
      <div className="t-cap mt-1 text-slate-600">
        {steps[level - 1]} · {level}/6
      </div>
    </div>
  )
}

export default function Dasbor({ go }: { go: (p: Page, room?: string | null) => void }) {
  const [floor, setFloor] = useState('all')
  const [range, setRange] = useState('7')
  const [rows, setRows] = useState<Row[]>([
    { id: '#AQ-2041', room: 'K2.10', level: 6, who: 'Teknisi A' },
    { id: '#AQ-2044', room: 'K2.11', level: 4, who: 'Teknisi B' },
    { id: '#AQ-2046', room: 'K1.02', level: 2, who: null },
  ])
  const shownFloors = floor === 'all' ? [1, 2, 3, 4] : [Number(floor)]
  const shownRows = rows.filter((r) => floor === 'all' || floorOf(r.room) === Number(floor))

  const assign = (id: string) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, who: 'Teknisi C', level: 3 } : r)))

  const statusFor = (r: Row) =>
    r.level === 6 ? (
      <StatusBadge status="normal">Selesai</StatusBadge>
    ) : r.who ? (
      <StatusBadge status="perhatian">{steps[r.level - 1]}</StatusBadge>
    ) : (
      <StatusBadge status="siaga">Belum ditugaskan</StatusBadge>
    )

  return (
    <main className="wrap py-10">
      <PageHeader title="Dasbor Pengelola" caption="Prioritas dari laporan penghuni dan riwayat perawatan.">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-[14px] font-semibold">
            <span className="sr-only sm:not-sr-only">Lantai:</span>
            <SelectInput value={floor} onChange={setFloor} className="w-[170px]">
              <option value="all">Lantai: Semua</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>Lantai {n}</option>
              ))}
            </SelectInput>
          </label>
          <SelectInput value={range} onChange={setRange} className="w-[180px]">
            <option value="1">24 jam terakhir</option>
            <option value="7">7 hari terakhir</option>
            <option value="30">30 hari terakhir</option>
          </SelectInput>
        </div>
      </PageHeader>

      <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Ringkasan">
        <Reveal><StatCard label="Laporan terbuka" value="7" badge={<NeutralBadge><Icon name="trend" size={14} /> +2 dari kemarin</NeutralBadge>} /></Reveal>
        <Reveal delay={90}><StatCard label="Siaga" value="1" badge={<StatusBadge status="siaga">K2.10</StatusBadge>} /></Reveal>
        <Reveal delay={180}><StatCard label="Rata-rata waktu respons" value="38" hint="menit" badge={<NeutralBadge tone="slate"><Icon name="clock" size={14} /> Target 60 menit</NeutralBadge>} /></Reveal>
        <Reveal delay={270}><StatCard label="Selesai minggu ini" value="14" badge={<StatusBadge status="normal">Tuntas</StatusBadge>} /></Reveal>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="!p-8">
          <h2 className="t-h3">Apa yang sebenarnya terjadi?</h2>
          <dl className="mt-4 divide-y divide-line text-[15px]">
            {[
              ['Perkiraan area terdampak', <b key="1">Lantai 2, K2.09 sampai K2.11</b>],
              ['Waktu puncak', <b key="2">06.00 sampai 08.00</b>],
              ['Keluhan terbanyak', <b key="3">Air keruh</b>],
              ['Tren', <StatusBadge key="4" status="siaga">Meningkat</StatusBadge>],
              ['Saran pemeriksaan', <b key="5">Tangki air dan jalur distribusi</b>],
            ].map(([l, v], i) => (
              <div key={i} className="flex min-h-12 items-center justify-between gap-4 py-2.5">
                <dt className="text-slate-600">{l}</dt>
                <dd className="text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <Note>Hanya indikasi dari laporan. Ajukan uji lab jika pola berulang.</Note>
          </div>
        </Card>

        <Card className="flex flex-col !p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="t-h3">Masalah yang muncul</h2>
            <span className="t-cap text-muted">K2.10 · laporan per bulan</span>
          </div>
          <div className="mt-6 flex-1">
            <MiniBars data={[2, 5, 9]} lastRed />
          </div>
          <div className="mt-6">
            <Button full icon="wrench">Jadwalkan pemeriksaan</Button>
          </div>
        </Card>
      </section>

      <section className="mt-6" aria-label="Peta panas lantai">
        <Card className="!p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="t-h3">Peta panas lantai</h2>
            <ul className="flex flex-wrap gap-2" aria-label="Legenda">
              <li><StatusBadge status="normal">Normal 45</StatusBadge></li>
              <li><StatusBadge status="perhatian">Perhatian 4</StatusBadge></li>
              <li><StatusBadge status="siaga">Siaga 1</StatusBadge></li>
            </ul>
          </div>
          <div className={`mt-5 grid gap-5 ${shownFloors.length > 1 ? 'lg:grid-cols-2' : ''}`}>
            {shownFloors.map((n) => (
              <FloorCard key={n} n={n} />
            ))}
          </div>
          <p className="t-cap mt-4 text-slate-600">
            Pembina: {Object.entries(pembina).map(([n, p]) => `Lantai ${n} ${p ? `★ ${p}` : 'belum ada'}`).join(' · ')}
          </p>
        </Card>
      </section>

      <section className="mt-6" aria-label="Pelacak laporan">
        <Card className="!p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="t-h3">Pelacak laporan</h2>
            <Button variant="secondary" icon="download">Ekspor laporan mingguan</Button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-[15px]">
              <thead>
                <tr className="border-b-2 border-line text-[13px] text-slate-600">
                  {['ID', 'Lokasi', 'Status', 'Progres', 'Ditugaskan ke', 'Pembina lantai'].map((h) => (
                    <th key={h} scope="col" className="py-3 pr-4 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shownRows.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-600">Belum ada laporan di lantai ini.</td></tr>
                )}
                {shownRows.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0">
                    <td className="py-4 pr-4 font-bold text-primary-dark">{r.id}</td>
                    <td className="py-4 pr-4">{r.room}</td>
                    <td className="py-4 pr-4">{statusFor(r)}</td>
                    <td className="py-4 pr-4"><Progress level={r.level} /></td>
                    <td className="py-4 pr-4">
                      {r.who ?? (
                        <div className="flex items-center gap-3">
                          <span className="text-slate-600">Belum ada</span>
                          <button
                            type="button"
                            onClick={() => assign(r.id)}
                            className="lift min-h-11 cursor-pointer rounded-xl bg-primary px-4 text-[14px] font-semibold text-white hover:bg-primary-dark"
                          >
                            Tugaskan
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-4 pr-4">{pembina[floorOf(r.room)] ? `★ ${pembina[floorOf(r.room)]}` : 'Belum ada'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </main>
  )
}
