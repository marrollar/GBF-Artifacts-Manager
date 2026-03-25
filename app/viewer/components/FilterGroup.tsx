import { FilterButtonData } from "../types";
import FilterGroupButton from "./FilterGroupButton";

export default function FilterGroup({ superQuery, btnNames }: { superQuery: string, btnNames: FilterButtonData[] }) {
    return (
        <div className={`flex flex-wrap gap-1`}>
            {
                btnNames.map((btnData) => (
                    <FilterGroupButton key={btnData.name}>
                        {btnData.name}
                    </FilterGroupButton>
                ))
            }
        </div>
    )
}