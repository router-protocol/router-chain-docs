import React from 'react';
import metamask from '../images/metamask.svg'


// const styles = {
//     mr1: {
//         marginRight: 4,
//     },
//     inputText: {
//       padding: "10px",
//       color: "red",
//     },
//   };

async function addNetwork() {
    if (typeof window.ethereum !== 'undefined') {
        return (
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [{
                    chainId: "0x1D79",
                    rpcUrls: ["https://rc-testnet1.routerprotocol.com"],
                    chainName: "Router EVM Devnet",
                    nativeCurrency: {
                        name: "ETH",
                        symbol: "ETH",
                        decimals: 18
                    },
                    // blockExplorerUrls: [""]
                }]
            })
        )
    }
    else {
        return (
            console.log("MetaMask not installed")
        )
    }
}

export function MetaMaskNetwork() {
    return (
        <button onClick={addNetwork}>
        <img width="20" height="10" src={metamask}/>
            Add Router EVM Devnet
        </button>
    )
}



