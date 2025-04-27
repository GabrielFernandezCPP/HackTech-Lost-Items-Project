import ItemBox from "./ItemBox"

function ViewClientPage() {

    return (<div className="h-screen w-full ml-6 mr-6 p-1">
        <div className="text-3xl mb-5">Your Items</div>
        <div className="overflow-y-auto h-full">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:border-0 sm:grid-cols-2 sm:gap-4 gap-1 max-h-full">
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>
                <ItemBox destination="#" status="Not Lost"></ItemBox>

            </div>
        </div>
    </div>
    )
}

export default ViewClientPage;