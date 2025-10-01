// components/TopHeader.jsx
import { useRef, useEffect, useState } from "react";

export default function TopHeader({ activeTab, setActiveTab, period, setPeriod }) {
  const navbarRef = useRef(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.offsetHeight);
    }
    const handleResize = () => {
      if (navbarRef.current) setNavbarHeight(navbarRef.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fadeHeight = 80;

  return (
    <>
      <div
        ref={navbarRef}
        className="fixed top-0 left-0 w-full z-20 bg-gradient-to-b from-[#9900FF] to-[#6400aa]"
      >
        <div className="flex flex-col items-center py-6">
          <h1 className="text-4xl font-bold text-white mb-4">TOP 100</h1>

          <div className="flex gap-8 text-xl mb-4">
            <button
              className={`border-b-2 ${
                activeTab === "artistas"
                  ? "border-white font-bold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("artistas")}
            >
              Artistas
            </button>
            <button
              className={`border-b-2 ${
                activeTab === "musicas"
                  ? "border-white font-bold"
                  : "border-transparent"
              }`}
              onClick={() => setActiveTab("musicas")}
            >
              Músicas
            </button>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {[
              { key: "4w", label: "Últimas 4 semanas" },
              { key: "6m", label: "Últimos 6 meses" },
              { key: "1y", label: "Último ano" },
              { key: "all", label: "Desde sempre" },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`py-2 px-4 rounded-md text-white ${
                  period === p.key
                    ? "bg-gradient-to-b from-[#9900FF] to-[#8300DB] font-bold"
                    : "bg-[#6900b1] border border-[#6900b1]"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fade Top logo abaixo dos botões */} 
      <div className="pointer-events-none fixed left-0 w-full z-10" style={{ top: navbarHeight - 2, height: fadeHeight }} > 
        <div className="w-full h-full bg-gradient-to-b from-[#6400aa] to-black/0" /> 
        </div>

      {/* Retorna altura para usar no padding do grid */}
      <div style={{ display: "none" }}>{navbarHeight + fadeHeight}</div>
    </>
  );
}