function status_to_style(status)
{
    switch(status)
    {
        case 1:
            return "bg-red-500";
        case 2:
            return "bg-healthygreen animate-pulse";
        default:
            return "bg-gray-400";
    }
}

function status_to_text(status)
{
    switch (status) {
        case 1:
            return "Lost";
        case 2:
            return "Found";
        default:
            return "Not Lost";
    }
}

function Navbar(props) {
    return (
    <>
        <a href={ props.destination } className="flex flex-col shadow-lg space-y-3 bg-white active:bg-healthygreen items-left justify-center w-full">
            <div className="text-xl min-w-fit font-bold bg-green-600 p-2">{ props.name }</div>
            <div className="text-md w-full text-left p-2 bg-white overflow-clip text-ellipsis">{ props.description }</div>
            <div className={`text-lg ${status_to_style(props.status)} text-white w-full text-center`}>{ status_to_text(props.status) }</div>
        </a>
    </>
    )
}

export default Navbar
