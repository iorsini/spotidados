import { useState } from "react";
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
  return data.filter(item => new Date(item.ts) >= cutoff);
}

function getTopArtists(data, topN = 100) {
  const counts = {};
  data.forEach(item => {
    const artist = item.master_metadata_album_artist_name;
    if (artist) counts[artist] = (counts[artist] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({
      name,
      count,
      image: artistImages[name] || "https://via.placeholder.com/150?text=No+Image"
    }));
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  return {
    props: { data },
  };
}

export default function Artists({ data }) {
  const [period, setPeriod] = useState("all");

  const filteredData = filterByPeriod(data, period);
  const topArtists = getTopArtists(filteredData, 100);

  return (
    <div className="h-screen flex flex-col relative">
      {/* Background Gradiente Fixo Atrás */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-[#9900FF] to-black z-0"
        style={{ backgroundAttachment: "fixed" }}
      />

      {/* Navbar Top Fixa */}
<div className="fixed top-0 left-0 w-full backdrop-blur-md z-10 shadow-md">
  <div className="flex justify-center gap-4 p-4">
    <button
      onClick={() => setPeriod("4w")}
      className={`flex-1 py-2 rounded-md text-center ${
        period === "4w"
          ? "bg-purple-600 text-white"
          : "bg-white text-black border border-gray-300"
      }`}
    >
      Últimas 4 semanas
    </button>
    <button
      onClick={() => setPeriod("6m")}
      className={`flex-1 py-2 rounded-md text-center ${
        period === "6m"
          ? "bg-purple-600 text-white"
          : "bg-white text-black border border-gray-300"
      }`}
    >
      Últimos 6 meses
    </button>
    <button
      onClick={() => setPeriod("1y")}
      className={`flex-1 py-2 rounded-md text-center ${
        period === "1y"
          ? "bg-purple-600 text-white"
          : "bg-white text-black border border-gray-300"
      }`}
    >
      Último ano
    </button>
    <button
      onClick={() => setPeriod("all")}
      className={`flex-1 py-2 rounded-md text-center ${
        period === "all"
          ? "bg-purple-600 text-white"
          : "bg-white text-black border border-gray-300"
      }`}
    >
      Desde sempre
    </button>
  </div>
</div>

      {/* Grid Rolável com fundo transparente */}
      <div className="flex-1 overflow-y-auto pt-20 pb-24 px-6 z-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-7">
          {topArtists.map(a => (
            <div key={a.name} className="text-center">
              <img
                src={a.image}
                alt={a.name}
                className="rounded-lg w-full object-cover"
              />
              <p className="mt-1 font-regular text-white">{a.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}