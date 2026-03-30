import { useState } from "react";
import { FilterButtonData } from "../types";
import ClearFilterButton from "./ClearFilterButton";
import FilterGroupButton from "./FilterGroupButton";
import { useDebouncedCallback } from "use-debounce";
import { FilterHandlers } from "../page";

type Props = {
    readonly showSidebar: boolean,
    readonly btnNames: FilterButtonData[],
    readonly groupName: string,
    readonly currentFilters: Set<string>,
    selectedSkillsUpdater: FilterHandlers["sk1Search"] | FilterHandlers["sk2Search"] | FilterHandlers["sk3Search"],
    readonly clearFilter: () => void
}

export default function FilterGroup({ showSidebar, btnNames, groupName, currentFilters, selectedSkillsUpdater, clearFilter }: Props) {
    const [filterQuery, setFilterQuery] = useState("");

    const handleSearch = useDebouncedCallback((term) => {
        setFilterQuery(term)
    }, 300)

    return (
        <div className={`flex flex-col w-full bg-base-200 rounded-md border border-gray-700 p-2 gap-2 min-h-[220px] max-h-[250px] overflow-auto ${!showSidebar ? "hidden" : ""}`}>
            <div className="flex gap-2 ">
                <label className={`input self-center w-full`}>
                    <input type="search" placeholder={groupName} onChange={(e) => { handleSearch(e.target.value) }}></input>
                </label>
                <div className={`flex items-center `}>
                    <ClearFilterButton onClick={() => clearFilter()} />
                </div>
            </div>
            <div className={`flex flex-wrap gap-1`}>
                {
                    (
                        () => {
                            const normalizedSearch = filterQuery.toLowerCase().trim();

                            const filteredButtons = btnNames.filter((btn) => {
                                const nameMatch = btn.name.toLowerCase().trim().includes(normalizedSearch);
                                const aliasMatch = btn.aliases?.some(alias => alias.toLowerCase().trim().includes(normalizedSearch))

                                return nameMatch || aliasMatch
                            })

                            return filteredButtons.map((btnData) => {
                                return (
                                    <FilterGroupButton className={`${currentFilters.has(btnData.name) ? "bg-accent text-base-200" : ""}`} onClick={() => selectedSkillsUpdater(btnData.name)} >
                                        {btnData.name}
                                    </FilterGroupButton>

                                )
                            })
                        }
                    )()
                }
            </div>
        </div>
    )
}