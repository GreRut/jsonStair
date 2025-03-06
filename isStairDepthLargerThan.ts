import { Stair } from "./types";
import { stairEquation } from "./stairEquation";

const EPSILON = 1e-4;

function findMostCommon(counts: Map<number, number>): number {
  let mostCommonValue = 0;
  let maxCount = 0;
  counts.forEach((count, value) => {
    if (count > maxCount) {
      mostCommonValue = value;
      maxCount = count;
    }
  });
  return mostCommonValue;
}

function collectHeights(stair: Stair): Map<number, number> {
  const heightCounts = new Map<number, number>();
  stair.solids.forEach((solid) => {
    solid.faces.forEach((face) => {
      face.loops.forEach((loop) => {
        loop.forEach(({ start, end }) => {
          const height = Math.abs(end.z - start.z);
          if (height > EPSILON) {
            heightCounts.set(height, (heightCounts.get(height) || 0) + 1);
          }
        });
      });
    });
  });
  return heightCounts;
}

function collectWidths(
  stair: Stair,
  referenceHeight: number
): Map<number, number> {
  const widthCounts = new Map<number, number>();
  stair.solids.forEach((solid) => {
    solid.faces.forEach((face) => {
      face.loops.forEach((loop) => {
        loop.forEach(({ start, end }) => {
          const width = Math.hypot(end.x - start.x, end.y - start.y);
          if (
            width > EPSILON &&
            width >= referenceHeight / 3 - EPSILON &&
            width <= referenceHeight * 3 + EPSILON
          ) {
            widthCounts.set(width, (widthCounts.get(width) || 0) + 1);
          }
        });
      });
    });
  });
  return widthCounts;
}

export function isStairDepthLargerThan(stairs: Stair[][]): boolean {
  for (let groupIndex = 0; groupIndex < stairs.length; groupIndex++) {
    console.log(`Stair Group ${groupIndex + 1}:`);

    for (const stair of stairs[groupIndex]) {
      const heightCounts = collectHeights(stair);
      const mostCommonHeight = findMostCommon(heightCounts);
      if (mostCommonHeight <= EPSILON) continue;

      const widthCounts = collectWidths(stair, mostCommonHeight);
      const mostCommonWidth = findMostCommon(widthCounts);
      if (mostCommonWidth <= EPSILON) continue;

      console.log(`Stair ID: ${stair.id}`);
      console.log(
        `     - Most Common Height: ${mostCommonHeight.toFixed(2)} units`
      );
      console.log(
        `     - Most Common Width: ${mostCommonWidth.toFixed(2)} units`
      );

      if (stairEquation(mostCommonHeight, mostCommonWidth)) {
        return true;
      }
    }
  }
  return false;
}
