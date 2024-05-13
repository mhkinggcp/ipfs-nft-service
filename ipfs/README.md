## IPFS Node

### Introduction

Host IPFS node so that do not need to pay IPFS service providers for hosting cost.

The file is hosted on the own node.

You can host multiple nodes, or pay other nodes with filecoin for data redunduncy.

For more information, please visit https://ipfscluster.io/

For the scope of the project, we only implement one single node.

### Setup

Create a GCP Compute Engine VM Instance

We picked e2-standard-4 instance with 2 core and 16 GB RAM

IPFS recommended at least 2 core and 2 GB RAM to host the node

VM: Ubuntu 20.04 LTS x86/64, amd64 focal image

Run the following command one by one

// For version 0.28.0
wget https://dist.ipfs.tech/kubo/v0.28.0/kubo_v0.28.0_linux-amd64.tar.gz
tar -xvzf kubo_v0.28.0_linux-amd64.tar.gz
cd kubo
sudo bash install.sh
ipfs --version
ipfs init
ipfs daemon

When you run ipfs daemon, there might be error on buffer size.
Run the following in root to solve the issue, https://github.com/quic-go/quic-go/wiki/UDP-Buffer-Sizes
sysctl -w net.core.rmem_max=7500000
sysctl -w net.core.wmem_max=7500000


### Firewall

Setup the firewall to allow port 4001 connection to the frontend service

If you allow everyone to access port 4001, then everyone will be able to upload files

The cost of hosting those files will be incurred on the node owner

One possibility is setup backend as a proxy to upload the files and implement access control
