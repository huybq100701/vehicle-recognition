from flask import Flask, request, jsonify, send_file, Response
import torch
from PIL import Image
from flask_cors import CORS
import os
import matplotlib.pyplot as plt
import time
import json

app = Flask(__name__)
CORS(app)

# Load YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)

UPLOAD_FOLDER = "uploaded_training_data"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Dummy function for training (replace with your actual training logic)
def train_model_with_logs():
    epochs = list(range(1, 11))
    for epoch in epochs:
        loss = 10 / (epoch + 1)
        accuracy = 0.9 + (0.01 * epoch)
        
        # Simulate processing time for each epoch
        time.sleep(2)
        
        # Yield epoch data as JSON
        yield f"data: {json.dumps({'epoch': epoch, 'loss': loss, 'accuracy': accuracy})}\n\n"

@app.route('/train', methods=['POST'])
def upload_and_train():
    images_dir = os.path.join(UPLOAD_FOLDER, "train", "images")
    labels_dir = os.path.join(UPLOAD_FOLDER, "train", "labels")

    os.makedirs(images_dir, exist_ok=True)
    os.makedirs(labels_dir, exist_ok=True)

    files = request.files.getlist("files[]")
    for file in files:
        if file.filename.endswith((".jpg", ".png")):
            file.save(os.path.join(images_dir, os.path.basename(file.filename)))
        elif file.filename.endswith(".txt"):
            file.save(os.path.join(labels_dir, os.path.basename(file.filename)))
        else:
            print(f"Skipping unsupported file: {file.filename}")

    return jsonify({"status": "Training started successfully!"})

@app.route('/training-logs', methods=['GET'])
def training_logs():
    return Response(train_model_with_logs(), content_type='text/event-stream')

@app.route('/get-plot', methods=['GET'])
def get_plot():
    plot_path = os.path.join(UPLOAD_FOLDER, "training_plot.png")
    if os.path.exists(plot_path):
        return send_file(plot_path, mimetype='image/png')
    else:
        return jsonify({"error": "Training plot not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
