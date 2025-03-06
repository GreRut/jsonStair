import { Stair } from "./types";
import { stairEquation } from "./stairEquation";

const EPSILON = 1e-4;

function findMostCommon(counts: Map<number, number>): number {
  let mostCommon = 0;
  let maxCount = 0;

  counts.forEach((count, value) => {
    if (count > maxCount) {
      mostCommon = value;
      maxCount = count;
    }
  });

  return mostCommon;
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
  mostCommonHeight: number
): Map<number, number> {
  const widthCounts = new Map<number, number>();

  if (mostCommonHeight > EPSILON) {
    stair.solids.forEach((solid) => {
      solid.faces.forEach((face) => {
        face.loops.forEach((loop) => {
          loop.forEach(({ start, end }) => {
            const width = Math.hypot(end.x - start.x, end.y - start.y);

            if (
              width > EPSILON &&
              width >= mostCommonHeight / 3 - EPSILON &&
              width <= mostCommonHeight * 3 + EPSILON
            ) {
              widthCounts.set(width, (widthCounts.get(width) || 0) + 1);
            }
          });
        });
      });
    });
  }

  return widthCounts;
}

export function isStairDepthLargerThan(stairs: Stair[][]): boolean {
  let isValid = false;

  stairs.forEach((group, groupIndex) => {
    console.log(`Stair Group ${groupIndex + 1}:`);

    group.forEach((stair) => {
      const heightCounts = collectHeights(stair);
      const mostCommonHeight = findMostCommon(heightCounts);

      const widthCounts = collectWidths(stair, mostCommonHeight);
      const mostCommonWidth = findMostCommon(widthCounts);

      console.log(`Stair ID: ${stair.id}`);
      console.log(
        `     - Most Common Height: ${mostCommonHeight.toFixed(2)} units`
      );
      console.log(
        `     - Most Common Width: ${mostCommonWidth.toFixed(2)} units`
      );

      if (mostCommonHeight > EPSILON && mostCommonWidth > EPSILON) {
        if (stairEquation(mostCommonHeight, mostCommonWidth)) {
          isValid = true;
        }
      }
    });
  });

  return isValid;
}
