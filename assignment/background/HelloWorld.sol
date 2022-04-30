// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract HelloWorld {
    // declare unsigned integer state variable
    uint storedNumber;

    // function to set storedNumber, can be called externally by other contract or internally within this contract
    function storeNumber(uint num) public {
        storedNumber = num;
    } 

    // function to retrieve storedNumber, can only view but not write,
    // can be called internall/ externally and is expected to return unsigned integer
    function retrieveNumber() public view returns (uint) {
        return storedNumber;
    }
}