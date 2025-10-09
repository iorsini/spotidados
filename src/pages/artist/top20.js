import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { artistImages } from "@/utils/artistImages";
import { BsFire } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegClock, FaHeadphonesAlt } from "react-icons/fa";

export default function ArtistTop20() {
  const router = useRouter();
  const { artist } = router.query;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTrackPopup, setActiveTrackPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const artistName = artist ? decodeURIComponent(artist) : "";
  const artistImage =
    artistImages[artistName] || "https://via.placeholder.com/400?text=No+Image";

  useEffect(() => {
    if (!artist) return;
    
    setLoading(true);
    fetch(`/api/artist/top20?artist=${encodeURIComponent(artist)}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar top 20:', err);
        setLoading(false);
      });
  }, [artist]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar dados</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center min-h-screen relative">
      {/* Header com imagem do artista */}
      <div className="flex flex-col items-center justify-center py-6">
        <img
          src={artistImage}
          alt={artistName}
          className="w-90 h-90 object-cover mb-4 rounded-lg"
        />
      </div>

      {/* Título com setinha + foguinho */}
      <div className="p-2 max-w-3xl w-full flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-0 text-3xl text-white hover:text-gray-300 transition"
          title="Voltar"
        >
          <IoMdArrowRoundBack />
        </button>

        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          Top 20 Músicas
          <button
            onClick={() => setShowPopup(true)}
            className="text-3xl text-[#1DB954] hover:text-[#1DB954] transition"
            title="Suas plays"
          >
            <BsFire />
          </button>
        </h2>
      </div>

      {/* Popup foguinho */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#111111] p-6 rounded-lg w-80 text-white relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white font-bold"
              onClick={() => setShowPopup(false)}
            >
              X
            </button>
            <h2 className="font-bold text-lg mb-4">{artistName}</h2>
            <p className="text-gray-300 mb-2 flex justify-center items-center gap-2">
              <FaHeadphonesAlt /> Total de plays:{" "}
              <span className="font-bold">{stats.totalPlays}</span>
            </p>
            <p className="text-gray-300 justify-center flex items-center gap-2">
              <FaRegClock /> Minutos ouvidos:{" "}
              <span className="font-bold">{stats.totalMinutes}</span>
            </p>
          </div>
        </div>
      )}

      {/* Lista Top 20 */}
      <div className="w-full max-w-3xl flex flex-col gap-3 mt-4 px-4">
        {stats.songsRanked && stats.songsRanked.length > 0 ? (
          stats.songsRanked.map((s, index) => (
            <div
              key={index}
              className="flex items-center bg-[#000000] rounded-lg p-3 gap-4 hover:bg-[#222222] transition-colors"
            >
              {/* Posição */}
              <span className="text-gray-400 font-bold w-8 text-right">
                #{index + 1}
              </span>

              {/* Info da música justificada */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden text-left">
                <p className="font-bold text-white truncate">{s.track}</p>
                <p className="text-sm text-gray-400 truncate">{s.album}</p>
              </div>

              {/* Botão ... */}
              <button
                className="text-gray-400 hover:text-white font-bold text-lg px-2 py-1 ml-2"
                onClick={() => setActiveTrackPopup(s)}
              >
                ...
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma música encontrada</p>
        )}
      </div>

      {/* Modal de info da música */}
      {activeTrackPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-lg w-80 text-white relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white font-bold"
              onClick={() => setActiveTrackPopup(null)}
            >
              X
            </button>
            <h2 className="font-bold text-lg mb-4">{activeTrackPopup.track}</h2>
            <p className="text-gray-300 mb-2">
              Você ouviu essa música{" "}
              <span className="font-bold">{activeTrackPopup.count} vezes</span>!
            </p>
            <p className="text-gray-300">
              Você passou{" "}
              <span className="font-bold">
                {Math.floor(activeTrackPopup.ms_played / 1000 / 60)}
              </span>{" "}
              minutos ouvindo essa música!
            </p>
          </div>
        </div>
      )}

      {/* Navbar inferior */}
      <div className="fixed bottom-0 left-0 w-full bg-black z-20">
        <Navbar />
      </div>
    </div>
  );
}