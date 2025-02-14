# Vehicle Recognition Project

## Mô tả
Dự án nhận diện các loại phương tiện (motorbike, car, truck, bus) sử dụng YOLO và CNN.

---

## Hướng dẫn cài đặt

### 1. Tạo và kích hoạt môi trường `venv`

#### Trên Windows:
1. Tạo môi trường ảo:
   ```bash
   python -m venv venv
   ```

2. Kích hoạt môi trường:
   ```bash
   .\venv\Scripts\activate
   ```

#### Trên macOS hoặc Linux:
1. Tạo môi trường ảo:
   ```bash
   python3 -m venv venv
   ```

2. Kích hoạt môi trường:
   ```bash
   source venv/bin/activate
   ```

---

### 2. Cài đặt các thư viện cần thiết

Sau khi kích hoạt môi trường ảo, cài đặt tất cả các thư viện được liệt kê trong file `requirements.txt`:

```bash
pip install -r requirements.txt
```

---

### 3. Cấu trúc thư mục dự án

```
backend/
│   ├── train_model.py       # File chính để huấn luyện mô hình
│   ├── model/
│   │   ├── vehicle_model.h5 # Mô hình CNN đã được lưu
│   │   
│   ├── datasets/
│   │   ├── train/
│   │   │   ├── images/       # Ảnh huấn luyện
│   │   │   └── labels/       # Nhãn tương ứng cho ảnh huấn luyện
│   │   └── validation/
│   │   │   ├── images/       # Ảnh validation
│   │   │   └── labels/       # Nhãn tương ứng cho ảnh validation
│   ├── utils/
│   │   └── image_preprocess.py # Tiền xử lý ảnh cho CNN
│   └── requirements.txt     # Danh sách thư viện cần cài đặt
```

---

### 4. Chạy huấn luyện mô hình

Chạy lệnh sau để huấn luyện YOLO và CNN:

```bash
python train_model.py
```

