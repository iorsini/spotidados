const fs = require("fs");
const path = require("path");
const { artistImages } = require("./artistImages"); // importa as já existentes

// Lê o JSON
const filePath = path.join(__dirname, "../data/history.json");
const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw);

// Pega a data mais recente do JSON
function getMaxDate(data) {
  let max = new Date(data[0].ts);
  for (const item of data) {
    const d = new Date(item.ts);
    if (d > max) max = d;
  }
  return max;
}

// Filtra por período
function filterByPeriod(data, period) {
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

// Conta os artistas e retorna top N
function getTopArtists(data, topN = 100) {
  const counts = {};
  data.forEach(item => {
    const artist = item.master_metadata_album_artist_name;
    if (artist) counts[artist] = (counts[artist] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name, count]) => ({ name, count }));
}

// Períodos que queremos
const periods = ["4w", "6m", "1y", "all"];
const missingArtists = new Set();

// Verifica cada período
for (const period of periods) {
  const filtered = filterByPeriod(data, period);
  const top = getTopArtists(filtered, 100);
  top.forEach(a => {
    if (!artistImages[a.name]) missingArtists.add(a.name);
  });
}

console.log("Artistas que ainda não têm imagem:");
console.log(Array.from(missingArtists).sort());