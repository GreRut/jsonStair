import { readStairJson } from "./fileUtils";
import { extractFaceDimensions } from "./extractFaceDimensions";
import { isStairDepthLargerThan } from "./isStairDepthLargerThan";

// Load stairs from JSON
const stairs = readStairJson("stair.json");

if (stairs.length === 0) {
  console.log("No stairs found, exiting.");
  process.exit(1);
}

// Process and analyze stair data
extractFaceDimensions(stairs, "stair_dimensions.txt");
isStairDepthLargerThan(stairs);
