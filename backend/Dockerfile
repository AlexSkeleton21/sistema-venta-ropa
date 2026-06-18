# 1. Etapa de construcción (Build)
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Etapa de ejecución (Producción)
FROM node:18-alpine
WORKDIR /app
# Solo copiamos lo necesario para correr
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3001
# AQUÍ ESTÁ EL CAMBIO: Ejecutamos el archivo compilado directamente
CMD ["node", "dist/main.js"]