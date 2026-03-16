/**
 * @deprecated Use imports from "../../api" or "../../api/checkins" instead.
 * This file re-exports from the central API layer.
 */
export {
  getCheckins,
  getCheckin,
  createCheckin,
  updateCheckin,
  deleteCheckin,
} from "./checkins";
export type { GetCheckinsParams } from "./checkins";
