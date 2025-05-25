FROM node:18

# Робоча директорія всередині контейнера
WORKDIR /app

# Копіюємо package.json і встановлюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо увесь проєкт у контейнер
COPY . .

# Відкриваємо порт
EXPOSE 4200

# Запуск сервера
CMD ["node", "server.js"]
