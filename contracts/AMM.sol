// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol"; 
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract MultiTokenPoolAmmV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public fee;

    struct Pool {
        uint256 reserve0;
        uint256 reserve1;
        uint256 totalSupply;
        bool exists;
    }

    mapping(bytes32 => Pool) public pools;
    mapping(bytes32 => mapping(address => uint256)) public balanceOf;
    
   

    function initialize(address initialOwner) public initializer {
       __Ownable_init_unchained(initialOwner);
        __UUPSUpgradeable_init();
        transferOwnership(initialOwner);
        fee = 997;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function getPoolId(address tokenA, address tokenB) public pure returns (bytes32) {
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        return keccak256(abi.encodePacked(token0, token1));
    }


}
