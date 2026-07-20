// test-imgproxy.js
import { generateImgproxyUrl } from "./src/utils/imgproxy.js";

// Configuration de test : nous injectons directement des valeurs ici
// pour ne pas dépendre du système de variables d'environnement de Next.js pour l'instant.
// NOTE : Remplace ces valeurs par ta vraie clé et ton vrai sel fournis par Antistatique.

const testImageUrl =
  "https://content-staging.luxurytribune.com/app/uploads/2026/04/Baccarat-Crystal-Crypt-©-Emanuelle-Luciani-©-Southway-Studio-1.jpg";
const options = { width: 800, height: 400 };

try {
  console.log("--- DÉBUT DU TEST DE GÉNÉRATION ---");
  const resultUrl = generateImgproxyUrl(testImageUrl, options);
  console.log("\n[SUCCÈS] URL Imgproxy générée avec succès !");
  console.log("-----------------------------------------");
  console.log(resultUrl);
  console.log("-----------------------------------------");
} catch (error) {
  console.error("\n[ERREUR] Le script a échoué :");
  console.error(error.message);
}
