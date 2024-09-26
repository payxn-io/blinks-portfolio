// Imports

import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
// import { Connection,PublicKey,Keypair} from "@solana/web3.js";
// import { encodeURL, findReference, FindReferenceError, validateTransfer } from "@solana/pay";
// import BigNumber from "bignumber.js";
// import { useState } from "react";
// import QRCode from "react-qr-code";
import * as dotenv from "dotenv";

// import { useRouter } from 'next/router'; // added by Chuck
// import React from 'react'; // Import React for JSX syntax

  

dotenv.config();



// Configure your RPC connection
// const RPC="https://rpc.helius.xyz/?api-key=".process.env.HELIUS_RPC!

const RPC="https://rpc.helius.xyz/?api-key=82d90b23-dc14-48a7-ac17-3c95ace2130b"!
//const RPC = `https://rpc.helius.xyz/?api-key=${process.env.HELIUS_RPC}`;
console.log(RPC); // This will output the complete RPC URL

// Create a Solana Connection object with your RPC URL
console.log('Connecting to the Solana network\n');
// const connection = new Connection(RPC, 'confirmed');



export default function Home() {
  return (
<div style={{ background: 'linear-gradient(90deg, #00FFA3, #DC1FFF, #9945FF)', minHeight: '100vh' }}>
<div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
  {/* <h5 className="my-0 me-md-auto fw-normal">Payxn.io</h5> */}
  <h5 className="my-0 me-md-auto fw-normal d-flex align-items-center">
  <img src="/favicon.ico" alt="Logo" style={{ width: '60px', height: '60px', marginRight: '8px' }} />
  Payxn.io
</h5>
  <nav className="my-2 my-md-0 me-md-3">
    <a className="p-2 text-dark" href="#">Features</a>
    <a className="p-2 text-dark" href="#">Enterprise</a>
    <a className="p-2 text-dark" href="#">Support</a>
    <a className="p-2 text-dark" href="#">Pricing</a>
  </nav>
  <a className="btn btn-outline-primary" href="#">Sign up</a>
  {/* <img src="/solana.png" alt="Solana Logo" style={{ width: '60px', height: '60px', marginLeft: '8px' }} /> */}
</div>


<div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
  {/* <div className="d-flex justify-content-center">
    <img src="/solana.png" alt="Solana Logo" style={{ width: '260px', height: '90px', marginBottom: '20px' }} />
  </div> */}
  <h1 className="display-4">Solana Blinks / Portfolio Rebalancer</h1>
  <p className="lead">
    Quickly build an effective pricing table for your potential customers with this Bootstrap example. It's built with default Bootstrap components and utilities with little customization.
  </p>
</div>


    <div className="container py-5">
      <div className="row">
        <div className="col-lg-4">
          <div className="card mb-4 box-shadow">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">SOL-USDT Swap</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">$10 <small className="text-muted">/ swap</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>10 SOL to USDT</li>
                <li>Fast processing</li>
                <li>Low fees</li>
              </ul>
              <button type="button" className="btn btn-lg btn-block btn-primary">
                Swap Now
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4 box-shadow">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">USDT-SOL Swap</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">$50 <small className="text-muted">/ swap</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>50 SOL to USDT</li>
                <li>Fast processing</li>
                <li>Low fees</li>
              </ul>
              <button type="button" className="btn btn-lg btn-block btn-primary">
                Swap Now
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4 box-shadow">
            <div className="card-header">
              <h4 className="my-0 font-weight-normal">SOL-BONK Swap</h4>
            </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">$100 <small className="text-muted">/ swap</small></h1>
              <ul className="list-unstyled mt-3 mb-4">
                <li>100 SOL to USDT</li>
                <li>Fast processing</li>
                <li>Low fees</li>
              </ul>
              <button type="button" className="btn btn-lg btn-block btn-primary">
                Swap Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
