---
title: Functions on third-party chain's contract
sidebar_position: 3
---

Router’s Gateway contracts have a function named `requestToRouter` that facilitates the transmission of a cross-chain request to the middleware contract on the Router Chain. Whenever users want to execute a cross-chain request, they can call this function by passing the payload to be transferred from the source to the Router chain.

In addition to calling the aforementioned function, the recipient contract on the destination chain will also have to implement the function `handleRequestFromRouter` to handle the requests received from the middleware contract.

### requestToRouter Function:

```jsx
function requestToRouter(
	bytes memory payload, 
	string memory routerBridgeContract,
	uint64 gasLimit,
	address feePayer
) external returns (uint64)
```

This is a function on the Router’s Gateway contracts. This function creates a request to send a payload to the middleware contract on the Router Chain. It takes the following arguments: 

1. **payload:** The payload to be sent. It should be in bytes format. You can send anything as a payload and handle it accordingly on the middleware.
2. **routerBridgeContract:** Address of your middleware contract on the Router Chain.
3. **gasLimit:** The gas limit required to execute the request on the Router chain.
4. **feePayer:** Address on the Router chain from which the cross-chain fee will be deducted. It can be either one of the three: (a) the user address, (b) the application contract address, or (c) `NONE`. If the `feePayer` address is set to `NONE`, then any entity on the Router chain can act as the feePayer. 

This function returns a nonce that serves as an identifier to your call to the Gateway contract. In this way, one can create a request to interact with the middleware contract on the Router Chain.

### handleRequestFromRouter Function:

```jsx
function handleRequestFromRouter(string memory sender, bytes memory payload) external
```

This function needs to be implemented into the recipient smart contract on the destination chain. This function is responsible for handling the requests received from the middleware contract on the Router Chain. 

This function should only be called by the Router’s Gateway contract. Make sure to check that the msg sender is the Gateway contract address. Also, make sure that only your middleware contract can send the request by checking it with the address of the sender received in the parameters of the function

This function takes two arguments:

1. **sender:** Address of the middleware contract on the Router Chain which sent the request.
2. **payload:** The payload comes from the middleware contract.