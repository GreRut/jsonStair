import { Stair, BoundingBox, Solid, Face, Line, Point } from "./types";

function isValidPoint(obj: unknown): obj is Point {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "x" in obj &&
    "y" in obj &&
    "z" in obj &&
    typeof (obj as Point).x === "number" &&
    typeof (obj as Point).y === "number" &&
    typeof (obj as Point).z === "number"
  );
}

function isValidLine(obj: unknown): obj is Line {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "start" in obj &&
    "end" in obj &&
    isValidPoint((obj as Line).start) &&
    isValidPoint((obj as Line).end)
  );
}

function isValidBoundingBox(obj: unknown): obj is BoundingBox {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "min" in obj &&
    "max" in obj &&
    isValidPoint((obj as BoundingBox).min) &&
    isValidPoint((obj as BoundingBox).max)
  );
}

function isValidFace(obj: unknown): obj is Face {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "loops" in obj &&
    Array.isArray((obj as Face).loops) &&
    (obj as Face).loops.every(
      (loop) => Array.isArray(loop) && loop.every(isValidLine)
    )
  );
}

function isValidSolid(obj: unknown): obj is Solid {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "faces" in obj &&
    Array.isArray((obj as Solid).faces) &&
    (obj as Solid).faces.every(isValidFace)
  );
}

export function isValidStair(obj: unknown): obj is Stair {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "boundingBox" in obj &&
    "solids" in obj &&
    typeof (obj as Stair).id === "string" &&
    typeof (obj as Stair).name === "string" &&
    isValidBoundingBox((obj as Stair).boundingBox) &&
    Array.isArray((obj as Stair).solids) &&
    (obj as Stair).solids.every(isValidSolid)
  );
}
