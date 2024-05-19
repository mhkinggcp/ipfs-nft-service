import "./App.css";
import { useState, useEffect } from "react";
import { formatBalance, formatChainAsNum } from "./utils";
import detectEthereumProvider from "@metamask/detect-provider";
import './App.css'
import axios from 'axios'

const App = () => {
  const initialState = { accounts: [], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);

  const [isConnecting, setIsConnecting] = useState(false);  /* New */
  const [error, setError] = useState(false);                /* New */
  const [errorMessage, setErrorMessage] = useState("");     /* New */
  const [image, setImage] = useState<any>(null);

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

  const handleConnect = async () => {                    /* Updated */
    setIsConnecting(true);                                 /* New */
    await window.ethereum.request({                      /* Updated */
        method: "eth_requestAccounts",
      })
      .then((accounts: []) => {                           /* New */
        setError(false);                                  /* New */
        updateWallet(accounts);                           /* New */
      })                                                  /* New */
      .catch((err: any) => {                              /* New */
        setError(true);                                   /* New */
        setErrorMessage(err.message);                     /* New */
      });                                                 /* New */
    setIsConnecting(false);                               /* New */
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  const onClickTransaction = async () => {
    await window.ethereum.request({
      method: "eth_sendTransaction",
      // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
      params: [
        {
          // The user's active address.
          from: wallet.accounts[0],
          // Required except during contract publications.
          to: '0xb794f5ea0ba39494ce839613fffba74279579268',
          // Only required to send ether to the recipient from the initiating external account.
          value: 0,
        },
      ],
    })
    .then((txHash: string) => console.log(txHash))
    .catch((error: any) => console.error(error));
  }

  const onChangeImage = async (e: any) => {
    setImage(e.target.files[0]);
  }

  const onClickSubmit = async () => {
    if (image !== null) {
      let formData = new FormData();
      formData.append('files', image, 'file.png');

      axios.post(
          'http://127.0.0.1:3000/upload',
          formData,
          {
              headers: {
                  "Content-type": "multipart/form-data",
              },                    
          }
      )
      .then((res: any) => {
          console.log(`Success` + res.data);
      })
      .catch((err: any) => {
          console.log(err);
      })
    }
  }

  return (
    <div className="App">
      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (  /* Updated */
        <button disabled={disableConnect} onClick={handleConnect}>Connect MetaMask</button>
      )}

      {wallet.accounts.length > 0 && (
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
          <div>
            <button onClick={onClickTransaction}>Send transaction</button>
          </div>
        </>
      )}
      {error && (  /* New code block */
        <div onClick={() => setError(false)}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      <div>
        <input type="file" onChange={onChangeImage}/>
        <button onClick={onClickSubmit}>Submit</button>
      </div>

    </div>
  );
};

export default App;