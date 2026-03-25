import { useState } from "react";
import { FilterButtonData } from "../types";
import ClearFilterButton from "./ClearFilterButton";
import FilterGroupButton from "./FilterGroupButton";
import { useDebouncedCallback } from "use-debounce";

type Params = {
    readonly showSidebar: boolean,
    readonly btnNames: FilterButtonData[],
    readonly inpPlaceholder: string
}

export default function FilterGroup({ showSidebar, btnNames, inpPlaceholder, setSelectedFilters }: Params) {
    const [filterQuery, setFilterQuery] = useState("");

    const handleSearch = useDebouncedCallback((term) => {
        setFilterQuery(term)
    }, 300)

    return (
        <div className={`flex flex-col w-full bg-base-200 rounded-md border border-gray-700 p-2 gap-2 min-h-[220px] max-h-[250px] overflow-auto ${!showSidebar ? "hidden" : ""}`}>
            <div className="flex gap-2 ">
                <label className={`input self-center w-full`}>
                    <input type="search" placeholder={inpPlaceholder} onChange={(e) => { handleSearch(e.target.value) }}></input>
                </label>
                {/* TODO: Implement trash icon to clear the filter from main page */}
                <div className={`flex items-center `}>
                    <ClearFilterButton onClick={() => console.warn("UNIMPLEMENTED SKILL GROUP TRASHING")} />
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
                                    <FilterGroupButton key={btnData.name}>
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