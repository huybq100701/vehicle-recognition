import React, { useState, useRef } from "react";
import axios from "../services/api";

const UploadForm = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false); 

  const imageRefs = useRef([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setImageUrls(files.map((file) => URL.createObjectURL(file)));
    setPredictions([])
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFiles.length) {
      alert("Vui lòng chọn ít nhất một hình ảnh!");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files[]", file); 
    });

    try {
      const response = await axios.post("/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setPredictions(response.data.results);
      // Add to history
      setHistory((prev) => [
        ...prev,
        { images: imageUrls, predictions: response.data.results },
      ]);
    } catch (error) {
      alert("Có lỗi xảy ra khi nhận diện hình ảnh.");
    }
  };

  const handleReset = () => {
    setSelectedFiles([]);
    setImageUrls([]);
    setPredictions([]);
    imageRefs.current = [];
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{
            marginRight: "10px",
            padding: "6px 12px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Recognize
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: "6px 12px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={toggleHistory}
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </form>

      {imageUrls.map((imageUrl, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            display: "inline-block",
            margin: "10px",
          }}
        >
          <img
            src={imageUrl}
            alt={`Uploaded ${index + 1}`}
            ref={(el) => (imageRefs.current[index] = el)}
            style={{ width: "100%", maxWidth: "800px" }}
          />
          {predictions[index]?.predictions?.map((prediction, predIndex) => {
            const { predicted_class, confidence, bounding_box } = prediction;
            const [x_min, y_min, x_max, y_max] = bounding_box.map(Math.round);

            const imgWidth = imageRefs.current[index]?.naturalWidth || 1;
            const imgHeight = imageRefs.current[index]?.naturalHeight || 1;
            const displayedWidth = imageRefs.current[index]?.width || 1;
            const displayedHeight = imageRefs.current[index]?.height || 1;

            const widthRatio = displayedWidth / imgWidth;
            const heightRatio = displayedHeight / imgHeight;

            return (
              <div
                key={predIndex}
                style={{
                  position: "absolute",
                  border: "2px solid red",
                  left: `${x_min * widthRatio}px`,
                  top: `${y_min * heightRatio}px`,
                  width: `${(x_max - x_min) * widthRatio}px`,
                  height: `${(y_max - y_min) * heightRatio}px`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    backgroundColor: "rgba(255, 0, 0, 0.7)",
                    color: "#fff",
                    padding: "4px",
                    fontSize: "12px",
                    top: "-20px",
                    left: "0",
                    borderRadius: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {predicted_class} ({confidence})
                </span>
              </div>
            );
          })}
        </div>
      ))}

      {showHistory && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            width: "300px",
            height: "100%",
            backgroundColor: "#f0f0f0",
            overflowY: "auto",
            borderLeft: "1px solid #ccc",
            padding: "10px",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h3>Lịch sử:</h3>
          {history.map((item, historyIndex) => (
            <div key={historyIndex} style={{ marginBottom: "20px" }}>
              <h4>Lần {historyIndex + 1}:</h4>
              {item.images.map((url, imgIndex) => (
                <img
                  key={imgIndex}
                  src={url}
                  alt={`History ${historyIndex + 1} Image ${imgIndex + 1}`}
                  style={{ width: "100%", marginBottom: "10px" }}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadForm;
