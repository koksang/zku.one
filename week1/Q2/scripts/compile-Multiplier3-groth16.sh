#!/bin/bash

# [assignment] create your own bash script to compile Multiplier3.circom modeling after compile-HelloWorld.sh below

cd contracts/circuits

rm -r Multiplier3_groth16
mkdir Multiplier3_groth16

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling Multiplier3.circom..."

# compile circuit

circom Multiplier3.circom --r1cs --wasm --sym -o Multiplier3_groth16
snarkjs r1cs info Multiplier3_groth16/Multiplier3.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup Multiplier3_groth16/Multiplier3.r1cs powersOfTau28_hez_final_10.ptau Multiplier3_groth16/circuit_0000.zkey
snarkjs zkey contribute Multiplier3_groth16/circuit_0000.zkey Multiplier3_groth16/circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey Multiplier3_groth16/circuit_final.zkey Multiplier3_groth16/verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier Multiplier3_groth16/circuit_final.zkey ../Multiplier3Verifier_groth16.sol

cd ../..