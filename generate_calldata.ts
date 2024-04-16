import * as ethers from "ethers";
//const ethers = require('ethers');

// Token and MultiTokenPoolAmmV1 Information
const tokenAAddress = "0xeeca81E0B533025d0De99D49557e0b9B1D2129C3";
const tokenBAddress = "0xb315D023589Cd506885339FB89A8CC808a803e95";
const amountA = ethers.utils.parseEther("0.008"); 
const amountB = ethers.utils.parseEther("0.008");

// Function Encoding
const functionSignature = "addLiquidity(address,address,uint256,uint256)";
const functionSelector = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)).slice(0,10);  

const encodedArguments = ethers.utils.defaultAbiCoder.encode(
    ["address", "address", "uint256", "uint256"], 
    [tokenAAddress, tokenBAddress, amountA, amountB]
);

// Combine and format the calldata
const calldata = functionSelector + encodedArguments.slice(2); // Remove leading '0x' 
console.log("Encoded calldata:", calldata);
