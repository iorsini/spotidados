import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "src/data/history.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    res.status(200).json(data);
  } catch (error) {
    console.error("Erro ao ler history.json:", error);
    res.status(500).json({ error: "Erro ao carregar histórico" });
  }
}
