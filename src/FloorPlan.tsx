import { CANVAS_H, CANVAS_W, floors, pembina, reportsOf, statusLabel, statusOf, type Floor, type Item } from './data'

const pos = (i: { l: number; y: number; w: number; h: number }) => ({
  left: `${(i.l / CANVAS_W) * 100}%`,
  top: `${(i.y / CANVAS_H) * 100}%`,
  width: `${(i.w / CANVAS_W) * 100}%`,
  height: `${(i.h / CANVAS_H) * 100}%`,
})

const roomTone = {
  normal: 'bg-[#DCFCE7] border-[#86EFAC] text-[#14532D] border',
  perhatian: 'bg-[#FEF3C7] border-warn text-[#78350F] border-2',
  siaga: 'bg-[#FEE2E2] border-alert text-[#7F1D1D] border-2 pulse-room',
}

function Room({
  item,
  floor,
  selected,
  onSelect,
}: {
  item: Item
  floor: number
  selected: boolean
  onSelect?: (id: string) => void
}) {
  const st = statusOf(item.id)
  const star = pembina[floor] === item.id
  const tip = `${item.id} · ${statusLabel[st]} · ${reportsOf(item.id)} laporan`
  const cls = `room group absolute flex items-center justify-center rounded-lg font-semibold ${roomTone[st]} ${
    onSelect ? 'cursor-pointer' : ''
  }`
  const style = {
    ...pos(item),
    fontSize: 'max(10px, 1.9cqw)',
    boxShadow: selected ? '0 0 0 2px #fff, 0 0 0 5px #0E7490' : undefined,
    zIndex: selected ? 10 : undefined,
  }
  const inner = (
    <>
      <span>
        {star && <span aria-label="kamar pembina">★ </span>}
        {item.id}
      </span>
      {st !== 'normal' && (
        <span
          aria-hidden="true"
          className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-extrabold leading-none ${
            st === 'siaga' ? 'bg-alert text-white' : 'bg-warn text-ink'
          }`}
        >
          !
        </span>
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-[12px] font-semibold leading-4 text-white opacity-0 shadow-lg transition-opacity duration-200 ease-out group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {tip}
      </span>
    </>
  )
  if (!onSelect)
    return (
      <div className={cls} style={style} title={tip}>
        {inner}
      </div>
    )
  return (
    <button
      type="button"
      className={cls}
      style={style}
      aria-pressed={selected}
      aria-label={`${item.id}, ${statusLabel[st]}, ${reportsOf(item.id)} laporan${star ? ', kamar pembina' : ''}`}
      onClick={() => onSelect(item.id)}
    >
      {inner}
    </button>
  )
}

export function FloorCanvas({
  floor,
  selected,
  onSelect,
}: {
  floor: Floor
  selected?: string | null
  onSelect?: (id: string) => void
}) {
  return (
    <div className="overflow-x-auto">
      <div
        className="relative min-w-[560px] rounded-xl border border-line bg-[#F8FAFC]"
        style={{ containerType: 'inline-size', padding: '2.5% 2.5%' }}
      >
        <div className="relative w-full" style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}>
          <div
            className="absolute flex items-center justify-center rounded-md border border-[#CBD5E1] bg-[#E2E8F0] font-semibold tracking-[0.12em] text-slate-600"
            style={{ ...pos({ l: 0, y: 57, w: CANVAS_W, h: 36 }), fontSize: 'max(9px, 1.7cqw)' }}
          >
            SELASAR
          </div>
          {floor.items.map((it, idx) => {
            if (it.kind === 'room')
              return (
                <Room
                  key={it.id}
                  item={it}
                  floor={floor.n}
                  selected={selected === it.id}
                  onSelect={onSelect}
                />
              )
            const stair = it.kind === 'tangga'
            return (
              <div
                key={idx}
                aria-label={stair ? 'Tangga' : 'Ruang Kaca'}
                className={`absolute flex items-center justify-center rounded-lg border-2 text-center font-bold ${
                  stair
                    ? 'border-[#EA580C] bg-[#FFEDD5] text-[#9A3412]'
                    : 'border-[#0284C7] bg-[#E0F2FE] text-[#075985]'
                }`}
                style={{
                  ...pos(it),
                  fontSize: 'max(9px, 1.7cqw)',
                  lineHeight: 1.15,
                  textTransform: stair ? 'none' : 'uppercase',
                }}
              >
                {stair ? 'Tangga' : (<>RUANG<br />KACA</>)}
              </div>
            )
          })}
          <div
            className="absolute flex items-center justify-center rounded-lg bg-ink px-1 text-center font-bold text-white"
            style={{
              ...pos({ l: floor.note.cx - floor.note.w / 2, y: floor.note.y, w: floor.note.w, h: 38 }),
              fontSize: 'max(10px, 1.8cqw)',
              lineHeight: 1.2,
            }}
          >
            {floor.note.text}
          </div>
        </div>
      </div>
    </div>
  )
}

export function FloorCard({
  n,
  selected,
  onSelect,
}: {
  n: number
  selected?: string | null
  onSelect?: (id: string) => void
}) {
  const floor = floors.find((f) => f.n === n)!
  const p = pembina[n]
  const count = floor.items.filter((i) => i.kind === 'room').length
  return (
    <section
      aria-label={`Denah Lantai ${n}`}
      className="overflow-visible rounded-2xl border-t-[6px] border-primary bg-white p-5 shadow-card"
    >
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="t-h3">
          Lantai {n} <span className="t-cap font-medium text-muted">· {count} kamar</span>
        </h3>
        <span className="t-cap font-medium text-slate-600">
          {p ? `★ Pembina: ${p}` : 'Belum ada pembina'}
        </span>
      </div>
      <FloorCanvas floor={floor} selected={selected} onSelect={onSelect} />
    </section>
  )
}
