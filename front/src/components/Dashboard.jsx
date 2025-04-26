import ItemBox from "./ItemBox"

function ViewClientPage() {

    return (<div className="h-screen w-full ml-6 mr-6 p-1">
        <div className="overflow-y-scroll h-full">
            <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 gap-1 max-h-full">
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