// getDateRange.js
const fs = require("fs");
const path = require("path");

// lê o JSON
const filePath = path.join(__dirname, "../data/history.json");
const raw = fs.readFileSync(filePath, "utf-8");
const data = JSON.parse(raw);

// função para pegar a data mais antiga e a mais recente
function getDateRange(data) {
  if (!data.length) return { min: null, max: null };

  let min = new Date(data[0].ts);
  let max = new Date(data[0].ts);

  data.forEach(item => {
    const d = new Date(item.ts);
    if (d < min) min = d;
    if (d > max) max = d;
  });

  return { min, max };
}

const range = getDateRange(data);
console.log("Data mais antiga:", range.min);
console.log("Data mais recente:", range.max);

//Data mais antiga: 2014-11-08T21:15:41.000Z
//Data mais recente: 2024-01-18T21:45:55.000Z