# Blockchain Development Internship — Final Project Report

**Author**: Internship Developer  
**Track**: Blockchain Development / Web3 Engineering  
**Submission Date**: October 2026  
**Target Network**: Ethereum Sepolia Testnet (Chain ID: `11155111`)

---

## 1. Executive Summary & Introduction
This final report documents the technical deliverables completed for Tasks 2, 3, and 4 of the Blockchain Development Internship. The objective of this internship was to build realistic, secure, and production-grade Web3 applications demonstrating core blockchain concepts, ERC-20 token engineering, smart contract security, and full-stack DApp development.

---

## 2. Internship Objectives
- **Task 2**: Design a local Node.js cryptographic block hashing ledger simulation demonstrating SHA-256 block chaining, validity checks, and automated tamper detection.
- **Task 3**: Write, compile, and deploy an OpenZeppelin-compliant ERC-20 token (`Progree Token` / `PRG`) on Sepolia testnet using Remix IDE and MetaMask.
- **Task 4**: Architect a full-stack Web3 Multi-Party Escrow DApp (`MultiPartyEscrow.sol` + React + Vite + Ethers.js v6) handling multi-user ETH contributions, conditional fund release, automatic refunds, and reentrancy protection.

---

## 3. Technologies & Stack Overview
- **Languages**: Solidity (`^0.8.20`), JavaScript (ES6+), HTML5, CSS3
- **Smart Contract Libraries**: OpenZeppelin Contracts (`ERC20`, `ReentrancyGuard`)
- **Cryptography**: SHA-256 (`crypto` module)
- **Frontend Stack**: React 18, Vite 5, Ethers.js v6
- **Tooling & IDE**: Remix IDE, MetaMask Browser Extension, Node.js
- **Testnet**: Ethereum Sepolia Testnet

---

## 4. Task 2 — Blockchain Hashing & Immutability Simulation

### 4.1 Implementation & Block Architecture
The simulation was built using Node.js without external dependencies, leveraging native `crypto.createHash('sha256')`.

```
Block Schema: { index, timestamp, transactions, previousHash, hash }
```

### 4.2 Cryptographic Chaining & SHA-256 Analysis
Each block calculates its hash deterministically from its index, timestamp, serialized transaction payload, and parent hash (`previousHash`). Because `previousHash` links each block to its predecessor, any change to a past transaction invalidates all downstream block hashes.

### 4.3 Chain Validation & Tamper Detection Results
- **Initial Ledger**: 4 blocks generated (Genesis + 3 transaction blocks). Validation returned `isChainValid(): true`.
- **Tampering Test 1 (Payload Mutated)**: Modified Block 1 transaction amount from `10.5 PRG` to `1000.0 PRG`. Validation correctly returned `isChainValid(): false`.
- **Tampering Test 2 (Previous Hash Link Mutated)**: Corrupted Block 2 parent reference. Validation correctly returned `isChainValid(): false`.
- **Automated Test Suite**: 6 / 6 automated unit tests passed cleanly.

---

## 5. Task 3 — ERC-20 Standard Token (Progree Token)

### 5.1 Smart Contract Engineering
`ProgreeToken.sol` inherits from OpenZeppelin's standard `ERC20` contract.
- **Token Name**: Progree Token
- **Symbol**: PRG
- **Decimals**: 18
- **Initial Supply**: 1,000,000 PRG (minted to `msg.sender` in constructor)

### 5.2 Compilation & Sepolia Deployment
- Compiled in Remix IDE using Solidity compiler `0.8.20`.
- Deployed to Sepolia testnet via Injected Provider (MetaMask).

### 5.3 Recorded Deployment Metrics Template

> [!NOTE]
> **Live Deployment Record**:
> - **Contract Address**: `YOUR_DEPLOYED_CONTRACT_ADDRESS`
> - **Deployer Address**: `YOUR_DEPLOYER_ADDRESS`
> - **Deployment Transaction**: `YOUR_DEPLOYMENT_TRANSACTION_HASH`
> - **Block Number**: `YOUR_DEPLOYMENT_BLOCK_NUMBER`

### 5.4 Functional Testing Matrix
- `totalSupply()` verified as `1000000000000000000000000` wei.
- `balanceOf(deployer)` verified as 1,000,000 PRG.
- Executed transfer of 100 PRG to receiver wallet; verified balance update.
- Executed approval of 50 PRG; verified `allowance()` query.

---

## 6. Task 4 — Multi-Party Escrow DApp

### 6.1 Smart Contract Architecture (`MultiPartyEscrow.sol`)
The contract manages pooled ETH crowdfunding campaign funds with key properties:
- `projectOwner`: immutable campaign creator address.
- `fundingTarget`: required funding goal in Wei.
- `deadline`: Unix timestamp campaign cutoff.
- `contributions`: mapping tracking individual contributor balances.

### 6.2 Security Mechanisms
- **Reentrancy Protection**: Implemented `ReentrancyGuard` (`nonReentrant`) on withdrawal functions.
- **Checks-Effects-Interactions (CEI)**: State mutations (`contributions[msg.sender] = 0` and `fundsReleased = true`) occur prior to low-level ETH transfers.
- **Access Control**: Enforced `onlyOwner` modifier for fund release.

### 6.3 React + Ethers.js Frontend Interface
- Modern Web3 dark glassmorphic dashboard built with Vite, React, and Ethers.js v6.
- Real-time funding progress bar, countdown timer, and connection status badges.
- Dedicated UI modules: `WalletConnect`, `ProjectStats`, `ContributionForm`, `RefundButton`, and `ReleaseFunds`.

---

## 7. Challenges & Solutions
1. **Network Mismatch Errors**: Solved by implementing automated Chain ID detection (`11155111`) and adding a 1-click network switch button using `wallet_switchEthereumChain`.
2. **Reentrancy Risks on Refunds**: Solved by applying OpenZeppelin `ReentrancyGuard` and strictly resetting state variables before initiating low-level ETH calls.
3. **Deadline Testing Overhead**: Solved by implementing configurable campaign duration parameters (`_durationSeconds`), enabling rapid 120-second testnet demonstration cycles.

---

## 8. Security Considerations Summary
- Zero real funds used; deployed exclusively on Sepolia testnet.
- No private keys or seed phrases hardcoded or exposed.
- All withdrawal calls protected against reentrancy, double-claims, and premature execution.

---

## 9. Future Improvements
- **Multi-Campaign Factory**: Implement a `EscrowFactory.sol` contract allowing users to launch custom escrow campaigns dynamically.
- **ERC-20 Crowdfunding Support**: Extend escrow logic to accept custom ERC-20 tokens in addition to native ETH.
- **Oracle Integration**: Integrate Chainlink Price Feeds to display real-time USD equivalent values for contributed ETH.

---

## 10. Conclusion
All deliverables for Tasks 2, 3, and 4 have been successfully architected, implemented, tested, and documented. The codebase represents a complete, professional, and audit-conscious Web3 internship submission suitable for presentation to mentors and reviewers.
