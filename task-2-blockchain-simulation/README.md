# Task 2: Immutability Ledger Block Hashing Simulation

## Objective
Build a local cryptographic Node.js console application that demonstrates fundamental blockchain immutability primitives: chained SHA-256 block hashes, parent hash pointers, chain integrity validation, and automated tamper detection.

---

## Technologies Used
- **Runtime**: Node.js (v16+)
- **Cryptography**: Native Node.js `crypto` module (`sha256`)
- **Language**: JavaScript (ES6+ Classes)
- **Serialization**: Deterministic `JSON.stringify`

---

## Architecture & Data Schema

### Block Schema
Each block in the ledger contains five essential properties:

```js
Block {
  index: number,          // Sequential position (0, 1, 2, ...)
  timestamp: string,      // ISO creation timestamp
  transactions: any,      // Payload (array of transaction objects or string)
  previousHash: string,   // 64-char SHA-256 hash of the parent block
  hash: string            // 64-char SHA-256 hash of this block's contents
}
```

### Cryptographic Chaining Diagram

```
+--------------------------+      +--------------------------+      +--------------------------+
|         Genesis          |      |         Block 1          |      |         Block 2          |
| index: 0                 |      | index: 1                 |      | index: 2                 |
| prevHash: "0"            |<-----+ prevHash: "9f8a..."      |<-----+ prevHash: "a4c2..."      |
| hash: "9f8a..."          |      | hash: "a4c2..."          |      | hash: "7b11..."          |
+--------------------------+      +--------------------------+      +--------------------------+
```

---

## Cryptographic Principles Explained

### What is SHA-256?
SHA-256 (Secure Hash Algorithm 256-bit) is a cryptographic hash function that converts an arbitrary input string into a fixed 256-bit (64 hexadecimal characters) output string.

### Why Blockchains Use Cryptographic Hashes
1. **Determinism**: The exact same input content always produces the exact same hash output.
2. **One-Way Function**: It is computationally impossible to reverse-engineer the original input payload from its output hash.
3. **Avalanche Effect**: Changing even a single character or comma in the input payload completely changes the generated SHA-256 hash output.

### How Chaining Guarantees Immutability
Every block stores the SHA-256 hash of the preceding block (`previousHash`). Because a block's `hash` calculation includes its `previousHash`, modifying any historical block invalidates its hash, which breaks the `previousHash` pointer of the subsequent block. This domino effect invalidates the entire chain onward.

---

## Installation & Execution

### Prerequisites
- Node.js installed on your machine (`node -v`).

### Running the Simulation

```bash
# Navigate to the task directory
cd task-2-blockchain-simulation

# Run the simulation & automated tests using Node.js
node blockchain.js
```

---

## Expected Output

```
🚀 Initializing Blockchain Hashing & Immutability Simulation...

📦 Mining Block 1...
📦 Mining Block 2...
📦 Mining Block 3...

==================== BLOCKCHAIN LEDGER ====================
Block #0
Timestamp    : 2026-01-01T00:00:00.000Z
Transactions : "Genesis Block - Internship Immutability Ledger"
Previous Hash: 0
Current Hash : 7a26f...
-----------------------------------------------------------
...

================ COMPACT CHAIN SUMMARY ================
Block #0 → 7a26f...
Block #1 → 4b91c...
Block #2 → e308a...
Block #3 → 18d2f...
=======================================================

========== VALIDATION ==========
Is blockchain valid? true

========== TAMPERING TEST 1: MUTATE TRANSACTION DATA ==========
⚠️  Tamper Attempt: Changing Block 1 amount from 10.5 PRG to 1000.0 PRG...
Is blockchain valid after data tampering? false

========== TAMPERING TEST 2: MUTATE PREVIOUS HASH LINK ==========
⚠️  Tamper Attempt: Corrupting previousHash reference of Block 2...
Is blockchain valid after previousHash link tampering? false

==================== AUTOMATED TEST SUITE ====================
✅ PASS: Genesis block exists at index 0
✅ PASS: Block 1 previousHash matches Genesis hash
✅ PASS: Block hash is valid 64-character hexadecimal SHA-256 string
✅ PASS: Valid blockchain returns isChainValid() === true
✅ PASS: Modified transaction payload causes isChainValid() to return false
✅ PASS: Modified previousHash reference causes isChainValid() to return false

Test Summary: 6 Passed, 0 Failed
==============================================================
```

---

## Limitations & Educational Scope
This simulation is designed for educational ledger architecture demonstration. It does not include:
- Peer-to-peer networking (P2P gossip).
- Proof-of-Work (PoW) consensus mining or Proof-of-Stake (PoS).
- Asymmetric key signature verification (ECDSA/secp256k1).
- Persistent database storage (LevelDB / SQLite).
