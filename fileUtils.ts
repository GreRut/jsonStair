import * as fs from "fs";
import { isValidStair } from "./typeValidation";
import { Stair } from "./types";

/**
 * Reads and parses a JSON file containing stair data.
 */
export function readStairJson(filePath: string): Stair[][] {
  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    const parsedData = JSON.parse(rawData);

    if (!Array.isArray(parsedData)) {
      throw new Error("Invalid JSON format: Expected an array.");
    }

    const stairObjects: Stair[] = parsedData.map((obj, index) => {
      if (!isValidStair(obj)) {
        throw new Error(
          `Invalid stair at index ${index}: ${JSON.stringify(obj, null, 2)}`
        );
      }
      return obj;
    });

    console.log(`Loaded ${stairObjects.length} stairs from JSON.`);

    const groupedStairs = stairObjects.reduce<Map<string, Stair[]>>(
      (map, stair) => {
        const key = `${stair.boundingBox.min.x},${stair.boundingBox.min.y}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(stair);
        return map;
      },
      new Map()
    );

    console.log(`Grouped into ${groupedStairs.size} stair groups.`);
    return Array.from(groupedStairs.values());
  } catch (error) {
    console.error("Error reading JSON:", error);
    return [];
  }
}
