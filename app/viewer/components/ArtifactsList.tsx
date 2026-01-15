'use client'

import type { ActiveFilters } from "../filtering/filterConfig";
import type { Artifacts } from "../types";

type Args = {
    artifacts: Artifacts,
    filterOpts: ActiveFilters
}

export default function ArtifactsList({ artifacts, filterOpts }: Args) {
    return (
        <>
            {Object.values(filterOpts)}
        </>
    )
}