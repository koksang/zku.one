//[assignment] write your own unit test to show that your Mastermind variation circuit is working as expected
const chai = require("chai");
const path = require("path");

const wasm_tester = require("circom_tester").wasm;
const buildPoseidon = require("circomlibjs").buildPoseidon;

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Mastermind Variation", function () {
    this.timeout(100000000);

    before( async () => {
        poseidon = await buildPoseidon();
        F = poseidon.F;

        circuit = await wasm_tester("contracts/circuits/MastermindVariation.circom");
        await circuit.loadConstraints();
    });

    it("Test correct inputs", async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubNumHit": "4",
            "pubNumBlow": "0",
            "pubSolnHash": null,
            "privSolnA": "1",
            "privSolnB": "2",
            "privSolnC": "3",
            "privSolnD": "4",
            "privSalt": 1234
        }

        INPUT["pubSolnHash"] = F.toObject(poseidon([
            INPUT["privSalt"], 
            INPUT["privSolnA"],
            INPUT["privSolnB"],
            INPUT["privSolnC"],
            INPUT["privSolnD"],
        ]));
        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(INPUT["pubSolnHash"])));
    });

    it("Test 1 hit, 2 blows inputs", async () => {
        const INPUT = {
            "pubGuessA": "1",
            "pubGuessB": "2",
            "pubGuessC": "3",
            "pubGuessD": "4",
            "pubNumHit": "1",
            "pubNumBlow": "2",
            "pubSolnHash": null,
            "privSolnA": "1",
            "privSolnB": "3",
            "privSolnC": "2",
            "privSolnD": "5",
            "privSalt": 1325
        }

        INPUT["pubSolnHash"] = F.toObject(poseidon([
            INPUT["privSalt"], 
            INPUT["privSolnA"],
            INPUT["privSolnB"],
            INPUT["privSolnC"],
            INPUT["privSolnD"],
        ]));
        const witness = await circuit.calculateWitness(INPUT, true);

        assert(Fr.eq(Fr.e(witness[0]),Fr.e(1)));
        assert(Fr.eq(Fr.e(witness[1]),Fr.e(INPUT["pubSolnHash"])));
    });
});