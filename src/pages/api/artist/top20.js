// pages/api/artist/top20.js
import historyData from '@/data/history.json';

function getArtistTop20Stats(data, artistName) {
  // Busca case-insensitive
  const artistNameLower = artistName.toLowerCase();
  
  const artistPlays = data.filter(
    (item) => item.master_metadata_album_artist_name?.toLowerCase() === artistNameLower
  );

  const songStats = {};
  artistPlays.forEach((item) => {
    const track = item.master_metadata_track_name;
    if (!track) return;
    if (!songStats[track]) {
      songStats[track] = {
        track,
        album: item.master_metadata_album_album_name || "Single",
        ms_played: 0,
        count: 0,
      };
    }
    songStats[track].ms_played += item.ms_played;
    songStats[track].count += 1;
  });

  const songsRanked = Object.values(songStats)
    .sort((a, b) => b.ms_played - a.ms_played)
    .slice(0, 20);

  const totalPlays = artistPlays.length;
  const totalMinutes = Math.floor(
    artistPlays.reduce((acc, i) => acc + i.ms_played, 0) / 1000 / 60
  );

  return { songsRanked, totalPlays, totalMinutes };
}

export default function handler(req, res) {
  try {
    const { artist } = req.query;
    
    if (!artist) {
      return res.status(400).json({ error: 'Artist name is required' });
    }

    const artistName = decodeURIComponent(artist);
    const stats = getArtistTop20Stats(historyData, artistName);

    res.status(200).json(stats);
  } catch (error) {
    console.error('Erro na API top20:', error);
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
}