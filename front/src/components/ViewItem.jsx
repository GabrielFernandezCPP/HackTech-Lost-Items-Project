import { useEffect, useState } from "react";
import { get_items } from "../api/requests.mjs";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import QRCode from 'qrcode';


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
    const [status, setStatus] = useState(1);
    const [loading, setLoading] = useState(true);
    const [qrBase64, setQrBase64] = useState('');
    const captionText = "Lost Item - Please Scan";

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
                setStatus(found_item.status);
                setLoading(false);
                return;
            }
        }
        setLoading(false);
    };  

    useEffect(() => {
        if (loading)
        {
            update_item();
        }
    }, [])

    useEffect(() => {
        const generateQrWithCaption = async () => {
          if (item && item.uuid) {
            try {
              const url = `https://yourwebsite.com/lost/${item.uuid}`;
    
              const qrBase64 = await QRCode.toDataURL(url, { margin: 2 });
    
              const qrImage = new Image();
              qrImage.src = qrBase64;
              qrImage.onload = () => {
                const canvas = document.createElement('canvas');
                const qrWidth = qrImage.width;
                const qrHeight = qrImage.height;
                const captionHeight = 50;
    
                canvas.width = qrWidth;
                canvas.height = qrHeight + captionHeight;
    
                const ctx = canvas.getContext('2d');
    
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
    
                ctx.fillStyle = 'black';
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(captionText, canvas.width / 2, 30);
    
                ctx.drawImage(qrImage, 0, captionHeight);
    
                const finalQrBase64 = canvas.toDataURL();
                setQrBase64(finalQrBase64);
              };
            } catch (err) {
              console.error('Failed to generate QR code with caption:', err);
            }
          }
        };
    
        generateQrWithCaption();
      }, [item]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('a');
        return;
    }

    return (<div className="h-full ml-6 mr-6 p-1 w-full">
    <div className="text-3xl mb-5 font-bold">{ item.item_name }</div>
        <div className="flex flex-col overflow-y-auto justify-between h-max">
        {
            loading ? <Loading></Loading> :
            <div className="flex sm:flex-row flex-col justify-between sm:overflow-y-visible items-center min-h-fit overflow-y-scroll">
                <form className="flex flex-col space-y-3 w-full p-4" onSubmit={handleSubmit}>
                    <div className="text-2xl">Change Status</div>
                    <button onClick={() => {console.log('a')}} className={`text-lg text-left cursor-pointer p-3 ${status_to_style(item.status)} text-white w-full text-center`}>{ status_to_text(item.status) }</button>
                    <div className="text-2xl">Edit Name</div>
                    <input className="border border-green-600 p-2 focus:outline-none focus:border-2" type="text" value={title} onChange={(element) => {setTitle(element.value)}}></input>
                    <div className="text-2xl">Edit Description</div>
                    <input className="border border-green-600 p-2 focus:outline-none focus:border-2" type="text" value={description} onChange={(element) => {setDescription(element.value)}}></input>
                    <button className="bg-green-600 text-black hover:bg-healthygreen p-2 mt-6 cursor-pointer" type="submit" value="Submit">Submit</button>
                </form>
                
                <div className="w-[256px] h-[256px] bg-white flex items-center justify-center border">
                    {qrBase64 ? (
                      <img src={qrBase64} alt="QR Code" className="w-full h-full object-contain" />
                    ) : (
                        <div className="text-black text-center">Generating QR...</div>
                    )}
                </div>

            </div>
            }
        </div>
    </div>
    )
}

export default ViewClientPage;