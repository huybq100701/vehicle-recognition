# Sử dụng image Python chính thức
FROM python:3.9-slim

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép tất cả các tệp từ thư mục hiện tại vào image
COPY . .

# Cài đặt các thư viện cần thiết
RUN pip install -r requirements.txt

# Chạy ứng dụng (thay "app.py" bằng tệp khởi chạy chính xác)
CMD ["python", "train_model.py"]
