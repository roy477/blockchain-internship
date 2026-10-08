import React, { useState } from 'react';

/**
 * RefundButton Component
 * Allows contributors to claim a 100% refund if the funding target is not achieved after campaign deadline.
 */
export default function RefundButton({ onRefund, userContributionEth, remainingSeconds, totalFundedEth, fundingTargetEth }) {
    const [txState, setTxState] = useState({ status: 'idle', message: '', txHash: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isExpired = remainingSeconds <= 0;
    const targetMet = parseFloat(totalFundedEth || 0) >= parseFloat(fundingTargetEth || 0);
    const userContribution = parseFloat(userContributionEth || 0);
    
    // Refund allowed ONLY IF deadline passed, target NOT met, and user HAS a balance
    const canClaimRefund = isExpired && !targetMet && userContribution > 0 && !isSubmitting;

    const handleRefund = async () => {
        setIsSubmitting(true);
        setTxState({ status: 'pending', message: 'Waiting for MetaMask wallet confirmation...' });

        try {
            await onRefund((status, message, hash) => {
                setTxState({ status, message, txHash: hash || '' });
            });
        } catch (error) {
            setTxState({ 
                status: 'error', 
                message: error?.reason || error?.message || 'Refund transaction failed.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="action-card glass-card">
            <h3 className="card-title">
                <span>💸</span> Contributor Refund Portal
            </h3>
            
            <div className="refund-summary">
                <span className="label">Your Recorded Contribution Balance:</span>
                <span className="balance-value">{userContributionEth} ETH</span>
            </div>

            {/* Explanatory UI Banners */}
            {!isExpired && (
                <div className="info-box">
                    🔒 Refund unavailable while campaign is active ({remainingSeconds}s remaining).
                </div>
            )}

            {isExpired && targetMet && (
                <div className="info-box info-success">
                    🎉 Campaign achieved its target goal! Refunds are disabled and funds are ready for owner release.
                </div>
            )}

            {isExpired && !targetMet && userContribution === 0 && (
                <div className="info-box info-neutral">
                    ℹ️ You have 0.0 ETH contribution balance to claim.
                </div>
            )}

            {isExpired && !targetMet && userContribution > 0 && (
                <div className="alert alert-danger">
                    ⚠️ Campaign failed to reach funding target. You are eligible to claim a full refund of {userContributionEth} ETH.
                </div>
            )}

            <button 
                className="btn btn-warning btn-block btn-glow" 
                onClick={handleRefund} 
                disabled={!canClaimRefund}
            >
                {isSubmitting ? 'Processing Refund...' : 'Claim 100% ETH Refund'}
            </button>

            {/* Refund Transaction Feedback Banner */}
            {txState.status !== 'idle' && (
                <div className={`tx-status-banner status-${txState.status}`}>
                    {txState.status === 'pending' && <span className="spinner">⏳</span>}
                    {txState.status === 'submitted' && <span className="spinner">🔄</span>}
                    {txState.status === 'success' && <span>✅</span>}
                    {txState.status === 'error' && <span>❌</span>}
                    
                    <div className="tx-status-content">
                        <p>{txState.message}</p>
                        {txState.txHash && (
                            <a 
                                href={`https://sepolia.etherscan.io/tx/${txState.txHash}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="etherscan-link"
                            >
                                View Refund Tx on Etherscan ↗
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
