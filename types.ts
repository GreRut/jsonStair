export type Point = { x: number; y: number; z: number };
export type Line = { start: Point; end: Point };
export type BoundingBox = { min: Point; max: Point };
export type Face = { loops: Line[][] };
export type Solid = { faces: Face[] };
export type Stair = {
  id: string;
  name: string;
  boundingBox: BoundingBox;
  solids: Solid[];
};
