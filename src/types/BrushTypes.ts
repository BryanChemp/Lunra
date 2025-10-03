
export type Brush = {
  size: number;
  color: string;
  opacity?: number;
  shape?: HTMLImageElement | "circle" | "square";
  spacing?: number;
};