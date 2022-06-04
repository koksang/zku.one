const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16, plonk } = require("snarkjs");
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

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        // generate a groth16 proof using input a=1,b=2 and our key
        // retrieve our proof and output publicSignals of the circuit
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");
        console.log('\n1x2 =',publicSignals[0]);
        
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
    it("Should return false for invalid proof", async function () {
        // mock data arguments, expect them to verify to false in circuit
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier_groth16");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const wasm_path = "contracts/circuits/Multiplier3_groth16/Multiplier3_js/Multiplier3.wasm";
        const zkey_path = "contracts/circuits/Multiplier3_groth16/circuit_final.zkey";
        const inputs = {"a":"1", "b":"2", "c":"3"};
        const { proof, publicSignals } = await groth16.fullProve(inputs, wasm_path, zkey_path);
        console.log("inputs =", inputs, "\noutput =", publicSignals[0]);
        
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
        
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());

        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);

        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier_plonk");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] insert your script here
        const wasm_path = "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm";
        const zkey_path = "contracts/circuits/Multiplier3_plonk/circuit_final.zkey";
        const inputs = {"a":"1", "b":"2", "c":"3"};
        const { proof, publicSignals } = await plonk.fullProve(inputs, wasm_path, zkey_path);
        console.log("inputs =", inputs, "\noutput =", publicSignals[0]);
        
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
        
        const argv = calldata.replace(/["[\]\s]/g, "").split(',');
        let value = argv[0];
        const Input = [BigInt(argv[1]).toString()];

        expect(await verifier.verifyProof(value=value, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        //[assignment] insert your script here
        // 0 is 0x0000 in byte
        let value = "0x0000";
        let Input = [0];
        expect(await verifier.verifyProof(value=value, Input)).to.be.false;
    });
});