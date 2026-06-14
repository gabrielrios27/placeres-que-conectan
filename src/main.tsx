import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PaqueteProvider } from "./hooks/usePaquete";
import { FlyToCartProvider } from "./components/FlyToCart";
import "./styles/temas.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PaqueteProvider>
      <FlyToCartProvider>
        <App />
      </FlyToCartProvider>
    </PaqueteProvider>
  </React.StrictMode>
);
