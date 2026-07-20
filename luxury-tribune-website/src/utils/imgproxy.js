// utils/imgproxy.js
import crypto from "crypto";

const hexDecode = (hex) => {
  if (!hex) {
    throw new Error("La valeur hexadécimale fournie est vide ou undefined.");
  }
  return Buffer.from(hex, "hex");
};

export function generateImgproxyUrl(sourceUrl, [{ parameters }]) {
  const keyHex = process.env.IMGPROXYKEY;
  const saltHex = process.env.IMGPROXYSALT;
  const endpoint = process.env.IMGPROXYENDPOINT;

  // Sécurité explicite pour éviter l'erreur "Received undefined"
  if (!keyHex) {
    throw new Error("Variable d'environnement IMGPROXY_KEY manquante.");
  }
  if (!saltHex) {
    throw new Error("Variable d'environnement IMGPROXY_SALT manquante.");
  }

  const key = hexDecode(keyHex);
  const salt = hexDecode(saltHex);

  const encodedUrl = Buffer.from(sourceUrl).toString("base64url");

  // 2. Options de traitement en clair
  const processingOptions = `/rs:fill/w:${parameters.width}/h:${parameters.height}`;

  // 3. Le chemin à signer doit contenir les options ET l'URL encodée, séparées par des slashes
  const path = `${processingOptions}/${encodedUrl}`;

  // 4. Calcul de la signature HMAC-SHA256 sur ce chemin complet
  const hmac = crypto.createHmac("sha256", key);
  hmac.update(salt);
  hmac.update(path);

  // Signe bien "/rs:fill:400:400/aHR0cHM6..."
  const signature = hmac.digest("base64url");

  // 5. URL finale sécurisée
  return `${endpoint}/${signature}${path}`;
}
