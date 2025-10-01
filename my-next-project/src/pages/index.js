import {
  contarTotalMusicas,
  obterPrimeiraMusica,
  encontrarArtistaMaisOuvido,
  contarMusicasDiferentes,
  contarMinutosOuvidos,
  mediaTempoDiario,
  horaMaisOuvida,
  estacaoMaisOuvida,
} from "@/utils/dataProcessing";
import Image from "next/image";
import { FaCalendarDay } from "react-icons/fa";

export default function Home() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, "0");
  const mes = String(hoje.getMonth() + 1).padStart(2, "0"); // Janeiro é 0
  const ano = hoje.getFullYear();
  const dataFormatada = `${dia}/${mes}/${ano}`;
  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="flex justify-center mt-6">
        <Image
          src="https://videos.openai.com/vg-assets/assets%2Ftask_01k6aj2kw2ez2tsk5xmbfkd841%2F1759143701_img_1.webp?st=2025-09-30T08%3A34%3A14Z&se=2025-10-06T09%3A34%3A14Z&sks=b&skt=2025-09-30T08%3A34%3A14Z&ske=2025-10-06T09%3A34%3A14Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ffff87a-01f1-47c9-9090-32999d4d6380&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=If5gA92ixU3FkQzEi6L78v13PhWT8uizwACBFWQy9zI%3D&az=oaivgprodscus"
          alt="Meu Logo"
          width={100}
          height={100}
        />
      </div>

      {/* Card do Perfil */}
      <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-transparent text-white">
        <div className="flex gap-6 h-64">
          {/* Metade esquerda: Foto + Nome */}
          <div className="w-1/2 flex flex-col items-center justify-center gap-2">
            <img
              src="https://thisis-images.spotifycdn.com/37i9dQZF1DZ06evO1IPOOk-default.jpg"
              alt="Foto de perfil"
              className="w-40 h-40 rounded-full"
            />
            <h2 className="text-xl font-semibold">Mr Lamar</h2>
          </div>

          {/* Metade direita: Data + Botões */}
          <div className="w-1/2 flex flex-col justify-center items-center gap-4">
            {/* Data com mais espaçamento acima do primeiro botão */}
            <p className="flex items-center text-sm text-gray-300 justify-center mb-8">
              <FaCalendarDay className="mr-1" />
              {dataFormatada}
            </p>

            {/* Botões empilhados com mesmo comprimento */}
            <button className="w-3/4 px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition">
              Editar Perfil
            </button>
            <button className="w-3/4 px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition">
              Partilhar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas de músicas */}
      <div className="max-w-4xl mx-auto bg-transparent rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {contarTotalMusicas()}
            </div>
            <div className="text-white">Total de reproduções</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {obterPrimeiraMusica()}
            </div>
            <div className="text-white">Primeira música no histórico</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {encontrarArtistaMaisOuvido()}
            </div>
            <div className="text-white">Artista mais ouvido</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {contarMusicasDiferentes()}
            </div>
            <div className="text-white">Musicas diferentes</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {contarMinutosOuvidos()}
            </div>
            <div className="text-white">Minutos ouvidos</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {mediaTempoDiario()}
            </div>
            <div className="text-white">Média tempo diário</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {horaMaisOuvida()}
            </div>
            <div className="text-white">Hora do dia que mais ouve</div>
          </div>

          <div className="p-4">
            <div className="text-lg font-semibold text-white truncate">
              {estacaoMaisOuvida()}
            </div>
            <div className="text-white">Estação do ano que mais ouve</div>
          </div>
        </div>
      </div>
    </div>
  );
}
