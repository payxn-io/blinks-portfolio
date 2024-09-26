import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import * as dotenv from "dotenv";

dotenv.config();

export default function Home() {
  const [solUsdtAmount, setSolUsdtAmount] = useState(10);
  const [usdtSolAmount, setUsdtSolAmount] = useState(50);
  const [solBonkAmount, setSolBonkAmount] = useState(100);

  const generateSwapLink = (tokenPair, amount) => {
    const localhost = 'http://localhost:3003'; // This will be replaced with your deployment URL later.
    const url = `${localhost}/api/jupiter/swap/${tokenPair}/${amount}`;
    return `https://dial.to/developer?url=${encodeURIComponent(url)}&cluster=mainnet`;
  };

  return (
    <div style={{ background: 'linear-gradient(90deg, #00FFA3, #DC1FFF, #9945FF)', minHeight: '100vh' }}>
      <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom shadow-sm">
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
      </div>

      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
        <h1 className="display-4">Solana Blinks / Portfolio Rebalancer</h1>
        <p className="lead">
          Quickly send/receive Blink SOL payments and rebalance your Solana wallet portfolio
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
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter amount in USD"
                  value={solUsdtAmount}
                  onChange={(e) => setSolUsdtAmount(e.target.value)}
                />
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Fast processing</li>
                  <li>Low fees</li>
                </ul>
                <a
                  href={generateSwapLink('SOL-USDT', solUsdtAmount)}
                  className="btn btn-lg btn-block btn-primary"
                >
                  Swap Now
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">USDT-SOL Swap</h4>
              </div>
              <div className="card-body">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter amount in USD"
                  value={usdtSolAmount}
                  onChange={(e) => setUsdtSolAmount(e.target.value)}
                />
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Fast processing</li>
                  <li>Low fees</li>
                </ul>
                <a
                  href={generateSwapLink('USDT-SOL', usdtSolAmount)}
                  className="btn btn-lg btn-block btn-primary"
                >
                  Swap Now
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card mb-4 box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">SOL-BONK Swap</h4>
              </div>
              <div className="card-body">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter amount in USD"
                  value={solBonkAmount}
                  onChange={(e) => setSolBonkAmount(e.target.value)}
                />
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Fast processing</li>
                  <li>Low fees</li>
                </ul>
                <a
                  href={generateSwapLink('SOL-BONK', solBonkAmount)}
                  className="btn btn-lg btn-block btn-primary"
                >
                  Swap Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
