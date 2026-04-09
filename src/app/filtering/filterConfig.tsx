import type { Element, Weapon } from "../types";
import type { FilterDefinition } from "./filters";

export const FILTERS = [
  {
    type: "text",
    key: "search",
    label: "Search",
  },
  {
    type: "select",
    key: "sk1Search",
    label: "Skill Group 1",
    options: new Set<string>(),
  },
  {
    type: "select",
    key: "sk2Search",
    label: "Skill Group 2",
    options: new Set<string>(),
  },
  {
    type: "select",
    key: "sk3Search",
    label: "Skill Group 3",
    options: new Set<string>(),
  },
  {
    type: "select",
    key: "element",
    label: "Element",
    options: new Set<Element>(),
  },
  {
    type: "select",
    key: "weapon",
    label: "Weapon",
    options: new Set<Weapon>(),
  },
  {
    type: "toggle",
    key: "filterFavorite",
    label: "Favorite",
  },
  {
    type: "toggle",
    key: "filterQuirk",
    label: "Quirk",
  },
  {
    type: "toggle",
    key: "filterScrap",
    label: "Scrap",
  },
] as const satisfies readonly FilterDefinition[];

type TextNarrowing = Extract<FilterDefinition, { type: "text" }>;
type SelectNarrowing = Extract<FilterDefinition, { type: "select" }>;
type ToggleNarowing = Extract<FilterDefinition, { type: "toggle" }>;
type FilterValue<T extends FilterDefinition> = T extends TextNarrowing
  ? string
  : T extends SelectNarrowing
    ? T["options"]
    : T extends ToggleNarowing
      ? boolean
      : never;

export type ActiveFilters = {
  [F in (typeof FILTERS)[number] as F["key"]]: FilterValue<F>;
};
export type FilterInputs = {
  [K in keyof ActiveFilters]: ActiveFilters[K] extends Set<infer U> ? U : ActiveFilters[K];
};
