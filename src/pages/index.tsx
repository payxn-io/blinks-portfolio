// Imports
import {Cluster,clusterApiUrl,Connection,PublicKey,Keypair} from "@solana/web3.js";
import { encodeURL, createQR,findReference, FindReferenceError, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import { useState } from "react";
import QRCode from "react-qr-code";


// Configure your RPC connection
const RPC="https://rpc.helius.xyz/?api-key<Helius_API>"!

// Create a Solana Connection object with your RPC URL
console.log('Connecting to the Solana network\n');
const connection = new Connection(RPC, 'confirmed');

export default function Home() {
  // URL Variables
  const [address, setAddress] = useState("");
  const [recipient, setRecipient] = useState(
    new PublicKey("Ckg9D8BZmeze7Ka19fYJG3pyFGiAgiYSnQGToNbdRz8r"));
  const [amount, setAmount] = useState(new BigNumber(1));
  const [message, setMessage] = useState("Payxn Demo Order");
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
    // Update payment status
    setPaymentStatus('pending');

		// Search for transaction
	
		// Validate transaction
}


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">
        Payxn Solana Pay Demo
      </h1>
    </div>
  );
}