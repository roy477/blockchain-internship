# Multi-Party Escrow DApp — React Frontend

## Overview
This is the Web3 frontend for the **Multi-Party Escrow DApp**, built with React, Vite, Ethers.js v6, and Tailwind-inspired custom Vanilla CSS. It provides a real-time dashboard for campaign tracking, MetaMask wallet integration, ETH contributions, contributor refunds, and project owner fund release workflows.

---

## Technical Stack
- **Framework**: React 18 + Vite 5
- **Web3 Provider**: Ethers.js v6 (`BrowserProvider`, `Contract`, `parseEther`, `formatEther`)
- **Wallet Connection**: MetaMask API (`window.ethereum`)
- **Network Enforcement**: Ethereum Sepolia Testnet (Chain ID `11155111` / `0xaa36a7`)

---

## Features

1. **MetaMask Wallet Integration**:
   - Connection status indicator (`0x1234...5678`).
   - Automated Sepolia network check and automated network switch trigger.
   - Account and network change event listeners (`accountsChanged`, `chainChanged`).

2. **Real-Time Project Stats**:
   - Target goal and total raised progress bar (`%`).
   - Contract ETH balance display.
   - Remaining time countdown (`HH:MM:SS`).
   - Individual user contribution tracker.
   - Dynamic campaign status badges (`IN PROGRESS`, `TARGET MET`, `FAILED — REFUNDS OPEN`, `FUNDS RELEASED`).

3. **Interactive Workflows**:
   - **Contribution Form**: Preset buttons (`0.01`, `0.05`, `0.1 ETH`) and real-time transaction state feedback (Pending, Submitted, Confirmed with Sepolia Etherscan links).
   - **Contributor Refund Portal**: Explicit eligibility checks and 1-click refund execution.
   - **Project Owner Dashboard**: Clear condition indicators and one-click fund release for campaign owners.

---

## Installation & Running Locally

```bash
# Navigate to frontend folder
cd task-4-escrow-dapp/frontend

# Install node dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser with MetaMask installed.

---

## Contract Address Setup

Open `src/contract.js` and set your deployed `MultiPartyEscrow` contract address:

```js
export const CONTRACT_ADDRESS = "0xYourDeployedContractAddressOnSepolia";
```
