## Deploy Polygon NFT Smart Contract

I deployed NFT.sol using Remix to Polygon testnet, Amoy

The smart contract is responsible to minting the NFTs of the collection

There are other options to deploy smart contract, including Hardhat
https://www.quicknode.com/guides/ethereum-development/smart-contracts/how-to-create-and-deploy-a-smart-contract-with-hardhat

The Solidity compiler version is 0.8.20

The project requirements stipulate that the user pay the minting fees. Therefore, the mintNft function does not have access control. If only the owner of the smart contract can mint (the owner will have the responsibility to mint and pay the fee), then the function will need to have a onlyOwner modifier. For more, please visit https://docs.openzeppelin.com/contracts/2.x/access-control

The smart contract is deployed to 0x52bfdf3638af98cbd8057a5033ec194fd1c75ea7
