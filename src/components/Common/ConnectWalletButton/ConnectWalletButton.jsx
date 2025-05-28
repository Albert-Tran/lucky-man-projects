import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import styles from './ConnectWalletButton.module.css';

const ConnectWalletButton = () => {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { connect, connectors, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div className={styles.walletInfo}>
        <p>Kết nối: {activeConnector?.name}</p>
        <p>Địa chỉ: {address.slice(0, 6)}...{address.slice(-4)}</p>
        <button onClick={() => disconnect()} className={styles.disconnectButton}>
          Ngắt kết nối
        </button>
      </div>
    );
  }

  return (
    <div className={styles.connectWalletContainer}>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          className={styles.connectButton}
          // disabled={!connector.ready || connector.id === pendingConnector?.id}
        >
          {connector.name}
          {connector.id === pendingConnector?.id && ' (đang kết nối...)'}
        </button>
      ))}
    </div>
  );
};

export default ConnectWalletButton;