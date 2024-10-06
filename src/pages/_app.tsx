// import '../styles/globals.css'

// function App({ Component, pagePros}) {
//   return <Component {...pagePros} />
// }

// export default App


// _app.tsx

import 'bootstrap/dist/css/bootstrap.min.css';




import { AppProps } from 'next/app';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, Connection, Cluster } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { useMemo, useEffect, useState } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css'; // Import the default wallet styles

export default function App({ Component, pageProps }: AppProps) {
  // Define the network: devnet, testnet, or mainnet-beta
  const network = 'devnet'; 
  // const [network, setNetwork] = useState<'mainnet-beta' | 'devnet' | 'testnet'>('devnet'); // Default to 'devnet'
  // const [network, setNetwork] = useState<Cluster>('devnet');  // Set a default initially


  // Set up the Solana cluster endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Configure the wallet adapters (here Phantom)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jQuery = require('jquery');
      window.$ = window.jQuery = jQuery; // Make jQuery globally available
    }
  }, []);

  // Function to dynamically set the network based on wallet connection
  // const handleNetworkChange = (connectedNetwork: string) => {
  //   if (connectedNetwork.includes('mainnet-beta')) {
  //     setNetwork('mainnet-beta');
  //   } else if (connectedNetwork.includes('testnet')) {
  //     setNetwork('testnet');
  //   } else {
  //     setNetwork('devnet');
  //   }
  // };
  // const handleNetworkChange = (newNetwork: string) => {
  //   setNetwork(newNetwork);
  // };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* <Component {...pageProps} /> */}
          {/* <Component {...pageProps} onNetworkChange={handleNetworkChange} />
           */}
           <Component {...pageProps} />
           {/* <Component {...pageProps} network={network} onNetworkChange={handleNetworkChange} /> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}






// import "@/styles/globals.css";
// import type { AppProps } from "next/app";

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }

// import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import WalletConnectionProvider from '../walletConnection';
// import { SolanaProvider } from "../components/solana/solana-provider"; // Adjust the path if needed

// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <SolanaProvider>
//       <Component {...pageProps} />
//     </SolanaProvider>
//   );
// }


