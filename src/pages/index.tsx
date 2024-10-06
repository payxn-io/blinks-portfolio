
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
// import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';

import dynamic from 'next/dynamic';
import { getSolanaBalance, getSolanaTokenBalances, portfolioRebalancer, getTokenPriceInUSD, getBalances, portfolioRebalancerCalc } from './portfolioIndex'; // Import your functions here

import { GetServerSideProps } from 'next';

// Your Solana RPC endpoint
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';


// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

// Dynamically load WalletButton and disable SSR
const WalletButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);


import { PublicKey } from '@solana/web3.js';
import * as dotenv from "dotenv";

dotenv.config();


interface PortfolioRebalanceResult {
  wallet: string;
  rebalSymbol: string;
  target: number;
  solanaPriceInUSD: number;
  cash: number;
  action: "BUY" | "SELL" | "NEUTRAL";
  tokenQuantity: number;
  valueInUSD: number;
  solBalance: number;
  solBalanceUSD: number;
}

// export default function Home() {

export default function Home({
  solanaBalance,
  splTokenBalances,
  serverWalletAddress,
  solanaPriceInUSD, // Adding this from server props
}: {
  solanaBalance: number | null;
  splTokenBalances: any[];
  serverWalletAddress: string;
  solanaPriceInUSD: number;
}) {


  const [isModalOpen, setIsModalOpen] = useState(false); // To show/hide modal
  const [confirmationMade, setConfirmationMade] = useState(false); // For confirmation
  const [swapLink, setSwapLink] = useState<string | null>(null); // Store the generated swap link
  const [portfolioResult, setPortfolioResult] = useState<PortfolioRebalanceResult | null>(null);
  const [isRebalancing, setIsRebalancing] = useState(false); // New state to handle button disabled state


  const [rebalanceInputs, setRebalanceInputs] = useState<{ [key: string]: number }>({});

  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [tokenBalances, setTokenBalances] = useState<any[]>([]);
  const { publicKey, connected } = useWallet();
  // const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(serverWalletAddress);

  const [solUsdtAmount, setSolUsdtAmount] = useState(10);
  const [usdtSolAmount, setUsdtSolAmount] = useState(50);
  const [solBonkAmount, setSolBonkAmount] = useState(100);

  const [targetPercentage, setTargetPercentage] = useState<number>(0);


  // Add a useEffect hook to trigger the modal when isModalOpen becomes true
  useEffect(() => {
    if (isModalOpen && typeof window !== 'undefined') {
      const $ = window.$;
      $('#rebalanceModal').modal('show'); // Show the modal using jQuery
    }
  }, [isModalOpen]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jquery = require('jquery');
      window.$ = window.jQuery = jquery; // Assign jQuery to window object
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);


  // Function to handle Rebalance button click
  const handleRebalance = async (tokenSymbol: string, tokenAmount: number, tokenPriceInUSD: number, tokenBalInUSD: number,  targetPercentage: number) => {
    
    let solCash = 0;


    setIsRebalancing(true); // Disable the button to prevent double clicks
    try {
      // Assuming solanaPriceInUSD is passed from props or fetched in getServerSideProps
      // const solanaPriceInUSD = await getTokenPriceInUSD('solana');
      if (solBalance) {
        solCash = solBalance * solanaPriceInUSD;
      }
      else {
        solCash = 0;
      };

      const portfolioResult = await portfolioRebalancerCalc(walletAddress, solBalance, solanaPriceInUSD, 
        "dummy", tokenSymbol, tokenPriceInUSD, tokenAmount, tokenBalInUSD, solCash, targetPercentage);
      
      // Log or show the portfolio rebalancer result in the UI
      console.log('Portfolio Rebalance Result:', portfolioResult);

            // Open the modal to show the result
      setIsModalOpen(true);
      // Store the portfolio result for the modal content
      setPortfolioResult(portfolioResult);

      // // Only trigger the Bootstrap modal in the browser
      // if (typeof window !== 'undefined') {
      //   const $ = window.$;
      //   $('#rebalanceModal').modal('show'); // Show the modal using jQuery
      // }

      // Trigger Bootstrap modal
      // $('#rebalanceModal').modal('show');
      // alert(`Rebalance completed: ${JSON.stringify(portfolioResult)}`);
    } catch (error) {
      console.error('Rebalance error: ', error);
      alert('Error while rebalancing portfolio. Please try again.');
    } finally {
      setIsRebalancing(false); // Re-enable the button after the process finishes
    }
  };

  const handleConfirm = () => {
    if (portfolioResult) { // Ensure it's not null
      const tokenPair = portfolioResult.action === "BUY" 
        ? `SOL-${portfolioResult.rebalSymbol}` 
        : `${portfolioResult.rebalSymbol}-SOL`;
      const link = generateSwapLink(tokenPair, portfolioResult.tokenQuantity);
      setSwapLink(link); // Store the generated swap link
      setConfirmationMade(true); // Disable Confirm button
    } else {
      console.error("Portfolio result is null");
    }
  };

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      const $ = window.$;
      $('#rebalanceModal').modal('hide'); // Manually hide the modal using jQuery
    }
    setIsModalOpen(false); // Close the modal
    setConfirmationMade(false); // Reset confirmation
    setSwapLink(null); // Clear the swap link
    setPortfolioResult(null); // Reset the portfolio result

    // Clean up any remaining Bootstrap modal backdrop
    if (typeof window !== 'undefined') {
      const $ = window.$;
      $('.modal-backdrop').remove(); // Remove any backdrop left behind by Bootstrap
    }
  };

  
  
  

  const router = useRouter();

  // Client-side fetch for wallet address and balance
  useEffect(() => {
    if (publicKey && connected) {
      const address = publicKey.toString();
      console.log("Wallet Address:", address); // Add this to verify the wallet address

      // Set wallet address for UI
      setWalletAddress(address);

      // Redirect to server-side logic with the wallet address as a query parameter
      router.push({
        pathname: '/',
        query: { walletAddress: address }
      });
    }
  }, [publicKey, connected]);

  // **ADD THIS BLOCK HERE** (below client-side fetch)
  useEffect(() => {
    console.log("Server Props:", {
      solanaBalance,
      splTokenBalances,
      serverWalletAddress
    });
  }, [solanaBalance, splTokenBalances, serverWalletAddress]);

  // Ensure that the state is updated with the server-side props
  useEffect(() => {
    if (solanaBalance !== null) {
      setSolBalance(solanaBalance);
    }
    if (splTokenBalances.length > 0) {
      setTokenBalances(splTokenBalances);
    }
  }, [solanaBalance, splTokenBalances]);


  const generateSwapLink = (tokenPair: string, amount: number) => {
    const localhost = 'http://localhost:3003'; // This will be replaced with your deployment URL later.
    const url = `${localhost}/api/jupiter/swap/${tokenPair}/${amount}`;
    return `https://dial.to/developer?url=${encodeURIComponent(url)}&cluster=mainnet`;
  };
  let cash = 0; // Initialize a variable to store cash balance

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
        <WalletButton /> {/* Add wallet connect button here */}
      </div>

      <div className="pricing-header px-3 py-3 pt-md-5 pb-md-1 mx-auto text-center">
        <h1 className="display-4">Solana Blinks / Portfolio Rebalancer</h1>
        <p className="lead mb-5">
          Quickly send/receive Blink SOL payments and rebalance your Solana wallet portfolio
        </p>
      </div>

      {/* Show wallet address if connected */}
      {/* <div className="container text-center"> */}
      <div className="container pt-1 pb-4">
    <h2 className="text-center mb-4 pb-4">Rebalance Your Portfolio (USDT) </h2>
    <div className="text-center mb-4">
  {walletAddress ? (
    <div>
      {/* <p>Wallet Connected: <strong>{walletAddress}</strong></p> */}
      {/* {solBalance !== null && <p>SOL Balance: <strong>{solBalance} SOL</strong></p>} */}

      <div className="row mt-4">
        {/* Card for SOL Balance */}
        {solBalance !== null && (
          <div className="col-md-3 mb-3">
            <div className="card p-3 h-100">
              <div className="card-body">
                <h5 className="card-title">SOL Balance</h5>
                <p className="card-text">
                  Amount: <strong>{solBalance} SOL</strong><br />
                  Price (USD): <strong>{solanaPriceInUSD}</strong><br />
                  USD Value: <strong>{solBalance * solanaPriceInUSD}</strong>
                </p>
                <div className="d-flex align-items-center">
              {/* <input
                type="number"
                className="form-control me-2"
                placeholder="Enter %"
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(Number(e.target.value))}
                style={{ width: '100px' }} // Adjust width as per your design
              /> */}
              {/* <button
                className="btn btn-primary"
                onClick={() => handleRebalance("solana", solBalance, solanaPriceInUSD, solBalance * solanaPriceInUSD,targetPercentage)}
              >
                Rebalance
              </button> */}
            </div>
              </div>
            </div>
          </div>
        )}

        {/* Cards for Token Balances */}
        {tokenBalances.map((token, idx) => {
            // If the token symbol is "USDT", update the cash variable
          if (token.tokenSymbol === "USDT") {
            cash = token.balanceInUSD;
          }

  // Return JSX to render for each token
  return (

          <div key={idx} className="col-md-3 mb-3">
            <div className="card p-3 h-100">
              <div className="card-body">
                <h5 className="card-title">{token.tokenSymbol}</h5>
                <p className="card-text">
                  Amount: <strong>{token.tokenAmount}</strong><br />
                  Price (USD): <strong>{token.tokenPriceInUSD}</strong><br />
                  USD Value: <strong>{token.balanceInUSD}</strong>
                </p>
                {/* Conditionally render the Rebalance button, except for USDT or USDC */}
                {/* {token.tokenSymbol !== "USDT" && token.tokenSymbol !== "USDC" && ( */}
                  <div className="d-flex align-items-center">
              <input
                type="number"
                className="form-control me-2"
                placeholder="Enter %"
                style={{ width: '100px' }} // Adjust width as per your design

                value={targetPercentage}
                onChange={(e) => setTargetPercentage(Number(e.target.value))}
                
              />
              <button
                className="btn btn-primary"
                onClick={() => handleRebalance(token.tokenSymbol, token.tokenAmount, token.tokenPriceInUSD, token.balanceInUSD, targetPercentage)}
                  disabled={isRebalancing} // Disable the button while processing
              >
                {isRebalancing ? 'Rebalancing...' : 'Rebalance'} {/* Show loading text */}
              </button>
            </div>
                {/* // )} */}
              </div>
            </div>
          </div>
          ); {/* End of return inside map function */}
        })}   {/* End of map function */}
      </div> {/* End of row */}
    </div>        
        ) : (
          <p>Please connect your wallet</p>
        )}
      </div>
      </div>

      
    <h2 className="text-center mb-4 pt-6">Swap Tokens </h2>
    
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
                  onChange={(e) => setSolUsdtAmount(Number(e.target.value))}
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
                  onChange={(e) => setUsdtSolAmount(Number(e.target.value))}
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
                <h4 className="my-0 font-weight-normal">SOL-Bonk Swap</h4>
              </div>
              <div className="card-body">
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Enter amount in USD"
                  value={solBonkAmount}
                  onChange={(e) => setSolBonkAmount(Number(e.target.value))}
                />
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Fast processing</li>
                  <li>Low fees</li>
                </ul>
                <a
                  href={generateSwapLink('SOL-Bonk', solBonkAmount)}
                  className="btn btn-lg btn-block btn-primary"
                >
                  Swap Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {isModalOpen && portfolioResult && ( */}
      {isModalOpen && portfolioResult && (
 <div
 className="modal fade"
 id="rebalanceModal"
 tabIndex="-1"
 role="dialog"
 aria-labelledby="rebalanceModalLabel"
 aria-hidden="true"
>
 <div className="modal-dialog modal-dialog-centered" role="document">
   <div className="modal-content">
     <div className="modal-header">
       <h5 className="modal-title" id="rebalanceModalLabel">Rebalance Summary</h5>
       <button
         type="button"
         className="close"
         data-dismiss="modal"
         aria-label="Close"
       >
         <span aria-hidden="true">&times;</span>
       </button>
     </div>
     <div className="modal-body">
       <p>
         Rebalancing: <strong>{portfolioResult?.rebalSymbol}</strong><br />
         Target SOL value %: <strong>{portfolioResult?.target}</strong><br />
         Action: <strong>{portfolioResult?.action}</strong><br />
         Qty: <strong>{portfolioResult?.tokenQuantity}</strong><br />
         Value: <strong>{portfolioResult?.valueInUSD} USD</strong><br />
       </p>
     </div>
     <div className="modal-footer">
        <button className="btn btn-secondary" onClick={handleCancel}>
          Cancel
        </button>
       <button
         type="button"
         className="btn btn-primary"
         onClick={handleConfirm}
         disabled={confirmationMade}
       >
         Confirm
       </button>
     </div>
     {swapLink && (
       <div className="modal-body">
         <a href={swapLink} target="_blank" className="btn btn-success" onClick={handleCancel} >
           Click here to complete swap
         </a>
       </div>
     )}
   </div>
 </div>
</div>

)}

    </div>  // End of your main div
  );
}









export const getServerSideProps: GetServerSideProps = async (context) => {
  // Replace this publicKey with your wallet's public key or dynamically from request if needed
  // const walletAddress = "YourDefaultWalletAddressHere";
  const { walletAddress } = context.query;

  // Ensure walletAddress is a string (handle cases where it's an array)
  const walletAddr = Array.isArray(walletAddress) ? walletAddress[0] : walletAddress;



  if (!walletAddr) {
    return {
      props: {
        solanaBalance: null,
        splTokenBalances: [],
        serverWalletAddress: '',
        solanaPriceInUSD: null,
      },
    };
  }

  try {
    // Fetch balances server-side
    const solanaBalance = await getSolanaBalance(walletAddr);
    const splTokenBalances = await getSolanaTokenBalances(walletAddr);
    const solanaPriceInUSD = await getTokenPriceInUSD("solana");
    const balStruct = await getBalances(walletAddr, solanaBalance);

    // const portfolioRebalanced: PortfolioRebalanceResult = await portfolioRebalancer(walletAddr, "Bonk", 20, 160);

    // Convert PublicKey objects to strings
    const serializableTokenBalances = splTokenBalances.map(token => ({
      ...token,
      mintAddress: token.mintAddress.toString(),  // Convert PublicKey to string
    }));
    console.log("from getServerSideProps solana Balance = ", solanaBalance); 
    console.log("from getServerSideProps splTokenBalances  = ", splTokenBalances); 
    console.log("from getServerSideProps serializableTokenBalances  = ", serializableTokenBalances); 
    return {
      props: {
        solanaBalance,
        splTokenBalances: serializableTokenBalances,
        walletAddress: walletAddr, // Pass the wallet address to be displayed
        solanaPriceInUSD,
      },
    };
  } catch (error) {
    console.error("Error fetching balances:", error);
    return {
      props: {
        solanaBalance: null,
        splTokenBalances: [],
        walletAddress: walletAddr,
        solanaPriceInUSD: null,
      },
    };
  }
};





