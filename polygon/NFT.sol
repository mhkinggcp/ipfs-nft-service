// NFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import { ERC721URIStorage } from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("NFT", "NFT") {}

    function mintNft(address user, string memory ipfsUrl)
        public
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _mint(user, tokenId);
        _setTokenURI(tokenId, ipfsUrl);

        return tokenId;
    }
}