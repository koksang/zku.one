const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");
const { exit } = require("process");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("LessThan10", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("LessThan10Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });
    
    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // generate a groth16 proof using input a=1,b=2 and our key
        // retrieve our proof and output publicSignals of the circuit
        const wasm_path = "contracts/circuits/LessThan10/LessThan10_js/LessThan10.wasm";
        const zkey_path = "contracts/circuits/LessThan10/circuit_final.zkey";
        const inputs = {"in": "100"};
        const { proof, publicSignals } = await groth16.fullProve(inputs, wasm_path, zkey_path);
        console.log("inputs =", inputs, "\noutput =", publicSignals);
        
        // convert proof in object form & publicSignals in array, each into BigInt
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        // export proof and signal into solidity calldata
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // regex cleanup any characters in [ " ] then split by , to get an array and convert each element into text
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        // get our a, b, c & Input arguments for our verifier circuit
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // verify to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
});

describe("RangeProof", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("RangeProofVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });
    
    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // generate a groth16 proof using input a=1,b=2 and our key
        // retrieve our proof and output publicSignals of the circuit
        const wasm_path = "contracts/circuits/RangeProof/RangeProof_js/RangeProof.wasm";
        const zkey_path = "contracts/circuits/RangeProof/circuit_final.zkey";
        const inputs = {"in": "0", "range": ["0", "0"]};
        const { proof, publicSignals } = await groth16.fullProve(inputs, wasm_path, zkey_path);
        console.log("inputs =", inputs, "\noutput =", publicSignals);
        
        // convert proof in object form & publicSignals in array, each into BigInt
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        // export proof and signal into solidity calldata
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        // regex cleanup any characters in [ " ] then split by , to get an array and convert each element into text
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        // get our a, b, c & Input arguments for our verifier circuit
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        // verify to be true
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
});