import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./Game";

const App = () => {
  useEffect(() => {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      console.log("DEVELOPMENT");
    } else {
      console.log("PRODUCTION");
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/en" element={<Game language="EN" />} />
        <Route path="/tl" element={<Game language="TL" />} />
        <Route path="/en/:id" element={<Game language="EN" />} />
        <Route path="/tl/:id" element={<Game language="TL" />} />
        <Route path="/test" element={"yo!!!"} />
        <Route path="/" element={"under construction"} />
      </Routes>
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
