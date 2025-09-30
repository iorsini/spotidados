import { contarTotalMusicas, obterPrimeiraMusica, encontrarArtistaMaisOuvido } from '@/utils/dataProcessing'

export default function Home() {

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Bem-vindo ao Spotidados! 🎵</h1>
        <p className="text-xl md:text-2xl mb-6 opacity-90">Descubra insights incríveis sobre seus hábitos musicais</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Alguns dados:</h2>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{contarTotalMusicas()}</div>
              <div className="text-gray-700">Total de reproduções</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-semibold text-blue-600 truncate">{obterPrimeiraMusica()}</div>
              <div className="text-gray-700">Primeira música no histórico</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-lg font-semibold text-purple-600 truncate">{encontrarArtistaMaisOuvido()}</div>
              <div className="text-gray-700">Artista mais ouvido</div>
            </div>
          </div>

      </div>
    </div>
  )
}