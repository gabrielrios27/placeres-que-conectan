import { useTema } from "./hooks/useTema";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ComoComprar from "./components/ComoComprar";
import Calculadora from "./components/Calculadora";
import SobreNosotros from "./components/SobreNosotros";
import Footer from "./components/Footer";
import FondoEstacion from "./components/FondoEstacion";
import CapaFestiva from "./components/festivo/CapaFestiva";

export default function App() {
  const { pref, setPref, estacion } = useTema();

  return (
    <>
      {/* Capa de partículas ambientales según la estación (detrás de todo) */}
      <FondoEstacion estacion={estacion} />

      {/* Capa festiva automática (se activa sola cerca de cada festividad) */}
      <CapaFestiva />

      {/* Saltar al contenido (accesibilidad) */}
      <a
        href="#calculadora"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-white"
      >
        Saltar a la calculadora
      </a>

      <Header pref={pref} setPref={setPref} />

      <main className="relative z-10">
        <Hero />
        <ComoComprar />
        <Calculadora />
        <SobreNosotros />
      </main>

      <Footer />
    </>
  );
}
