# Progree Token (PRG) — Sepolia Deployment Information

This document records the official deployment details for the **Progree Token (PRG)** on the Ethereum Sepolia Testnet.

> [!IMPORTANT]
> **Instructions for Intern / Developer**:
> After deploying your smart contract using Remix IDE and MetaMask, replace the placeholder values (`YOUR_...`) with your actual transaction metrics copied from Remix IDE or [Sepolia Etherscan](https://sepolia.etherscan.io).

---

## Deployment Summary Metrics

| Metadata Field | Recorded Value |
| :--- | :--- |
| **Network Name** | Sepolia Testnet |
| **Chain ID** | `11155111` |
| **Token Name** | Progree Token |
| **Token Symbol** | PRG |
| **Decimals** | 18 |
| **Initial Supply** | 1,000,000 PRG (`1000000000000000000000000` wei) |
| **Contract Address** | `YOUR_DEPLOYED_CONTRACT_ADDRESS` |
| **Deployer Wallet Address** | `YOUR_DEPLOYER_ADDRESS` |
| **Deployment Tx Hash** | `YOUR_DEPLOYMENT_TRANSACTION_HASH` |
| **Block Number** | `YOUR_DEPLOYMENT_BLOCK_NUMBER` |
| **Sepolia Etherscan Link** | `https://sepolia.etherscan.io/address/YOUR_DEPLOYED_CONTRACT_ADDRESS` |

---

## Post-Deployment Verification Checklist

- [ ] **Contract Compiled**: `ProgreeToken.sol` compiled cleanly in Remix with compiler `0.8.20`.
- [ ] **MetaMask Connected**: Injected Provider connected to Sepolia Testnet (Chain ID `11155111`).
- [ ] **Deployer Balance Verified**: `balanceOf(YOUR_DEPLOYER_ADDRESS)` returns `1000000000000000000000000` (1,000,000 PRG).
- [ ] **Total Supply Verified**: `totalSupply()` returns `1000000000000000000000000`.
- [ ] **Transfer Test**: Transferred 100 PRG (`100000000000000000000` wei) to test receiver wallet.
- [ ] **Approval & Allowance Test**: Approved 50 PRG (`50000000000000000000` wei) for spender wallet.
