import React from 'react';

/**
 * WalletConnect Component
 * Handles MetaMask connection, wallet address truncation, and network switching (Sepolia 11155111).
 */
export default function WalletConnect({ 
    account, 
    chainId, 
    onConnect, 
    onSwitchNetwork, 
    isConnecting 
}) {
    const isSepolia = chainId === 11155111;

    // Helper to format 0x1234...5678 address display
    const truncateAddress = (addr) => {
        if (!addr) return '';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <div className="wallet-bar glass-card">
            <div className="wallet-brand">
                <span className="brand-logo">🛡️</span>
                <div>
                    <h1 className="brand-title">EscrowVault</h1>
                    <p className="brand-subtitle">Multi-Party Crowdfunding DApp</p>
                </div>
            </div>

            <div className="wallet-actions">
                {account ? (
                    <>
                        {/* Network Badge */}
                        <div className={`network-badge ${isSepolia ? 'network-sepolia' : 'network-wrong'}`}>
                            <span className="dot"></span>
                            {isSepolia ? 'Sepolia Testnet' : `Wrong Network (${chainId || 'Unknown'})`}
                        </div>

                        {/* Switch Network Button if on wrong chain */}
                        {!isSepolia && (
                            <button className="btn btn-warning" onClick={onSwitchNetwork}>
                                Switch to Sepolia
                            </button>
                        )}

                        {/* Account Address Pill */}
                        <div className="account-pill">
                            <span className="account-icon">👤</span>
                            <span className="account-address">{truncateAddress(account)}</span>
                        </div>
                    </>
                ) : (
                    <button 
                        className="btn btn-primary btn-glow" 
                        onClick={onConnect} 
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting MetaMask...' : 'Connect Wallet'}
                    </button>
                )}
            </div>
        </div>
    );
}
