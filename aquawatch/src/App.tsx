import { useCallback, useEffect, useState } from 'react'
import { Navbar } from './ui'
import type { Page } from './data'
import Home from './pages/Home'
import Lapor from './pages/Lapor'
import Hasil from './pages/Hasil'
import Peta from './pages/Peta'
import Dasbor from './pages/Dasbor'

const pages: Page[] = ['home', 'lapor', 'hasil', 'peta', 'dasbor']
const fromHash = (): Page => {
  const h = window.location.hash.replace('#/', '') as Page
  return pages.includes(h) ? h : 'home'
}

export default function App() {
  const [page, setPage] = useState<Page>(fromHash)
  const [room, setRoom] = useState<string | null>('K2.10')
  const [formRoom, setFormRoom] = useState<string | null>(null)

  useEffect(() => {
    const on = () => setPage(fromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = useCallback((p: Page, r?: string | null) => {
    if (p === 'lapor') setFormRoom(r ?? null)
    else if (r) setRoom(r)
    window.location.hash = `/${p}`
    setPage(p)
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="min-h-screen">
      <Navbar page={page} go={go} />
      {page === 'home' && <Home go={go} />}
      {page === 'lapor' && <Lapor key={formRoom ?? 'none'} go={go} initialRoom={formRoom} />}
      {page === 'hasil' && <Hasil go={go} room={room} />}
      {page === 'peta' && <Peta go={go} room={room} setRoom={setRoom} />}
      {page === 'dasbor' && <Dasbor go={go} />}
    </div>
  )
}
