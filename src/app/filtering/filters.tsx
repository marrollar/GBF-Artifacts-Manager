import type { Element, Weapon } from "../types";

export type FilterDefinition =
    | {
        type: "text";
        key: "search";
        label: string;
    }
    | {
        type: "select";
        key:"sk1Search";
        label:string;
        options:Set<string>;  
    }
    | {
        type: "select";
        key:"sk2Search";
        label:string;
        options:Set<string>;  
    }
    | {
        type: "select";
        key:"sk3Search";
        label:string;
        options:Set<string>;  
    }
    | {
        type: "select";
        key: "element";
        label: string;
        options: Set<Element>;
    }
    | {
        type: "select";
        key: "weapon";
        label: string;
        options: Set<Weapon>;
    }
    | {
        type:"toggle";
        key:"filterFavorite";
        label:string;
    }
    | {
        type:"toggle";
        key:"filterQuirk";
        label:string;
    }
    | {
        type:"toggle";
        key:"filterScrap";
        label:string;
    }