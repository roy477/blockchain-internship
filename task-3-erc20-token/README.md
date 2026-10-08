# Task 3: ERC-20 Standard Token Implementation (Progree Token)

## Objective
Create, compile, and deploy a standard-compliant ERC-20 fungible token (`Progree Token` / `PRG`) on the Ethereum Sepolia Testnet using Solidity `^0.8.20`, OpenZeppelin Contracts, Remix IDE, and MetaMask.

---

## Token Specifications

- **Token Name**: Progree Token
- **Token Symbol**: PRG
- **Decimals**: 18
- **Initial Supply**: 1,000,000 PRG
- **Target Network**: Ethereum Sepolia Testnet (Chain ID: `11155111`)
- **Base Framework**: `@openzeppelin/contracts/token/ERC20/ERC20.sol`

---

## Technical Architecture & Inherited Standard Functions

The contract inherits from OpenZeppelin's standard `ERC20.sol` implementation, guaranteeing full compliance with ERC-20 standards:

1. `totalSupply()`: Returns the total circulating token supply (`1,000,000 * 10^18`).
2. `balanceOf(address account)`: Returns the token balance of a specific wallet address.
3. `transfer(address recipient, uint256 amount)`: Moves `amount` tokens from caller (`msg.sender`) to `recipient`.
4. `approve(address spender, uint256 amount)`: Grants permission to `spender` to withdraw up to `amount` tokens from caller.
5. `allowance(address owner, address spender)`: Queries the remaining tokens `spender` is authorized to spend on behalf of `owner`.
6. `transferFrom(address sender, address recipient, uint256 amount)`: Moves `amount` tokens from `sender` to `recipient` using the caller's allowance.

---

## Testnet Safety & Security Guidelines

> [!WARNING]
> **CRITICAL SECURITY RULES**:
> 1. **Testnet Only**: Deploy exclusively to **Ethereum Sepolia Testnet**. NEVER deploy this code to Ethereum Mainnet for internship assignments.
> 2. **Never Expose Private Keys**: NEVER paste your private key, seed phrase, or `.env` secrets into Remix IDE, GitHub, or any public platform.
> 3. **Use Test ETH Only**: Acquire free testnet ETH from official Sepolia faucets (e.g., Google Cloud Sepolia Faucet or Chainlink Faucet).
> 4. **MetaMask Signing**: Always use MetaMask as an Injected Provider for signing transactions securely.

---

## Step-by-Step Remix IDE Deployment Guide

### Step 1: Prepare Remix IDE
1. Open your web browser and navigate to [https://remix.ethereum.org](https://remix.ethereum.org).
2. In the **File Explorer** tab, create a folder named `contracts/`.
3. Create a new file named `ProgreeToken.sol` inside `contracts/`.
4. Copy the complete contents of `ProgreeToken.sol` from this repository and paste it into Remix.

### Step 2: Compile Contract
1. Click on the **Solidity Compiler** icon on the left sidebar.
2. Select **Compiler Version**: `0.8.20` (or `0.8.24`).
3. Set **EVM Version**: `default` or `shanghai` / `cancun`.
4. Click **Compile ProgreeToken.sol**. Ensure a green checkmark appears indicating zero compilation errors.

### Step 3: Connect MetaMask & Network
1. Open your MetaMask browser extension.
2. Ensure network is set to **Sepolia Testnet** (Chain ID: `11155111`).
3. Ensure you have Sepolia testnet ETH in your wallet for gas fees.

### Step 4: Deploy Contract
1. Click on the **Deploy & Run Transactions** icon on the left sidebar.
2. Select **Environment**: `Injected Provider - MetaMask`.
3. MetaMask will prompt you to connect your account. Confirm connection.
4. Verify **Contract** dropdown shows `ProgreeToken - contracts/ProgreeToken.sol`.
5. Click the orange **Deploy** button.
6. MetaMask will popup requesting transaction approval. Review estimated gas fee and click **Confirm**.
7. Wait 10-15 seconds for Sepolia block confirmation.
8. Under **Deployed Contracts**, expand `PROGREETOKEN AT 0x...`.
9. Copy your deployed contract address and transaction hash.

---

## Testing Procedure (Remix IDE Console)

After deployment, perform these standard manual tests in Remix IDE under **Deployed Contracts**:

### Test 1: Verify Total Supply
- Click `totalSupply`.
- **Expected Output**: `1000000000000000000000000` (1,000,000 PRG in 18-decimal wei notation).

### Test 2: Verify Deployer Balance
- Paste deployer address into `balanceOf` input field and click `balanceOf`.
- **Expected Output**: `1000000000000000000000000`.

### Test 3: Transfer Tokens
- Call `transfer(recipientAddress, 100000000000000000000)` (transfers 100 PRG).
- Confirm transaction in MetaMask.
- Query `balanceOf(recipientAddress)` -> **Expected**: `100000000000000000000`.
- Query `balanceOf(deployerAddress)` -> **Expected**: `999900000000000000000000`.

### Test 4: Approval & Allowance
- Call `approve(spenderAddress, 50000000000000000000)` (approves 50 PRG).
- Query `allowance(deployerAddress, spenderAddress)` -> **Expected**: `50000000000000000000`.

---

## Screenshots to Capture for Internship Submission

1. **Remix Compilation**: Screenshot showing `ProgreeToken.sol` compiled with green checkmark.
2. **MetaMask Transaction Approval**: Screenshot of MetaMask popup confirming deployment on Sepolia.
3. **Deployed Contract in Remix**: Screenshot showing expanded contract methods (`totalSupply`, `balanceOf`, `transfer`).
4. **Sepolia Etherscan Verification**: Screenshot of contract address page on `https://sepolia.etherscan.io`.
