import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import fs from "fs";
import path from "path";
import Navbar from "@/components/Navbar";
import { artistImages } from "@/utils/artistImages";

export default function ArtistTop20({ songs, artist, favorite, season, totalMinutes, totalHours }) {
  const router = useRouter();
  if (!artist) return <div>Carregando...</div>;
  const safeSongs = Array.isArray(songs) ? songs : [];
  const artistImage = artistImages[artist] || "/artists/default.jpg";


  return (
    <div className="flex flex-col items-center text-center min-h-screen">
      {/* Banner */}
      <div
      className="w-full h-80 bg-cover bg-center relative rounded-b-3xl shadow-lg"
      style={{ backgroundImage: `url(${artistImage})` }}
      >
      </div>

      {/* Lista Top 20 */}
      <div className="p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4">🔥 Top 20 Músicas</h2>
        <ul className="space-y-2">
          {safeSongs.length > 0 ? (
            safeSongs.map((s, index) => (
              <li key={index} className=" rounded-xl shadow p-3 flex justify-between items-center hover:scale-[1.02] transition-transform">
                <span className="font-medium">
                  {index + 1}. {s.master_metadata_track_name}
                  <span className="text-gray-500"> – {s.master_metadata_album_name}</span>
                </span>
                <span className="text-sm text-gray-600">{s.count}x</span>
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
// Server-side
// =======================
export async function getServerSideProps({ query }) {
  const artistName = query.artist;
  if (!artistName) return { notFound: true };

  const filePath = path.join(process.cwd(), "src/data/history.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);

  const artistSongs = data.filter(d => d.master_metadata_album_artist_name === artistName);

  // Estatísticas (top 20, totalMinutes, season, favorite)
  const songCount = {};
  let totalMs = 0;
  let seasonCount = { verao: 0, inverno: 0 };

  artistSongs.forEach(d => {
    const track = d.master_metadata_track_name;
    if (!track) return;
    songCount[track] = (songCount[track] || 0) + 1;
    totalMs += d.ms_played || 0;

    const month = new Date(d.ts).getMonth() + 1;
    if ([12, 1, 2].includes(month)) seasonCount.inverno++;
    else if ([6, 7, 8].includes(month)) seasonCount.verao++;
  });

  const songsRanked = Object.entries(songCount)
    .map(([name, count]) => {
      const sample = artistSongs.find(d => d.master_metadata_track_name === name);
      return {
        master_metadata_track_name: name,
        master_metadata_album_name: sample?.master_metadata_album_name || "",
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  const favorite = songsRanked[0]?.master_metadata_track_name || null;
  const season = seasonCount.verao > seasonCount.inverno ? "Verão" : "Inverno";
  const totalMinutes = Math.round(totalMs / 60000);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return {
    props: {
      songs: songsRanked,
      artist: artistName,
      favorite,
      season,
      totalMinutes,
      totalHours,
    },
  };
}