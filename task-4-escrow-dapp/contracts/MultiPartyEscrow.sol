// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MultiPartyEscrow
 * @dev Secure Multi-Party Crowdfunding Escrow Contract for Task 4.
 * Integrates ReentrancyGuard, Checks-Effects-Interactions pattern, and strict access controls.
 */
contract MultiPartyEscrow is ReentrancyGuard {
    // Contract State Variables
    address payable public immutable projectOwner;
    uint256 public immutable fundingTarget;
    uint256 public immutable deadline;
    
    uint256 public totalFunded;
    bool public fundsReleased;

    // Mapping tracking individual contributor deposits: contributor address => deposit amount in wei
    mapping(address => uint256) public contributions;

    // Events
    event ContributionReceived(address indexed contributor, uint256 amount);
    event FundsReleased(address indexed owner, uint256 amount);
    event RefundIssued(address indexed contributor, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == projectOwner, "Escrow: Caller is not project owner");
        _;
    }

    /**
     * @notice Constructor setting funding target and duration.
     * @param _fundingTargetWei Target amount to be raised in Wei.
     * @param _durationSeconds Duration of the funding campaign in seconds.
     */
    constructor(uint256 _fundingTargetWei, uint256 _durationSeconds) {
        require(_fundingTargetWei > 0, "Escrow: Target must be > 0 wei");
        require(_durationSeconds > 0, "Escrow: Duration must be > 0 seconds");

        projectOwner = payable(msg.sender);
        fundingTarget = _fundingTargetWei;
        deadline = block.timestamp + _durationSeconds;
    }

    /**
     * @notice Allows contributors to send ETH toward the crowdfunding goal.
     */
    function contribute() external payable {
        require(block.timestamp < deadline, "Escrow: Funding campaign has ended");
        require(!fundsReleased, "Escrow: Funds have already been released");
        require(msg.value > 0, "Escrow: Contribution amount must be > 0 ETH");

        contributions[msg.sender] += msg.value;
        totalFunded += msg.value;

        emit ContributionReceived(msg.sender, msg.value);
    }

    /**
     * @notice Allows project owner to claim total raised funds if target is met post-deadline.
     * Protected against reentrancy attacks using nonReentrant modifier and CEI pattern.
     */
    function releaseFunds() external onlyOwner nonReentrant {
        require(block.timestamp >= deadline, "Escrow: Deadline has not passed yet");
        require(totalFunded >= fundingTarget, "Escrow: Funding target not achieved");
        require(!fundsReleased, "Escrow: Funds have already been released");

        // Checks-Effects-Interactions: State update before external call
        fundsReleased = true;
        uint256 balanceToTransfer = address(this).balance;

        (bool success, ) = projectOwner.call{value: balanceToTransfer}("");
        require(success, "Escrow: Transfer to project owner failed");

        emit FundsReleased(projectOwner, balanceToTransfer);
    }

    /**
     * @notice Allows contributors to claim a full ETH refund if funding target fails post-deadline.
     * Protected against reentrancy attacks and double-refund exploits.
     */
    function refund() external nonReentrant {
        require(block.timestamp >= deadline, "Escrow: Campaign deadline has not passed");
        require(totalFunded < fundingTarget, "Escrow: Funding target was met; refunds disabled");

        uint256 userContribution = contributions[msg.sender];
        require(userContribution > 0, "Escrow: No contribution balance available to refund");

        // Checks-Effects-Interactions: Reset balance to zero BEFORE external transfer
        contributions[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: userContribution}("");
        require(success, "Escrow: Refund ETH transfer failed");

        emit RefundIssued(msg.sender, userContribution);
    }

    /**
     * @notice Queries contribution amount for a specific address.
     */
    function getContribution(address contributor) external view returns (uint256) {
        return contributions[contributor];
    }

    /**
     * @notice Returns current ETH balance held by the escrow contract.
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Returns seconds remaining until campaign deadline.
     */
    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= deadline) {
            return 0;
        }
        return deadline - block.timestamp;
    }
}
