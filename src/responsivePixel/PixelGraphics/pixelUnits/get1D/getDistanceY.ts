import type { Size } from "../../types";

export const getDistanceY = (Distance) =>
  class DistanceY extends Distance {
    axis = false;

    constructor(args: Size) {
      super(false, args);
    }
  };
