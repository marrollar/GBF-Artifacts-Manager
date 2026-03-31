'use client'

import React from "react";
import type { ActiveFilters } from "../filtering/filterConfig";
import { elementSortOrder, weapons, weaponSortOrder, type Artifacts } from "../types";
import { ArtifactSkillColumn } from "./ArtifactRows";

type Props = {
    artifacts: Artifacts,
    filterOpts: ActiveFilters
}

function filterLogic(artifact: [string, Artifacts[number]], filterOpts: ActiveFilters) {
    const artiData = artifact[1];
    const search = filterOpts.search;
    const sk1Filter = filterOpts.sk1Search;
    const sk2Filter = filterOpts.sk2Search;
    const sk3Filter = filterOpts.sk3Search;
    const eleFilter = filterOpts.element;
    const wepFilter = filterOpts.weapon

    if ((sk1Filter.size === 0 || sk1Filter.has(artiData.s1.name)) &&
        (sk2Filter.size === 0 || sk2Filter.has(artiData.s2.name)) &&
        (sk3Filter.size === 0 || sk3Filter.has(artiData.s3.name)) &&
        (eleFilter.size === 0 || eleFilter.has(artiData.element)) &&
        (wepFilter.size === 0 || wepFilter.has(artiData.weapon))
    ) {
        return true
    }

    return false

}

export default function ArtifactsList({ artifacts, filterOpts }: Props) {
    var filteredArtifacts = Object.entries(artifacts).filter(arti => filterLogic(arti, filterOpts))

    for (var i = 0; i < filteredArtifacts.length; i++) {
        const s1 = filteredArtifacts[i][1].s1
        const s2 = filteredArtifacts[i][1].s2

        if (s2.id < s1.id) {
            filteredArtifacts[i][1].s1 = s2
            filteredArtifacts[i][1].s2 = s1
        }
    }

    const sortedArtifacts = filteredArtifacts
        .sort((a, b) => {
            // if (a[1].s2.name < a[1].s1.name) {
            //     a[1].s1, a[1].s2 = a[1].s2, a[1].s1
            // }

            // if (b[1].s2.name < b[1].s1.name) {
            //     b[1].s1, b[1].s2 = b[1].s2, b[1].s1
            // }

            const a_elemOrd = elementSortOrder.get(a[1].element);
            const b_elemOrd = elementSortOrder.get(b[1].element);

            if (a_elemOrd !== b_elemOrd) return (a_elemOrd ?? Infinity) - (b_elemOrd ?? Infinity)

            const a_wepOrd = weaponSortOrder.get(a[1].weapon);
            const b_wepOrd = weaponSortOrder.get(b[1].weapon)

            if (a_wepOrd !== b_wepOrd) return (a_wepOrd ?? Infinity) - (b_wepOrd ?? Infinity)

            const a_skillIds = [a[1].s1.id, a[1].s2.id, a[1].s3.id, a[1].s4.id]
            const b_skillIds = [b[1].s1.id, b[1].s2.id, b[1].s3.id, b[1].s4.id]

            for (let i = 0; i < a_skillIds.length; i++) {
                if (a_skillIds[i] < b_skillIds[i]) return -1;
                if (a_skillIds[i] > b_skillIds[i]) return 1;
            }

            const a_skillVals = [a[1].s1.value, a[1].s2.value, a[1].s3.value, a[1].s4.value]
            const b_skillVals = [b[1].s1.value, b[1].s2.value, b[1].s3.value, b[1].s4.value]

            for (let i = 0; i < a_skillIds.length; i++) {
                if (a_skillVals[i] < b_skillVals[i]) return -1;
                if (a_skillVals[i] > b_skillVals[i]) return 1;
            }

            return 0
        })

    return (
        <div className="flex flex-col gap-2">
            {
                Object.entries(sortedArtifacts).map(([id, artifact]) => {
                    const artiInfo = artifact[1]
                    return (
                        <div key={id} className="flex gap-1 h-[40px] items-center">
                            <input type="checkbox" className="checkbox checkbox-error" disabled checked={artifact[1].is_scrap} />
                            <img src={`/Icon_Element_${artiInfo.element}.png`} className="flex-none w-[25px] h-auto object-contain" />
                            <img src={`/Label_Weapon_${artiInfo.weapon}.png`} className="flex-none w-[50px] h-auto object-contain" />
                            <div className="flex h-full w-full">
                                <ArtifactSkillColumn name={artiInfo.s1.name} value={artiInfo.s1.value} />
                                <ArtifactSkillColumn name={artiInfo.s2.name} value={artiInfo.s2.value} />
                                <ArtifactSkillColumn name={artiInfo.s3.name} value={artiInfo.s3.value} />
                                <ArtifactSkillColumn name={artiInfo.s4.name} value={artiInfo.s4.value} />
                            </div>
                        </div>
                    )
                })
            }
        </div>

    )
}