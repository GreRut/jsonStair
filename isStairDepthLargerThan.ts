import { Stair } from "./types";
import { stairEquation } from "./stairEquation";

/**
 * Small tolerance value to handle floating-point precision issues.
 */
const EPSILON = 1e-6;

/**
 * Determines if any stair in the given groups meets the depth condition.
 *
 * @param stairs - Grouped stair data.
 * @returns boolean - Whether any stair meets the depth condition.
 */
export function isStairDepthLargerThan(stairs: Stair[][]): boolean {
  let isValid: boolean = false;

  for (let groupIndex = 0; groupIndex < stairs.length; groupIndex++) {
    console.log(`Stair Group ${groupIndex + 1}:`);

    for (const stair of stairs[groupIndex]) {
      const heightCounts = new Map<number, number>();
      const widthCounts = new Map<number, number>();

      // Step 1: Collect step heights
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

      // Find the most common height
      let mostCommonHeight = 0;
      let maxHeightCount = 0;
      heightCounts.forEach((count, height) => {
        if (count > maxHeightCount) {
          mostCommonHeight = height;
          maxHeightCount = count;
        }
      });

      // Step 2: Collect step widths (only if we found a valid height)
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

      // Find the most common width
      let mostCommonWidth = 0;
      let maxWidthCount = 0;
      widthCounts.forEach((count, width) => {
        if (count > maxWidthCount) {
          mostCommonWidth = width;
          maxWidthCount = count;
        }
      });

      // Logging results for debugging
      console.log(`Stair ID: ${stair.id}`);
      console.log(
        `     - Most Common Height: ${mostCommonHeight.toFixed(2)} units`
      );
      console.log(
        `     - Most Common Width: ${mostCommonWidth.toFixed(2)} units`
      );

      // Validate stair dimensions if valid values were found
      if (mostCommonHeight > EPSILON && mostCommonWidth > EPSILON) {
        if (stairEquation(mostCommonHeight, mostCommonWidth)) {
          isValid = true;
        }
      }
    }
  }

  return isValid;
}
