# 1. Usamos la imagen oficial de Node.js
FROM node:18-alpine

# 2. Creamos la carpeta interna del contenedor donde vivirá la app
WORKDIR /app

# 3. Copiamos los archivos de configuración de empaquetado
COPY package*.json ./

# 4. Instalamos las librerías necesarias (incluyendo chartjs y jspdf)
RUN npm install --legacy-peer-deps

# 5. Copiamos el resto de tus componentes y carpetas de React
COPY . .

# 6. Abrimos el puerto 3000 que usa React por defecto
EXPOSE 3000

# 7. Comando para encender el servidor de React
CMD ["npm", "start"]