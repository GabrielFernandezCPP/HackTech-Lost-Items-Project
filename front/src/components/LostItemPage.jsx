import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotFound from './NotFound';
import Loading from './Loading'

const supabaseUrl = import.meta.env.VITE_DATABASE_URL;
const supabaseKey = import.meta.env.VITE_DB_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const LostItemPage = () => {

  const navigate = useNavigate();
  const {uuid} = useParams();
  const [lostItem, setLostItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finderMessage, setFinderMessage] = useState(''); // new state for user message

  
  useEffect(() => {
    const fetchLostItem = async () => {
      console.log('Fetching lost item with UUID:', `"${uuid}"`);
      try {
        const { data, error } = await supabase
          .from('lost_items')
          .select('owner_email, item_name, item_description')
          .eq('uuid', uuid)
          .single();  // Expect exactly one matching row

      if (error || !data) {
        console.error('Item not found, redirecting...');
        navigate('/errorpage'); // Redirect to 404 page
      } 
      else {
        setLostItem(data);
      }
      }catch (err) {
        console.error('Error fetching item:', err);
        navigate('/'); // Redirect on fetch error too
      }finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchLostItem();
    }
  }, [uuid,navigate]);

  if (loading) {
    return <Loading></Loading>
  }

  if (notFound) {
    return <NotFound></NotFound>;
  }

  

  const handleContactOwner = async () => {
    if (!finderMessage.trim()) {
      alert('Please type a message before sending.');
      return;
    }


    console.log('Button clicked!');
    const res = await fetch('http://localhost:3000/api/contact-owner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerEmail: lostItem.owner_email,
        itemName: lostItem.item_name,
        finderMessage: finderMessage
      })
    });

    const data = await res.json();
    alert(data.message);
  }


  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-6 break-words">
        You found a lost item!
        </h1>

        {/* Item Info */}
        <h2 className="text-xl md:text-2xl font-semibold mb-4 break-words">
          {lostItem.item_name}
        </h2>
        <p className="text-gray-700 mb-6 break-words whitespace-pre-wrap">
          {lostItem.item_description}
        </p>
        <p className="text-gray-500 text-sm mb-8 break-words">
          Owner Contact: {lostItem.owner_email}
        </p>

        {/* Contact Owner Form */}
        <div className="flex flex-col gap-4">
          <textarea
            value={finderMessage}
            onChange={(e) => setFinderMessage(e.target.value)}
            placeholder="Type a message to the owner here. Help them reunite with their lost goods."
            rows="5"
            className="w-full p-3 border rounded resize-none"
          ></textarea>

          <button
            onClick={handleContactOwner}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded text-lg"
          >
            Send Message
          </button>
        </div>

        {/* Thank You Footer */}
        <p className="text-gray-400 text-xs mt-6">
          Thanks for helping return lost items!
        </p>
      </div>
    </div>
  );

};

export default LostItemPage;