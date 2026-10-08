import React, { useState } from 'react';

/**
 * ContributionForm Component
 * Allows users to input ETH amount, submit contribution to the smart contract, and track transaction states.
 */
export default function ContributionForm({ onContribute, disabled, remainingSeconds, fundsReleased }) {
    const [amount, setAmount] = useState('0.05');
    const [txState, setTxState] = useState({ status: 'idle', message: '', txHash: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isExpired = remainingSeconds <= 0;
    const canContribute = !disabled && !isExpired && !fundsReleased && !isSubmitting;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) {
            setTxState({ status: 'error', message: 'Please enter a valid ETH contribution amount greater than 0.' });
            return;
        }

        setIsSubmitting(true);
        setTxState({ status: 'pending', message: 'Waiting for MetaMask wallet confirmation...' });

        try {
            await onContribute(amount, (status, message, hash) => {
                setTxState({ status, message, txHash: hash || '' });
            });
        } catch (error) {
            setTxState({ 
                status: 'error', 
                message: error?.reason || error?.message || 'Transaction failed or rejected.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="action-card glass-card">
            <h3 className="card-title">
                <span>📥</span> Contribute ETH to Campaign
            </h3>
            <p className="card-desc">
                Support this crowdfunding project. If the target goal is not achieved before the deadline expires, you can claim a 100% ETH refund.
            </p>

            {isExpired && (
                <div className="alert alert-warning">
                    ⚠️  Campaign period has ended. New contributions are closed.
                </div>
            )}

            {fundsReleased && (
                <div className="alert alert-info">
                    ℹ️ Campaign completed and project funds have been released.
                </div>
            )}

            <form onSubmit={handleSubmit} className="form-group">
                <div className="input-wrapper">
                    <label className="input-label">Amount (ETH):</label>
                    <div className="input-with-postfix">
                        <input 
                            type="number" 
                            step="0.001" 
                            min="0.001" 
                            className="form-input" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            disabled={!canContribute}
                            placeholder="0.05"
                        />
                        <span className="postfix">ETH</span>
                    </div>
                </div>

                <div className="preset-buttons">
                    <button type="button" className="btn btn-sm" onClick={() => setAmount('0.01')} disabled={!canContribute}>0.01 ETH</button>
                    <button type="button" className="btn btn-sm" onClick={() => setAmount('0.05')} disabled={!canContribute}>0.05 ETH</button>
                    <button type="button" className="btn btn-sm" onClick={() => setAmount('0.1')} disabled={!canContribute}>0.1 ETH</button>
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary btn-block btn-glow" 
                    disabled={!canContribute}
                >
                    {isSubmitting ? 'Processing Transaction...' : 'Contribute ETH'}
                </button>
            </form>

            {/* Transaction Feedback Banner */}
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
                                View on Sepolia Etherscan ↗
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
