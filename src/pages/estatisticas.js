import Link from 'next/link'

export default function Estatisticas() {

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">📊 Suas Estatísticas</h1>
      <p className="text-gray-600 mb-6">Descubra seus hábitos musicais e tendências de escuta</p>
      <Link href="/top20" className="text-green-600 hover:text-green-800 text-sm font-medium">
          Ver Top 20 →
      </Link>
    </div>
  )
}