import { Element, Weapon } from "../types";
import type { FilterDefinition } from "./filters";

export const FILTERS = [
    {
        type: "text",
        key: "search",
        label: "Search"
    },
    {
        type: "select",
        key: "element",
        label: "Element",
        options: Object.values(Element)
    },
    {
        type: "select",
        key: "weapon",
        label: "Weapon",
        options: Object.values(Weapon)
    }
] as const satisfies readonly FilterDefinition[];

type TextNarrowing = Extract<FilterDefinition, { type: "text" }>;
type SelectNarrowing = Extract<FilterDefinition, { type: "select" }>;
type FilterValue<T extends FilterDefinition> =
    T extends TextNarrowing
    ? string
    : T extends SelectNarrowing
    ? T["options"][number] | null
    : never

export type ActiveFilters = {
    [F in (typeof FILTERS)[number]as F["key"]]: FilterValue<F>;
}