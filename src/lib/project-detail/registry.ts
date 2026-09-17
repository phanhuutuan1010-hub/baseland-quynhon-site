import type { ProjectDetailData } from "./types";
import { QTERRA_PROJECT } from "./qterra";
import { THE_SAILING_PROJECT } from "./the-sailing";
import { SIMONA_HEIGHTS_PROJECT } from "./simona";
import { PHU_GIA_ROYAL_PARK_PROJECT } from "./phu-gia";

/**
 * Every project detail page is registered here by slug. Adding a new
 * project = adding a new ProjectDetailData object (in its own file, for
 * readability) and one line here — no route or component changes needed.
 */
export const PROJECTS: Record<string, ProjectDetailData> = {
  [QTERRA_PROJECT.slug]: QTERRA_PROJECT,
  [THE_SAILING_PROJECT.slug]: THE_SAILING_PROJECT,
  [SIMONA_HEIGHTS_PROJECT.slug]: SIMONA_HEIGHTS_PROJECT,
  [PHU_GIA_ROYAL_PARK_PROJECT.slug]: PHU_GIA_ROYAL_PARK_PROJECT,
};

export function getProjectBySlug(slug: string): ProjectDetailData | undefined {
  return PROJECTS[slug];
}
