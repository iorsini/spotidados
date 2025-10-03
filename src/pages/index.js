import { useState } from "react";
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
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);

  const mostrarPopup = (mensagem) => {
    setPopup(mensagem);
    setVisible(true);
    setTimeout(() => setVisible(false), 1800);
    setTimeout(() => setPopup(null), 2000);
  };

  return (
    <div className="relative">
      {/* Pop-up */}
      {popup && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#9900FF] text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300 ${
            visible ? "opacity-100" : "opacity-0"
          }`}
        >
          {popup}
        </div>
      )}

      {/* Card Perfil */}
      <div className="p-6 rounded-2xl text-white">
        <div className="flex gap-6 h-50">
          {/* Foto de perfil + nome + data */}
          <div className="w-1/2 flex flex-col items-center justify-center gap-2">
            <img
              src="https://i.pinimg.com/736x/d9/cf/61/d9cf6197348bfcc39a22e58a3b308b9a.jpg"
              alt="Foto de perfil"
              className="w-40 h-40 aspect-square rounded-full object-cover object-center"
            />
            <h2 className="text-xl font-semibold">Docinho</h2>
            {/* Data agora fica aqui */}
            <p className="flex items-center text-sm text-gray-300 mt-1">
              <FaCalendarDay className="mr-1" />
              18/01/2024
            </p>
          </div>

          {/* Logo + botões */}
          <div className="w-1/2 flex flex-col justify-center items-center gap-4">
            <Image
              src="https://videos.openai.com/vg-assets/assets%2Ftask_01k6aj2kw2ez2tsk5xmbfkd841%2F1759143701_img_1.webp?st=2025-10-02T06%3A44%3A02Z&se=2025-10-08T07%3A44%3A02Z&sks=b&skt=2025-10-02T06%3A44%3A02Z&ske=2025-10-08T07%3A44%3A02Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=HAly8bKLg76DD%2Fs9XPAtWcEpLIr1E%2BmPmqC0Re8qAUc%3D&az=oaivgprodscus"
              alt="Meu Logo"
              width={100}
              height={100}
            />
            <button
              onClick={() => mostrarPopup("Perfil editado")}
              className="w-3/4 px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => mostrarPopup("Perfil partilhado")}
              className="w-3/4 px-4 py-2 rounded-full bg-gray-800 text-white text-sm hover:bg-gray-700 transition"
            >
              Partilhar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* ESTATÍSTICAS */}
      <div className="pt-[40px] max-w-4xl mx-auto">
        <div
          className="bg-transparent rounded-lg shadow-md p-6 
                        max-h-[calc(100vh-380px)] overflow-y-auto"
        >
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
              <div className="text-white">Músicas diferentes</div>
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
    </div>
  );
}
