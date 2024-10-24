// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/INFTCollection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";

contract Destripe is Ownable{

    INFTCollection public nftCollection;
    IERC20 public acceptedErc20;

    uint256 public constant monthlyAmount = 0.1 ether; 

    event Paid(address indexed customer, uint256 date, uint256 amount);
    event Granted(address indexed customer, uint256 tokenId, uint256 amount);
    event Revoked(address indexed customer, uint256 tokenId, uint256 date);
    event Removed(address indexed customer, uint256 tokenId, uint256 date);

    constructor(address erc20Address, address nftAddress) Ownable(msg.sender){
        acceptedErc20 = IERC20(erc20Address);
        nftCollection = INFTCollection(nftAddress);
    }


    address[] public customers; 
    mapping (address => Customer) public payments;

    struct Customer {
        uint256 tokenId;//Token ID of the NFT associated with this customer
        uint256 nextPayment;
        uint256 index;//Position of the customer in the customers array
    }

    function removeCustomer(address customer) external onlyOwner {
        uint256 timestamp =  block.timestamp;
        uint256 tokenId = payments[customer].tokenId;
        nftCollection.burn(tokenId);

        uint256 position = payments[customer].index;

        delete customers[position];

        delete payments[customer];

        emit Removed(customer, tokenId, timestamp);
    }    
}