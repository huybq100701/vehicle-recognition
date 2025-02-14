# Sử dụng image Node.js chính thức
FROM node:14

# Cài đặt các thư viện cần thiết
WORKDIR /app
COPY frontend/ ./
RUN npm install

# Chạy ứng dụng React
CMD ["npm", "start"]
