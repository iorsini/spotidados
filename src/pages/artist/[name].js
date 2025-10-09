import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { artistImages } from "@/utils/artistImages";
import Navbar from "@/components/Navbar";
import { FaHeadphonesAlt } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
import { IoMusicalNotesSharp } from "react-icons/io5";
import { FaCanadianMapleLeaf } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa6";
import { IoMdArrowRoundBack } from "react-icons/io";

// Adiciona getServerSideProps para funcionar corretamente
export async function getServerSideProps({ params }) {
  return {
    props: {
      artistNameFromUrl: params.name,
    },
  };
}

export default function ArtistPage({ artistNameFromUrl }) {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const artistName = artistNameFromUrl ? decodeURIComponent(artistNameFromUrl) : "";
  const artistImage =
    artistImages[artistName] || "https://via.placeholder.com/400?text=No+Image";

  useEffect(() => {
    if (!artistNameFromUrl) return;
    
    setLoading(true);
    fetch(`/api/artist/${encodeURIComponent(artistNameFromUrl)}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar stats do artista:', err);
        setLoading(false);
      });
  }, [artistNameFromUrl]);

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