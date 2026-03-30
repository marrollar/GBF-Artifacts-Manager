'use client'
import { useArtifactsJson } from "@/app/components/ArtifactsJsonContext"
import { useState } from "react"
import { Group, Panel, Separator, usePanelCallbackRef } from "react-resizable-panels"
import { useDebouncedCallback } from "use-debounce"
import ArtifactsList from "./components/ArtifactsList"
import ClearFilterButton from "./components/ClearFilterButton"
import FilterGroup from "./components/FilterGroup"
import { ActiveFilters, FilterInputs } from "./filtering/filterConfig"
import type { Artifacts, Element, Weapon } from "./types"
import { elements, SK1_NAMES, SK2_NAMES, SK3_NAMES, weapons } from "./types"

const __default_filter: ActiveFilters = {
    search: "",
    sk1Search: new Set<string>,
    sk2Search: new Set<string>,
    sk3Search: new Set<string>,
    element: new Set<Element>,
    weapon: new Set<Weapon>

}

export type FilterHandlers = {
    [K in keyof FilterInputs]: (value: FilterInputs[K]) => void;
}

const __SIDEBAR = {
    collapsedSize: 40,
    minSize: 100,
    defaultSize: "35%"
}



export default function ViewerHome() {
    const { jsonData } = useArtifactsJson();
    const [filters, setFilters] = useState<ActiveFilters>(__default_filter);
    const [rr, toggleReRender] = useState(false);
    const [sidebarIsShown, setShowSidebar] = useState(false);
    const [sidebarPanelRef, setSidebarPanelRef] = usePanelCallbackRef();

    const filterHandlers: FilterHandlers = {
        search: (value) => {
            setFilters(prev => ({ ...prev, ["search"]: value }))
        },
        sk1Search: (value) => {
            if (filters["sk1Search"].has(value)) {
                filters["sk1Search"].delete(value)
            } else {
                filters["sk1Search"].add(value)
            }
            toggleReRender(!rr);
        },
        sk2Search: (value) => {
            if (filters["sk2Search"].has(value)) {
                filters["sk2Search"].delete(value)
            } else {
                filters["sk2Search"].add(value)
            }
            toggleReRender(!rr);
        },
        sk3Search: (value) => {
            if (filters["sk3Search"].has(value)) {
                filters["sk3Search"].delete(value)
            } else {
                filters["sk3Search"].add(value)
            }
            toggleReRender(!rr);
        },
        element: (value) => {
            const castedValue = value as Element;
            if (filters["element"].has(castedValue)) {
                filters["element"].delete(castedValue)
            } else {
                filters["element"].add(castedValue)
            }
            toggleReRender(!rr);
        },
        weapon: (value) => {
            const castedValue = value as Weapon;
            if (filters["weapon"].has(castedValue)) {
                filters["weapon"].delete(castedValue)
            } else {
                filters["weapon"].add(castedValue)
            }
            toggleReRender(!rr);
        }
    }

    function filterUpdater<K extends keyof ActiveFilters>(key: K) {
        return (value: FilterInputs[K]) => {
            filterHandlers[key](value);
        };
    }

    const showSidebar = () => {
        setShowSidebar(true)
        sidebarPanelRef?.resize(__SIDEBAR.defaultSize)
    }

    const onPanelResize = () => {
        if (sidebarPanelRef?.isCollapsed()) {
            setShowSidebar(false)
        } else {
            setShowSidebar(true)
        }
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
        <div className="h-screen">
            <Group>
                <Panel collapsible collapsedSize={__SIDEBAR.collapsedSize} minSize={__SIDEBAR.minSize} defaultSize={__SIDEBAR.defaultSize} className="bg-base-300 p-2" panelRef={setSidebarPanelRef} onResize={onPanelResize}>
                    {/* Show sidebar button */}
                    <button className={`btn btn-square btn-ghost bg-base-100 w-[30px] h-[30px] hover:bg-neutral-500 ${sidebarIsShown ? "hidden" : ""}`} onClick={showSidebar}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-6 w-6 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M4 6 h16 M4 12 h16 M4 18 h16"
                            ></path>
                        </svg>
                    </button>
                    <div className="flex flex-col items-center gap-2 pr-6">
                        <div className={`flex flex-col items-center gap-2 ${!sidebarIsShown ? "hidden" : ""}`}>
                            {/* Clear Filters button */}
                            <div className={`flex items-center justify-center `}>
                                <button className="btn bg-base-100 hover:bg-red-400 h-7" onClick={() => setFilters(__default_filter)}> Clear Filters </button>
                            </div>

                            {/* Search bar */}
                            <label className={`input`}>
                                <input type="search" placeholder="Search" onChange={(e) => { filterUpdater("search")(e.target.value) }}></input>
                            </label>

                            {/* Elements filter */}
                            <div className="flex gap-2">
                                <div className={`flex items-center gap-2 h-[50px] overflow-auto`}>
                                    {
                                        Object.entries(elements).map(([key, value]) => (
                                            <button key={key} className={`flex-none p-0.5 hover:bg-neutral-500 hover:cursor-pointer rounded-md ${filters["element"].has(value as Element) ? "bg-accent" : ""}`} onClick={() => filterUpdater("element")(value)}>
                                                <img className="w-[30px] h-[30px]" src={`/Icon_Element_${value}.png`} />
                                            </button>
                                        ))
                                    }
                                </div>
                                <div className={`flex items-center`}>
                                    {/* TODO: Implement filter clearing */}
                                    <ClearFilterButton onClick={() => { console.warn("UNIMPLEMENTED ELEMENT TRASH") }} />
                                </div>
                            </div>


                            {/* Weapons filter */}
                            <div className="flex gap-2">
                                <div className="flex overflow-auto">
                                    <div className="flex-none grid grid-flow-row grid-rows-2 grid-cols-5 overflow-auto pb-2">
                                        {
                                            Object.entries(weapons).map(([key, value]) => (
                                                <button key={key} className={`p-0.5 hover:bg-neutral-500 hover:cursor-pointer rounded-md  ${filters["weapon"].has(value as Weapon) ? "bg-accent" : ""}`} onClick={() => filterUpdater("weapon")(value)}>
                                                    <img className="h-[20px]" src={`/Label_Weapon_${value}.png`} />
                                                </button>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className={`flex items-center pb-2`}>
                                    {/* TODO: Implement filter clearing */}
                                    <ClearFilterButton onClick={() => { console.warn("UNIMPLEMENTED WEAPON TRASH") }} />
                                </div>
                            </div>


                            {/* Skill Group 1 Filters */}
                            <FilterGroup showSidebar={sidebarIsShown} btnNames={SK1_NAMES} inpPlaceholder="Skill Group 1 Search" selectedSkillsUpdater={filterUpdater("sk1Search")} />

                            {/* Skill Group 2 Filters */}
                            <FilterGroup showSidebar={sidebarIsShown} btnNames={SK2_NAMES} inpPlaceholder="Skill Group 2 Search" selectedSkillsUpdater={filterUpdater("sk2Search")} />

                            {/* Skill Group 3 Filters */}
                            <FilterGroup showSidebar={sidebarIsShown} btnNames={SK3_NAMES} inpPlaceholder="Skill Group 3 Search" selectedSkillsUpdater={filterUpdater("sk3Search")} />
                        </div>

                    </div>
                </Panel>
                <Separator>
                    <div className="w-0.5 h-full ml-1 mr-1 shrink-0 bg-gray-600" />
                </Separator>
                <Panel className="bg-base-300 p-2">
                    <ArtifactsList artifacts={artifacts} filterOpts={filters} />
                </Panel>
            </Group>
        </div>

    )
}