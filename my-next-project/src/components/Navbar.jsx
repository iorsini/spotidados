import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()
  const isActive = (path) => router.pathname === path

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-green-400">
          🎵 Spotidados
        </Link>

        <div className="flex space-x-6">
          <Link href="/perfil" className={isActive('/perfil') ? 'bg-green-600 p-2' : 'p-2'}>
            👤
          </Link>
          <Link href="/estatisticas" className={isActive('/estatisticas') ? 'bg-green-600 p-2' : 'p-2'}>
            📊
          </Link>
          <Link href="/pesquisa" className={isActive('/pesquisa') ? 'bg-green-600 p-2' : 'p-2'}>
            🔍
          </Link>
        </div>
    </nav>
  )
}