# Base image
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json tsconfig.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers sources
COPY . .

# Compiler le code TypeScript
RUN npm run build

# Exposer le port du serveur
EXPOSE 4001
EXPOSE 4002

# Ajouter l'argument pour le type de serveur
ARG SERVER_TYPE
ENV SERVER_TYPE=${SERVER_TYPE}

# Commande pour démarrer le serveur en fonction du type
CMD ["sh", "-c", "node dist/main-${SERVER_TYPE}.js"]
