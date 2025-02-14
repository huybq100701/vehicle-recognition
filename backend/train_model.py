from ultralytics import YOLO
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from utils.image_preprocess import load_cnn_data

# 1. Huấn luyện YOLO
def train_yolo(data_path, epochs=50):
    yolo_model = YOLO('yolov8s.pt')  # Load YOLO pre-trained model
    yolo_model.train(data=data_path, epochs=epochs, imgsz=640, name='yolo_vehicle_detection')
    yolo_model.save('model/yolo_vehicle_model.pt')
    print("Mô hình YOLO đã được lưu tại model/yolo_vehicle_model.pt")

# 2. Huấn luyện CNN
def train_cnn(images_dir, labels_dir):
    train_images, train_labels = load_cnn_data(images_dir, labels_dir)

    # Tạo mô hình CNN
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
        MaxPooling2D(pool_size=(2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dense(4, activation='softmax')
    ])

    # Compile và huấn luyện
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
    history = model.fit(train_images, train_labels, epochs=10, batch_size=32, validation_split=0.2)

    # Lưu mô hình CNN
    model.save('model/vehicle_model.h5')
    print("Mô hình CNN đã được lưu tại model/vehicle_model.h5")

if __name__ == "__main__":
    # Đường dẫn dữ liệu YOLO
    yolo_data_path = 'datasets/data.yaml'

    # Huấn luyện YOLO
    train_yolo(yolo_data_path)

    # Huấn luyện CNN
    train_cnn('train/images', 'train/labels')
