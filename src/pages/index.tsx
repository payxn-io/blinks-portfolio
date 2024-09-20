// Imports
import { Connection,PublicKey,Keypair} from "@solana/web3.js";
import { encodeURL, findReference, FindReferenceError, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import { useState } from "react";
import QRCode from "react-qr-code";
import * as dotenv from "dotenv";
dotenv.config();


// Configure your RPC connection
// const RPC="https://rpc.helius.xyz/?api-key=".process.env.HELIUS_RPC!

const RPC="https://rpc.helius.xyz/?api-key=82d90b23-dc14-48a7-ac17-3c95ace2130b"!
//const RPC = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_RPC}`;
console.log(RPC); // This will output the complete RPC URL

// Create a Solana Connection object with your RPC URL
console.log('Connecting to the Solana network\n');
const connection = new Connection(RPC, 'confirmed');

export default function Home() {
  // URL Variables
  const [address, setAddress] = useState("");
  const [recipient, setRecipient] = useState(
    new PublicKey("Ckg9D8BZmeze7Ka19fYJG3pyFGiAgiYSnQGToNbdRz8r"));
  const [amount, setAmount] = useState(new BigNumber(1));
  const [message] = useState("Payxn Demo Order");
  const reference = new Keypair().publicKey;
  const label = "Payxn Super Store";
  const memo = "Payxn#1337";

  // for the QR code
  const [qrCodeValue, setQrCodeValue] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  async function createPayment() {
    console.log("Creating a payment URL \n");
    setRecipient(new PublicKey(address));
    const url = encodeURL({
      recipient,
      amount,
      reference,
      label,
      message,
      memo,
    });

    setQrCodeValue(url.toString()); // convert URL object to string
    checkPayment();
  }

  async function checkPayment() {

		// Search for transaction
    console.log('Searching for the payment\n');
    let signatureInfo;

    // const {signature} = await new Promise((resolve, reject) => {
    const { signature } = await new Promise<{ signature: string }>((resolve, reject) => {  
      
        const interval = setInterval(async () => {
            console.count('Checking for transaction...'+reference);
            try {
                signatureInfo = await findReference(connection, reference, { finality: 'confirmed' });
                console.log('\n Signature: ', signatureInfo.signature,signatureInfo);
                clearInterval(interval);
                resolve(signatureInfo);
            } catch (error: unknown) {
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, 250);
    });

    // Update payment status
    setPaymentStatus('confirmed');

    //validate transaction
    console.log('Validating the payment\n');
    try {
      await validateTransfer(connection, signature, { recipient: recipient, amount });

      // Update payment status
      setPaymentStatus('validated');
      console.log('Payment validated');
      return true;
      
  } catch (error) {
      console.error('Payment failed', error);
      return false;
  }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">
        Payxn Solana Pay Demo
      </h1>
      <div className="w-full max-w-md p-6 mx-auto bg-white rounded-xl shadow-md">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Address:
          </label>
          <input
            type="text"
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Amount:
          </label>
          <input
            type="number"
            onChange={(e) => setAmount(new BigNumber(e.target.value))}
            className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex justify-center items-center">
        <button 
          className="px-4 py-2 font-bold text-white bg-indigo-500 rounded hover:bg-blue-700" 
          onClick={createPayment}
        >
          Create QR Code
        </button>
        </div>
        
        <div>
        {paymentStatus === 'validated' ? <p className="mt-4 text-green-500 text-center">Payment Validated</p> : <div className="flex justify-center mt-4">
          {qrCodeValue && <QRCode value={qrCodeValue} />}
        </div>}
      </div>
      </div>

    </div>
  );
}