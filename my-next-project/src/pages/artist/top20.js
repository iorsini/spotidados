import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useState } from "react";
import { artistImages } from "@/utils/artistImages";
import { BsFire } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegClock, FaHeadphonesAlt } from "react-icons/fa";

// Função para calcular estatísticas do artista
function getArtistStats(data, artistName) {
  const artistPlays = data.filter(
    (item) => item.master_metadata_album_artist_name === artistName
  );

  const songStats = {};
  artistPlays.forEach((item) => {
    const track = item.master_metadata_track_name;
    if (!track) return;
    if (!songStats[track]) {
      songStats[track] = {
        track,
        album: item.master_metadata_album_album_name || "Single",
        ms_played: 0,
        count: 0,
      };
    }
    songStats[track].ms_played += item.ms_played;
    songStats[track].count += 1;
  });

  const songsRanked = Object.values(songStats)
    .sort((a, b) => b.ms_played - a.ms_played)
    .slice(0, 20);

  const totalPlays = artistPlays.length;
  const totalMinutes = Math.floor(
    artistPlays.reduce((acc, i) => acc + i.ms_played, 0) / 1000 / 60
  );

  return { songsRanked, totalPlays, totalMinutes };
}

export default function ArtistTop20({ data, artistName }) {
  const { songsRanked, totalPlays, totalMinutes } = getArtistStats(
    data,
    artistName
  );
  const router = useRouter();
  const [activeTrackPopup, setActiveTrackPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const artistImage =
    artistImages[artistName] || "https://via.placeholder.com/400?text=No+Image";

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
            className="text-3xl text-red-600 hover:text-red-400 transition"
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
              <span className="font-bold">{totalPlays}</span>
            </p>
            <p className="text-gray-300 justify-center flex items-center gap-2">
              <FaRegClock /> Minutos ouvidos:{" "}
              <span className="font-bold">{totalMinutes}</span>
            </p>
          </div>
        </div>
      )}

      {/* Lista Top 20 */}
      <div className="w-full max-w-3xl flex flex-col gap-3 mt-4 px-4">
        {songsRanked.length > 0 ? (
          songsRanked.map((s, index) => (
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

// =======================
// Server-side props
// =======================
export async function getServerSideProps({ query }) {
  const artistName = query.artist;
  if (!artistName) return { notFound: true };

  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  return { props: { data, artistName } };
}