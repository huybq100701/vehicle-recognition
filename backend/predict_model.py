import tensorflow as tf
from PIL import Image
import numpy as np
from ultralytics import YOLO

# Load model YOLO và CNN
yolo_model = YOLO('model/yolo_vehicle_model.pt')
cnn_model = tf.keras.models.load_model('model/vehicle_model.h5')

def detect_and_classify(image_path):
    # YOLO dự đoán bounding box
    results = yolo_model.predict(source=image_path)
    bounding_boxes = []

    for result in results:
        for box in result.boxes:
            coordinates = box.xyxy.tolist()[0]  # [x_min, y_min, x_max, y_max]
            cropped_image = Image.open(image_path).crop(coordinates).resize((224, 224))
            image_array = np.expand_dims(np.array(cropped_image) / 255.0, axis=0)

            # CNN dự đoán class
            prediction = cnn_model.predict(image_array)
            class_id = np.argmax(prediction)
            bounding_boxes.append({
                "coordinates": coordinates,
                "cnn_class_id": class_id
            })

    return bounding_boxes
