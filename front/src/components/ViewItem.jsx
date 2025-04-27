import { useEffect, useState } from "react";
import { get_items } from "../api/requests.mjs";
import { useParams } from "react-router-dom";
import Loading from "./Loading";

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


function ViewClientPage() {
    const { uuid } = useParams();
    const [item, setItem] = useState({});
    const [loading, setLoading] = useState(true);

    const update_item = async () => {
        const items = await get_items();

        for (const found_item of items)
        {
            if (found_item.uuid == uuid)
            {
                return found_item;
            }
        }

        return {};
    }

    useEffect(() => {
        update_item();
        setLoading(false);
    }, [])
console.log(item)
    return (<div className="h-screen ml-6 mr-6 p-1 w-full">
    <div className="text-3xl mb-5">Your Items</div>
        <div className="overflow-y-auto h-full">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:border-0 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-1 max-h-full">
                {
                loading ? <Loading></Loading> :
                <>
                <div className="text-xl min-w-fit font-bold bg-green-600 p-2">{ item.item_name }</div>
                <div className="text-md w-full text-left p-2 bg-white overflow-clip text-ellipsis">{ item.item_description }</div>
                <div className={`text-lg ${status_to_style(item.status)} text-white w-full text-center`}>{ status_to_text(item.status) }</div>
                </>
                }
            </div>
        </div>
    </div>
    )
}

export default ViewClientPage;