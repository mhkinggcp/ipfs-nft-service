// Script To Mint a NFT using mintNFT()

const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
    //connect to polygon testnet
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today');

    //the address of our deployed contract
    const contractAddress = "0x52bfdf3638af98cbd8057a5033ec194fd1c75ea7";

    //Read ABI of your Contract 
    const abiPath = "./abi.json";
    const contractData = JSON.parse(fs.readFileSync(abiPath));
    const contractABI = contractData.abi;
    
    //create a contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    //User Account Address
    const userAddress = 'USER_ADDRESS_HERE';

    //IPFS URL of NFT
    const ipfsUrl = "IPFS_URL_OF_NFT";

    console.log(`Minting NFT for ${ipfsUrl}`);

    try{
        //call mintNFT function
        const txResponse = await contract.mintNft(userAddress, ipfsUrl);
        console.log(`Transaction hash: ${txResponse.hash}`);

        //wait for transaction to be complete
        const reciept = await txResponse.wait();
        console.log(`Transaction confirmed Block Number: ${reciept.blockNumber}`);
    }catch(error) {
        console.error(`Error minting NFT: ${error.message}`);
    }
}

main().catch(console.error); 