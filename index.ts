import { readStairJson } from "./fileUtils";
import { extractFaceDimensions } from "./extractFaceDimensions";
import { isStairDepthLargerThan } from "./isStairDepthLargerThan";

const stairs = readStairJson("stair.json");

if (stairs.length === 0) {
  process.exit(1);
}

extractFaceDimensions(stairs, "stair_dimensions.txt");
isStairDepthLargerThan(stairs);
