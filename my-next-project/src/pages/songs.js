// pages/songs.js
import { useState } from "react";
import fs from "fs";
import path from "path";
import TopHeader from "@/components/TopHeader";
import Navbar from "@/components/Navbar";

function getMaxDate(data) {
  return data.reduce((max, item) => new Date(item.ts) > max ? new Date(item.ts) : max, new Date(data[0].ts));
}

function filterByPeriod(data, period) {
  if (!data.length) return [];
  const maxDate = getMaxDate(data);
  let cutoff;
  switch (period) {
    case "4w": cutoff = new Date(maxDate); cutoff.setDate(cutoff.getDate() - 28); break;
    case "6m": cutoff = new Date(maxDate); cutoff.setMonth(cutoff.getMonth() - 6); break;
    case "1y": cutoff = new Date(maxDate); cutoff.setFullYear(cutoff.getFullYear() - 1); break;
    case "all": default: return data;
  }
  return data.filter(item => new Date(item.ts) >= cutoff);
}

function getTopSongs(data, topN = 100) {
  const counts = {};
  data.forEach(item => {
    const song = item.master_metadata_track_name;
    if (song) counts[song] = (counts[song] || 0) + 1;
  });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,topN).map(([name,count])=>({name,count}));
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const filteredData = filterByPeriod(data, "all");
  const topSongs = getTopSongs(filteredData, 100);

  return { props: { topSongs } };
}

export default function Songs({ topSongs }) {
  const [period, setPeriod] = useState("all");
  const [activeTab, setActiveTab] = useState("musicas");

  const filteredSongs = topSongs;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#9900FF] to-black z-0"/>
      <TopHeader activeTab={activeTab} setActiveTab={setActiveTab} period={period} setPeriod={setPeriod} />
      <div className="flex-1 overflow-y-auto pb-24 px-6 relative z-0 mt-[360px]">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-7">
          {filteredSongs.map(s => (
            <div key={s.name} className="text-center text-white">
              <p>{s.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none fixed bottom-0 left-0 w-full h-40 z-10">
        <div className="w-full h-full bg-gradient-to-t from-black/100 to-black/0"/>
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-black z-20">
        <Navbar/>
      </div>
    </div>
  );
}