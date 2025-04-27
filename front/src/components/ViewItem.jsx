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
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    const update_item = async () => {
        const items = await get_items();
        
        setLoading(false);

        for (const found_item of items)
        {
            if (found_item.uuid == uuid)
            {
                setItem(found_item);
                setDescription(found_item.item_description);
                setTitle(found_item.item_name);
                return;
            }
        }
    }

    useEffect(() => {
        if (loading)
        {
            update_item();
        }
    }, [])

    const handleSubmit = () => {
        return;
    }

    return (<div className="h-full ml-6 mr-6 p-1 w-full">
    <div className="text-3xl mb-5 font-bold">{ item.item_name }</div>
        <div className="flex flex-col overflow-y-auto justify-between h-max">
        {
            loading ? <Loading></Loading> :
            <>
            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
                <div className="text-2xl">Change Status</div>
                <button onClick={() => {console.log('a')}} className={`text-lg cursor-pointer p-3 ${status_to_style(item.status)} text-white w-full text-center`}>{ status_to_text(item.status) }</button>
                <div className="text-2xl">Edit Name</div>
                <input className="border border-green-600 p-2 focus:outline-none focus:border-2" type="text" value={title} onChange={(element) => {setTitle(element.value)}}></input>
                <div className="text-2xl">Edit Description</div>
                <input className="border border-green-600 p-2 focus:outline-none focus:border-2" type="text" value={description} onChange={(element) => {setDescription(element.value)}}></input>
            </form>
            </>
            }
        </div>
    </div>
    )
}

export default ViewClientPage;