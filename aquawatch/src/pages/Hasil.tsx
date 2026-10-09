import { useState } from 'react'
import { AlertBanner, Button, Card, DemoPhoto, Icon, Note, PageHeader, Segmented, StatusBadge, TimelineStep } from '../ui'
import { floorOf, type Page } from '../data'

type Variant = 'perhatian' | 'normal'

export default function Hasil({ go, room }: { go: (p: Page, room?: string | null) => void; room: string | null }) {
  const [v, setV] = useState<Variant>('perhatian')
  const id = room ?? 'K2.10'
  const warn = v === 'perhatian'
  const rows: [string, React.ReactNode][] = [
    ['Tampilan kekeruhan', warn ? <StatusBadge status="siaga">Tinggi</StatusBadge> : <StatusBadge status="normal">Rendah</StatusBadge>],
    [
      'Penyimpangan warna',
      warn ? <span className="font-semibold text-[#991B1B]">Terdeteksi</span> : <span className="font-semibold text-[#166534]">Tidak terdeteksi</span>,
    ],
    [
      'Partikel terlihat',
      warn ? <span className="font-semibold text-[#991B1B]">Terdeteksi</span> : <span className="font-semibold text-[#166534]">Tidak terdeteksi</span>,
    ],
  ]
  const conf = warn ? 87 : 91

  return (
    <main className="wrap py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ok text-white">
            <Icon name="check" size={30} />
          </span>
          <div>
            <h1 className="t-h2">Laporan diterima · #AQ-2047</h1>
            <p className="t-cap text-[14px] text-slate-600">
              {id}, Lantai {floorOf(id)} · baru saja
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="t-cap font-semibold text-muted">Pratinjau varian hasil</span>
          <Segmented<Variant>
            label="Varian hasil"
            value={v}
            onChange={setV}
            options={[
              { v: 'perhatian', label: 'Perlu perhatian' },
              { v: 'normal', label: 'Normal' },
            ]}
          />
        </div>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-12">
        <Card className="space-y-6 !p-8 lg:col-span-7">
          <h2 className="t-h3">Penilaian Visual</h2>
          <dl className="divide-y divide-line">
            {rows.map(([l, val]) => (
              <div key={l} className="flex min-h-14 items-center justify-between gap-4 py-3">
                <dt className="text-[16px] text-slate-700">{l}</dt>
                <dd>{val}</dd>
              </div>
            ))}
            <div className="py-3">
              <div className="flex items-center justify-between">
                <dt className="text-[16px] text-slate-700">Keyakinan visual</dt>
                <dd className="font-bold text-primary-dark">{conf}%</dd>
              </div>
              <div
                className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#E0F4F8]"
                role="progressbar"
                aria-valuenow={conf}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Keyakinan visual"
              >
                <div className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${conf}%` }} />
              </div>
            </div>
          </dl>

          {warn ? (
            <AlertBanner tone="perhatian" title="Kondisi air perlu perhatian">
              Berdasarkan ciri visual, sampel ini tampak berbeda dari kondisi normal di lokasi ini. Ini bukan hasil uji laboratorium.
            </AlertBanner>
          ) : (
            <AlertBanner tone="normal" title="Kondisi air tampak normal">
              Kondisi air tampak sesuai kondisi normal lokasi ini. Ini bukan hasil uji laboratorium.
            </AlertBanner>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {(['sample', 'tissue'] as const).map((k) => (
              <figure key={k}>
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-line bg-slate-100">
                  <DemoPhoto kind={k} />
                </div>
                <figcaption className="t-cap mt-2 font-semibold text-slate-700">
                  {k === 'sample' ? 'Foto sampel air' : 'Foto saringan tisu'}
                </figcaption>
              </figure>
            ))}
          </div>
          <Note>Indikasi dari foto dan laporan, bukan hasil uji laboratorium.</Note>
        </Card>

        <div className="space-y-6 lg:col-span-5">
          <Card>
            <h2 className="t-h3">Yang bisa kamu lakukan sekarang</h2>
            <ul className="mt-4 space-y-4">
              {[
                ['cup', 'Minum', 'Rebus dulu atau pakai air isi ulang.'],
                ['drop', 'Wajah dan gigi', 'Pakai air tersaring jika keruh.'],
                ['arrow', 'Selanjutnya', 'Pembina memverifikasi, pengelola menindak.'],
              ].map(([ic, t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E0F4F8] text-primary">
                    <Icon name={ic} size={20} />
                  </span>
                  <div>
                    <div className="font-semibold">{t}</div>
                    <div className="text-[15px] text-slate-700">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="t-h3">Status laporan</h2>
            <ol className="mt-4" aria-label="Tahap laporan">
              <TimelineStep label="Lapor" state="done" note="Baru saja" />
              <TimelineStep label="Terverifikasi" state="todo" />
              <TimelineStep label="Ditugaskan" state="todo" />
              <TimelineStep label="Diperiksa" state="todo" />
              <TimelineStep label="Diperbaiki" state="todo" />
              <TimelineStep label="Diverifikasi ulang" state="todo" last />
            </ol>
          </Card>

          <div className="flex flex-col gap-3">
            <Button full icon="list" onClick={() => go('dasbor')}>Pantau laporan ini</Button>
            <Button full variant="secondary" onClick={() => go('home')}>Kembali ke Beranda</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
