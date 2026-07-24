export type ImageMetricsBlock = {
  id: string;
  imageAlt?: string;
  imageUrl: string;
  imageSizes?: {
    medium?: string;
    large?: string;
  };
  gradientDirection: Direction;
  focalPoint: FocalPoint;
};

export type Direction = "left" | "right";

export type FocalPoint = {
  x: number;
  y: number;
};
