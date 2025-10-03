import { useState, useRef, useEffect } from "react";
import fs from "fs";
import path from "path";
import { artistImages } from "../utils/artistImages";
import Navbar from "@/components/Navbar";

function getMaxDate(data) {
  return data.reduce((max, item) => {
    const d = new Date(item.ts);
    return d > max ? d : max;
  }, new Date(data[0].ts));
}

function filterByPeriod(data, period) {
  if (!data.length) return [];
  const maxDate = getMaxDate(data);
  let cutoff;
  switch (period) {
    case "4w":
      cutoff = new Date(maxDate);
      cutoff.setDate(cutoff.getDate() - 28);
      break;
    case "6m":
      cutoff = new Date(maxDate);
      cutoff.setMonth(cutoff.getMonth() - 6);
      break;
    case "1y":
      cutoff = new Date(maxDate);
      cutoff.setFullYear(cutoff.getFullYear() - 1);
      break;
    case "all":
    default:
      return data;
  }
  return data.filter((item) => new Date(item.ts) >= cutoff);
}

// ---- TOP ARTISTAS: baseado em quantidade de plays ----
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
        artistImages[name] ||
        null, // se não tiver, cai no fallback
    }));
}

// ---- TOP MÚSICAS: baseado em tempo total (ms_played) ----
function getTopTracks(data, topN = 100) {
  const counts = {};
  data.forEach((item) => {
    const track = item.master_metadata_track_name;
    const artist = item.master_metadata_album_artist_name;
    if (track && artist) {
      const key = `${track} - ${artist}`;
      counts[key] = (counts[key] || 0) + item.ms_played; // soma tempo total
    }
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, ms_played]) => {
      const [track, artist] = name.split(" - ");
      return {
        track,
        artist,
        ms_played,
        hours: Math.floor(ms_played / 1000 / 60 / 60), // inteiro em horas
        image:
          artistImages[artist] || null, // se não tiver, cai no fallback
      };
    });
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  return {
    props: { data },
  };
}

export default function Top100({ data }) {
  const [period, setPeriod] = useState("all");
  const [activeTab, setActiveTab] = useState("artistas");
  const [activeArtist, setActiveArtist] = useState(null);

  const filteredData = filterByPeriod(data, period);
  const topArtists = getTopArtists(filteredData, 100);
  const topTracks = getTopTracks(filteredData, 100);

  // Ref para calcular altura da navbar + botões
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

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

  // Altura do fade
  const fadeHeight = 80; // h-20 = 80px

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
          <h1 className="text-4xl font-bold text-white mb-4">TOP 100</h1>

          <div className="flex gap-8 text-xl mb-4">
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
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-7 relative z-0">
          {activeTab === "artistas"
            ? topArtists.map((a) => (
                <a
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
                </a>
              ))
            : topTracks.map((t) => (
                <div
                  key={`${t.track}-${t.artist}`}
                  className="group text-center transform transition-transform duration-200"
                >
                  {t.image ? (
                    <img
                      src={t.image}
                      alt={t.track}
                      className="rounded-lg w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-200"
                    />
                  ) : (
                    <div className="rounded-lg w-full h-40 flex items-center justify-center bg-gradient-to-br from-purple-700 to-black text-white p-2">
                      <span className="text-xs font-semibold line-clamp-2">
                        {t.track}
                      </span>
                    </div>
                  )}
                  <p className="mt-1 font-bold text-white">{t.track}</p>
                  <p className="text-sm text-gray-300">{t.artist}</p>
                  <p className="text-xs text-gray-400">{t.hours} h ouvidas</p>
                </div>
              ))}
        </div>
      </div>

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
