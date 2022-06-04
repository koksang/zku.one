pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template CheckRoot(n) { // compute the root of a MerkleTree of n Levels 
    signal input leaves[2**n];
    signal output root;

    //[assignment] insert your code here to calculate the Merkle root from 2^n leaves
    // using the illusration as example, at n = 4, we always have 2^(n-1) base leaves
    // Hence we always have to compute 2^(n-1)-1 hashes (excluding the base leaves and root is single)
    // To ensure consistency, we can populate leaves array from 2^(n-1) because
    // the first 2^n are base leaves, then next are the hash tree layers computed from leaves
    // Then we know the 2nd last leaves is our root because we can only have root at (2^n)-1
    //
    //                       14 (root)
    //                 12          13
    //              8     9     10   11
    //            0  1  2  3  4  5  6  7
    
    // we only need to compute hash of size 2^(n-1) 
    component hash[(2**(n-1))-1];
    var idx = 0;
    // we loop thru leaves
    for (var i = 0; i < leaves.length; i+=2) {
        // hash array index goes 0,1,2,3....2^(n-1)
        hash[idx] = Poseidon(2);
        hash[idx].inputs[0] <== leaves[i];
        hash[idx].inputs[1] <== leaves[i+1];
        // leaves array index goes 0+2^n, 1+2^n, 2+2^n, .... 2^(n-1)+2^n
        leaves[idx + 2**n] <== hash[idx].out;
        idx += 1;
    }

    root <== leaves[(2**n)-1];
}

template MerkleTreeInclusionProof(n) {
    // const Input = {
    //     "leaf": "1",
    //     "path_elements": ["2", node9, node13],
    //     "path_index": ["0", "0", "0"]
    // }
    signal input leaf;
    signal input path_elements[n];
    signal input path_index[n]; // path index are 0's and 1's indicating whether the current element is on the left or right
    signal output root; // note that this is an OUTPUT signal

    //[assignment] insert your code here to compute the root from a leaf and elements along the path
    var hash = leaf;
    component hasher[n];
    for (var i = 0; i < n; i++) {
        path_index[i] * (path_index[i] + 1) === 0;

        hasher[i] = Poseidon(2);
        hasher[i].inputs[0] <== path_index[i] * (hash + path_elements[i]) + hash;
        hasher[i].inputs[1] <== path_index[i] * (hash + path_elements[i]) + path_elements[i];
        hash = hasher[i].out;
        
    }
    root <== hasher[n-1].out;
}