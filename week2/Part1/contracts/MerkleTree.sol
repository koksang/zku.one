//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import { PoseidonT3 } from "./Poseidon.sol"; //an existing library to perform Poseidon hash on solidity
import "./verifier.sol"; //inherits with the MerkleTreeInclusionProof verifier contract
import "hardhat/console.sol";

contract MerkleTree is Verifier {
    uint256[] public hashes; // the Merkle tree in flattened array form
    uint256 public index = 0; // the current index of the first unfilled leaf
    uint256 public root; // the current Merkle root
    uint public n;
    uint public depth;
    uint current;

    constructor(uint _n) {
        // [assignment] initialize a Merkle tree of 8 with blank leaves
        // default value is 0
        n = _n;
        hashes = new uint256[](2**(n+1)-1);
        
        uint idx;
        uint start = 0;
        for (uint i = n; i > 0; i--) {
            for (uint j = 0; j < 2**(i-1); j++) {
                idx = start + 2**i + j;
                hashes[idx] = PoseidonT3.poseidon([hashes[start + 2*j], hashes[start + 1 + 2*j]]);
            }
            start += 2**i;
        }
    }

    function insertLeaf(uint256 hashedLeaf) public returns (uint256) {
        // [assignment] insert a hashed leaf into the Merkle tree
        // start from bottom then slowly work our way up
        uint start = 0;
        uint child_index;
        uint parent_index;
        uint idx = index;

        hashes[index] = hashedLeaf;
        for (uint i = n; i > 0; i--) {
            child_index = start + idx;
            start += 2**i;
            idx /= 2;
            parent_index = start + idx;
            if (child_index % 2 == 0) {
                hashes[parent_index] = PoseidonT3.poseidon([hashes[child_index], hashes[child_index+1]]);
            } else {
                hashes[parent_index] = PoseidonT3.poseidon([hashes[child_index-1], hashes[child_index]]);
            }
        }
        index++;
        // return last hashes (root)
        return hashes[hashes.length - 1]; 
    }

    function verify(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[1] memory input
        ) public view returns (bool) {

        // [assignment] verify an inclusion proof and check that the proof root matches current root
        if (input[0] != hashes[hashes.length - 1]) {
            return false;
        }
        else {
            return verifyProof(a, b, c, input);
        }
    }
}
