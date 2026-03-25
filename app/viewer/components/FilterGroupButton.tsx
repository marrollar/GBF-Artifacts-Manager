export default function FilterGroupButton({ children }: { children:React.ReactNode }) {
    
    
    return (
        <button className="hover:bg-neutral-500 hover:cursor-pointer pl-2 pr-2 border rounded-md">
            {children}
        </button>
    )
}