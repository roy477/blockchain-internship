# Task 4: Multi-Party Escrow Decentralized Application (DApp)

## Overview
A complete Web3 Decentralized Application (DApp) allowing multiple users to contribute cryptocurrency (ETH) toward a shared project funding goal on the **Ethereum Sepolia Testnet**. The smart contract manages contributions, funding deadlines, conditional owner fund release, and automatic contributor refunds.

---

## Architecture Diagram

```
+------------------+         +------------------+         +------------------+
|   User Wallet    | <-----> |  React Frontend  | <-----> |   Ethers.js v6   |
|    (MetaMask)    |         |   (Vite Dashboard)         | (BrowserProvider)|
+------------------+         +------------------+         +------------------+
                                                                   |
                                                                   v
                                                        +---------------------+
                                                        |   Sepolia Network   |
                                                        | MultiPartyEscrow.sol|
                                                        +---------------------+
```

---

## Safe Testing Strategy for Development Deadlines

> [!TIP]
> **DEVELOPMENT & DEMO DEADLINE STRATEGY**:
> When deploying `MultiPartyEscrow.sol` to Sepolia for testing and presentation:
> - Set `_fundingTargetWei` to `10000000000000000` (0.01 ETH) or `50000000000000000` (0.05 ETH).
> - Set `_durationSeconds` to a short testing duration such as `120` seconds (2 minutes) or `300` seconds (5 minutes).
> - This allows you to test post-deadline refund and fund-release pathways quickly during an internship demonstration without waiting days for a production deadline to expire.

---

## Remix IDE Deployment Guide for MultiPartyEscrow.sol

1. Open [Remix IDE](https://remix.ethereum.org).
2. Create file `contracts/MultiPartyEscrow.sol` and paste contract code.
3. In compiler tab, select version `0.8.20` and click **Compile**.
4. Open **Deploy & Run Transactions** tab.
5. Environment: Select **Injected Provider - MetaMask**. Ensure MetaMask is on **Sepolia Testnet**.
6. In Deploy dropdown parameters:
   - `_fundingTargetWei`: `50000000000000000` (0.05 ETH in Wei)
   - `_durationSeconds`: `300` (5 minutes for live demonstration testing)
7. Click **Transact** / **Deploy** and confirm transaction in MetaMask.
8. Copy the deployed contract address and update `CONTRACT_ADDRESS` inside `task-4-escrow-dapp/frontend/src/contract.js`.

---

## Comprehensive 11-Point Testing Matrix

| Test # | Test Scenario | Procedure / Inputs | Expected Result | Status |
| :---: | :--- | :--- | :--- | :---: |
| **1** | Wallet Connection | Click "Connect Wallet" button in DApp | Displays connected address (`0x1234...5678`) & Sepolia network badge | ✅ Pass |
| **2** | ETH Contribution | Enter `0.01 ETH` and click "Contribute ETH" | MetaMask prompts approval; transaction confirms on Sepolia | ✅ Pass |
| **3** | State Update Verification | Query Total Funded & Progress Bar | Total Funded increases by 0.01 ETH; user contribution updates | ✅ Pass |
| **4** | Zero ETH Validation | Attempt contributing `0 ETH` | Transaction rejected locally by validation | ✅ Pass |
| **5** | Post-Deadline Contribution | Attempt contributing after deadline | Smart contract reverts: `"Escrow: Funding campaign has ended"` | ✅ Pass |
| **6** | Target Met Fund Release | Target achieved + Deadline passed -> Owner clicks "Release Funds" | Contract transfers full balance to owner; `fundsReleased = true` | ✅ Pass |
| **7** | Failed Target Refund | Target NOT met + Deadline passed -> Contributor clicks "Claim Refund" | Contract refunds 100% user deposit back to contributor | ✅ Pass |
| **8** | Double Refund Prevention | Contributor clicks "Claim Refund" a second time | Transaction reverts: `"Escrow: No contribution balance available"` | ✅ Pass |
| **9** | Non-Owner Release Access | Non-owner wallet attempts calling `releaseFunds()` | Smart contract reverts: `"Escrow: Caller is not project owner"` | ✅ Pass |
| **10** | Premature Release Access | Owner attempts calling `releaseFunds()` before deadline | Smart contract reverts: `"Escrow: Deadline has not passed yet"` | ✅ Pass |
| **11** | Reentrancy Protection | Review `nonReentrant` modifier & CEI pattern in contract | Code analysis proves state reset occurs prior to ETH transfers | ✅ Pass |

---

## Screenshots to Capture for Internship Submission

1. **Successful Remix Deployment**: Remix output showing deployment tx hash and contract address.
2. **DApp Landing Page**: Web dashboard loaded with status bar and cards.
3. **MetaMask Wallet Connected**: Top bar showing `0x...` address and Sepolia green badge.
4. **Contribution Transaction**: MetaMask popup confirming contribution tx.
5. **Updated Funding Dashboard**: Dashboard showing progress bar filled with updated ETH amount.
6. **Refund / Release Execution**: Successful transaction notification banner with Etherscan link.
