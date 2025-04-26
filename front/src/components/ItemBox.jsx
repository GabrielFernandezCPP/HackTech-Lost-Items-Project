function status_to_style(status)
{
    switch(status)
    {
        case "Lost":
            return "bg-red-500";
        case "Found":
            return "bg-green-500";
        default:
            return "bg-black";
    }
}

function Navbar(props) {
    return (
    <>
        <a href={ props.destination } className="flex flex-col space-y-3 rounded-lg bg-gray-400 hover:bg-gray-300 items-center justify-center w-full p-5">
            <div className="text-xl">Water Bottle</div>
            <div className={`text-lg ${status_to_style(props.status)} text-white w-full text-center rounded-sm`}>{ props.status }</div>
        </a>
    </>
    )
}

export default Navbar
