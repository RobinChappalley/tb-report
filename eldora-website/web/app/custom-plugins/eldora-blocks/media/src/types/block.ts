export type MediaBlock = {
  id: string;
  imageUrl: string;
  imageAlt: string;
  mediaSizes?: {
    medium?: string;
    large?: string;
  };
  videoUrl: string;
};
