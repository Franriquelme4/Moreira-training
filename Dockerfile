# Usa la imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de la aplicación al directorio de trabajo
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Comando para iniciar la aplicación cuando se ejecute el contenedor
CMD ["node", "index.js"]