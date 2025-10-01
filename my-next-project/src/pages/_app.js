import "@/styles/globals.css";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <div className="h-screen bg-gradient-to-b from-[#9900FF] to-black flex flex-col relative">
      {/* Conteúdo rolável */}
      <main className="flex-1 overflow-y-auto px-4 py-8 pb-16">
        <Component {...pageProps} />
      </main>

      {/* Navbar fixa no fundo */}
      <div className="fixed bottom-0 left-0 w-full">
        <Navbar />
      </div>
    </div>
  );
}