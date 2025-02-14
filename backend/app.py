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

@app.route('/predict', methods=['POST'])
def predict():
    if 'files[]' not in request.files:
        print("No files[] found in request")
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('files[]')
    print(f"Number of files received: {len(files)}")

    all_predictions = []

    for file in files:
        try:
            # Load and process image
            image = Image.open(file)

            # Run YOLO model
            results = model(image)

            # Extract predictions
            detections = results.pandas().xyxy[0]

            predictions = []
            for _, row in detections.iterrows():
                predictions.append({
                    "predicted_class": row['name'],
                    "confidence": f"{row['confidence']:.2%}",
                    "bounding_box": [row['xmin'], row['ymin'], row['xmax'], row['ymax']]
                })

            # Append predictions for each image
            all_predictions.append({
                "filename": file.filename,
                "predictions": predictions
            })
        except Exception as e:
            print(f"Error processing {file.filename}: {str(e)}")
            all_predictions.append({
                "filename": file.filename,
                "error": f"Error processing image: {str(e)}"
            })

    return jsonify({"results": all_predictions})


@app.route('/generate-labels', methods=['POST'])
def generate_labels():
    if 'files[]' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400

    files = request.files.getlist('files[]')
    labels_dir = os.path.join(UPLOAD_FOLDER, "generated_labels")
    os.makedirs(labels_dir, exist_ok=True)

    all_labels = []

    for file in files:
        try:
            # Load and process image
            image = Image.open(file)

            # Run YOLO model
            results = model(image)
            detections = results.pandas().xyxy[0]

            filename = os.path.splitext(file.filename)[0]
            label_file_path = os.path.join(labels_dir, f"{filename}.txt")

            label_lines = []

            for _, row in detections.iterrows():
                # Example: You may need to map to your class index if using custom class names
                class_index = 0  # Placeholder. Replace with your actual class index if available.

                # Normalize bounding box coordinates for YOLO format
                img_width, img_height = image.size
                x_center = ((row['xmin'] + row['xmax']) / 2) / img_width
                y_center = ((row['ymin'] + row['ymax']) / 2) / img_height
                box_width = (row['xmax'] - row['xmin']) / img_width
                box_height = (row['ymax'] - row['ymin']) / img_height

                # Format: "class_index x_center y_center width height"
                label_line = f"{class_index} {x_center:.6f} {y_center:.6f} {box_width:.6f} {box_height:.6f}"
                label_lines.append(label_line)

            # Save label to file
            with open(label_file_path, 'w') as label_file:
                label_file.write("\n".join(label_lines))

            # Normalize path to use forward slashes
            normalized_label_path = label_file_path.replace(os.sep, "/")

            # Collect label file info
            all_labels.append({
                "filename": file.filename,
                "label_file": normalized_label_path
            })

        except Exception as e:
            all_labels.append({
                "filename": file.filename,
                "error": f"Error processing image: {str(e)}"
            })

    return jsonify({"labels": all_labels})


if __name__ == '__main__':
    app.run(debug=True)
