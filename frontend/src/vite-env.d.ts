/// <reference types="vite/client" />

interface Window {
  ethereum: any;
  helia: HeliaLibp2p<Libp2p<DefaultLibp2pServices>>;
}