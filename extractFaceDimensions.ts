import * as fs from "fs";
import { Stair } from "./types";

const EPSILON = 1e-4;

/**
 * Extracts face dimensions (horizontal & vertical) from stair data and saves them to a file.
 *
 * @param stairs - Grouped stair data
 * @param outputFilePath - Path to save the extracted data
 */

export function extractFaceDimensions(
  stairs: Stair[][],
  outputFilePath: string
): void {
  let output = "";

  stairs.forEach((stairGroup, groupIndex) => {
    output += `\nStair Group ${groupIndex + 1}:\n`;

    stairGroup.forEach((stair) => {
      output += `  Stair ID: ${stair.id}\n`;

      stair.solids.forEach((solid, solidIndex) => {
        output += `    Solid ${solidIndex + 1}:\n`;

        solid.faces.forEach((face, faceIndex) => {
          const dimensions = face.loops.flatMap((loop) =>
            loop.map(({ start, end }) => {
              const horizontal = Math.hypot(end.x - start.x, end.y - start.y);
              const vertical = Math.abs(end.z - start.z);

              return {
                horizontal: horizontal < EPSILON ? 0 : horizontal,
                vertical: vertical < EPSILON ? 0 : vertical,
              };
            })
          );

          output += `      Face ${faceIndex + 1}:\n${dimensions
            .map(
              (dim) =>
                `      Horizontal: ${dim.horizontal}, Vertical: ${dim.vertical}`
            )
            .join("\n")}\n`;
        });
      });
    });
  });

  fs.writeFileSync(outputFilePath, output, "utf-8");
  console.log(`Face dimensions saved to ${outputFilePath}`);
}
