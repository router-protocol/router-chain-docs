---
title: set_dapp_metadata
sidebar_position: 1
---

* To facilitate cross-chain transactions, it is necessary to cover the fees on the Router Chain. This is achieved using the set_dapp_metadata function available in the Gateway contracts. 
* Once the `fee_payer_address` is set, the designated fee payer must approve the request to act as the fee payer on the Router Chain. Without this approval, dApps will not be able to execute any cross-chain transactions.
* It's important to note that any fee refunds resulting from these transactions will be credited back to the dApp's `fee_payer_address` on the Router Chain. 

##### Create Metadata Object For The Package:

* The DApp must implement a function to create a metadata object. This object will be used to validate the authority of the calling DApp.
* To create the metadata object, the DApp should call the `new_metadata` function.
```rust
public fun new_metadata(
    recipient: address,
    ctx: &mut TxContext
)
```
* The `new_metadata` function requires the recipient to be passed as a package state object.
* Once the metadata object is created, it should be stored in the DApp's state.
* The stored metadata will be used when making the `i_send` call.
* By doing this, the gateway will be able to verify the authority of the calling DApp.


```rust
public fun set_dapp_metadata(
    self: &mut GatewayContract,
    metadata: &mut Metadata,
    dapp_module_address: address,
    dapp_object_id: address,
    fee_payer_address: String,    
    coin: &mut option::Option<Coin<SUI>>,   
    ctx: &mut TxContext
)
```

##### Parameters:

* `metadata`: The metadata object that is initially created.
* `dapp_module_address`: The package ID of the DApp.
* `dapp_object_id`: The state ID object of the package.
* `fee_payer_address`: The account responsible for covering the transaction fees for any cross-chain requests originating from the dApp.
* `coin`: The SUI coin used if the i_send_fee is greater than 0.

:::caution
Without creating dApp metadata object via the set_dapp_metadata function, it is not possible to make an i_send call.
:::
