/**
 * Validates step dimensions based on height (t) and depth (r).
 * All dimensions in cm.
 *
 * @param stepHeight - riser(@param r)
 * @param stepDepth - thread (@param t)
 *
 * @param minR = 25 indoors because of 8:232 Trappor, ramper och balkonger BBR (current edition BBR 31)
 * @param maxT = 18 because of 44§ AFS 2020:1, BBR 8:232 points to this section
 * @param minSum and @param maxSum because of Blondel Formula for Stair Ergonomy 2*riser + thread = between 620 and 630 mm,
 *                                 strict control for @param minSum = 620 && @param maxSum 630
 * @param maxR = 30 because of SIS 911101 where the riser depth should be between 250-300 mm
 * @param stepProductionSize = 0.5 tolerance for stair fabrication, change the value to 0.1 to find suboptimal solutions
 */

export function stairEquation(
  stepDepth: number, // t
  stepHeight: number // r
): boolean {
  const minT: number = 15,
    maxT: number = 18,
    minR: number = 25,
    maxR: number = 30,
    minSum: number = 60,
    maxSum: number = 65;
  const proportion: number = stepHeight / stepDepth;
  const stepSize: number = 0.5;

  let foundValid: boolean = false;

  for (let t = minT; t <= maxT; t += stepSize) {
    const r = t * proportion;
    if (r >= minR && r <= maxR && 2 * t + r >= minSum && 2 * t + r <= maxSum) {
      console.log(
        `Valid (from t-loop): t = ${t.toFixed(2)} cm, r = ${r.toFixed(2)} cm`
      );
      foundValid = true;
    }
  }

  for (let r = minR; r <= maxR; r += stepSize) {
    const t = r / proportion;
    if (t >= minT && t <= maxT && 2 * t + r >= minSum && 2 * t + r <= maxSum) {
      console.log(
        `Valid (from r-loop): t = ${t.toFixed(2)} cm, r = ${r.toFixed(2)} cm`
      );
      foundValid = true;
    }
  }
  return foundValid;
}
