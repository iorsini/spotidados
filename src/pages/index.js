import { useState, useEffect } from "react";
import Image from "next/image";
import { FaCalendarDay } from "react-icons/fa";

export default function Home() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carrega as estatísticas da API
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar stats:', err);
        setLoading(false);
      });
  }, []);

  const mostrarPopup = (mensagem) => {
    setPopup(mensagem);
    setVisible(true);
    setTimeout(() => setVisible(false), 1800);
    setTimeout(() => setPopup(null), 2000);
  };

  return (
    <div className="relative">
      {/* Pop-up */}
      {popup && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#9900FF] text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {popup}
        </div>
      )}

      {/* Card Perfil */}
      <div className="p-6 rounded-2xl text-white">
        <div className="flex gap-6 h-50">
          {/* Foto de perfil + nome + data */}
          <div className="w-1/2 flex flex-col items-center justify-center gap-2">
            <img
              src="https://videos.openai.com/vg-assets/assets%2Ftask_01k6z4t7tcffm8xctt0k0vp82c%2F1759834426_img_1.webp?se=2025-10-10T01%3A07%3A50Z&sp=r&sv=2024-08-04&sr=b&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-09T20%3A04%3A55Z&ske=2025-10-09T21%3A14%3A55Z&sks=b&skv=2024-08-04&sig=XRyyH%2BuUNIKTpb4ETMLqmXNH6BncPLmkEnbnMlVqQYI%3D&az=oaivgprodscus"
              alt="Foto de perfil"
              className="w-40 h-40 aspect-square rounded-full object-cover object-center"
            />
            <h2 className="text-xl font-semibold">Meu perfil</h2>
            <p className="flex items-center text-sm text-gray-300 mt-1">
              <FaCalendarDay className="mr-1" />
              18/01/2024
            </p>
          </div>

          {/* Logo + botões */}
          <div className="w-1/2 flex flex-col justify-center items-center gap-4">
            <Image
              src="https://videos.openai.com/vg-assets/assets%2Ftask_01k6aj2kw2ez2tsk5xmbfkd841%2F1759143701_img_1.webp?se=2025-10-10T02%3A08%3A49Z&sp=r&sv=2024-08-04&sr=b&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-09T21%3A17%3A48Z&ske=2025-10-09T22%3A27%3A48Z&sks=b&skv=2024-08-04&sig=HXmVWFa4lIc02jyqH%2Bswsw4lTu6A6kPP4gulRY1hLDc%3D&az=oaivgprodscus"
              alt="Meu Logo"
              width={100}
              height={100}
            />
            <button
              onClick={() => mostrarPopup("Perfil editado")}
              className="w-3/4 px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => mostrarPopup("Perfil partilhado")}
              className="w-3/4 px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition"
            >
              Partilhar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="pt-[40px] max-w-4xl mx-auto">
        <div
          className="bg-transparent rounded-lg shadow-md p-6 
                        max-h-[calc(100vh-380px)] overflow-y-auto"
        >
          {loading ? (
            <div className="text-white text-center py-8">
              Carregando estatísticas...
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.totalMusicas}
                </div>
                <div className="text-white">Total de reproduções</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.primeiraMusica}
                </div>
                <div className="text-white">Primeira música no histórico</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.artistaMaisOuvido}
                </div>
                <div className="text-white">Artista mais ouvido</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.musicasDiferentes}
                </div>
                <div className="text-white">Músicas diferentes</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.minutosOuvidos}
                </div>
                <div className="text-white">Minutos ouvidos</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.mediaTempoDiario}
                </div>
                <div className="text-white">Média tempo diário</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.horaMaisOuvida}
                </div>
                <div className="text-white">Hora do dia que mais ouve</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-semibold text-white truncate">
                  {stats.estacaoMaisOuvida}
                </div>
                <div className="text-white">Estação do ano que mais ouve</div>
              </div>
            </div>
          ) : (
            <div className="text-white text-center py-8">
              Erro ao carregar dados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
