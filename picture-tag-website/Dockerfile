# Étape 1 : Construction de l'application statique avec Node.js
FROM node:24-alpine AS builder

WORKDIR /app

# Copie uniquement les fichiers de configuration de package pour optimiser le cache Docker
COPY package*.json ./
RUN npm install

# Copie le reste du code (les images, css, js)
COPY . .

# Compile le site avec Vite
RUN npm run build

# Étape 2 : Distribution via Nginx (Image ultra légère)
FROM nginx:alpine

# Copie le dossier 'dist' généré par Vite vers le dossier public de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Le conteneur écoutera sur le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
