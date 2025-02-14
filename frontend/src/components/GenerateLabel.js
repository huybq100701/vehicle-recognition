import React, { useState } from 'react';
import axios from 'axios';

const GenerateLabelsPage = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [labelResults, setLabelResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    setLabelResults([]); // Clear previous results on new file selection
    setError(null);
  };

  const handleGenerateLabels = async () => {
    if (!selectedFiles) {
      setError('Please select files before generating labels.');
      return;
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append('files[]', file);
    });

    setUploading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/generate-labels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLabelResults(response.data.labels);
    } catch (err) {
      setError('An error occurred while generating labels.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Labels for Uploaded Images</h1>
      <div className="mb-4">
        <input
          type="file"
          multiple
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          className="block w-full border border-gray-300 rounded p-2"
        />
      </div>
      <button
        onClick={handleGenerateLabels}
        disabled={uploading}
        className={`px-4 py-2 rounded text-white ${uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        {uploading ? 'Generating Labels...' : 'Generate Labels'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Label Results</h2>
        {labelResults.length === 0 && <p>No labels generated yet.</p>}
        {labelResults.map((result, index) => (
          <div key={index} className="border border-gray-300 rounded p-2 mb-2">
            <p><strong>Filename:</strong> {result.filename}</p>
            {result.error ? (
              <p className="text-red-500">Error: {result.error}</p>
            ) : (
              <a
                href={`http://localhost:5000/${result.label_file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Download Label File
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerateLabelsPage;
