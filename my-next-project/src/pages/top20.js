import Link from 'next/link'

export default function Top20() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Link href="/estatisticas" className="text-green-600 hover:text-green-800 font-medium flex items-center mb-4">
        ←
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">🏆 Top 20</h1>
      <p className="text-gray-600">Os mais ouvidos desta semana</p>
    </div>
  )
}