// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DestripeCollection is ERC721, Ownable {
    uint256 private _currentTokenId;

    address public authorizedContract;


    string public baseUri ="http://localhost:3000/nfts/";


    function setAuthorizedContract(address newAuthorizedContract) external onlyOwner {
        authorizedContract = newAuthorizedContract;
    }

    function setBaseUri(string calldata newUri) external onlyOwner {
        baseUri = newUri;
    }


    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string.concat(_baseURI(), Strings.toString(tokenId), ".json");
    }

    constructor()
        ERC721("Destripe", "DSP")
        Ownable(msg.sender)
    {}


    function getLastTokenId() external view returns (uint256) {
        return _currentTokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function burn(uint256 tokenId) external  {
        require(msg.sender == authorizedContract || msg.sender == owner(), "Only the owner or the authorized contract can burn this token");
        _burn(tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override onlyOwner {
        _setApprovalForAll(operator, authorizedContract, approved);
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _currentTokenId++;
        _safeMint(to, tokenId);
    }

    function mint(address customer) external returns(uint256) {
        require(msg.sender == authorizedContract || msg.sender == owner(), "Only the owner or the authorized contract can mint this token");
        _currentTokenId += 1;
        _safeMint(customer, _currentTokenId);
        _setApprovalForAll(customer, authorizedContract, true);
        return _currentTokenId;
    }
}