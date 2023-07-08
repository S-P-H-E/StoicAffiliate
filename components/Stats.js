
export default function Stats({ name, numbers}) {
    return (
        <>
            <div className="bg-[#171918] border border-[#1D201F] w-[250px] h-[120px] p-4 rounded-lg flex flex-col gap-1">
                <h1 className="text-[#979BA1]">{name}</h1>
                <p className="text-5xl">{numbers}</p>
            </div>
        </>
    )
}