import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_CHAIN_ID } from './contract';
import WalletConnect from './components/WalletConnect';
import ProjectStats from './components/ProjectStats';
import ContributionForm from './components/ContributionForm';
import RefundButton from './components/RefundButton';
import ReleaseFunds from './components/ReleaseFunds';
import './App.css';

export default function App() {
    const [account, setAccount] = useState('');
    const [chainId, setChainId] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    
    // Contract Metrics State
    const [stats, setStats] = useState({
        projectOwner: '',
        fundingTargetEth: '0.0',
        totalFundedEth: '0.0',
        contractBalanceEth: '0.0',
        userContributionEth: '0.0',
        remainingSeconds: 0,
        fundsReleased: false,
        isLoading: true
    });

    // Helper to get Web3 Provider & Signer
    const getProviderAndSigner = useCallback(async () => {
        if (!window.ethereum) throw new Error("MetaMask is not installed in your browser.");
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return { provider, signer };
    }, []);

    // Fetch Smart Contract Read State
    const fetchContractData = useCallback(async () => {
        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS") {
            setStats(prev => ({ ...prev, isLoading: false }));
            return;
        }

        try {
            const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
            if (!provider) return;

            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            const [owner, targetWei, totalWei, balanceWei, released, remainingSec] = await Promise.all([
                contract.projectOwner(),
                contract.fundingTarget(),
                contract.totalFunded(),
                contract.getContractBalance(),
                contract.fundsReleased(),
                contract.getRemainingTime()
            ]);

            let userContribution = '0.0';
            if (account) {
                const userWei = await contract.getContribution(account);
                userContribution = ethers.formatEther(userWei);
            }

            setStats({
                projectOwner: owner,
                fundingTargetEth: ethers.formatEther(targetWei),
                totalFundedEth: ethers.formatEther(totalWei),
                contractBalanceEth: ethers.formatEther(balanceWei),
                userContributionEth: userContribution,
                remainingSeconds: Number(remainingSec),
                fundsReleased: released,
                isLoading: false
            });
        } catch (error) {
            console.error("Error loading contract state:", error);
            setStats(prev => ({ ...prev, isLoading: false }));
        }
    }, [account]);

    // Connect MetaMask Wallet
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask extension not found! Please install MetaMask to interact with this DApp.");
            return;
        }

        setIsConnecting(true);
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const currentChain = await window.ethereum.request({ method: 'eth_chainId' });
            
            setAccount(accounts[0]);
            setChainId(parseInt(currentChain, 16));
        } catch (err) {
            console.error("User rejected wallet connection:", err);
        } finally {
            setIsConnecting(false);
        }
    };

    // Switch Wallet to Sepolia Network
    const switchNetwork = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }] // Sepolia 11155111
            });
        } catch (switchError) {
            console.error("Failed to switch network:", switchError);
        }
    };

    // Handle ETH Contribution Transaction
    const handleContribute = async (amountEth, updateStatus) => {
        const { signer } = await getProviderAndSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const valWei = ethers.parseEther(amountEth);
        updateStatus('submitted', 'Transaction submitted to network. Confirming block...');
        
        const tx = await contract.contribute({ value: valWei });
        updateStatus('submitted', 'Transaction sent! Waiting for block inclusion...', tx.hash);

        await tx.wait();
        updateStatus('success', `Successfully contributed ${amountEth} ETH!`, tx.hash);
        fetchContractData();
    };

    // Handle Contributor Refund Transaction
    const handleRefund = async (updateStatus) => {
        const { signer } = await getProviderAndSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        updateStatus('submitted', 'Submitting refund transaction...');
        const tx = await contract.refund();
        updateStatus('submitted', 'Refund transaction sent! Waiting for confirmation...', tx.hash);

        await tx.wait();
        updateStatus('success', 'Refund transaction confirmed! ETH returned to your wallet.', tx.hash);
        fetchContractData();
    };

    // Handle Project Owner Fund Release Transaction
    const handleRelease = async (updateStatus) => {
        const { signer } = await getProviderAndSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        updateStatus('submitted', 'Submitting owner fund release transaction...');
        const tx = await contract.releaseFunds();
        updateStatus('submitted', 'Release transaction sent! Waiting for block confirmation...', tx.hash);

        await tx.wait();
        updateStatus('success', 'Funds successfully released to Project Owner wallet!', tx.hash);
        fetchContractData();
    };

    // Wallet & Network Event Listeners
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
                if (accounts.length > 0) setAccount(accounts[0]);
            });

            window.ethereum.request({ method: 'eth_chainId' }).then(chain => {
                setChainId(parseInt(chain, 16));
            });

            window.ethereum.on('accountsChanged', (accs) => {
                setAccount(accs.length > 0 ? accs[0] : '');
            });

            window.ethereum.on('chainChanged', (chain) => {
                setChainId(parseInt(chain, 16));
            });
        }
    }, []);

    // Refresh contract state periodically and on dependency change
    useEffect(() => {
        fetchContractData();
        const interval = setInterval(fetchContractData, 5000);
        return () => clearInterval(interval);
    }, [fetchContractData]);

    return (
        <div className="app-container">
            {/* Top Navigation & Wallet Connection */}
            <WalletConnect 
                account={account} 
                chainId={chainId} 
                onConnect={connectWallet} 
                onSwitchNetwork={switchNetwork}
                isConnecting={isConnecting}
            />

            {/* Unconfigured Contract Warning Banner */}
            {CONTRACT_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS" && (
                <div className="alert alert-warning" style={{ marginBottom: '24px' }}>
                    ⚙️ <strong>Configuration Action Required:</strong> Deploy <code>MultiPartyEscrow.sol</code> to Sepolia Testnet using Remix IDE, then update <code>CONTRACT_ADDRESS</code> inside <code>src/contract.js</code>.
                </div>
            )}

            {/* Interactive Stats Dashboard */}
            <ProjectStats stats={stats} account={account} />

            {/* Main Interactive Action Cards Grid */}
            <div className="actions-grid">
                {/* 1. Contribution Card */}
                <ContributionForm 
                    onContribute={handleContribute}
                    disabled={!account || chainId !== SEPOLIA_CHAIN_ID}
                    remainingSeconds={stats.remainingSeconds}
                    fundsReleased={stats.fundsReleased}
                />

                {/* 2. Contributor Refund Card */}
                <RefundButton 
                    onRefund={handleRefund}
                    userContributionEth={stats.userContributionEth}
                    remainingSeconds={stats.remainingSeconds}
                    totalFundedEth={stats.totalFundedEth}
                    fundingTargetEth={stats.fundingTargetEth}
                />

                {/* 3. Owner Fund Release Card */}
                <ReleaseFunds 
                    onRelease={handleRelease}
                    account={account}
                    projectOwner={stats.projectOwner}
                    remainingSeconds={stats.remainingSeconds}
                    totalFundedEth={stats.totalFundedEth}
                    fundingTargetEth={stats.fundingTargetEth}
                    fundsReleased={stats.fundsReleased}
                    contractBalanceEth={stats.contractBalanceEth}
                />
            </div>

            <footer className="app-footer">
                <p>Multi-Party Escrow Web3 DApp — Blockchain Development Internship Assignment</p>
                <p>Deployed on Ethereum Sepolia Testnet | Powered by React, Vite, Ethers.js v6 & OpenZeppelin</p>
            </footer>
        </div>
    );
}
