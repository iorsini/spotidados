import fs from "fs";
import path from "path";
import { artistImages } from "@/utils/artistImages";
import Navbar from "@/components/Navbar";
import { FaHeadphonesAlt } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { FaCanadianMapleLeaf } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useRouter } from "next/router";

// Função para determinar a estação
function getSeason(date) {
  const month = date.getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "Inverno";
  if ([3, 4, 5].includes(month)) return "Primavera";
  if ([6, 7, 8].includes(month)) return "Verão";
  return "Outono";
}

// Função para calcular estatísticas do artista
function getArtistStats(data, artistName, topArtists) {
  const artistPlays = data.filter(
    (item) => item.master_metadata_album_artist_name === artistName
  );

  const timesPlayed = artistPlays.length;
  const minutesPlayed = Math.floor(
    artistPlays.reduce((acc, i) => acc + i.ms_played, 0) / 60000
  );
  const uniqueTracks = new Set(
    artistPlays.map((i) => i.master_metadata_track_name)
  ).size;

  const seasonCount = {};
  artistPlays.forEach((p) => {
    const s = getSeason(new Date(p.ts));
    seasonCount[s] = (seasonCount[s] || 0) + 1;
  });
  const favoriteSeason =
    Object.entries(seasonCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const totalPlays = data.length;
  const percentage = ((timesPlayed / totalPlays) * 100).toFixed(2);

  const position =
    topArtists.findIndex((a) => a.name === artistName) + 1 || "N/A";

  return {
    timesPlayed,
    minutesPlayed,
    uniqueTracks,
    favoriteSeason,
    percentage,
    position,
  };
}

// Função para pegar os top artistas
function getTopArtists(data, topN = 100) {
  const counts = {};
  data.forEach((item) => {
    const artist = item.master_metadata_album_artist_name;
    if (artist) counts[artist] = (counts[artist] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({
      name,
      count,
      image:
        artistImages[name] || "https://via.placeholder.com/400?text=No+Image",
    }));
}

// 🔹 Gera as rotas dinâmicas
export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const artists = [
    ...new Set(
      data.map((i) => i.master_metadata_album_artist_name).filter(Boolean)
    ),
  ];

  return {
    paths: artists.map((name) => ({
      params: { name: encodeURIComponent(name) },
    })),
    fallback: "blocking",
  };
}

// 🔹 Gera os props de cada artista
export async function getStaticProps({ params }) {
  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const artistName = decodeURIComponent(params.name);

  return {
    props: { data, artistName },
  };
}

// 🔹 Componente principal da página de artista
export default function ArtistPage({ data, artistName }) {
  const topArtists = getTopArtists(data);
  const stats = getArtistStats(data, artistName, topArtists);
  const artistImage =
    artistImages[artistName] || "https://via.placeholder.com/400?text=No+Image";
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header com imagem */}
      <div className="flex flex-col items-center justify-center py-6">
        <img
          src={artistImage}
          alt={artistName}
          className="w-90 h-90 md:w-96 md:h-96 object-cover mb-4 rounded-lg"
        />

        {/* Linha com seta à esquerda e nome centralizado */}
        <div className="p-2 max-w-3xl w-full flex items-center justify-center relative">
          <button
            onClick={() => router.back()}
            className="absolute left-0 text-3xl text-white hover:text-gray-300 transition"
            title="Voltar"
          >
            <IoMdArrowRoundBack />
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {artistName}
          </h1>
        </div>
      </div>

      {/* Botão centralizado embaixo */}
      <div className="flex justify-center mt-0 px-4">
        <a
          href={`/artist/top20?artist=${encodeURIComponent(artistName)}`}
          className="bg-[#9900FF] text-white text-lg font-semibold px-4 py-2 rounded-lg hover:bg-[#7a00cc] transition sm:w-auto text-center"
        >
          Ver Top 20 músicas
        </a>
      </div>

      {/* Estatísticas */}
      <div className="max-w-4xl mx-auto px-4 py-6 flex justify-evenly gap-x-8">
        {/* Coluna esquerda */}
        <div className="flex flex-col justify-between h-[300px]">
          <div className="p-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <FaHeadphonesAlt className="text-[#1DB954] text-3xl" />
              <span className="text-[#1DB954] text-2xl">
                {stats.timesPlayed}
              </span>
            </div>
            <div className="text-white text-lg mt-2">Total de plays</div>
          </div>

          <div className="p-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <FaTrophy className="text-[#1DB954] text-3xl" />
              <span className="text-[#1DB954] text-2xl">{stats.position}</span>
            </div>
            <div className="text-white text-lg mt-2">Posição no Top</div>
          </div>

          <div className="p-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <FaRegClock className="text-[#1DB954] text-3xl" />
              <span className="text-[#1DB954] text-2xl">
                {stats.minutesPlayed}
              </span>
            </div>
            <div className="text-white text-lg mt-2">Minutos escutados</div>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="flex flex-col justify-between h-[300px]">
          <div className="p-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <FaCanadianMapleLeaf className="text-[#1DB954] text-3xl" />
              <span className="text-[#1DB954] text-2xl">
                {stats.favoriteSeason}
              </span>
            </div>
            <div className="text-white text-lg mt-2">Estação favorita</div>
          </div>

          <div className="p-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <IoMusicalNotesSharp className="text-[#1DB954] text-3xl" />
              <span className="text-[#1DB954] text-2xl">
                {stats.uniqueTracks}
              </span>
            </div>
            <div className="text-white text-lg mt-2">Músicas diferentes</div>
          </div>

          <div className="p-2">
            <div className="flex items-center gap-3 text-2xl font-bold text-white">
              <VscGraph className="text-[#1DB954] text-3xl" />
              <span className="text-[#1DB954] text-2xl">
                {stats.percentage}%
              </span>
            </div>
            <div className="text-white text-lg mt-2">Das suas plays</div>
          </div>
        </div>
      </div>

      {/* Navbar inferior */}
      <div className="fixed bottom-0 left-0 w-full bg-black z-20">
        <Navbar active="estatisticas" />
      </div>
    </div>
  );
}
