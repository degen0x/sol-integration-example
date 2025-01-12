import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
// Компоненты обертки необходимые для корректной работы кнопки подключить кошелек
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
// Компонент обертка необходимый для корректной работы кнопки подключить кошелек
import {WalletModalProvider} from "@solana/wallet-adapter-react-ui";
import {clusterApiUrl} from "@solana/web3.js";
// Позволяет указать какие кошельки мы позволяем подключить: phantom, solflare и т.д.
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';

// К чему подключаемся - mainnet, devnet, testnet, local
const endpoint = clusterApiUrl('devnet');

// массив кошельков, которые мы позволяем подключать
const wallets = [
    new walletAdapterWallets.PhantomWalletAdapter(),
    new walletAdapterWallets.SolflareWalletAdapter()
];
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets}>
              <WalletModalProvider>
                  <App />
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
  </StrictMode>,
)
