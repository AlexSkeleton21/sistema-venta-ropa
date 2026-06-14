# 1. Usamos la misma base de Node.js
FROM node:18-alpine

# 2. Carpeta de trabajo interna del contenedor
WORKDIR /app

# 3. Copiamos las dependencias del backend
COPY package*.json ./

# 4. Instalamos los módulos de NestJS
RUN npm install

# 5. Copiamos todo el código de tu servidor NestJS
COPY . .

# 6. Abrimos el puerto 3001 que usa tu API para escuchar a React
EXPOSE 3001

# 7. Comando para arrancar NestJS en modo desarrollo
CMD ["npm", "run", "start:dev"]