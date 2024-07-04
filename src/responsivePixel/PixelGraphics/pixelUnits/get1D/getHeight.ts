import type { Size } from "../../types";

export const getHeight = (Dimension) =>
  class Height extends Dimension {
    axis = false;

    constructor(args: Size) {
      super(false, true, args);
    }
  };

export type Height = ReturnType<typeof getHeight>;
