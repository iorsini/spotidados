// pages/api/stats.js
import historyData from '@/data/history.json';

export default function handler(req, res) {
  try {
    // Total de músicas
    const totalMusicas = historyData.length;

    // Primeira música (pela data mais antiga)
    let primeiraMusica = "Nenhuma música encontrada";
    if (historyData.length > 0) {
      const sortedByDate = [...historyData].sort((a, b) => 
        new Date(a.ts) - new Date(b.ts)
      );
      primeiraMusica = sortedByDate[0]?.master_metadata_track_name || "Música desconhecida";
    }

    // Artista mais ouvido
    const contagemArtistas = {};
    historyData.forEach(musica => {
      const artista = musica.master_metadata_album_artist_name;
      if (artista) {
        contagemArtistas[artista] = (contagemArtistas[artista] || 0) + 1;
      }
    });
    let artistaMaisOuvido = "Nenhum artista encontrado";
    let maiorContagem = 0;
    for (const artista in contagemArtistas) {
      if (contagemArtistas[artista] > maiorContagem) {
        maiorContagem = contagemArtistas[artista];
        artistaMaisOuvido = artista;
      }
    }

    // Músicas diferentes
    const musicasUnicas = new Set(
      historyData
        .map((musica) => musica.master_metadata_track_name)
        .filter(Boolean)
    );
    const musicasDiferentes = musicasUnicas.size;

    // Minutos ouvidos
    const totalMs = historyData.reduce((soma, musica) => {
      return soma + (musica.ms_played || 0);
    }, 0);
    const minutosOuvidos = Math.floor(totalMs / 1000 / 60);

    // Média tempo diário
    const diasUnicos = new Set(
      historyData.map((musica) => musica.ts?.split("T")[0]).filter(Boolean)
    );
    const numeroDias = diasUnicos.size;
    const totalMinutos = totalMs / 1000 / 60;
    const mediaMinutos = Math.floor(totalMinutos / numeroDias);
    const horas = Math.floor(mediaMinutos / 60);
    const minutos = mediaMinutos % 60;
    const mediaTempoDiario = horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`;

    // Hora mais ouvida
    const contagemHoras = {};
    historyData.forEach((musica) => {
      if (!musica.ts) return;
      const hora = musica.ts.split("T")[1]?.split(":")[0];
      if (hora !== undefined)
        contagemHoras[hora] = (contagemHoras[hora] || 0) + 1;
    });
    let horaMaisOuvida = null;
    let maiorContagemHora = 0;
    for (const hora in contagemHoras) {
      if (contagemHoras[hora] > maiorContagemHora) {
        maiorContagemHora = contagemHoras[hora];
        horaMaisOuvida = hora;
      }
    }
    const horaMaisOuvidaResult = horaMaisOuvida !== null ? `${horaMaisOuvida}h` : "Nenhuma música encontrada";

    // Estação mais ouvida
    const contagemEstacoes = { Primavera: 0, Verão: 0, Outono: 0, Inverno: 0 };
    historyData.forEach((musica) => {
      if (!musica.ts) return;
      const mes = parseInt(musica.ts.split("-")[1], 10);
      if ([3, 4, 5].includes(mes)) contagemEstacoes["Primavera"]++;
      else if ([6, 7, 8].includes(mes)) contagemEstacoes["Verão"]++;
      else if ([9, 10, 11].includes(mes)) contagemEstacoes["Outono"]++;
      else contagemEstacoes["Inverno"]++;
    });
    let estacaoMaisOuvida = null;
    let maiorContagemEstacao = 0;
    for (const estacao in contagemEstacoes) {
      if (contagemEstacoes[estacao] > maiorContagemEstacao) {
        maiorContagemEstacao = contagemEstacoes[estacao];
        estacaoMaisOuvida = estacao;
      }
    }

    res.status(200).json({
      totalMusicas,
      primeiraMusica,
      artistaMaisOuvido,
      musicasDiferentes,
      minutosOuvidos,
      mediaTempoDiario,
      horaMaisOuvida: horaMaisOuvidaResult,
      estacaoMaisOuvida: estacaoMaisOuvida || "Nenhuma música encontrada",
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar dados' });
  }
}