import { createConfig, http } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import CONFIG from '../../utils/config/config.js';

const chains = [mainnet, base];

export const config = createConfig({
  chains: chains,
  connectors: [
    metaMask()
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http()
  },
});
