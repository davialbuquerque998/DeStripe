// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/INFTCollection.sol";

contract DestripeCollection is ERC721, Ownable, INFTCollection {
    uint256 private _currentTokenId;

    address public authorizedContract;

    string public baseUri = "http://localhost:3000/nfts/";

    modifier onlyOwnerOrAuthorized() {
        if (msg.sender != authorizedContract && msg.sender != owner()) {
            revert OnlyOwnerOrAuthorizedContract();
        }
        _;
    }

    error OnlyOwnerOrAuthorizedContract();

    function setAuthorizedContract(address newAuthorizedContract) external onlyOwner {
        authorizedContract = newAuthorizedContract;
    }

    function setBaseUri(string calldata newUri) external onlyOwner {
        baseUri = newUri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string.concat(_baseURI(), Strings.toString(tokenId), ".json");
    }

    constructor(address initialOwner)
        ERC721("Destripe", "DSP")
        Ownable(initialOwner)
    {}

    function getLastTokenId() external view returns (uint256) {
        return _currentTokenId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseUri;
    }

    function burn(uint256 tokenId) onlyOwnerOrAuthorized external {
        _burn(tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721, IERC721) onlyOwner {
        _setApprovalForAll(operator, authorizedContract, approved);
    }

    function mint(address customer) external onlyOwnerOrAuthorized returns (uint256)  {
        _currentTokenId += 1;
        _safeMint(customer, _currentTokenId);
        _setApprovalForAll(customer, authorizedContract, true);
        return _currentTokenId;
    }
}
