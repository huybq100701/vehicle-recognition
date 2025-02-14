import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import TrainModelPage from "./components/TrainModel";
import GenerateLabelPage from "./components/GenerateLabel"; 
function App() {
  const [currentPage, setCurrentPage] = useState("recognition");

  return (
    <div style={{ padding: "20px" }}>
      <h1>Vehicle System</h1>
      <nav style={{ marginBottom: "20px" }}>
        <button
          style={{ marginRight: "10px", padding: "6px 12px" }}
          onClick={() => setCurrentPage("recognition")}
        >
          Image Recognition
        </button>
        <button
          style={{ marginRight: "10px", padding: "6px 12px" }}
          onClick={() => setCurrentPage("train")}
        >
          Train Model
        </button>
        <button
          style={{ padding: "6px 12px" }}
          onClick={() => setCurrentPage("generate-label")}
        >
          Generate Label
        </button>
      </nav>
      {currentPage === "recognition" && <UploadForm />}
      {currentPage === "train" && <TrainModelPage />}
      {currentPage === "generate-label" && <GenerateLabelPage />}
    </div>
  );
}

export default App;
