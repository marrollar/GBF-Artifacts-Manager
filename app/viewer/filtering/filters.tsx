import type { Element, Weapon } from "../types";

export type FilterDefinition =
    | {
        type: "text";
        key: "search";
        label: string;
    }
    | {
        type: "select";
        key: "element";
        label: string;
        options: readonly Element[];
    }
    | {
        type: "select";
        key: "weapon";
        label: string;
        options: readonly Weapon[];
    }