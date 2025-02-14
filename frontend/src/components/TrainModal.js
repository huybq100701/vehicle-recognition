import React, { useState } from "react";
import axios from "../services/api";

const TrainModelPage = () => {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [trainingLogs, setTrainingLogs] = useState([]);
  const [plotUrl, setPlotUrl] = useState("");

  const handleFolderChange = (e) => {
    setSelectedFolder(e.target.files);
  };

  const handleTrainSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFolder || selectedFolder.length === 0) {
      alert("Please select a folder with images and labels!");
      return;
    }

    const formData = new FormData();
    Array.from(selectedFolder).forEach((file) => formData.append("files[]", file));

    try {
      await axios.post("/train", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const eventSource = new EventSource("http://localhost:5000/training-logs");

      eventSource.onmessage = (event) => {
        try {
          // Parse log as JSON to extract epoch data
          const logData = JSON.parse(event.data);
          setTrainingLogs((prevLogs) => [...prevLogs, logData]);

          // If training completes (e.g., on epoch 10), close the event source
          if (logData.epoch === 10) {
            eventSource.close();
            setPlotUrl("http://localhost:5000/get-plot");
          }
        } catch (err) {
          console.error("Error parsing log data:", err);
        }
      };
    } catch (error) {
      alert("An error occurred while starting the training.");
    }
  };

  return (
    <div>
      <h2>Train Model</h2>
      <form onSubmit={handleTrainSubmit}>
        <label htmlFor="folderUpload" style={{ marginBottom: "10px", display: "block" }}>
          Upload Folder (Images & Labels):
        </label>
        <input
          type="file"
          id="folderUpload"
          onChange={handleFolderChange}
          webkitdirectory=""
          directory=""
          multiple
        />
        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "6px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Train
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        <h3>Training Progress:</h3>
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Epoch</th>
              <th>Loss</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {trainingLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.epoch}</td>
                <td>{log.loss}</td>
                <td>{(log.accuracy * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {plotUrl && (
        <div style={{ marginTop: "30px" }}>
          <h3>Training Results:</h3>
          <img src={plotUrl} alt="Training Plot" style={{ width: "100%", maxWidth: "800px" }} />
        </div>
      )}
    </div>
  );
};

export default TrainModelPage;
