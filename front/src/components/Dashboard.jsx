import { useEffect, useState } from "react";
import ItemBox from "./ItemBox"
import { get_items } from "../api/requests.mjs";

const APP_URL = import.meta.env.VITE_API_URL;

function ViewClientPage() {
    const [items, setItems] = useState([]);
    
    const update_items = async () => {
        const items = await get_items();
        setItems(items);
    }

    useEffect(() => {
        update_items();
    }, [])

    return (<div className="h-screen ml-6 mr-6 p-1">
        <div className="text-3xl mb-5">Your Items</div>
        <div className="overflow-y-auto h-full">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:border-0 sm:grid-cols-2 grid-cols-1 sm:gap-4 gap-1 max-h-full">
                {
                (items == null) ?
                <div>No Items Available. Add new item (button)</div> :
                items.map((object) =>{
                    return <ItemBox key={object.id} destination={`${APP_URL}/${object.uuid}`} status={object.status} name={object.item_name} description={object.item_description}></ItemBox>
                })}
            </div>
        </div>
    </div>
    )
}

export default ViewClientPage;