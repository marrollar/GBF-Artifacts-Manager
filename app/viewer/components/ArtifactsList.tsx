'use client'

import { useArtifactsJson } from "@/app/components/ArtifactsJsonContext";
import type { Artifacts, Elements, FilterOpts } from "@/app/viewer/page"

type Args = {
    artifacts: Artifacts,
    filterOpts: FilterOpts
}

export default function ArtifactsList({ artifacts, filterOpts }: Args) {
    
}