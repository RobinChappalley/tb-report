export type ImageTextCardBlock = {
  id: string;
  image: string;
  imageAlt: string;
  imageSize?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    full?: string;
  };
  title: string;
  text: string;
  link: string;
  linkText: string;
};
