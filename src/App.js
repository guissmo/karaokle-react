import React from "react";
import { render } from "react-dom";
import YouTubePlayer from "./YouTubePlayer";

const App = () => {
  return <YouTubePlayer />;
};

render(<App />, document.getElementById("root"));
