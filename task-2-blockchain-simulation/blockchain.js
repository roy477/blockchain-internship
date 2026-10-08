/**
 * Task 2: Immutability Ledger Block Hashing Simulation
 * 
 * Demonstrates core blockchain primitives:
 * - Block schema (index, timestamp, transactions, previousHash, hash)
 * - Deterministic SHA-256 cryptographic hashing using Node.js native crypto module
 * - Cryptographic block chaining via previousHash references
 * - Chain validation and automated tamper detection algorithms
 */

const crypto = require('crypto');

/**
 * Class representing a single Block in the blockchain ledger.
 */
class Block {
    /**
     * @param {number} index - Position of the block in the chain.
     * @param {string} timestamp - ISO timestamp or formatted date string.
     * @param {Array<Object>|string} transactions - Transaction payload stored in the block.
     * @param {string} previousHash - SHA-256 hash of the preceding block in the chain.
     */
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    /**
     * Calculates the SHA-256 hash of the block based on its contents.
     * Uses deterministic JSON stringification of transactions to maintain consistency.
     * @returns {string} Hexadecimal SHA-256 hash string.
     */
    calculateHash() {
        const payload = this.index + 
                        this.timestamp + 
                        JSON.stringify(this.transactions) + 
                        this.previousHash;

        return crypto
            .createHash('sha256')
            .update(payload)
            .digest('hex');
    }
}

/**
 * Class representing the Blockchain ledger containing chained blocks.
 */
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    /**
     * Creates the initial Genesis block (Block #0) for the blockchain.
     * @returns {Block} The Genesis block.
     */
    createGenesisBlock() {
        return new Block(0, "2026-01-01T00:00:00.000Z", "Genesis Block - Internship Immutability Ledger", "0");
    }

    /**
     * Retrieves the most recently added block in the chain.
     * @returns {Block} The latest block.
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * Appends a new block to the chain after setting its previousHash link
     * and calculating its cryptographic SHA-256 hash.
     * @param {Block} newBlock - The block instance to be added.
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    /**
     * Validates the integrity of the entire blockchain ledger.
     * Checks:
     * 1. Re-computed hash matches stored block hash.
     * 2. Block's previousHash matches the prior block's actual hash.
     * @returns {boolean} True if chain is untampered and valid, false otherwise.
     */
    isChainValid() {
        // Validate Genesis block initial link parameter
        if (this.chain[0].previousHash !== "0") {
            return false;
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Verify internal content hash integrity
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Verify cryptographic link integrity
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

    /**
     * Prints a detailed view of all blocks in the ledger.
     */
    printChain() {
        console.log("\n==================== BLOCKCHAIN LEDGER ====================");
        this.chain.forEach(block => {
            console.log(`Block #${block.index}`);
            console.log(`Timestamp    : ${block.timestamp}`);
            console.log(`Transactions : ${JSON.stringify(block.transactions)}`);
            console.log(`Previous Hash: ${block.previousHash}`);
            console.log(`Current Hash : ${block.hash}`);
            console.log("-----------------------------------------------------------");
        });
    }

    /**
     * Additional Professional Feature: Compact Summary View
     * Prints a lightweight overview showing exact block hash relationships.
     */
    printSummary() {
        console.log("\n================ COMPACT CHAIN SUMMARY ================");
        this.chain.forEach(block => {
            console.log(`Block #${block.index} → ${block.hash}`);
        });
        console.log("=======================================================\n");
    }
}

// ============================================================================
// SIMULATION & DEMONSTRATION RUNNER
// ============================================================================

function runSimulation() {
    console.log("🚀 Initializing Blockchain Hashing & Immutability Simulation...");

    // 1. Instantiate Blockchain
    const progreeCoin = new Blockchain();

    // 2. Add sample transactions in 3 blocks
    console.log("\n📦 Mining Block 1...");
    progreeCoin.addBlock(new Block(1, "2026-10-08T10:00:00.000Z", [
        { sender: "Alice", receiver: "Bob", amount: 10.5, token: "PRG" }
    ]));

    console.log("📦 Mining Block 2...");
    progreeCoin.addBlock(new Block(2, "2026-10-08T10:05:00.000Z", [
        { sender: "Bob", receiver: "Charlie", amount: 4.2, token: "PRG" },
        { sender: "Charlie", receiver: "Dave", amount: 1.0, token: "PRG" }
    ]));

    console.log("📦 Mining Block 3...");
    progreeCoin.addBlock(new Block(3, "2026-10-08T10:10:00.000Z", [
        { sender: "Dave", receiver: "Eve", amount: 0.75, token: "PRG" }
    ]));

    // 3. Print full chain state and compact hash summary
    progreeCoin.printChain();
    progreeCoin.printSummary();

    // 4. Initial Integrity Validation
    console.log("========== VALIDATION ==========");
    const initialValidity = progreeCoin.isChainValid();
    console.log(`Is blockchain valid? ${initialValidity}`);

    // 5. Tamper Test 1: Modify transaction payload in Block 1
    console.log("\n========== TAMPERING TEST 1: MUTATE TRANSACTION DATA ==========");
    console.log("⚠️  Tamper Attempt: Changing Block 1 amount from 10.5 PRG to 1000.0 PRG...");
    progreeCoin.chain[1].transactions[0].amount = 1000.0;
    
    const postTamperValidity1 = progreeCoin.isChainValid();
    console.log(`Is blockchain valid after data tampering? ${postTamperValidity1}`);

    // 6. Tamper Test 2: Modify previousHash in Block 2
    console.log("\n========== TAMPERING TEST 2: MUTATE PREVIOUS HASH LINK ==========");
    console.log("⚠️  Tamper Attempt: Corrupting previousHash reference of Block 2...");
    // Reset transaction payload to simulate sneaky hash fix attempt without fixing child links
    progreeCoin.chain[1].hash = progreeCoin.chain[1].calculateHash(); 
    progreeCoin.chain[2].previousHash = "0000000000000000000000000000000000000000000000000000000000000000";

    const postTamperValidity2 = progreeCoin.isChainValid();
    console.log(`Is blockchain valid after previousHash link tampering? ${postTamperValidity2}`);

    // 7. Automated Test Suite Execution
    runTests();
}

function runTests() {
    console.log("\n==================== AUTOMATED TEST SUITE ====================");
    let passed = 0;
    let failed = 0;

    function assert(condition, testName) {
        if (condition) {
            console.log(`✅ PASS: ${testName}`);
            passed++;
        } else {
            console.log(`❌ FAIL: ${testName}`);
            failed++;
        }
    }

    // Test 1: Genesis block exists
    const testChain = new Blockchain();
    assert(testChain.chain.length === 1 && testChain.chain[0].index === 0, "Genesis block exists at index 0");

    // Test 2: Blocks are correctly linked
    testChain.addBlock(new Block(1, "2026-10-08T12:00:00Z", "Tx 1"));
    assert(testChain.chain[1].previousHash === testChain.chain[0].hash, "Block 1 previousHash matches Genesis hash");

    // Test 3: SHA-256 Hash generated
    assert(typeof testChain.chain[1].hash === "string" && testChain.chain[1].hash.length === 64, "Block hash is valid 64-character hexadecimal SHA-256 string");

    // Test 4: Valid chain returns true
    assert(testChain.isChainValid() === true, "Valid blockchain returns isChainValid() === true");

    // Test 5: Modified transaction returns false
    testChain.chain[1].transactions = "Tampered Tx Payload";
    assert(testChain.isChainValid() === false, "Modified transaction payload causes isChainValid() to return false");

    // Test 6: Modified previousHash returns false
    const testChain2 = new Blockchain();
    testChain2.addBlock(new Block(1, "2026-10-08T12:00:00Z", "Tx 1"));
    testChain2.addBlock(new Block(2, "2026-10-08T12:05:00Z", "Tx 2"));
    testChain2.chain[2].previousHash = "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    assert(testChain2.isChainValid() === false, "Modified previousHash reference causes isChainValid() to return false");

    console.log(`\nTest Summary: ${passed} Passed, ${failed} Failed`);
    console.log("==============================================================");
}

// Execute simulation
runSimulation();

module.exports = { Block, Blockchain };
