import dadosHistory from "../data/history.json"

export function contarTotalMusicas() {
  if (!dadosHistory || dadosHistory.length === 0) {
    return 0;
  }
  return dadosHistory.length;
}

export function obterPrimeiraMusica() {
  if (!dadosHistory || dadosHistory.length === 0) {
    return "Nenhuma música encontrada";
  }
  return dadosHistory[0]?.master_metadata_track_name || "Música desconhecida";
}

export function encontrarArtistaMaisOuvido() {
  if (!dadosHistory || dadosHistory.length === 0) {
    return "Nenhum artista encontrado";
  }
  const contagemArtistas = {};
  
  dadosHistory.forEach(musica => {
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

  return artistaMaisOuvido;
}



export function contarMusicasDiferentes() {
  if (!dadosHistory || dadosHistory.length === 0) {
    return 0;
  }

  const musicasUnicas = new Set(
    dadosHistory
      .map((musica) => musica.master_metadata_track_name)
      .filter(Boolean) // remove null/undefined
  );

  return musicasUnicas.size;
}

export function contarMinutosOuvidos() {
  if (!dadosHistory || dadosHistory.length === 0) {
    return 0;
  }

  const totalMs = dadosHistory.reduce((soma, musica) => {
    return soma + (musica.ms_played || 0);
  }, 0);

  // converter de ms para minutos
  const totalMinutos = Math.floor(totalMs / 1000 / 60);

  return totalMinutos;
}

export function mediaTempoDiario() {
  if (!dadosHistory || dadosHistory.length === 0) return "0min";

  const totalMs = dadosHistory.reduce(
    (soma, musica) => soma + (musica.ms_played || 0),
    0
  );

  // dias únicos com base no ts
  const diasUnicos = new Set(
    dadosHistory.map((musica) => musica.ts?.split("T")[0]).filter(Boolean)
  );

  const numeroDias = diasUnicos.size;
  if (numeroDias === 0) return "0min";

  const totalMinutos = totalMs / 1000 / 60;
  const mediaMinutos = Math.floor(totalMinutos / numeroDias);

  const horas = Math.floor(mediaMinutos / 60);
  const minutos = mediaMinutos % 60;

  return horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`;
}

export function horaMaisOuvida() {
  if (!dadosHistory || dadosHistory.length === 0)
    return "Nenhuma música encontrada";

  const contagemHoras = {};

  dadosHistory.forEach((musica) => {
    if (!musica.ts) return;
    const hora = musica.ts.split("T")[1]?.split(":")[0]; // pega HH
    if (hora !== undefined)
      contagemHoras[hora] = (contagemHoras[hora] || 0) + 1;
  });

  let horaMaisOuvida = null;
  let maiorContagem = 0;

  for (const hora in contagemHoras) {
    if (contagemHoras[hora] > maiorContagem) {
      maiorContagem = contagemHoras[hora];
      horaMaisOuvida = hora;
    }
  }

  return horaMaisOuvida !== null
    ? `${horaMaisOuvida}h`
    : "Nenhuma música encontrada";
}

export function estacaoMaisOuvida() {
  if (!dadosHistory || dadosHistory.length === 0)
    return "Nenhuma música encontrada";

  const contagemEstacoes = { Primavera: 0, Verão: 0, Outono: 0, Inverno: 0 };

  dadosHistory.forEach((musica) => {
    if (!musica.ts) return;

    const mes = parseInt(musica.ts.split("-")[1], 10);

    if ([3, 4, 5].includes(mes)) contagemEstacoes["Primavera"]++;
    else if ([6, 7, 8].includes(mes)) contagemEstacoes["Verão"]++;
    else if ([9, 10, 11].includes(mes)) contagemEstacoes["Outono"]++;
    else contagemEstacoes["Inverno"]++; // 12,1,2
  });

  let estacaoMaisOuvida = null;
  let maiorContagem = 0;

  for (const estacao in contagemEstacoes) {
    if (contagemEstacoes[estacao] > maiorContagem) {
      maiorContagem = contagemEstacoes[estacao];
      estacaoMaisOuvida = estacao;
    }
  }

  return estacaoMaisOuvida || "Nenhuma música encontrada";
}
