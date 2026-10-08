import React, { useState } from 'react';

/**
 * ReleaseFunds Component
 * Displays owner-only fund release controls with explicit status explanations when conditions are not met.
 */
export default function ReleaseFunds({ 
    onRelease, 
    account, 
    projectOwner, 
    remainingSeconds, 
    totalFundedEth, 
    fundingTargetEth, 
    fundsReleased,
    contractBalanceEth 
}) {
    const [txState, setTxState] = useState({ status: 'idle', message: '', txHash: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isOwner = account && projectOwner && account.toLowerCase() === projectOwner.toLowerCase();
    const isExpired = remainingSeconds <= 0;
    const targetMet = parseFloat(totalFundedEth || 0) >= parseFloat(fundingTargetEth || 0);

    // Release allowed ONLY IF caller is owner, deadline passed, target met, and not already released
    const canRelease = isOwner && isExpired && targetMet && !fundsReleased && !isSubmitting;

    // Build specific condition reason text
    let statusExplanation = '';
    if (!isOwner) {
        statusExplanation = 'Only the Project Owner can invoke fund release.';
    } else if (fundsReleased) {
        statusExplanation = 'Project funds have already been successfully transferred to your wallet.';
    } else if (!isExpired) {
        statusExplanation = `Campaign active (${remainingSeconds}s remaining). Release unlocks post-deadline.`;
    } else if (!targetMet) {
        statusExplanation = `Funding target not achieved (${totalFundedEth} / ${fundingTargetEth} ETH). Refunds unlocked for contributors.`;
    } else {
        statusExplanation = 'Campaign successful and deadline reached! You can now claim pooled funds.';
    }

    const handleRelease = async () => {
        setIsSubmitting(true);
        setTxState({ status: 'pending', message: 'Waiting for MetaMask owner signature...' });

        try {
            await onRelease((status, message, hash) => {
                setTxState({ status, message, txHash: hash || '' });
            });
        } catch (error) {
            setTxState({ 
                status: 'error', 
                message: error?.reason || error?.message || 'Fund release transaction failed.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`action-card glass-card ${isOwner ? 'owner-card' : ''}`}>
            <h3 className="card-title">
                <span>👑</span> Project Owner Dashboard
            </h3>

            <div className="owner-status-box">
                <div className="status-row">
                    <span>Target Reached:</span>
                    <strong className={targetMet ? 'text-success' : 'text-danger'}>{targetMet ? 'YES ✅' : 'NO ❌'}</strong>
                </div>
                <div className="status-row">
                    <span>Deadline Passed:</span>
                    <strong className={isExpired ? 'text-success' : 'text-warning'}>{isExpired ? 'YES ✅' : 'NO ⏳'}</strong>
                </div>
                <div className="status-row">
                    <span>Funds Claimed:</span>
                    <strong>{fundsReleased ? 'YES ✅' : 'NO 🔒'}</strong>
                </div>
            </div>

            <div className="info-box info-neutral">
                💡 <strong>Release Condition Status:</strong> {statusExplanation}
            </div>

            {isOwner && (
                <button 
                    className="btn btn-success btn-block btn-glow" 
                    onClick={handleRelease} 
                    disabled={!canRelease}
                >
                    {isSubmitting ? 'Releasing Funds...' : `Release ${contractBalanceEth} ETH to Owner`}
                </button>
            )}

            {/* Release Transaction Feedback Banner */}
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
                                View Release Tx on Etherscan ↗
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
