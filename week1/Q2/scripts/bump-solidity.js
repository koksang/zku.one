const fs = require("fs");
const solidityRegex = /pragma solidity \^\d+\.\d+\.\d+/

const verifierRegex = /contract Verifier/
const verifierRegex_plonk = /contract PlonkVerifier/

function bumpSolidity(circuitName, solidityVersionString = "pragma solidity ^0.8.0") {
    let content = fs.readFileSync("./contracts/" + circuitName + ".sol", { encoding: 'utf-8' });
    let bumped = content.replace(solidityRegex, solidityVersionString);
    bumped = bumped.replace(verifierRegex, "contract " + circuitName);
    bumped = bumped.replace(verifierRegex_plonk, "contract " + circuitName);
    fs.writeFileSync("./contracts/" + circuitName + ".sol", bumped);
}

bumpSolidity("HelloWorldVerifier");

// [assignment] add your own scripts below to modify the other verifier contracts you will build during the assignment
bumpSolidity("Multiplier3Verifier_groth16");
bumpSolidity("Multiplier3Verifier_plonk", ">=0.7.0 <0.9.0");