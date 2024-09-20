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
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">
        Payxn Solana Pay Demo
      </h1>
    </div>
  );
}