import React, { useRef, useState, useEffect } from 'react';
import { MdSend } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Main = () => {
  const [imageu, setImageu] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const placeholderImage = "https://v0.dev/placeholder.svg?height=400&width=400";

  const fetchImage = async () => {
    if (inputRef.current.value === "") {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: inputRef.current.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageu(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically reset loading after 120 seconds
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 120000); // 120 seconds
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        

      <h1 className="text-4xl font-bold text-white mb-8">
        AI image <span className="text-pink-500">generator</span>
      </h1>
      

      <div className="w-full max-w-md aspect-square bg-gray-800 rounded-lg overflow-hidden mb-8 flex items-center justify-center">
        {loading ? (
          <div className="relative flex items-center justify-center">
            <AiOutlineLoading3Quarters className="w-24 h-24 text-pink-500 animate-spin" />
          </div>
        ) : (
          <img
            src={imageu === "" ? placeholderImage : imageu}
            className="w-96 h-96 object-cover"
            alt="Generated"
          />
        )}
      </div>

      <div className="w-full max-w-md relative">
        <input
          type="text"
          ref={inputRef}
          placeholder="Describe what you want to see"
          className="w-full py-3 px-4 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={fetchImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          <MdSend className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Main;
