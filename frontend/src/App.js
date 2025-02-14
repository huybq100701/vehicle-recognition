import React, { useState } from "react";
import UploadForm from "./components/UploadForm";
import TrainModelPage from "./components/TrainModal";

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
          style={{ padding: "6px 12px" }}
          onClick={() => setCurrentPage("train")}
        >
          Train Model
        </button>
      </nav>
      {currentPage === "recognition" ? <UploadForm /> : <TrainModelPage />}
    </div>
  );
}

export default App;
