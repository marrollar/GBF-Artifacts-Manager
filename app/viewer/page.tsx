'use client'
import { useArtifactsJson } from "@/app/components/ArtifactsJsonContext"
import Image from "next/image"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import ArtifactsList from "./components/ArtifactsList"
import { ActiveFilters } from "./filtering/filterConfig"
import type { Artifacts, Element, Weapon } from "./types"
import { elements, weapons } from "./types"
import GroupFilterButton from "./components/GroupFilterButton"

const __default_filter: ActiveFilters = {
    search: "",
    element: null,
    weapon: null

}

export default function ViewerHome() {
    const { jsonData } = useArtifactsJson();
    const [filters, setFilters] = useState<ActiveFilters>(__default_filter);
    const [showSidebar, setShowSidebar] = useState(false);

    function updateFilter<K extends keyof ActiveFilters>(
        key: K,
        value: ActiveFilters[K]
    ) {
        // console.log(key, value, filters)
        if (key === "element" || key === "weapon") {
            if (value === filters[key]) {
                setFilters(prev => ({ ...prev, [key]: null }))
            } else {
                setFilters(prev => ({ ...prev, [key]: value }))
            }
        } else {
            setFilters(prev => ({ ...prev, [key]: value }))
        }
    }

    const handleSearch = useDebouncedCallback((term) => {
        setFilters(prev => ({ ...prev, ["search"]: term }))
    }, 300) // TODO Consider if debouncing is necessary

    const toggleSideBar = () => {
        setShowSidebar(!showSidebar)
    }

    if (!jsonData) {
        return <p className="text-red-500 mt-2">Loading...or json data not found.</p>
    }

    const artifacts: Artifacts = {};
    Object.entries(jsonData).forEach(([id, v]) => {
        const info = JSON.parse(v);

        artifacts[id] = {
            element: info.element,
            weapon: info.weapon_group,
            is_scrap: info.is_scrap,
            s1: {
                id: Math.floor(info.s1.skill_id / 10),
                name: info.s1.name,
                value: info.s1.effect_value,
                quality: info.s1.skill_quality
            },
            s2: {
                id: Math.floor(info.s2.skill_id / 10),
                name: info.s2.name,
                value: info.s2.effect_value,
                quality: info.s2.skill_quality
            },
            s3: {
                id: Math.floor(info.s3.skill_id / 10),
                name: info.s3.name,
                value: info.s3.effect_value,
                quality: info.s3.skill_quality
            },
            s4: {
                id: Math.floor(info.s4.skill_id / 10),
                name: info.s4.name,
                value: info.s4.effect_value,
                quality: info.s4.skill_quality
            },
        }
    })

    return (
        <div className="flex">
            <div className={`flex flex-none flex-col items-center gap-4 bg-base-300 p-4 sticky top-0 ${showSidebar ? "w-120" : "w-10 overflow-hidden"}`}>
                {/* Collapse sidebar button */}
                <button className={`btn btn-square btn-ghost mb-4 absolute hover:bg-neutral-500 ${showSidebar ? "top-4 right-2" : ""}`} onClick={toggleSideBar}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-6 w-6 stroke-current"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </button>

                {/* Clear Filters button */}
                <div className={`flex items-center justify-center ${!showSidebar ? "hidden" : ""}`}>
                    <button className="btn hover:bg-red-400" onClick={() => setFilters(__default_filter)}> Clear Filters </button>
                </div>

                {/* Search bar */}
                <label className={`input ${!showSidebar ? "hidden" : ""}`}>
                    <input type="search" placeholder="Search" onChange={(e) => { handleSearch(e.target.value) }}></input>
                </label>

                {/* Elements filter */}
                <div className={`flex items-center justify-center gap-2 h-[30px] ${!showSidebar ? "hidden" : ""}`}>
                    {
                        Object.entries(elements).map(([key, value]) => (
                            <button key={key} className={`btn p-0.5 hover:bg-neutral-500 ${filters.element === value ? "bg-accent" : ""}`} onClick={() => updateFilter("element", value)}>
                                <img className="h-[30px]" src={`/Icon_Element_${value}.png`} />
                            </button>
                        ))
                    }
                </div>
                {/* Weapons filter */}
                <div className={`flex flex-wrap items-center justify-center gap-2 h-[60px] ${!showSidebar ? "hidden" : ""}`}>
                    {
                        Object.entries(weapons).map(([key, value]) => (
                            <button key={key} className={`hover:bg-neutral-500 hover:cursor-pointer rounded-md p-0.5 ${filters.weapon === value ? "bg-accent" : ""}`} onClick={() => updateFilter("weapon", value)}>
                                <img className="h-[20px]" src={`/Label_Weapon_${value}.png`} />
                            </button>
                        ))
                    }
                </div>

                {/* Skill Group 1 Filters */}
                <div className={`flex flex-col border p-2 ${!showSidebar ? "hidden" : ""}`}>
                    <div className="self-center font-bold">
                        Skill Group 1 Filters
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        <GroupFilterButton>
                            ATK
                        </GroupFilterButton>
                        <GroupFilterButton>
                            HP
                        </GroupFilterButton>
                        <GroupFilterButton>
                            C.A. DMG
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Skill DMG
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Elemental ATK
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Critical Hit Rate
                        </GroupFilterButton>
                        <GroupFilterButton>
                            D.A. Rate
                        </GroupFilterButton>
                        <GroupFilterButton>
                            T.A. Rate
                        </GroupFilterButton>
                        <GroupFilterButton>
                            DEF
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Superior Element Reduction
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Dodge Rate
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Healing
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Debuff Success Rate
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Debuff Resistance
                        </GroupFilterButton>
                    </div>
                </div>

                {/* Skill Group 2 Filters */}
                <div className={`flex flex-col border p-2 ${!showSidebar ? "hidden" : ""}`}>
                    <div className="self-center font-bold">
                        Skill Group 2 Filters
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                        <div className="flex flex-col gap-1">
                            <GroupFilterButton>
                                N.A. Cap
                            </GroupFilterButton>
                            <GroupFilterButton>
                                Skill Cap
                            </GroupFilterButton>
                            <GroupFilterButton>
                                C.A. Cap
                            </GroupFilterButton>
                            <GroupFilterButton>
                                SP C.A. Cap
                            </GroupFilterButton>
                        </div>
                        <div className="flex flex-col gap-1">
                            <GroupFilterButton >
                                N.A. Trade
                            </GroupFilterButton>
                            <GroupFilterButton >
                                Skill Trade
                            </GroupFilterButton>
                            <GroupFilterButton >
                                C.A. Trade
                            </GroupFilterButton>
                        </div>
                        <div className="flex flex-col gap-1">
                            <GroupFilterButton>
                                N.A. Supp
                            </GroupFilterButton>
                            <GroupFilterButton>
                                Skill Supp
                            </GroupFilterButton>
                            <GroupFilterButton>
                                C.A. Supp
                            </GroupFilterButton>
                        </div>
                        <div className="flex flex-col gap-1">
                            <GroupFilterButton>
                                Crit Amp
                            </GroupFilterButton>
                            <GroupFilterButton>
                                C.B. Amp
                            </GroupFilterButton>
                            <GroupFilterButton>
                                Amp at 100% HP
                            </GroupFilterButton>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                        <GroupFilterButton>
                            TA while above 50% HP
                        </GroupFilterButton>
                        <GroupFilterButton>
                            HP Boost, 70% DEF cut
                        </GroupFilterButton>
                        <GroupFilterButton>
                            DR at/below 50% HP
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Regeneration
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Turn-Based DMG Reduction
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Chance to Dispel
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Chance to Dispel Cancel
                        </GroupFilterButton>
                    </div>
                </div>

                {/* Skill Group 3 Filters */}
                <div className={`flex flex-col border p-2 ${!showSidebar ? "hidden" : ""}`}>
                    <div className="self-center font-bold">
                        Skill Group 3 Filters
                    </div>
                    <div className="flex flex-col gap-1">
                        <GroupFilterButton>
                            Battle Start: DMG Mitigation with value of x
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Battle Start: Gain x random buff(s)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Battle Start: 20% HP Cut, x% DMG Cap after 3 turns
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On KO: All allies gain x random buff(s)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On Swap to Main: x% DMG Amp
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On foe 50% HP: Restore equipper's HP by x
                        </GroupFilterButton>

                        <GroupFilterButton>
                            On casting 1st-slot skill: Cut 1st-slot skill cd by 1, cut x% HP
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On using debuff skill: Apply x% DMG Taken Amplified (2 hits)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On using healing skill: Ally in the next position gains x% Bonus DMG (1 time)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Each 10 skills used: Gain 1% DMG Cap Up (Stackable / Max 5%)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On using skill w/ 10 or more cd: Gain x% DMG Amp
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Cut linked skill cds by 1 after using a linked skill x times
                        </GroupFilterButton>

                        <GroupFilterButton>
                            At EoT: Gain Supplemental DMG based on amount of charge bar spent that turn
                        </GroupFilterButton>
                        <GroupFilterButton>
                            At Eot: If equipper didn't attack, gain random buff(s)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            At Eot: Chance to Dispel all buffs from foe
                        </GroupFilterButton>
                        <GroupFilterButton>
                            At Eot: Chance to progress turn count by 5
                        </GroupFilterButton>

                        <GroupFilterButton>
                            Battle Start & every 5 turns: Gain Shield with value of x
                        </GroupFilterButton>
                        <GroupFilterButton >
                            Chance to gain Flurry (6-hit / 1 time) before attacking
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Gain 20% Bonus DMG (1 time) after being targeted by foes' attacks x time(s)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Gain Flurry (3-hit / 1 time) after hitting a foe x times
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Plain DMG to a foe at EoT based on how much HP the equipper lost that turn
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Gain Supplemental Skill DMG (Stackable / Max: 50,000) after dealing this amount of skill DMG
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On Single attacks: Gain x random buff(s)
                        </GroupFilterButton>
                        <GroupFilterButton>
                            On using a green or blue potion: Boost FC bar by x
                        </GroupFilterButton>
                        <GroupFilterButton>
                            When a foe has 3 or fewer buffs at turn start: Gain x% Armored
                        </GroupFilterButton>

                        <GroupFilterButton>
                            When sub ally: 1 random debuff to all foes every x turns
                        </GroupFilterButton>

                        <GroupFilterButton>
                            Boost EXP earned by x
                        </GroupFilterButton>
                        <GroupFilterButton>
                            Boost item drop rate by x
                        </GroupFilterButton>
                        <GroupFilterButton>
                            At EOT: Chance to find earrings
                        </GroupFilterButton>
                    </div>
                </div>
            </div>
            <div className="flex grow flex-col min-w-0 max-w-full m-4 ">
                <ArtifactsList artifacts={artifacts} filterOpts={filters} />
            </div>
        </div>
    )
}