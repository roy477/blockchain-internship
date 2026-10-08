/**
 * MultiPartyEscrow Smart Contract ABI & Configuration
 * 
 * Replace `CONTRACT_ADDRESS` with your actual deployed contract address on Sepolia testnet.
 */

export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const SEPOLIA_CHAIN_ID = 11155111; // Hex: 0xaa36a7

export const CONTRACT_ABI = [
  "constructor(uint256 _fundingTargetWei, uint256 _durationSeconds)",
  "event ContributionReceived(address indexed contributor, uint256 amount)",
  "event FundsReleased(address indexed owner, uint256 amount)",
  "event RefundIssued(address indexed contributor, uint256 amount)",
  "function contribute() external payable",
  "function releaseFunds() external",
  "function refund() external",
  "function projectOwner() external view returns (address)",
  "function fundingTarget() external view returns (uint256)",
  "function deadline() external view returns (uint256)",
  "function totalFunded() external view returns (uint256)",
  "function fundsReleased() external view returns (bool)",
  "function contributions(address) external view returns (uint256)",
  "function getContribution(address contributor) external view returns (uint256)",
  "function getContractBalance() external view returns (uint256)",
  "function getRemainingTime() external view returns (uint256)"
];
