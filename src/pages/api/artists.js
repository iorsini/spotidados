// pages/api/artists.js
import historyData from '@/data/history.json';
import { artistImages } from '@/utils/artistImages';

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
      image: artistImages[name] || null,
    }));
}

function getTopTracks(data, topN = 100) {
  const trackStats = {};
  
  data.forEach((item) => {
    const track = item.master_metadata_track_name;
    const artist = item.master_metadata_album_artist_name;
    if (track && artist) {
      const key = `${track} - ${artist}`;
      if (!trackStats[key]) {
        trackStats[key] = {
          track,
          artist,
          ms_played: 0,
          count: 0,
          album: item.master_metadata_album_album_name || "Single"
        };
      }
      trackStats[key].ms_played += item.ms_played;
      trackStats[key].count += 1;
    }
  });

  return Object.values(trackStats)
    .sort((a, b) => b.ms_played - a.ms_played)
    .slice(0, topN)
    .map((item) => ({
      track: item.track,
      artist: item.artist,
      album: item.album,
      ms_played: item.ms_played,
      count: item.count,
      hours: Math.floor(item.ms_played / 1000 / 60 / 60),
      image: artistImages[item.artist] || null,
    }));
}

export default function handler(req, res) {
  try {
    const { period = 'all' } = req.query;
    
    const filteredData = filterByPeriod(historyData, period);
    const topArtists = getTopArtists(filteredData, 100);
    const topTracks = getTopTracks(filteredData, 100);

    res.status(200).json({
      topArtists,
      topTracks,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
}