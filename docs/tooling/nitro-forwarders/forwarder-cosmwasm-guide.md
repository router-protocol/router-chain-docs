---
title: Forwarder CosmWasm Guide
sidebar_position: 3
---

Let's say the following EVM address is our Forwarder EOA wallet:
`0xEeDb3AB68d567A6CD6D19Fa819fe77b9f8Ed1538`

All EVM addresses are compatible with the Router Chain. You can check its equivalent Router Chain address by replacing `your_EVM_address` in the link below with your EVM address:
https://routerscan.io/address/your_EVM_address#tokentxns

Now, let's review the Nitro Asset Forwarder account-specific query operations on the CosmWasm contract. Nitro Asset Forwarder Middleware Contract is a permissionless module present on the Router Chain that listens to the deposit event on the source chain and settles that user's request on the destination chain. 

Please execute or query the operation on the following asset forwarder addresses:

```
AlphaDevnet -> router12fykm2xhg5ces2vmf4q2aem8c958exv3v0wmvrspa8zucrdwjedsjnnxzt

Testnet -> router14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s00ztvk

Mainnet -> router14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9s00ztvk
```

Use the [Router Station UI](https://station.routerprotocol.com/) to interact with the CosmWasm contract. 
Click [here](https://www.awesomescreenshot.com/video/26484776?key=5a391916938289e13c838392e147b677) to view how to start interacting with the contract.


Remember to change the network to match your requirements.
<center><img src={require('../../../src/images/network-change.png').default} alt="Network change" style={{width: 600, marginBottom: 12}} /></center>

Use the following JSON to view the currently accumulated balance **(Query → Read Operation)**:
```json
{
  "fetch_claimable_amount": {
    "symbol": "<symbol>",
    "forwarder": "<router format address"
  }
}

Example:-
{
  "fetch_claimable_amount": {
    "symbol": "USDT",
    "forwarder": "router1amdn4d5d2eaxe4k3n75pnlnhh8uw69fcgf2mga"
  }
}
```

Use the following JSON to view the current withdrawal recipient address for the given chain **(Query → Read Operation)**:
```json
{
  "fetch_withdrawal_address": {
    "forwarder": "<router format address",
    "chain_ids": ["chain-ids in string format"]
  }
}

Example:-
{
  "fetch_withdrawal_address": {
    "forwarder": "router1amdn4d5d2eaxe4k3n75pnlnhh8uw69fcgf2mga",
    "chain_ids": ["1", "137"]
  }
}
```

Use the following JSON to set or update the withdrawal recipient address via the write operation **(Execution → Write Operation)**. Ensure that you use the same account to perform this operation.

```json
{
  "update_forwarder_address": {
    "withdrawal_addresses": [
      {
        "chain_id": "<chain-id>",
        "address": "<destination compatible address in string format>"
      }
    ]
  }
}

Example:-
{
  "update_forwarder_address": {
    "withdrawal_addresses": [
      {
        "chain_id": "1",
        "address": "0xEeDb3AB68d567A6CD6D19Fa819fe77b9f8Ed1538"
      },
      {
        "chain_id": "137",
        "address": "0xEeDb3AB68d567A6CD6D19Fa819fe77b9f8Ed1538"
      }
    ]
  }
}
```


Use the following JSON to withdraw or rebalance liquidity **(Execution → Write Operation)**. Ensure to use the same account when performing this operation. This operation requires passing a Router token, whose value depends on the destination chain ID.
```json
{
  "withdraw_liquidity": {
    "chain_id": "<chain-id>",
    "withdraw_info": [
      {
        "symbol": "<symbol>",
        "amount": "<amount>" // Amount should be in 18 decimals adjusted value
      }
    ]
  }
}

Example:-
{
  "withdraw_liquidity": {
    "chain_id": "137",
    "withdraw_info": [
      {
        "symbol": "ETH",
        "amount": "43000000000000000000" // 43 ETH
      },
      {
        "symbol": "USDT",
        "amount": "123000000000000000000" // 123 USDT
      }
    ]
  }
}
```

During the withdrawal function, the forwarder must pay some ROUTE tokens as fees. There's no need to provide the exact amount of ROUTE tokens as fees when withdrawing liquidity, as any excess amount will be retained by the contract for future requests. To check the available gas amount locked in the contract, the forwarder can call the following query. This is a **(Query → Read Operation)**:
```json
{
  "fetch_available_gas": {
    "address": "<forwarder Router Address>"
  }
}

Example:-
{
  "fetch_available_gas": {
    "address": "router1y9ttlgv4cqeu5t05lu2wdksvv9aced8hmke5x5"
  }
}
```

GitHub link for the contract: 
https://github.com/router-protocol/forwarder-pool-contract/blob/main/src/ForwarderPool.sol

We've updated our withdrawal process and "Update Forwarder Address" queries to enhance security and reduce reliance on the owner address of the Forwarder Contract. Now, we can set the withdrawal addresses for multiple chains using the following functions. For the withdrawal initiation, we can use the owner address.

```javascript
/**
     * Sets the withdrawal addresses for multiple chains.
     * 
     * @param chainIds Chain Ids array
     * @param addresses withdrawal addresses
     * @param adding add/ remove flags array
     */
    function setWithdrawalAddresses(
        string[] calldata chainIds,
        string[] calldata addresses,
        bool[] calldata adding,
        bytes calldata requestMetadata
    ) public  payable {
        // Encode the expiry time and refund claimer into a byte array
        uint8 txnType = 0;
        assert(chainIds.length == addresses.length);
        assert(chainIds.length == adding.length);
        bytes memory packet = abi.encode(txnType, chainIds, addresses, adding);

        // Encode the asset forwarder middleware and the previously created packet into a byte array
        bytes memory requestPacket = abi.encode(assetForwarderMiddleware, packet);

        // Send the request packet using the gateway contract
        gateway.iSend{ value: msg.value }(
          1,
          0,
          string(""),
          destChainId,
          requestMetadata,
          requestPacket
        );
    }

/**
     * Sets the refund claimer for the forwarder.
     * 
     * @param expiryTime The expiry time for the refund claimer in seconds.
     * @param _address The router chain address.
     * @param requestMetadata Additional metadata for the request. Like router gas.
     */
    function setLiquidityBalanceAddress(
        uint64 expiryTime,
        string calldata _address,
        bytes calldata requestMetadata
    ) public  payable {
        // Encode the expiry time and refund claimer into a byte array
        uint8 txnType = 1;
        bytes memory packet = abi.encode(txnType, expiryTime, _address);

        // Encode the asset forwarder middleware and the previously created packet into a byte array
        bytes memory requestPacket = abi.encode(assetForwarderMiddleware, packet);

        // Send the request packet using the gateway contract
        gateway.iSend{ value: msg.value }(
          1,
          0,
          string(""),
          destChainId,
          requestMetadata,
          requestPacket
        );
    }
    /**
     * Set's the router chain fee payer 
     * 
     * @param feePayerAddress The router chain address of the fee payer.
     */
    function setDappMetadata(string memory feePayerAddress) external onlyOwner {
      // Set the Dapp metadata in the gateway contract
      gateway.setDappMetadata(feePayerAddress);
    }
```