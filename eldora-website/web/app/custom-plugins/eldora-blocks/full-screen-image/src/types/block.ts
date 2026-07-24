export type FullScreenImageBlock = {
  id: string;
  imageAlt?: string;
  imageUrl: string;
  focalPoint: Points;
  videoUrl: string;
  mediaSizes?: {
    medium?: string;
    large?: string;
  };
  gradientDirection: Direction;
}

export type Direction = "up" | "down" | "left" | "right";

export type Points = {
  x: number;
  y: number;
}
