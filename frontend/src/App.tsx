import "./App.css";
import { useState, useEffect } from "react";
import { formatBalance, formatChainAsNum } from "./utils";
import detectEthereumProvider from "@metamask/detect-provider";
import './App.css'
import axios from 'axios'
import { abi } from './utils/index';
import * as ethers from 'ethers';

const App = () => {
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [step, setStep] = useState(0);
  const [path, setPath] = useState("");

  const [isConnecting, setIsConnecting] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // If length 0, user is disconnected.
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        const accounts = await window.ethereum.request({method: "eth_accounts"});
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, balance, chainId });
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      .then((accounts: []) => {
        updateWallet(accounts);
      })
      .catch((err: any) => {
        console.log(err);
      });
    setIsConnecting(false);
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  const onClickTransaction = async () => {
    if (wallet.chainId != '0x13882') {
      alert('Please change to network to Amoy. https://docs.polygon.technology/tools/wallets/metamask/add-polygon-network/');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(wallet.accounts[0]);
    const contract = new ethers.Contract("0x52bfdf3638af98cbd8057a5033ec194fd1c75ea7", abi, signer);

    await contract.mintNft(wallet.accounts[0], "ipfs://" + path);

    setStep(3);
  }

  const onChangeImage = async (e: any) => {
    setImage(e.target.files[0]);
  }

  const onInputEmail = async (e: any) => {
    setEmail(e.target.value);
  }

  const onClickSubmit = async () => {
    if (image !== null) {
      let formData = new FormData();
      formData.append('files', image, 'file.png');

      axios.post(
          'http://34.130.3.149:3000/upload',
          formData,
          {
              headers: {
                  "Content-type": "multipart/form-data",
              },                    
          }
      )
      .then((res: any) => {
          setPath(res.data.path);
          setStep(2);
      })
      .catch((err: any) => {
          console.log(err);
      })
    }
  }

  const onClickSend = async () => {
    axios.post(
      'http://34.130.3.149:3000/email',
      { email: email,
        nftMetadata: "https://ipfs.io/ipfs/" + path }
    )
    .then(() => {
        setStep(4);
    })
    .catch((err: any) => {
        console.log(err);
    })
  }

  return (
    <div className="App">
      {
        step == 0 &&
        <div>
          <h1>Step 1: Input user email</h1>
          <label>Email
            <input type="text" value={email} onInput={onInputEmail}></input>
          </label><br/>
          <button onClick={() => setStep(1)}>Next</button>
        </div>
      }

      {
        step == 1 &&
        <div>
          <h1>Step 1: Upload file to IPFS</h1>
          <input type="file" accept="image/*" onChange={onChangeImage}/>
          <button onClick={onClickSubmit}>Submit</button>
        </div>
      }

      {
        step == 2 &&
        window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (  /* Updated */
          <button disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</button>
        )
      }

      {
        step == 2 &&
        wallet.accounts.length > 0 && (
          <>
            <h1>Step 2: Mint NFT on Amoy (Polygon testnet)</h1>
            <div>Wallet Accounts: {wallet.accounts[0]}</div>
            <div>Wallet Balance: {wallet.balance}</div>
            <div>Hex ChainId: {wallet.chainId}</div>
            <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
            <div>
              <button onClick={onClickTransaction}>Send transaction</button>
            </div>
          </>
        )
      }

      {
        step == 3 &&
        <div>
          <h1>Step 3: Send Confirmation Email</h1>
          <button onClick={onClickSend}>Send Email</button>
        </div>
      }

      {
        step == 4 &&
        <p>All Done. Thank you for using Project NFT.</p>
      }

    </div>
  );
};

export default App;