export type TextImageGridBlock = {
  id: string;
  surtitle: string;
  title: string;
  text: string;
  link: {
    text: string;
    url: string;
  };
  format: Format;
  images: (Image | undefined)[];
};

export type Format = "one-image-right" | "one-image-left" | "four-images";

export type Image = {
  url: string;
  alt: string;
  sizes: {
    medium: string;
    large: string;
  };
};
