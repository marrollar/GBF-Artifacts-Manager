'use client'

import type { ActiveFilters } from "../filtering/filterConfig";
import { elements, elementSortOrder, weapons, weaponSortOrder, type Artifacts } from "../types";
import { NameRow, ValueRow } from "./ArtifactRows";
import React from "react";

type Props = {
    artifacts: Artifacts,
    filterOpts: ActiveFilters
}

function filterLogic(artifact: [string, Artifacts[number]], filterOpts: ActiveFilters) {
    const artiData = artifact[1];
    const eleFilter = filterOpts.element;
    const wepFilter = filterOpts.weapon

    if ((eleFilter.size === 0 || eleFilter.has(artiData.element)) &&
        (wepFilter.size === 0 || wepFilter.has(artiData.weapon))) {
        return true
    }

    return false

}

export default function ArtifactsList({ artifacts, filterOpts }: Props) {
    console.log(filterOpts)
    var filteredArtifacts = Object.entries(artifacts).filter(arti => filterLogic(arti, filterOpts))

    for(var i = 0; i < filteredArtifacts.length; i++) {
        const s1 = filteredArtifacts[i][1].s1
        const s2 = filteredArtifacts[i][1].s2
        // console.log(filteredArtifacts[i][1])
        if (s2.id < s1.id) {
            filteredArtifacts[i][1].s1 = s2
            filteredArtifacts[i][1].s2 = s1
        }
        // console.log(filteredArtifacts[i][1])
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
        <div className="flex flex-col gap-4">
            {
                Object.entries(elements).map(([_, ele_str]) => {
                    const relevantArtis = sortedArtifacts.filter(arti => arti[1].element === ele_str)

                    if (relevantArtis.length > 0) {
                        return <ElementBlock key={"eb" + ele_str} element={ele_str} artifacts={relevantArtis} />
                    }
                    return <React.Fragment key={"eb" + ele_str} />
                })
            }
        </div>

    )
}

function ElementBlock({ element, artifacts }: { element: string, artifacts: [string, Artifacts[number]][] }) {
    return (
        <details className="flex flex-col collapse border collapse-arrow">
            <summary className="collapse-title">
                <div className="flex items-center gap-4">
                    <img src={`/Icon_Element_${element}.png`} />
                    Count: {artifacts.length}
                </div>
            </summary>
            <div className="collapse-content">
                <div className="flex flex-col gap-4">
                    {
                        Object.entries(weapons).map(([_, wep_str]) => {
                            const relevantArtis = artifacts.filter(arti => arti[1].weapon === wep_str)

                            if (relevantArtis.length > 0) {
                                return <WeaponBlock key={"wb" + wep_str} weapon={wep_str} artifacts={relevantArtis} />
                            }
                            return <React.Fragment key={"wb" + wep_str} />
                        })
                    }
                </div>
            </div>
        </details>

    )
}

function WeaponBlock({ weapon, artifacts }: { weapon: string, artifacts: [string, Artifacts[number]][] }) {
    return (
        <details className="collapse collapse-arrow">
            <summary className="collapse-title ">
                <div className="flex items-center gap-4">
                    <img src={`/Label_Weapon_${weapon}.png`} />
                    Count: {artifacts.length}
                </div>
            </summary>
            <div className="collapse-content">
                <div className="flex flex-col ml-2 mt-2">
                    <div className="h-full grid grid-cols-4 auto-rows-fr grid-flow-col ">
                        {
                            artifacts.map((artifact) => {
                                return (
                                    <div key={artifact[0]} className="col-span-full grid grid-rows-[2fr_1fr] grid-cols-[50px_1fr_1fr_1fr_1fr] h-20 items-center">
                                        <img src={`/Label_Weapon_${weapon}.png`} />
                                        <NameRow>
                                            {artifact[1].s1.name + artifact[1].s1.id}
                                        </NameRow>
                                        <NameRow>
                                            {artifact[1].s2.name + artifact[1].s2.id}
                                        </NameRow>
                                        <NameRow>
                                            {artifact[1].s3.name}
                                        </NameRow>
                                        <NameRow last={true}>
                                            {artifact[1].s4.name}
                                        </NameRow>
                                        <div className="justify-self-center align-self-center pb-[12px]">
                                            <input type="checkbox" className="checkbox checkbox-error" disabled checked={artifact[1].is_scrap} />
                                        </div>
                                        <ValueRow>
                                            {artifact[1].s1.value}
                                        </ValueRow>
                                        <ValueRow>
                                            {artifact[1].s2.value}
                                        </ValueRow>
                                        <ValueRow>
                                            {artifact[1].s3.value}
                                        </ValueRow>
                                        <ValueRow last={true}>
                                            {artifact[1].s4.value}
                                        </ValueRow >
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </details>

    )
}