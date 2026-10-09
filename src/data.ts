export type Status = 'normal' | 'perhatian' | 'siaga'
export type Page = 'home' | 'lapor' | 'hasil' | 'peta' | 'dasbor'

export const statusLabel: Record<Status, string> = {
  normal: 'Normal',
  perhatian: 'Perhatian',
  siaga: 'Siaga',
}

export function statusOf(id: string): Status {
  if (id === 'K2.10') return 'siaga'
  if (['K2.09', 'K2.11', 'K1.04', 'K3.09'].includes(id)) return 'perhatian'
  return 'normal'
}

export const pembina: Record<number, string | null> = {
  1: 'K1.08',
  2: 'K2.02',
  3: 'K3.05',
  4: null,
}

export type Item = {
  id: string
  l: number
  w: number
  y: number
  h: number
  kind: 'room' | 'tangga' | 'kaca'
}

export const CANVAS_W = 512
export const CANVAS_H = 200

const top = (id: string, l: number, w: number, kind: Item['kind'] = 'room'): Item => ({
  id,
  l,
  w,
  y: 12,
  h: 34,
  kind,
})
const bot = (id: string, l: number, w: number, kind: Item['kind'] = 'room'): Item => ({
  id,
  l,
  w,
  y: 100,
  h: kind === 'kaca' ? 54 : 34,
  kind,
})

export type Floor = {
  n: number
  items: Item[]
  note: { text: string; cx: number; w: number; y: number }
}

function upper(n: number): Floor {
  const k = (s: string) => `K${n}.${s}`
  return {
    n,
    items: [
      top(k('07'), 7, 54),
      top(k('08'), 62, 53),
      top('Tangga', 138, 49, 'tangga'),
      top(k('09'), 191, 50),
      top(k('10'), 242, 48),
      top(k('11'), 291, 48),
      top('Tangga', 340, 49, 'tangga'),
      top(k('12'), 420, 43),
      top(k('13'), 464, 43),
      bot(k('01'), 4, 57),
      bot(k('02'), 116, 55),
      bot(k('03'), 173, 55),
      bot(k('04'), 312, 51),
      bot(k('05'), 367, 51),
      bot(k('06'), 460, 51),
    ],
    note: { text: 'Balkon', cx: 270, w: 84, y: 136 },
  }
}

export const floors: Floor[] = [
  {
    n: 1,
    items: [
      top('K1.06', 8, 45),
      top('Tangga', 101, 50, 'tangga'),
      top('K1.07', 170, 54),
      top('K1.08', 224, 54),
      top('K1.09', 278, 49),
      top('Tangga', 361, 50, 'tangga'),
      top('K1.10', 413, 44),
      top('K1.11', 458, 48),
      bot('K1.01', 6, 46),
      bot('K1.02', 90, 45),
      bot('K1.03', 135, 39),
      bot('Ruang Kaca', 174, 54, 'kaca'),
      bot('Ruang Kaca', 324, 50, 'kaca'),
      bot('K1.04', 410, 47),
      bot('K1.05', 458, 48),
    ],
    note: { text: 'Pintu masuk utama', cx: 276, w: 100, y: 158 },
  },
  upper(2),
  upper(3),
  upper(4),
]

export const allRooms: { id: string; floor: number }[] = floors.flatMap((f) =>
  f.items.filter((i) => i.kind === 'room').map((i) => ({ id: i.id, floor: f.n })),
)

export const floorOf = (id: string) => Number(id.charAt(1))

export function reportsOf(id: string) {
  const fixed: Record<string, number> = { 'K2.10': 12, 'K2.09': 7, 'K2.11': 6, 'K1.04': 3, 'K3.09': 4 }
  return fixed[id] ?? id.charCodeAt(4) % 2
}

export type Passport = {
  recurring: string
  maint: string
  history: { label: string; date: string }[]
  chart: [number, number, number]
}

export function passportOf(id: string): Passport {
  const map: Record<string, Passport> = {
    'K2.10': {
      recurring: 'Air keruh tiap pagi',
      maint: '2 Sep 2026',
      history: [
        { label: 'Filter diganti', date: '2 Sep 2026' },
        { label: 'Tangki diperiksa', date: '28 Agu 2026' },
      ],
      chart: [2, 5, 9],
    },
    'K2.09': {
      recurring: 'Air agak keruh sesekali',
      maint: '2 Sep 2026',
      history: [{ label: 'Filter diganti', date: '2 Sep 2026' }],
      chart: [1, 3, 7],
    },
    'K2.11': {
      recurring: 'Air agak keruh sesekali',
      maint: '2 Sep 2026',
      history: [{ label: 'Filter diganti', date: '2 Sep 2026' }],
      chart: [0, 2, 6],
    },
    'K1.04': {
      recurring: 'Aliran kecil sore hari',
      maint: '19 Agu 2026',
      history: [{ label: 'Keran dibersihkan', date: '19 Agu 2026' }],
      chart: [1, 2, 3],
    },
    'K3.09': {
      recurring: 'Bau klorin ringan',
      maint: '5 Sep 2026',
      history: [{ label: 'Pipa dibilas', date: '5 Sep 2026' }],
      chart: [0, 1, 4],
    },
  }
  return (
    map[id] ?? {
      recurring: 'Belum ada masalah berulang',
      maint: '14 Agu 2026',
      history: [{ label: 'Pemeriksaan rutin', date: '14 Agu 2026' }],
      chart: [0, 1, reportsOf(id)],
    }
  )
}
