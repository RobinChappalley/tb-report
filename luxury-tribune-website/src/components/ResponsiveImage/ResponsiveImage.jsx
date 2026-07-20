// components/ResponsiveImage.jsx
import React from "react";
import { generateImgproxyUrl } from "../../utils/imgproxy";

// Breakpoints standard d'affichage (largeur max de l'image demandée)
const BREAKPOINTS = [640, 768, 1024, 1280, 1536];

export default function ResponsiveImage({
  src,
  alt = "",
  width,
  height,
  sizes = "100vw",
  className,
}) {
  // 1. Validation stricte du ratio (sécurité contre le CLS)
  if (!width || !height) {
    throw new Error(
      `ResponsiveImage : Les dimensions de l'image sont invalides ou manquantes. ` +
        `Valeurs acceptées : width et height doivent être des nombres positifs.`,
    );
  }

  const aspectRatio = width / height;

  // 2. Génération du srcset
  const srcSetEntries = BREAKPOINTS.map((width) => {
    // Calcul de la hauteur proportionnelle au breakpoint pour respecter le ratio
    const height = Math.round(width / aspectRatio);
    const url = generateImgproxyUrl(src, { width, height });
    return `${url} ${width}w`;
  });

  // 3. Image par défaut (Fallback pour les navigateurs sans support srcset ou robots)
  const fallbackUrl = generateImgproxyUrl(src, [
    { width: 1024, height: Math.round(1024 / aspectRatio) },
  ]);

  return (
    <div className="fix-image">
      <img
        src={fallbackUrl}
        srcSet={srcSetEntries.join(", ")}
        sizes={sizes}
        width={width}
        height={height}
        loading="lazy"
        alt={alt}
        className={className}
      />
    </div>
  );
}
