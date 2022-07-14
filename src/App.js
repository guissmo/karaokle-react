import React from "react";
import { createRoot } from "react-dom/client";
import YouTubePlayer from "./YouTubePlayer";

const App = () => {
  return <YouTubePlayer />;
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
