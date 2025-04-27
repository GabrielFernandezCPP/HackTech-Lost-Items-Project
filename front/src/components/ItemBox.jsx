function status_to_style(status)
{
    switch(status)
    {
        case "Lost":
            return "bg-red-500";
        case "Found":
            return "bg-healthygreen animate-pulse";
        default:
            return "bg-black";
    }
}

function Navbar(props) {
    return (
    <>
        <a href={ props.destination } className="flex flex-col space-y-3 rounded-lg bg-white active:bg-healthygreen items-left justify-center w-full">
            <div className="text-xl min-w-fit font-bold bg-gray-400 p-2">{ props.name }</div>
            <div className="text-md w-full text-left p-2 bg-white overflow-clip text-ellipsis">{ props.description }</div>
            <div className={`text-lg ${status_to_style(props.status)} text-white w-full text-center`}>{ props.status }</div>
        </a>
    </>
    )
}

export default Navbar
