import { useState } from 'react'
import { Button, Card, Chip, DemoPhoto, Field, Icon, Note, PageHeader, Segmented, SelectInput } from '../ui'
import { allRooms, floors, type Page } from '../data'

type Photo = { kind: 'demo-sample' | 'demo-tissue' } | { kind: 'file'; url: string; name: string } | null
type Form = {
  room: string
  cond: string
  seen: string[]
  when: string
  pump: boolean
  sample: Photo
  tissue: Photo
  note: string
}
type Preset = 'default' | 'terisi' | 'error' | 'disabled'

const empty: Form = { room: '', cond: '', seen: [], when: '', pump: false, sample: null, tissue: null, note: '' }
const filled: Form = {
  room: 'K2.10',
  cond: 'Keruh',
  seen: ['Partikel'],
  when: 'Sekarang',
  pump: false,
  sample: { kind: 'demo-sample' },
  tissue: { kind: 'demo-tissue' },
  note: 'Air keruh sejak subuh, ada serpihan halus di dasar gelas.',
}

const conds = [
  { n: 'Jernih', c: '#16A34A', sw: '#EAF7FA', d: 'Tembus pandang' },
  { n: 'Agak keruh', c: '#F59E0B', sw: '#E9E3B5', d: 'Sedikit kabur' },
  { n: 'Keruh', c: '#EA580C', sw: '#C9A66B', d: 'Sulit tembus pandang' },
  { n: 'Sangat keruh', c: '#DC2626', sw: '#8B5E34', d: 'Pekat atau berwarna' },
]
const seenOpts = ['Warna berubah', 'Bau', 'Partikel', 'Aliran kecil', 'Air mati']
const whenOpts = ['Sekarang', 'Pagi tadi', 'Kemarin']

function PhotoBox({
  title,
  hint,
  value,
  onChange,
  optional,
}: {
  title: string
  hint: string
  value: Photo
  onChange: (p: Photo) => void
  optional?: boolean
}) {
  if (value)
    return (
      <div className="rounded-xl border-2 border-line p-3">
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
          {value.kind === 'file' ? (
            <img src={value.url} alt={title} className="h-full w-full object-cover" />
          ) : (
            <DemoPhoto kind={value.kind === 'demo-sample' ? 'sample' : 'tissue'} />
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold">{title}</div>
            <div className="t-cap flex items-center gap-1 font-semibold text-ok">
              <Icon name="check" size={14} /> Terunggah
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-lg px-3 text-[14px] font-semibold text-alert hover:bg-[#FEF2F2]"
          >
            <Icon name="trash" size={16} /> Hapus
          </button>
        </div>
      </div>
    )
  return (
    <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#9DC3D2] bg-bg p-4 text-center transition-colors duration-200 ease-out hover:border-primary hover:bg-[#E3F4FA] focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-[#facc15]">
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange({ kind: 'file', url: URL.createObjectURL(f), name: f.name })
        }}
      />
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-card">
        <Icon name="upload" size={22} />
      </span>
      <span className="text-[15px] font-semibold">{title}</span>
      <span className="t-cap text-slate-600">{hint}</span>
      {optional && <span className="t-cap font-semibold text-muted">Opsional</span>}
      <span className="t-cap font-semibold text-primary">Ketuk untuk unggah</span>
    </label>
  )
}

function TissueIllus({ n }: { n: number }) {
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
      <rect width="80" height="80" rx="12" fill="#E3F4FA" />
      {n === 1 && (
        <>
          <rect x="18" y="52" width="44" height="12" rx="2" fill="#fff" stroke="#9DC3D2" />
          <path d="M26 14h28l-3 30H29z" fill="#fff" stroke="#0E7490" strokeWidth="2" />
          <path d="M28 24h24l-2 20H30z" fill="#C9A66B" />
          <path d="M40 44v8" stroke="#C9A66B" strokeWidth="3" strokeDasharray="2 3" />
        </>
      )}
      {n === 2 && (
        <>
          <circle cx="58" cy="20" r="9" fill="#FDE68A" />
          <path d="M58 6v-3M58 37v-3M44 20h-3M75 20h-3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <rect x="16" y="34" width="40" height="32" rx="3" fill="#fff" stroke="#9DC3D2" />
          <circle cx="36" cy="50" r="9" fill="#C9A66B" opacity=".6" />
          <circle cx="33" cy="48" r="1.500" fill="#6B4A20" />
          <circle cx="39" cy="53" r="1.500" fill="#6B4A20" />
        </>
      )}
      {n === 3 && (
        <>
          <rect x="22" y="40" width="36" height="26" rx="3" fill="#fff" stroke="#0E7490" strokeWidth="2" />
          <path d="M40 34V14M32 22l8-8 8 8" stroke="#0E7490" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="40" cy="53" r="6" fill="#C9A66B" opacity=".6" />
        </>
      )}
    </svg>
  )
}

export default function Lapor({ go, initialRoom }: { go: (p: Page, room?: string | null) => void; initialRoom: string | null }) {
  const [f, setF] = useState<Form>({ ...empty, room: initialRoom ?? '' })
  const [tried, setTried] = useState(false)
  const [preset, setPreset] = useState<Preset>('default')

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }))
  const valid = !!f.room && !!f.cond
  const roomErr = tried && !f.room ? 'Pilih kamar terlebih dahulu agar laporan sampai ke pembina yang tepat.' : undefined
  const condErr = tried && !f.cond ? 'Pilih kondisi air yang paling mendekati.' : undefined

  const applyPreset = (p: Preset) => {
    setPreset(p)
    if (p === 'terisi') {
      setF(filled)
      setTried(false)
    } else if (p === 'error') {
      setF(empty)
      setTried(true)
    } else if (p === 'disabled') {
      setF({ ...empty, room: 'K2.10' })
      setTried(false)
    } else {
      setF(empty)
      setTried(false)
    }
  }

  const step = !f.room ? 1 : !f.cond ? 2 : 3
  const stepsList = ['Lokasi', 'Kondisi', 'Bukti']
  const isUpper4 = f.room.startsWith('K4')

  return (
    <main className="wrap py-10">
      <PageHeader title="Laporkan Masalah Air" caption="Hanya sekitar semenit. Tambahkan foto agar tim bisa mengecek lebih cepat.">
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <span className="t-cap font-semibold text-muted">Pratinjau state formulir</span>
          <Segmented<Preset>
            label="Pratinjau state"
            value={preset}
            onChange={applyPreset}
            options={[
              { v: 'default', label: 'Default' },
              { v: 'terisi', label: 'Terisi' },
              { v: 'error', label: 'Error validasi' },
              { v: 'disabled', label: 'Tombol nonaktif' },
            ]}
          />
        </div>
      </PageHeader>

      <ol className="mt-8 flex flex-wrap items-center gap-3" aria-label="Langkah pelaporan">
        {stepsList.map((s, i) => {
          const done = i + 1 < step || (i === 2 && valid && !!f.sample)
          const cur = i + 1 === step
          return (
            <li key={s} className="flex items-center gap-3" aria-current={cur ? 'step' : undefined}>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-bold ${
                  done ? 'bg-ok text-white' : cur ? 'bg-primary text-white' : 'bg-white text-slate-600 ring-2 ring-line'
                }`}
              >
                {done ? <Icon name="check" size={18} /> : i + 1}
              </span>
              <span className={`text-[15px] font-semibold ${cur || done ? 'text-ink' : 'text-slate-600'}`}>{s}</span>
              {i < 2 && <span aria-hidden="true" className="h-0.5 w-10 rounded bg-line" />}
            </li>
          )
        })}
      </ol>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
        <form
          className="lg:col-span-7"
          onSubmit={(e) => {
            e.preventDefault()
            if (!valid) return setTried(true)
            go('hasil', f.room)
          }}
        >
          <Card className="space-y-8 !p-8">
            <section>
              <Field label="1. Lokasi" htmlFor="room" error={roomErr}>
                <SelectInput id="room" value={f.room} onChange={(v) => set('room', v)} invalid={!!roomErr}>
                  <option value="">Pilih kamar</option>
                  {floors.map((fl) => (
                    <optgroup key={fl.n} label={`Lantai ${fl.n}`}>
                      {allRooms
                        .filter((r) => r.floor === fl.n)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            Max Planck, Lantai {fl.n}, {r.id}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </SelectInput>
              </Field>
              <button
                type="button"
                onClick={() => go('peta')}
                className="mt-1 inline-flex min-h-11 cursor-pointer items-center gap-1 text-[14px] font-semibold text-primary underline-offset-2 hover:underline"
              >
                <Icon name="map" size={16} /> Pilih dari peta
              </button>
            </section>

            <fieldset>
              <legend className="mb-2 text-[16px] font-semibold">2. Kondisi air</legend>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="radiogroup" aria-label="Kondisi air">
                {conds.map((c) => {
                  const sel = f.cond === c.n
                  return (
                    <button
                      key={c.n}
                      type="button"
                      role="radio"
                      aria-checked={sel}
                      onClick={() => set('cond', c.n)}
                      style={{
                        borderColor: c.c,
                        outline: sel ? '3px solid #0E7490' : undefined,
                        outlineOffset: sel ? 2 : undefined,
                      }}
                      className="lift relative flex min-h-[132px] cursor-pointer flex-col items-center gap-2 rounded-xl border-2 bg-white p-3 text-center"
                    >
                      {sel && (
                        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                          <Icon name="check" size={13} />
                        </span>
                      )}
                      <span className="mt-1 h-12 w-9 rounded-b-xl rounded-t-sm border-2 border-white shadow-[0_0_0_1px_#cbd5e1]" style={{ background: c.sw }} />
                      <span className="text-[15px] font-semibold leading-5">{c.n}</span>
                      <span className="t-cap text-slate-600">{c.d}</span>
                    </button>
                  )
                })}
              </div>
              {condErr && (
                <p role="alert" className="mt-2 flex items-center gap-1 text-[13px] font-semibold text-alert">
                  <Icon name="alert" size={14} /> {condErr}
                </p>
              )}
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-[16px] font-semibold">3. Apa yang kamu lihat?</legend>
              <div className="flex flex-wrap gap-2">
                {seenOpts.map((o) => (
                  <Chip
                    key={o}
                    selected={f.seen.includes(o)}
                    onClick={() => set('seen', f.seen.includes(o) ? f.seen.filter((x) => x !== o) : [...f.seen, o])}
                  >
                    {o}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-[16px] font-semibold">4. Waktu kejadian</legend>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Waktu kejadian">
                {whenOpts.map((o) => (
                  <Chip key={o} role="radio" tone="teal" selected={f.when === o} onClick={() => set('when', o)}>
                    {o}
                  </Chip>
                ))}
              </div>
              <label className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                <input
                  type="checkbox"
                  checked={f.pump}
                  onChange={(e) => set('pump', e.target.checked)}
                  className="h-5 w-5 cursor-pointer accent-[#0E7490]"
                />
                Pompa sempat mati/hidup
              </label>
            </fieldset>

            <section>
              <h3 className="mb-2 text-[16px] font-semibold">5. Bukti foto</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <PhotoBox
                  title="Foto sampel air"
                  hint="Segelas air, latar polos"
                  value={f.sample}
                  onChange={(p) => set('sample', p)}
                />
                <PhotoBox
                  title="Foto saringan tisu (opsional)"
                  hint="Saring satu gelas lewat tisu putih"
                  optional
                  value={f.tissue}
                  onChange={(p) => set('tissue', p)}
                />
              </div>
            </section>

            <Field label="6. Catatan tambahan (opsional)" htmlFor="note">
              <textarea
                id="note"
                rows={3}
                value={f.note}
                onChange={(e) => set('note', e.target.value)}
                placeholder="Ceritakan singkat apa yang kamu lihat atau cium."
                className="w-full resize-y rounded-xl border-2 border-line bg-white p-3 text-[16px] transition-colors duration-200 ease-out placeholder:text-muted hover:border-primary"
              />
            </Field>

            <div>
              <Button type="submit" full softDisabled={!valid} icon="arrow">
                Kirim laporan
              </Button>
              <p className="t-cap mt-2 text-center text-slate-600">Laporan diteruskan ke pembina lantai, lalu pengelola.</p>
              {!valid && (
                <p className="t-cap mt-1 text-center text-muted">Tombol aktif setelah kamar dan kondisi air dipilih.</p>
              )}
            </div>
          </Card>
        </form>

        <aside className="space-y-6 lg:col-span-5">
          <Card>
            <h2 className="t-h3">Cara kerja uji tisu</h2>
            <ol className="mt-4 space-y-4">
              {[
                'Tuang segelas air lewat tisu putih.',
                'Foto tisu di cahaya terang.',
                'Unggah bersama laporan.',
              ].map((t, i) => (
                <li key={t} className="flex items-center gap-4">
                  <div className="h-[72px] w-[72px] shrink-0">
                    <TissueIllus n={i + 1} />
                  </div>
                  <div>
                    <div className="t-cap font-bold text-primary">Langkah {i + 1}</div>
                    <div className="text-[15px] font-medium">{t}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4">
              <Note>Air jernih tetap bisa membawa partikel halus. Foto ini bukti untuk tim, bukan uji keamanan.</Note>
            </div>
          </Card>

          <Card>
            <h2 className="t-h3">Jalur laporan</h2>
            <ol className="mt-4 flex flex-wrap items-center gap-2">
              {[
                ['user', 'Penghuni'],
                ['shield', 'Pembina lantai'],
                ['list', 'Pengelola'],
                ['wrench', 'Teknisi'],
              ].map(([ic, l], i) => (
                <li key={l} className="flex items-center gap-2">
                  <span className="flex flex-col items-center gap-1 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E0F4F8] text-primary">
                      <Icon name={ic} size={20} />
                    </span>
                    <span className="t-cap font-semibold">{l}</span>
                  </span>
                  {i < 3 && <Icon name="arrow" size={16} className="mb-5 text-muted" />}
                </li>
              ))}
            </ol>
            <div className={`mt-4 rounded-lg p-3 ${isUpper4 ? 'bg-[#FFFBEB] ring-2 ring-warn' : 'bg-bg'}`}>
              <Note>Lantai 4 belum punya pembina, laporan langsung ke pengelola.</Note>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  )
}
