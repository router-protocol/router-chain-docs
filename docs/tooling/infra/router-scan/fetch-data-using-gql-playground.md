---
title: Fetch data using GQL Playground
sidebar_position: 1
---

# How to fetch data using GQL Playground

You can try the GraphQL queries by using the following link - [https://explorer-api.testnet.routerchain.dev/gql](https://devnet-explorer-api.routerprotocol.com/gql). “Docs” section can be referred from the right top of the page and the various available  query endpoints can be looked at.

![gql-playground.svg](../../../../src/images/gql-plyground-query.png)


<details>
<summary><b>Blocks</b></summary>

### Overview

To query the data for blocks, you can use the blocks query. Below we have provided a few sample queries on how you can fetch desired blocks data using GraphQL.

### To get the latest blocks

To get the latest blocks from the explorer you can use the below query. The parameters offset and limit can be passed as required to get the outcome needed.

:::tip
The parameters can be set in the “Query Variables” section on the GraphQL playground. An example to set the parameters is as below - {"limit": 1, "offset": 1}
:::

**Request**

```jsx
query getLatestBlocks($limit: Int!, $offset: Int!) {
  paginatedBlock(sortBy:{_id:desc},limit:$limit,offset:$offset){
    totalRecords
    blocks{
      _id
      hash
      proposer
      txn_count
      timestamp
      transactions{
         _id
        height
        sender
        status
        receiver
        timeStamp
        gasWanted
        gasUsed
        fee
        event_logs
        success
      }
    }
  }
}
```

**Response**

```jsx
{
  "data": {
    "paginatedBlock": {
      "totalRecords": 15641,
      "blocks": [
        {
          "_id": 15641,
          "hash": "1C6BC272B52029A27D574A9E68269E9079A6E33AD4DBC3B4754874CE6EE4B0E6",
          "proposer": "4EC53962072D60BE17C849C98902EC05B22076E4",
          "txn_count": 0,
          "timestamp": "2023-01-02T08:55:57Z",
          "transactions": []
        }
      ]
    }
  }
}
```

### To get a specific block’s data

**Request**

```jsx
query getBlockByHeight($height: Int!){
  block(_id:$height){
    _id
    hash
    proposer
    txn_count
    timestamp
  }
}
```

**Response**

```jsx
{
  "data": {
    "block": {
      "_id": 1234,
      "hash": "92144B399796060CF32831077D34C5F3F67275E57572218B5BFC9BEDDDD0F44B",
      "proposer": "12B6CFEA58C5A3BC8CB194F4AE4E4610827083FC",
      "txn_count": 0,
      "timestamp": "2023-01-02T01:30:33Z"
    }
  }
}
```

</details>

<details>
<summary><b>Transactions</b></summary>

### Overview

To query the data for transactions, you can use the below examples. 

### To get the latest transactions data

To get the latest transactions from the explorer you can use the below query. The parameters offset and limit can be passed as required to get the outcome needed.

:::tip
The parameters can be set in the “Query Variables” section on the GraphQL playground. An example to set the parameters is as below -
{"limit": 1, "offset": 1}
:::

**Request**

```jsx
query getLatestTransactions($limit: Int!, $offset: Int!){
    paginatedTransaction(sortBy:{height:desc,timeStamp:desc},limit:$limit,offset:$offset){
    totalRecords
  transactions{
     _id
    height
    sender
    status
    receiver
    timeStamp
    gasWanted
    gasUsed
    fee
    event_logs
    success
    rawLog
    routePrice
  }
  }
}
```

**Response**

```jsx
{
  "data": {
    "paginatedTransaction": {
      "totalRecords": 17,
      "transactions": [
        {
          "_id": "4BB9D33522003683D23AF08A463248B77A65F0992C8FFAD730BD6F766B261E27",
          "height": 12886,
          "sender": "router1hvaau9fkk4xssmqe455mfujzd2hs6jnsy0rcdj",
          "status": "",
          "receiver": "router1gmj4z4vr3rn8ptzcumyycp6eegkuhehrlzlws2",
          "timeStamp": "2023-01-02T07:30:46Z",
          "gasWanted": "",
          "gasUsed": "",
          "fee": "100000000000000router",
          "event_logs": "",
          "success": "",
          "rawLog": "[{\"events\":[{\"type\":\"coin_received\",\"attributes\":[{\"key\":\"receiver\",\"value\":\"router1gmj4z4vr3rn8ptzcumyycp6eegkuhehrlzlws2\"},{\"key\":\"amount\",\"value\":\"1000000000000000000router\"}]},{\"type\":\"coin_spent\",\"attributes\":[{\"key\":\"spender\",\"value\":\"router1hvaau9fkk4xssmqe455mfujzd2hs6jnsy0rcdj\"},{\"key\":\"amount\",\"value\":\"1000000000000000000router\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmos.bank.v1beta1.MsgSend\"},{\"key\":\"sender\",\"value\":\"router1hvaau9fkk4xssmqe455mfujzd2hs6jnsy0rcdj\"},{\"key\":\"module\",\"value\":\"bank\"}]},{\"type\":\"transfer\",\"attributes\":[{\"key\":\"recipient\",\"value\":\"router1gmj4z4vr3rn8ptzcumyycp6eegkuhehrlzlws2\"},{\"key\":\"sender\",\"value\":\"router1hvaau9fkk4xssmqe455mfujzd2hs6jnsy0rcdj\"},{\"key\":\"amount\",\"value\":\"1000000000000000000router\"}]}]}]",
          "routePrice": "1.7062257784837516"
        }
      ]
    }
  }
}
```

### To get a specific transaction’s data

**Request**

```jsx
query getTransactionByHash($hash: String!){
  transaction(_id:$hash){
	  _id
	  height
	  sender
	  status
	  receiver
	  timeStamp
	  gasWanted
	  gasUsed
	  fee
	  event_logs
	  success
  }
}
```

**Response**

```jsx
{
  "data": {
    "transaction": {
      "_id": "4BB9D33522003683D23AF08A463248B77A65F0992C8FFAD730BD6F766B261E27",
      "height": 12886,
      "sender": "router1hvaau9fkk4xssmqe455mfujzd2hs6jnsy0rcdj",
      "status": "",
      "receiver": "router1gmj4z4vr3rn8ptzcumyycp6eegkuhehrlzlws2",
      "timeStamp": "2023-01-02T07:30:46Z",
      "gasWanted": "",
      "gasUsed": "",
      "fee": "100000000000000router",
      "event_logs": "",
      "success": ""
    }
  }
}
```

</details>

<details>
<summary><b>Inbounds</b></summary>

### Overview

To query the data for cross-chain transactions, you can use the below examples.

### To get the latest inbounds data

To get the latest cross-chain transactions from the explorer you can use the below query. The parameters offset and limit can be passed as required to get the outcome needed.

:::tip
The parameters can be set in the “Query Variables” section on the GraphQL playground. An example to set the parameters is as below -
{"limit": 1, "offset": 1}
:::

**Request**

```jsx
query getLatestInbounds($limit: Int!, $offset: Int!){
    paginatedInbound(sortBy:{blockHeight:desc},limit:$limit,offset:$offset){
    totalRecords
    inbounds{
      attestationId
      chainType
      attestationType
      chainId
      eventNonce
      blockHeight
      sourceTxHash
      sourceSender
      routerBridgeContract
      payload
      status
      formAttestationId
      historyStatus{
        status
        txnHash
        timestamp
      }
      confirmations{
        validator
        txnHash
        timestamp
      }
    }
  }
}
```

**Response**

```jsx
{
  "data": {
    "paginatedCrosschain": {
      "totalRecords": 291,
      "crosschains": [
        {
          "id": "80001-468",
          "attestationId": "",
          "srcChainId": "80001",
          "requestIdentifier": 468,
          "blockHeight": 35434410,
          "sourceTxHash": "0xdc486ad4ecdbb5323023bec182617fe68b6ca4277c9556232aee38f3dc6d399d",
          "srcTimestamp": 1683752990,
          "srcTxOrigin": "",
          "routeAmount": "0",
          "routeRecipient": "",
          "destChainId": "43113",
          "requestSender": "0x0c64E70ea640583cb4371A0082c49C16FBa11EDB",
          "requestMetadata": {
            "destGasLimit": 1000000,
            "destGasPrice": 37500000000,
            "ackGasLimit": 0,
            "ackGasPrice": 0,
            "ackType": 1,
            "isReadCall": false,
            "asmAddress": ""
          },
          "requestPacket": {
            "handler": "\fd�\u000e�@X<�7\u001a\u0000�Ĝ\u0016��\u001e�",
            "payload": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABTZFbpyu+XheLnj75hHkZd5S6zSIgAAAAAAAAAAAAAAAA"
          },
          "srcChainType": "CHAIN_TYPE_EVM",
          "destChainType": "CHAIN_TYPE_EVM",
          "status": "CROSSCHAIN_REQUEST_CONFIRMED",
          "eventHistory": [
            {
              "name": "routerprotocol.routerchain.crosschain.EventCrosschainRequestCreated",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": "80CBB4C048FF9B1A95B35AFAF2E0051F3769920743356AE89B84D32527D19E90"
            },
            {
              "name": "routerprotocol.routerchain.attestation.EventAttestationVote",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": "80CBB4C048FF9B1A95B35AFAF2E0051F3769920743356AE89B84D32527D19E90"
            },
            {
              "name": "routerprotocol.routerchain.crosschain.EventCrosschainRequestConfirm",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": "80CBB4C048FF9B1A95B35AFAF2E0051F3769920743356AE89B84D32527D19E90"
            },
            {
              "name": "routerprotocol.routerchain.attestation.EventAttestationVote",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": "DD85827581C234AAD366660E78D4EDDE4EAF37A7F9CC690B81EF7F15DBF42D6B"
            },
            {
              "name": "routerprotocol.routerchain.crosschain.EventCrosschainRequestConfirm",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": "DD85827581C234AAD366660E78D4EDDE4EAF37A7F9CC690B81EF7F15DBF42D6B"
            },
            {
              "name": "routerprotocol.routerchain.crosschain.EventHandleNativeTransfer",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": ""
            },
            {
              "name": "routerprotocol.routerchain.crosschain.EventCrosschainReadyToExecute",
              "height": 136471,
              "timestamp": 1683752998,
              "txnHash": ""
            },
            {
              "name": "routerprotocol.routerchain.attestation.EventAttestationVote",
              "height": 136472,
              "timestamp": 1683753004,
              "txnHash": "834F689C60A7B5572814B8688BDC0F9F4455E55217FC9CA64F88684BF44124CC"
            },
            {
              "name": "routerprotocol.routerchain.crosschain.EventCrosschainRequestConfirm",
              "height": 136472,
              "timestamp": 1683753004,
              "txnHash": "834F689C60A7B5572814B8688BDC0F9F4455E55217FC9CA64F88684BF44124CC"
            }
          ],
          "historyStatus": [
            {
              "status": "CROSSCHAIN_REQUEST_CREATED",
              "txnHash": "80CBB4C048FF9B1A95B35AFAF2E0051F3769920743356AE89B84D32527D19E90",
              "timestamp": 1683752998
            },
            {
              "status": "CROSSCHAIN_REQUEST_CONFIRMED",
              "txnHash": "80CBB4C048FF9B1A95B35AFAF2E0051F3769920743356AE89B84D32527D19E90",
              "timestamp": 1683752998
            },
            {
              "status": "CROSSCHAIN_REQUEST_CONFIRMED",
              "txnHash": "DD85827581C234AAD366660E78D4EDDE4EAF37A7F9CC690B81EF7F15DBF42D6B",
              "timestamp": 1683752998
            },
            {
              "status": "CROSSCHAIN_REQUEST_READY_TO_EXECUTE",
              "txnHash": "",
              "timestamp": 1683752998
            },
            {
              "status": "CROSSCHAIN_REQUEST_CONFIRMED",
              "txnHash": "834F689C60A7B5572814B8688BDC0F9F4455E55217FC9CA64F88684BF44124CC",
              "timestamp": 1683753004
            }
          ],
          "eventConfirmSignatures": [
            {
              "validator": "router12ypmrn46en3wpcetrjz5jkk505g0r99ev8a6cw",
              "txnHash": "80CBB4C048FF9B1A95B35AFAF2E0051F3769920743356AE89B84D32527D19E90",
              "timestamp": 1683752998,
              "blockHeight": 136471,
              "signature": "0x5103b1ceBAcCE2E0e32B1C85495AD47d10f194b9",
              "ethSigner": "ff2b650775e8a1366cc59684bd848123c7f7948b6ed7c0584ae36a31e6fa48031934699930a5f78336cf6e502338872f009ae6b9f47a95543dd697702318debb01"
            },
            {
              "validator": "router1q4r5atk05alpwxm7llrnnf608yjudahv9yl4yy",
              "txnHash": "DD85827581C234AAD366660E78D4EDDE4EAF37A7F9CC690B81EF7F15DBF42D6B",
              "timestamp": 1683752998,
              "blockHeight": 136471,
              "signature": "0x05474EAeCfa77e171b7Effc739A74f3925C6F6EC",
              "ethSigner": "155bdeefe7914fae3202ebea66bcfeb622c5dccaa7e567376f74c89efea681790dc55379d34be471e7e678df51157d5bde16cb9592b258a2a89fb9f30b31091f00"
            },
            {
              "validator": "router1yrf75ap247eq636u4pdzzm2rqvphnwsavz4cwu",
              "txnHash": "834F689C60A7B5572814B8688BDC0F9F4455E55217FC9CA64F88684BF44124CC",
              "timestamp": 1683753004,
              "blockHeight": 136472,
              "signature": "0x20d3Ea742AAfb20D475cA85a216d43030379BA1d",
              "ethSigner": "ff8ef31a21d79bcc23a399c97cb46f0d2467d93f5c4ba890370e4ebf2e125eb46e91a5980cc2f6a3e17a5de90953c1a75a33607afbf36c0835e2cbb64e9431eb00"
            }
          ],
          "ackRequest": {
            "eventAckRequestCreated": {
              "attestationId": "",
              "ackSrcChainId": "",
              "ackRequestIdentifier": 0,
              "blockHeight": 0,
              "destTxHash": "",
              "relayerRouterAddress": "",
              "ackDestChainId": "",
              "requestSender": "",
              "requestIdentifier": 0,
              "ackSrcChainType": 0,
              "ackDestChainType": 0,
              "execData": "",
              "execStatus": false,
              "status": ""
            },
            "eventAckRequestConfirm": [],
            "status": "",
            "historyStatus": [],
            "claimHash": "",
            "txFeeInRoute": "",
            "chainType": "",
            "chainId": "",
            "requestIdentifier": 0,
            "customFormAttestationId": "",
            "ackReceiptRequest": {
              "ackReceipt": {
                "attestationId": "",
                "ackReceiptSrcChainId": "",
                "ackReceiptIdentifier": 0,
                "ackReceiptBlockHeight": 0,
                "ackReceiptTxHash": "",
                "relayerRouterAddress": "",
                "requestIdentifier": 0,
                "status": ""
              },
              "historyStatus": [],
              "relayerFeeInRoute": "",
              "refundFeeInRoute": "",
              "ackReceiptKey": "",
              "status": "",
              "claimHash": ""
            },
            "ackGasLimit": 0,
            "ackGasPrice": 0,
            "feePayer": "",
            "relayerFeeInRoute": "",
            "refundFeeInRoute": "",
            "errorResponse": "",
            "eventSignatures": []
          },
          "customFormAttestationId": "",
          "destinationTxHash": "",
          "eventAckConfirmSignatures": [],
          "createdAt": 1683752990,
          "updatedAt": 1683753004,
          "destTxFeeInRoute": "0",
          "relayerFee": "0",
          "relayerFeeInRoute": "",
          "refundFeeInRoute": "",
          "feePayer": "",
          "errorResponse": "",
          "relayerAddress": "",
          "execStatus": false,
          "execData": "",
          "eventSignatures": [
            {
              "chainType": "CHAIN_TYPE_NONE",
              "chainId": "80001",
              "eventNonce": 468,
              "voter": "routervaloper1mysxspguz359s9hra3h0te2ldctuljltl5lvk5",
              "blockHeight": 136471,
              "timestamp": 1683752998
            },
            {
              "chainType": "CHAIN_TYPE_NONE",
              "chainId": "80001",
              "eventNonce": 468,
              "voter": "routervaloper13psflkvyrmy2kwp2fhvas2j54uy3tme804k60c",
              "blockHeight": 136471,
              "timestamp": 1683752998
            },
            {
              "chainType": "CHAIN_TYPE_NONE",
              "chainId": "80001",
              "eventNonce": 468,
              "voter": "routervaloper10q4lc4hq6g0t34kj0fk6fp48hgt5pz48aq34al",
              "blockHeight": 136472,
              "timestamp": 1683753004
            }
          ]
        }
      ]
    }
  }
}
```

### To get a specific inbound’s data

In order to get data for a specific inbound request using the attestation id, you can use the below query.

**Request**

```jsx
query getInboundByFormAttestationId($formAttestationId: String!){
  inbound(formAttestationId:$formAttestationId){
    attestationId
    chainType
    attestationType
    chainId
    eventNonce
    blockHeight
    sourceTxHash
    sourceSender
    routerBridgeContract
    payload
    status
    formAttestationId
    historyStatus{
        status
        txnHash
        timestamp
      }
      confirmations{
        validator
        txnHash
        timestamp
      }
  }
}
```

**Response**

```jsx

```

### To get a search inbound data

In case you need to search for inbound transactions using various parameters, below sample query which can be used. You can add or remove conditions based on the requirement.

**Request**

```jsx
query getLatestInbounds($searchTerm: String!,$limit: Int!, $offset: Int!){
    paginatedInbound(where_or:{sourceTxHash:$searchTerm,sourceSender:$searchTerm,routerBridgeContract:$searchTerm,formAttestationId:$searchTerm},sortBy:{blockHeight:desc},limit:$limit,offset:$offset){
    totalRecords
    inbounds{
      attestationId
      chainType
      attestationType
      chainId
      eventNonce
      blockHeight
      sourceTxHash
      sourceSender
      routerBridgeContract
      payload
      status
      formAttestationId
      historyStatus{
        status
        txnHash
        timestamp
      }
      confirmations{
        validator
        txnHash
        timestamp
      }
    }
  }
}
```

**Response**

```jsx

```

</details>

<details>
<summary><b>Outbounds</b></summary>

### Overview

To query the data for outbound transactions, you can use the below examples. These are the transactions from Router chain to any other EVM/non-EVM chain.

### To get the latest outbounds data

To get the latest inbound transactions from the explorer you can use the below query. The parameters offset and limit can be passed as required to get the outcome needed.

:::tip
The parameters can be set in the “Query Variables” section on the GraphQL playground. An example to set the parameters is as below -
{"limit": 1, "offset": 1}
:::

**Request**

```jsx
query getLatestOutbounds($limit: Int!, $offset: Int!){
    paginatedOutbound(sortBy:{blockHeight:desc},limit:$limit,offset:$offset){
    totalRecords
    outbounds{
      eventNonce
      destinationChainType
      destinationChainId
      relayerFee
      outgoingTxFee
      isAtomic
      sourceAddress
      expiryTimestamp
      status
      contractCalls
      ackFormAttestationId
      formAttestationId
      attestationId
      outgoingTxNonce
      outboundTxRequestedBy
      destinationTxHash
      feeConsumed
      blockHeight
      historyStatus{
        status
        txnHash
        timestamp
        blockHeight
      }
     outboundSignatures{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      outboundACKSignatures{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      contractsExecutionData{
        destContractAddress
        status
        payload
      }
      confirmations{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      contractAckResponses
    }
    }
}
```

**Response**

```jsx

```

### To get a specific outbound’s data

In order to get data for a specific outbound request using the attestation id, you can use the below query.

**Request**

```jsx
query getOutboundByFormAttestationId($formAttestationId: String!){
  outbound(formAttestationId:$formAttestationId){
      eventNonce
      destinationChainType
      destinationChainId
      relayerFee
      outgoingTxFee
      isAtomic
      sourceAddress
      expiryTimestamp
      status
      contractCalls
      ackFormAttestationId
      formAttestationId
      attestationId
      outgoingTxNonce
      outboundTxRequestedBy
      destinationTxHash
      feeConsumed
      blockHeight
      historyStatus{
        status
        txnHash
        timestamp
        blockHeight
      }
     outboundSignatures{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      outboundACKSignatures{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      contractsExecutionData{
        destContractAddress
        status
        payload
      }
      confirmations{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      contractAckResponses
  }
}
```

**Response**

```jsx

```

### To get a search outbound data

In case you need to search for outbound request using various parameters, below sample query which can be used. You can add or remove conditions based on the requirement.

**Request**

```jsx
query getLatestOutbounds($destinationChainType: String!,$destinationChainId: String!,$sourceAddress: String!,$limit: Int!, $offset: Int!){
    paginatedOutbound(where:{destinationChainType:$destinationChainType,destinationChainId:$destinationChainId,sourceAddress:$sourceAddress},sortBy:{blockHeight:desc},limit:$limit,offset:$offset){
    totalRecords
    outbounds{
      eventNonce
      destinationChainType
      destinationChainId
      relayerFee
      outgoingTxFee
      isAtomic
      sourceAddress
      expiryTimestamp
      status
      contractCalls
      ackFormAttestationId
      formAttestationId
      attestationId
      outgoingTxNonce
      outboundTxRequestedBy
      destinationTxHash
      feeConsumed
      blockHeight
      historyStatus{
        status
        txnHash
        timestamp
        blockHeight
      }
     outboundSignatures{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      outboundACKSignatures{
        validator
        txnHash
        timestamp
      	blockHeight
      }
      contractsExecutionData{
        destContractAddress
        status
        payload
      }
      contractAckResponses
      confirmations{
        validator
        txnHash
        timestamp
      	blockHeight
      }
    }
    }
}
```

**Response**

```jsx

```

</details>