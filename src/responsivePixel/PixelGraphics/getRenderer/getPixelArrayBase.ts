import { Color } from "./Color";

const getColor = () => new Color();

export const getPixelArrayBase = (width, height) =>
  new Array(width)
    .fill(undefined)
    .map(() => new Array(height).fill(undefined).map(getColor));
