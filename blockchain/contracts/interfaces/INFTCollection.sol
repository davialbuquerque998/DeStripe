// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/interfaces/IERC721.sol";


interface INFTCollection is IERC721{

    function setAuthorizedContract(address newAuthorizedContract) external;

    function setBaseUri(string calldata newUri) external;

    function getLastTokenId() external view returns (uint256);

    function burn(uint256 tokenId) external;

    function mint(address customer) external returns (uint256);
}