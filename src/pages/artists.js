import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Top100() {
  const [period, setPeriod] = useState("all");
  const [activeTab, setActiveTab] = useState("artistas");
  const [activeArtist, setActiveArtist] = useState(null);
  const [activeTrackPopup, setActiveTrackPopup] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Busca dados da API quando o período muda
  useEffect(() => {
    setLoading(true);
    fetch(`/api/artists?period=${period}`)
      .then((res) => res.json())
      .then((data) => {
        setTopArtists(data.topArtists);
        setTopTracks(data.topTracks);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar dados:", err);
        setLoading(false);
      });
  }, [period]);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fadeHeight = 80;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradiente Fixo */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#9900FF] to-black z-0"
        style={{ backgroundAttachment: "fixed" }}
      />

      {/* Navbar + Top 100 + Botões */}
      <div
        ref={navbarRef}
        className="fixed top-0 left-0 w-full z-20 bg-gradient-to-b from-[#9900FF] to-[#6400aa]"
      >
        <div className="flex flex-col items-center py-6">
          <h1 className="text-5xl font-bold text-white mb-4">TOP 100</h1>

          <div className="flex gap-8 text-2xl mb-4 text-white">
            <button
              className={`border-b-2 ${
                activeTab === "artistas"
                  ? "border-white font-bold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("artistas")}
            >
              Artistas
            </button>
            <button
              className={`border-b-2 ${
                activeTab === "musicas"
                  ? "border-white font-bold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("musicas")}
            >
              Músicas
            </button>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            <button
              onClick={() => setPeriod("4w")}
              className={`py-2 px-4 rounded-md text-white ${
                period === "4w"
                  ? "bg-gradient-to-b from-[#9900FF] to-[#8300DB] font-bold"
                  : "bg-[#6900b1] border border-[#6900b1]"
              }`}
            >
              Últimas 4 semanas
            </button>
            <button
              onClick={() => setPeriod("6m")}
              className={`py-2 px-4 rounded-md text-white ${
                period === "6m"
                  ? "bg-gradient-to-b from-[#9900FF] to-[#8300DB] font-bold"
                  : "bg-[#6900b1] border border-[#6900b1]"
              }`}
            >
              Últimos 6 meses
            </button>
            <button
              onClick={() => setPeriod("1y")}
              className={`py-2 px-4 rounded-md text-white ${
                period === "1y"
                  ? "bg-gradient-to-b from-[#9900FF] to-[#8300DB] font-bold"
                  : "bg-[#6900b1] border border-[#6900b1]"
              }`}
            >
              Último ano
            </button>
            <button
              onClick={() => setPeriod("all")}
              className={`py-2 px-4 rounded-md text-white ${
                period === "all"
                  ? "bg-gradient-to-b from-[#9900FF] to-[#8300DB] font-bold"
                  : "bg-[#6900b1] border border-[#6900b1]"
              }`}
            >
              Desde sempre
            </button>
          </div>
        </div>
      </div>

      {/* Fade Top logo abaixo dos botões */}
      <div
        className="pointer-events-none fixed left-0 w-full z-10"
        style={{ top: navbarHeight - 2, height: fadeHeight }}
      >
        <div className="w-full h-full bg-gradient-to-b from-[#6400aa] to-black/0" />
      </div>

      {/* Grid rolável */}
      <div
        className="flex-1 overflow-y-auto pb-24 px-6 relative z-0"
        style={{ paddingTop: navbarHeight + fadeHeight - 40 }}
      >
        {loading ? (
          <div className="text-white text-center py-8">Carregando...</div>
        ) : (
          <>
            {/* ARTISTAS */}
            {activeTab === "artistas" && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-7 relative z-0">
                {topArtists.map((a) => (
                  <Link
                    key={a.name}
                    href={`/artist/${encodeURIComponent(a.name)}`}
                    className={`group text-center transform transition-transform duration-200 ${
                      activeArtist === a.name ? "scale-110" : ""
                    }`}
                    onTouchStart={() => setActiveArtist(a.name)}
                    onTouchEnd={() => setActiveArtist(null)}
                  >
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="rounded-lg w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                    ) : (
                      <div className="rounded-lg w-full h-40 flex items-center justify-center bg-gradient-to-br from-purple-700 to-black text-white p-2">
                        <span className="text-xs font-semibold line-clamp-2">
                          {a.name}
                        </span>
                      </div>
                    )}
                    <p className="mt-1 font-regular text-white">{a.name}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* MÚSICAS */}
            {activeTab === "musicas" && (
              <div className="flex flex-col gap-3">
                {topTracks.map((t, index) => (
                  <div
                    key={`${t.track}-${t.artist}`}
                    className="flex items-center bg-[#000000] rounded-lg p-3 gap-4 group hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    {/* Posição */}
                    <span className="text-gray-400 font-bold w-6 text-right">
                      #{index + 1}
                    </span>

                    {/* Imagem do artista */}
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.track}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-700 to-black text-white p-2 flex-shrink-0">
                        <span className="text-xs font-semibold line-clamp-2">
                          {t.artist}
                        </span>
                      </div>
                    )}

                    {/* Info da música */}
                    <div className="flex-1 flex flex-col justify-center overflow-hidden">
                      <p className="font-bold text-white truncate">{t.track}</p>
                      <p className="text-sm text-gray-300 truncate">
                        {t.artist} <span className="mx-1">•</span>{" "}
                        {t.album || "Single"}
                      </p>
                    </div>

                    {/* Botão ... */}
                    <button
                      className="text-gray-400 hover:text-white font-bold text-lg px-2 py-1 ml-2"
                      onClick={() => setActiveTrackPopup(t)}
                    >
                      ...
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de info da música */}
      {activeTrackPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-30">
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

      {/* Fade Bottom FIXO */}
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-60 z-10">
        <div className="w-full h-full bg-gradient-to-t from-black/100 to-black/0" />
      </div>

      {/* Navbar Bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-black z-20">
        <Navbar />
      </div>
    </div>
  );
}
