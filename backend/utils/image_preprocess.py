import os
import numpy as np
from PIL import Image
import tensorflow as tf

def load_cnn_data(images_dir, labels_dir):
    images = []
    labels = []

    for filename in os.listdir(images_dir):
        if filename.endswith(".jpg") or filename.endswith(".png"):
            # Đọc ảnh và resize về 224x224
            img_path = os.path.join(images_dir, filename)
            image = Image.open(img_path).resize((224, 224))
            images.append(np.array(image) / 255.0)

            # Đọc nhãn từ file tương ứng
            label_file = os.path.join(labels_dir, filename.replace(".jpg", ".txt").replace(".png", ".txt"))
            with open(label_file, 'r') as f:
                first_line = f.readline().strip()
                class_id = int(first_line.split()[0])
                labels.append(class_id)

    images = np.array(images)
    labels = np.array(labels)

    # Chuyển nhãn thành one-hot encoding
    num_classes = 4
    labels = tf.keras.utils.to_categorical(labels, num_classes)

    return images, labels
