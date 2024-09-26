import { useState } from 'react';

export default function Swap() {
  const [amount, setAmount] = useState('');
  const [link, setLink] = useState('');

  const generateSwapLink = () => {
    const tokenPair = 'SOL-USDT';
    const localhost = 'http://localhost:3003'; // Adjust this to your API base URL
    const url = `${localhost}/api/jupiter/swap/${tokenPair}/${amount}`;
    const dialtoLink = `https://dial.to/developer?url=${encodeURIComponent(url)}&cluster=mainnet`;
    setLink(dialtoLink);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">Swap SOL-USDT</h1>
      <div className="w-full max-w-md p-6 mx-auto bg-white rounded-xl shadow-md">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          className="px-4 py-2 font-bold text-white bg-indigo-500 rounded hover:bg-blue-700"
          onClick={generateSwapLink}
        >
          Generate Swap Link
        </button>
        {link && (
          <div className="mt-4">
            <a href={link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">
              Click here to swap SOL-USDT
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
