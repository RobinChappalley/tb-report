export type ImageCarouselStaticBlock = {
  id: string;
  images: (Image | undefined)[];
};

export type Image = {
  url: string;
  alt: string;
  sizes: {
    medium: string;
    large: string;
  };
  focalPoint: FocalPoint;
};

export type FocalPoint = {
  x: number;
  y: number;
};
