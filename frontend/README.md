# React frontend

The React frontend acts as the interface that connects the user, IPFS and Polygon.

The user first upload images to IPFS, then mint the Polygon NFT token.

The smart contract that mints the NFT token is in the folder, /polygon.

The module can be substitute with any blockchain. The code is compatible with all EVM chains.

If you deploy to Ethereum, please change the chainId from 0x13882 to 0x1 in L84 of src/App.tsx

Also, change the smart contract address to the updated address in L89 of src/App.tsx

Run npm run ci, npm run dev to start the frontend service.
