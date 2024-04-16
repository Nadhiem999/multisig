//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
pragma abicoder v2;

contract Greeter {
    string private greeting;
    // Variable to store the owner's address

    constructor(string memory _greeting) {
        greeting = _greeting;
    }

   

    function greet() public view returns (string memory) {
        return greeting;
    }

    // Use the `onlyOwner` modifier to restrict access
    function setGreeting(string memory _greeting) public  {
        greeting = _greeting;
    }
}
