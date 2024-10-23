// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/INFTCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Destripe is Ownable{

    INFTCollection public nftCollection;
    IERC20 public acceptedErc20;

    constructor(address erc20Address, address nftAddress) Ownable(msg.sender){
        acceptedErc20 = IERC20(erc20Address);
        nftCollection = INFTCollection(nftAddress);
    }
}