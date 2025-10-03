import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import { artistImages } from "@/utils/artistImages";
import { BsFire } from "react-icons/bs";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaRegClock } from "react-icons/fa";
import { FaHeadphonesAlt } from "react-icons/fa";

// Função para determinar a estação
function getSeason(date) {
  const month = date.getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "Inverno";
  if ([3, 4, 5].includes(month)) return "Primavera";
  if ([6, 7, 8].includes(month)) return "Verão";
  return "Outono";
}

// Função para calcular estatísticas do artista
function getArtistStats(data, artistName) {
  const artistPlays = data.filter(
    (item) => item.master_metadata_album_artist_name === artistName
  );

  const totalMs = artistPlays.reduce((acc, i) => acc + i.ms_played, 0);
  const totalMinutes = Math.floor(totalMs / 60000);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const seasonCount = {};
  artistPlays.forEach((p) => {
    const s = getSeason(new Date(p.ts));
    seasonCount[s] = (seasonCount[s] || 0) + 1;
  });
  const favoriteSeason =
    Object.entries(seasonCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const songCount = {};
  artistPlays.forEach((p) => {
    const track = p.master_metadata_track_name;
    if (!track) return;
    songCount[track] = (songCount[track] || 0) + 1;
  });

  const songsRanked = Object.entries(songCount)
    .map(([name, count]) => {
      const sample = artistPlays.find(
        (d) => d.master_metadata_track_name === name
      );
      return {
        master_metadata_track_name: name,
        master_metadata_album_name: sample?.master_metadata_album_name || "",
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const favorite = songsRanked[0]?.master_metadata_track_name || null;

  return {
    songsRanked,
    totalMinutes,
    totalHours,
    favorite,
    favoriteSeason,
    totalPlays: artistPlays.length,
  };
}

export default function ArtistTop20({ data, artistName }) {
  const stats = getArtistStats(data, artistName);
  const artistImage =
    artistImages[artistName] || "https://via.placeholder.com/400?text=No+Image";

  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="flex flex-col items-center text-center min-h-screen relative">
      {/* Header com imagem do artista idêntica ao ArtistPage */}
      <div className="flex flex-col items-center justify-center py-6">
        <img
          src={artistImage}
          alt={artistName}
          className="w-90 h-90 object-cover mb-4 rounded-lg"
        />
      </div>

      {/* Título com ícones */}
      <div className="p-2 max-w-3xl w-full flex items-center justify-center relative">
        {/* Botão de voltar */}
        <button
          onClick={() => router.back()}
          className="absolute left-0 text-3xl text-white hover:text-gray-300 transition"
          title="Voltar"
        >
          <IoMdArrowRoundBack />
        </button>

        <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
          Top 20 Músicas
          {/* Botão do fogo mais colado */}
          <button
            onClick={() => setShowPopup(true)}
            className="text-3xl text-red-600 hover:text-red-400 transition"
            title="Suas plays"
          >
            <BsFire />
          </button>
        </h2>

        {/* Popup */}
        {showPopup && (
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white shadow-lg rounded-lg p-4 w-64 z-50">
            <p className="flex justify-center items-center gap-2 font-semibold">
              <FaHeadphonesAlt /> Plays: {stats.totalPlays}
            </p>
            <p className="flex justify-center items-center gap-2 font-semibold">
              <FaRegClock /> Minutos: {stats.totalMinutes}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 px-3 py-1 bg-white/20 text-white rounded hover:bg-white/30 transition"
            >
              Fechar
            </button>
          </div>
        )}
      </div>

      {/* Lista Top 20 */}
      <div className="p-0 max-w-3xl w-full mt-4">
        <ul className="space-y-2">
          {stats.songsRanked.length > 0 ? (
            stats.songsRanked.map((s, index) => (
              <li
                key={index}
                className="rounded-xl shadow p-3 flex justify-between items-center hover:scale-[1.02] transition-transform text-white"
              >
                <span className="font-medium">
                  {index + 1}. {s.master_metadata_track_name}
                  <span className="text-gray-500">
                    {" "}
                    {s.master_metadata_album_name}
                  </span>
                </span>
                <span className="text-sm text-white">{s.count}x</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">Nenhuma música encontrada</li>
          )}
        </ul>
      </div>

      {/* Navbar inferior */}
      <div className="fixed bottom-0 left-0 w-full bg-black z-20">
        <Navbar active="estatisticas" />
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
