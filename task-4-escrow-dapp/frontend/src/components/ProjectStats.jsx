import React from 'react';

/**
 * ProjectStats Component
 * Displays interactive dashboard stats: Target, Total Funded, Funding %, Contract Balance, Deadline, Remaining Time.
 */
export default function ProjectStats({ stats, account }) {
    const { 
        projectOwner, 
        fundingTargetEth, 
        totalFundedEth, 
        contractBalanceEth, 
        userContributionEth,
        remainingSeconds, 
        fundsReleased,
        isLoading 
    } = stats;

    // Calculate progress percentage
    const target = parseFloat(fundingTargetEth || 0);
    const funded = parseFloat(totalFundedEth || 0);
    const progressPercent = target > 0 ? Math.min(100, ((funded / target) * 100)).toFixed(1) : '0.0';

    // Format remaining time into HH:MM:SS
    const formatTime = (totalSec) => {
        if (totalSec <= 0) return 'Campaign Ended';
        const hours = Math.floor(totalSec / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;
        return `${hours}h ${mins}m ${secs}s`;
    };

    // Determine status badge
    const isTargetMet = funded >= target;
    const isExpired = remainingSeconds <= 0;
    
    let statusText = 'IN PROGRESS';
    let statusClass = 'badge-progress';

    if (fundsReleased) {
        statusText = 'FUNDS RELEASED';
        statusClass = 'badge-released';
    } else if (isTargetMet && isExpired) {
        statusText = 'SUCCESSFUL — READY FOR RELEASE';
        statusClass = 'badge-success';
    } else if (isTargetMet && !isExpired) {
        statusText = 'TARGET MET (CAMPAIGN ACTIVE)';
        statusClass = 'badge-success';
    } else if (!isTargetMet && isExpired) {
        statusText = 'FAILED — REFUNDS OPEN';
        statusClass = 'badge-danger';
    }

    const isOwner = account && projectOwner && account.toLowerCase() === projectOwner.toLowerCase();

    return (
        <div className="stats-container">
            {/* Header Status Bar */}
            <div className="stats-header glass-card">
                <div className="status-meta">
                    <span className="label">Project Campaign Status:</span>
                    <span className={`status-badge ${statusClass}`}>{statusText}</span>
                    {isOwner && <span className="owner-tag">👑 You are Project Owner</span>}
                </div>
                <div className="owner-info">
                    <span className="label">Project Owner:</span>
                    <span className="mono">{projectOwner ? `${projectOwner.substring(0, 8)}...${projectOwner.substring(projectOwner.length - 6)}` : 'Loading...'}</span>
                </div>
            </div>

            {/* Progress Bar Component */}
            <div className="progress-card glass-card">
                <div className="progress-labels">
                    <span>Funding Raised: <strong>{totalFundedEth} ETH</strong></span>
                    <span>Target Goal: <strong>{fundingTargetEth} ETH</strong> ({progressPercent}%)</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }}></div>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <span className="stat-icon">🎯</span>
                    <span className="stat-value">{fundingTargetEth} ETH</span>
                    <span className="stat-label">Funding Target</span>
                </div>

                <div className="stat-card glass-card">
                    <span className="stat-icon">💎</span>
                    <span className="stat-value">{totalFundedEth} ETH</span>
                    <span className="stat-label">Total Funded</span>
                </div>

                <div className="stat-card glass-card">
                    <span className="stat-icon">🏦</span>
                    <span className="stat-value">{contractBalanceEth} ETH</span>
                    <span className="stat-label">Contract Balance</span>
                </div>

                <div className="stat-card glass-card">
                    <span className="stat-icon">⏳</span>
                    <span className="stat-value">{isLoading ? 'Updating...' : formatTime(remainingSeconds)}</span>
                    <span className="stat-label">Remaining Duration</span>
                </div>

                <div className="stat-card glass-card stat-highlight">
                    <span className="stat-icon">🤲</span>
                    <span className="stat-value">{userContributionEth} ETH</span>
                    <span className="stat-label">Your Contribution</span>
                </div>
            </div>
        </div>
    );
}
