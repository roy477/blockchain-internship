// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ProgreeToken
 * @dev Standard compliant ERC-20 token implementation for Internship Task 3.
 * Inherits standard minting, balances, approvals, and transfer mechanics from OpenZeppelin.
 */
contract ProgreeToken is ERC20 {
    /**
     * @notice Contract constructor that sets Token Name, Symbol, and mints initial supply.
     * @dev Initial supply of 1,000,000 PRG tokens with 18 decimals is minted directly to msg.sender (deployer).
     */
    constructor() ERC20("Progree Token", "PRG") {
        // Mint 1,000,000 PRG with 18 decimal places (1,000,000 * 10^18)
        _mint(msg.sender, 1_000_000 * (10 ** decimals()));
    }
}
