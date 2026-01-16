'use client'

import type { ActiveFilters } from "../filtering/filterConfig";
import { elements, elementSortOrder, weapons, weaponSortOrder, type Artifacts } from "../types";

type Args = {
    artifacts: Artifacts,
    filterOpts: ActiveFilters
}

export default function ArtifactsList({ artifacts, filterOpts }: Args) {
    const sortedArtifacts = Object.entries(artifacts)
        .sort((a, b) => {
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

    console.log(sortedArtifacts)

    return (
        <div className="flex flex-col gap-4">
            {
                Object.entries(elements).map(([_, ele_str]) => (
                    <ElementBlock key={"eb" + ele_str} element={ele_str} artifacts={sortedArtifacts.filter(arti => arti[1].element === ele_str)} />
                ))
            }
        </div>

    )
}

function ElementBlock({ element, artifacts }: { element: string, artifacts: [string, Artifacts[number]][] }) {
    return (
        <details className="flex flex-col collapse border collapse-arrow">
            <summary className="collapse-title">
                <img src={`/Icon_Element_${element}.png`} />
            </summary>
            <div className="collapse-content">
                <div className="flex flex-col gap-4">
                    {
                        Object.entries(weapons).map(([_, wep_str]) => (
                            <WeaponBlock key={"wb" + wep_str} weapon={wep_str} artifacts={artifacts.filter(arti => arti[1].weapon === wep_str)} />
                        ))
                    }
                </div>
            </div>
        </details>

    )
}

function WeaponBlock({ weapon, artifacts }: { weapon: string, artifacts: [string, Artifacts[number]][] }) {
    return (
        <div>
            <img src={`/Label_Weapon_${weapon}.png`} />
            <div className="mt-2">
                {
                    artifacts.map((artifact) => {
                        return (
                            <div key={artifact[0]} className="ml-2 ">
                                <table className="table border border-collapse">
                                    <tbody>
                                        <tr>
                                            <th className="border">
                                                <input type="checkbox" className="checkbox checkbox-error" disabled checked={artifact[1].is_scrap} />
                                            </th>
                                            <td className="border text-clip truncate overflow-scroll">
                                                {artifact[1].s1.name}
                                            </td>
                                            <td className="border text-left">
                                                {artifact[1].s1.value}
                                            </td>
                                            <td className="border text-right truncate overflow-scroll">
                                                {artifact[1].s2.name}
                                            </td>
                                            <td className="border text-left">
                                                {artifact[1].s2.value}
                                            </td>
                                            <td className="border text-right truncate overflow-scroll">
                                                {artifact[1].s3.name}
                                            </td>
                                            <td className="border text-left ">
                                                {artifact[1].s3.value}
                                            </td>
                                            <td className="border text-right truncate overflow-scroll">
                                                {artifact[1].s4.name}
                                            </td>
                                            <td className="border text-left ">
                                                {artifact[1].s4.value}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* <input type="checkbox" className="checkbox checkbox-error" disabled checked={artifact[1].is_scrap} />
                                <div className="text-right overflow-scroll">
                                    {artifact[1].s1.name}
                                </div>
                                <div className="text-left ">
                                    {artifact[1].s1.value}
                                </div>
                                <div className="text-right overflow-scroll">
                                    {artifact[1].s2.name}
                                </div>
                                <div className="text-left">
                                    {artifact[1].s2.value}
                                </div>
                                <div className="text-right overflow-scroll">
                                    {artifact[1].s3.name}
                                </div>
                                <div className="text-left ">
                                    {artifact[1].s3.value}
                                </div>
                                <div className="text-right overflow-scroll">
                                    {artifact[1].s4.name}
                                </div>
                                <div className="text-left ">
                                    {artifact[1].s4.value}
                                </div> */}
                            </div>

                        )
                    })
                }
            </div>
        </div>
    )
}