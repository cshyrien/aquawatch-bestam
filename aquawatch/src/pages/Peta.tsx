import { useState } from 'react'
import { FloorCard } from '../FloorPlan'
import { Button, Card, Icon, PageHeader, Segmented, StatusBadge } from '../ui'
import { floorOf, passportOf, pembina, reportsOf, statusLabel, statusOf, type Page } from '../data'

type Seg = 'all' | '1' | '2' | '3' | '4'

export function MiniBars({ data, lastRed }: { data: number[]; lastRed?: boolean }) {
  const max = Math.max(...data, 1)
  const months = ['Sep', 'Okt', 'Nov']
  return (
    <div className="flex h-[120px] items-end gap-4" role="img" aria-label={`Laporan per bulan: ${data.map((d, i) => `${months[i]} ${d}`).join(', ')}`}>
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[13px] font-bold">{d}</span>
          <div
            className={`w-full rounded-t-md transition-[height] duration-300 ease-out ${lastRed && i === data.length - 1 ? 'bg-alert' : 'bg-primary'}`}
            style={{ height: `${Math.max(4, (d / max) * 72)}px` }}
          />
          <span className="t-cap text-slate-600">{months[i]}</span>
        </div>
      ))}
    </div>
  )
}

function Passport({ id, go }: { id: string; go: Props['go'] }) {
  const st = statusOf(id)
  const fl = floorOf(id)
  const p = passportOf(id)
  const b = pembina[fl]
  return (
    <Card className="space-y-5 !p-6">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="t-cap font-semibold text-muted">Water Passport</div>
          <h2 className="t-h2 mt-0.5">
            {id} <span className="t-cap font-medium text-muted">Lantai {fl}</span>
          </h2>
        </div>
        <StatusBadge status={st} />
      </div>
      <dl className="divide-y divide-line text-[15px]">
        {[
          ['Laporan bulan ini', <b key="a" className="text-[20px] text-primary-dark">{reportsOf(id)}</b>],
          ['Masalah berulang', <span key="b" className="font-semibold">{p.recurring}</span>],
          ['Perawatan terakhir', <span key="c" className="font-semibold">{p.maint}</span>],
          [
            'Pembina lantai',
            <span key="d" className="font-semibold">{b ? `★ ${b}` : 'Belum ada, lapor ke pengelola'}</span>,
          ],
        ].map(([l, v], i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-slate-600">{l}</dt>
            <dd className="text-right">{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <h3 className="mb-2 text-[15px] font-semibold">Riwayat</h3>
        <ul className="space-y-2">
          {p.history.map((h) => (
            <li key={h.label} className="flex items-center gap-2 text-[15px]">
              <Icon name="wrench" size={16} className="text-primary" />
              <span className="flex-1">{h.label}</span>
              <span className="t-cap text-muted">{h.date}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="mb-2 text-[15px] font-semibold">Laporan 3 bulan</h3>
        <MiniBars data={p.chart} lastRed={st === 'siaga'} />
      </div>
      <Button full icon="drop" onClick={() => go('lapor', id)}>Laporkan Masalah Air</Button>
    </Card>
  )
}

type Props = { go: (p: Page, room?: string | null) => void; room: string | null; setRoom: (r: string | null) => void }

export default function Peta({ go, room, setRoom }: Props) {
  const [seg, setSeg] = useState<Seg>('all')
  const shown = seg === 'all' ? [1, 2, 3, 4] : [Number(seg)]
  const toggle = (id: string) => setRoom(room === id ? null : id)

  return (
    <main className="wrap py-10">
      <PageHeader
        title="Peta Air"
        caption="Denah Asrama Max Planck. Pilih kamar untuk melihat Water Passport-nya. ★ = kamar pembina asrama."
      />

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <ul className="flex flex-wrap gap-2" aria-label="Legenda status">
              {(['normal', 'perhatian', 'siaga'] as const).map((s) => (
                <li key={s}>
                  <StatusBadge status={s}>
                    {statusLabel[s]} {s === 'normal' ? 45 : s === 'perhatian' ? 4 : 1}
                  </StatusBadge>
                </li>
              ))}
              <li className="t-cap flex items-center gap-1 px-1 text-slate-600">
                <span className="inline-block h-3 w-3 rounded border-2 border-[#EA580C] bg-[#FFEDD5]" /> Tangga
                <span className="ml-2 inline-block h-3 w-3 rounded border-2 border-[#0284C7] bg-[#E0F2FE]" /> Ruang Kaca (bukan titik air)
              </li>
            </ul>
            <Segmented<Seg>
              label="Filter lantai"
              value={seg}
              onChange={setSeg}
              options={[
                { v: 'all', label: 'Semua lantai' },
                { v: '1', label: 'Lantai 1' },
                { v: '2', label: '2' },
                { v: '3', label: '3' },
                { v: '4', label: '4' },
              ]}
            />
          </div>
          <div className="space-y-6">
            {shown.map((n) => (
              <FloorCard key={n} n={n} selected={room} onSelect={toggle} />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:col-span-4" aria-label="Water Passport">
          {room ? (
            <Passport id={room} go={go} />
          ) : (
            <Card className="flex flex-col items-center gap-3 py-14 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E0F4F8] text-primary">
                <Icon name="pin" size={26} />
              </span>
              <h2 className="t-h3">Water Passport</h2>
              <p className="max-w-[260px] text-[15px] text-slate-700">Pilih kamar di denah untuk melihat riwayatnya.</p>
            </Card>
          )}
        </aside>
      </div>
    </main>
  )
}
