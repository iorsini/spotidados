// pages/api/artist/[name].js
import historyData from '@/data/history.json';

function getSeason(date) {
  const month = date.getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "Inverno";
  if ([3, 4, 5].includes(month)) return "Primavera";
  if ([6, 7, 8].includes(month)) return "Verão";
  return "Outono";
}

function getTopArtists(data, topN = 100) {
  const counts = {};
  data.forEach((item) => {
    const artist = item.master_metadata_album_artist_name;
    if (artist) counts[artist] = (counts[artist] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

function getArtistStats(data, artistName, topArtists) {
  // Busca case-insensitive
  const artistNameLower = artistName.toLowerCase();
  
  const artistPlays = data.filter(
    (item) => item.master_metadata_album_artist_name?.toLowerCase() === artistNameLower
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
    topArtists.findIndex((a) => a.name.toLowerCase() === artistNameLower) + 1 || "N/A";

  return {
    timesPlayed,
    minutesPlayed,
    uniqueTracks,
    favoriteSeason,
    percentage,
    position,
  };
}

export default function handler(req, res) {
  try {
    const { name } = req.query;
    const artistName = decodeURIComponent(name);

    const topArtists = getTopArtists(historyData);
    const stats = getArtistStats(historyData, artistName, topArtists);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
}