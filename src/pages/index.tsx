// imports
import {Cluster,clusterApiUrl,Connection,PublicKey,Keypair} from "@solana/web3.js";
import { encodeURL, createQR,findReference, FindReferenceError, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import { useState } from "react";
import QRCode from "react-qr-code";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">
        Payxn Solana Pay Demo
      </h1>
    </div>
  );
}