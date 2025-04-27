const LostItemPage = () => {

    const handleContactOwner = async () => {
        console.log('Button clicked!');
        const res = await fetch('http://localhost:3000/api/contact-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ownerEmail: 'kevinjnev@gmail.com',
            itemName: 'Black Backpack',
            finderMessage: 'Hi, I found your black backpack near the library.'
          })
        });
      
        const data = await res.json();
        alert(data.message);
    }


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        {/* Big Header */}
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          You found a lost item!
        </h1>

        {/* Item Name */}
        <h2 className="text-xl font-semibold mb-2">
          Item Name
        </h2>

        {/* Item Description */}
        <p className="text-gray-600 mb-4">
          Item Description
        </p>

        {/* Contact Owner Button */}
        <button 
          onClick={handleContactOwner}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
        >
          Send Message To Owner
        </button>

        {/* Thank You Footer */}
        <p className="text-gray-400 text-xs mt-6">
          Thanks for helping return lost items!
        </p>
      </div>
    </div>
  );
}


export default LostItemPage;