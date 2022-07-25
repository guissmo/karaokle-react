import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Game";

const App = () => {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/en" element={<Game language="EN" />} />
          <Route path="/tl" element={<Game language="TL" />} />
          <Route path="/en/:id" element={<Game language="EN" />} />
          <Route path="/tl/:id" element={<Game language="TL" />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
