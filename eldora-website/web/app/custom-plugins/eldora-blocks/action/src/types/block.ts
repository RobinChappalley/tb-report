export type ActionBlock = {
  id: string;
  type: "link" | "file";
  label: string;
  link: string;
  isBlank: boolean;
  file: string;
  iconLeft?: string;
  iconRight?: string;
};
