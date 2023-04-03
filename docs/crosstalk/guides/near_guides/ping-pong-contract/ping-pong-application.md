---
title: Ping Pong Application
sidebar_position: 1
description: A simple ping pong contract using Router Gatway contracts
---

In this section we will go through how a simple cross-chain ping-pong dApp can be created by integrating the Router Gateway contracts.

### Cloning the NEAR Boilerplate code in Rust

Go to the terminal and clone the boilerplate repository using
`git clone https://github.com/near/boilerplate-template-rs-dev`

Get into the folder using `cd ./boilerplate-template-rs-dev/contract`

### Installing the dependencies using Cargo

Open the Cargo.toml file and paste the folowing:

```javascript
[package]
name = "cross-chain-ping-pong-application"
version = "1.0.0"
authors = ["Router Protocol"]
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
near-sdk = "4.0.0"
schemars = "0.8.12"
uint = { version = "0.9.3", default-features = false }
hex = { version = "0.4.3", default-features = false }
router-wasm-bindings = { version = "0.1.17", default-features = false, features = ["ethabi"] }

[profile.release]
codegen-units = 1
opt-level = "z"
lto = true
debug = false
panic = "abort"
overflow-checks = true

[workspace]
members = []

```

### Starting with the contract

Go to the `src` folder using `cd ./src`. Now we will start with adding the state variables. Open the file `lib.rs` in your code editor and add the following code.

```javascript
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env, near_bindgen, AccountId, Gas, Promise,
};

pub const CONTRACT_VERSION: &str = "1.0.0";
pub const CONTRACT_NAME: &str = "PingPong";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct PingPong {
    owner: AccountId,
    gateway: AccountId,
    current_request_id: u64,
    // srcChainType, srcChainId, requestId -> pingFromSource
    ping_from_source: UnorderedMap<(u64, String, u64), String>,
    // requestId => ackMessage
    ack_from_destination: UnorderedMap<u64, String>,
}

```

1. `owner`: AccountId of the owner of the contract. This is just for adding some access control mechanisms.
2. `gateway`: This is the AccountId of the Router's Gateway contract.
3. `current_request_id`: Request ID is a counter to count the requests. This is also used to index the messages sent and received across chains.
4. `ping_from_source`: This is a mapping which takes the source chain type, the source chain ID and the request ID and gives the message received from that chain as the output.
5. `ack_from_destination`: This is a mapping which takes the request ID and gives the message received as acknowledgement back from the destination chain.

### Implementing Default trait for the state variables:

```javascript
impl Default for PingPong {
    fn default() -> Self {
        Self {
            owner: env::predecessor_account_id(),
            gateway: env::predecessor_account_id(),
            current_request_id: 0,
            ping_from_source: UnorderedMap::new(b'p'),
            ack_from_destination: UnorderedMap::new(b'a'),
        }
    }
}
```

In the NEAR protocol, implementing the Default trait is neccessary. Just set default values for the states in this function.

### Creating the Implementation of the contract and adding an initializer function:

```javascript
#[near_bindgen]
impl PingPong {
  #[init]
  pub fn new(gateway: AccountId) -> Self {
      Self {
          owner: env::predecessor_account_id(),
          gateway,
          current_request_id: 0,
          ping_from_source: UnorderedMap::new(b'p'),
          ack_from_destination: UnorderedMap::new(b'a'),
      }
  }
}
```

We will create a `new` function with the decorator `init` which specifies that this is an initializer function. We pass the AccountId of the Gateway contract here and initialize the contracts.

### Creating the helper functions to `set` and `get` data:

Add the following functions below the `new` function. These functions

```javascript
// Function to set the gateway account ID.
// Only the owner account can call this function.
pub fn set_gateway(&mut self, gateway: AccountId) {
    if env::predecessor_account_id() != self.owner.clone() {
        env::panic_str("only owner");
    }

    self.gateway = gateway;
}

// Function to get the current request ID.
pub fn get_current_request_id(&self) -> u64 {
    return self.current_request_id.clone();
}

// Function to get the ping received from another chain.
pub fn get_ping_from_source(
    &self,
    src_chain_type: u64,
    src_chain_id: String,
    request_id: u64,
) -> String {
    self.ping_from_source
        .get(&(src_chain_type, src_chain_id, request_id))
        .unwrap_or("".to_string())
}

// Function to get the pong received back from the destination chain.
pub fn get_ack_from_destination(&self, request_id: u64) -> String {
    self.ack_from_destination
        .get(&request_id)
        .unwrap_or("".to_string())
}

// Function to get the Gateway Account ID.
pub fn get_gateway(&self) -> AccountId {
    self.gateway.clone()
}

// Function to get the Owner AccountId.
pub fn get_owner(&self) -> AccountId {
    self.owner.clone()
}
```

### Creating the structs file which contains the required data types:

Create a new file `structs.rs` in the `src` folder. Also add `mod structs;` at the top of `lib.rs` file.
In the file `structs.rs`, add the following structs:

```javascript
use near_sdk::serde::{Deserialize, Serialize};
use schemars::JsonSchema;

#[derive(Debug, JsonSchema, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
#[serde(crate = "near_sdk::serde")]
pub struct RequestArgs {
    pub exp_timestamp: u64,
    pub is_atomic_calls: bool,
}

#[derive(Debug, JsonSchema, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
#[serde(crate = "near_sdk::serde")]
pub struct DestinationChainParams {
    pub gas_limit: u64,
    pub gas_price: u64,
    pub dest_chain_type: u64,
    pub dest_chain_id: String,
    pub asm_address: Vec<u8>,
}

#[derive(Debug, JsonSchema, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
#[serde(crate = "near_sdk::serde")]
pub struct AckGasParams {
    pub gas_limit: u64,
    pub gas_price: u64,
}

#[derive(Debug, JsonSchema, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
#[serde(crate = "near_sdk::serde")]
pub struct ContractCalls {
    pub payloads: Vec<Vec<u8>>,
    pub dest_contract_addresses: Vec<Vec<u8>>,
}
```

These are the structs we have already discussed in the [Understanding CrossTalk Section](../../../../../understanding-crosstalk/near_guides/requestToDest)

### Creating the external function interface to call the gateway contract:

Create another file `external.rs` in the `src` folder. Also add `mod external;` at the top of `lib.rs` file.
In the file `external.rs`, add the following code:

```javascript
use crate::structs::*;
use near_sdk::ext_contract;

pub const TGAS: u64 = 1_000_000_000_000;

// Validator interface, for cross-contract calls
#[ext_contract(gateway_contract)]
trait GatewayContract {
    fn request_to_dest(
        &self,
        request_args: RequestArgs,
        ack_type: u8,
        ack_gas_params: AckGasParams,
        dest_chain_params: DestinationChainParams,
        contract_calls: ContractCalls,
    ) -> bool;

    fn set_dapp_metadata(&self, fee_payer_address: String);
}
```

We have already learnt about the `request_to_dest` function in the [Understanding CrossTalk Section](../../../understanding-crosstalk/near_guides/requestToDest).
Also we have learnt about the `set_dapp_metadata` function in the [Set Dapp Metadata Section](../../../understanding-crosstalk/setDappMetadata).

### Creating a file for defining events:

Also create another file for recording the events. Let us name it `events.rs`. Also add `mod events;` at the top of `lib.rs` file. Inside the `events.rs`, add the following events:

```javascript
use near_sdk::{
    serde::{Deserialize, Serialize},
    serde_json,
};
use std::fmt;

use crate::{CONTRACT_NAME, CONTRACT_VERSION};

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "event", content = "data")]
#[serde(rename_all = "snake_case")]
#[serde(crate = "near_sdk::serde")]
#[non_exhaustive]
pub enum EventLogVariant {
    PingFromSource(Vec<PingFromSourceEvent>),
    NewPing(Vec<NewPingEvent>),
    ExecutionStatus(Vec<ExecutionStatusEvent>),
    AckFromDestination(Vec<AckFromDestinationEvent>),
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct EventLog {
    pub standard: String,
    pub version: String,

    // `flatten` to not have "event": {<EventLogVariant>} in the JSON, just have the contents of {<EventLogVariant>}.
    #[serde(flatten)]
    pub event: EventLogVariant,
}

impl EventLog {
    pub fn new(event: EventLogVariant) -> Self {
        Self {
            standard: CONTRACT_NAME.to_string(),
            version: CONTRACT_VERSION.to_string(),
            event,
        }
    }
}

impl fmt::Display for EventLog {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_fmt(format_args!(
            "EVENT_JSON:{}",
            &serde_json::to_string(self).map_err(|_| fmt::Error)?
        ))
    }
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct PingFromSourceEvent {
    pub src_chain_type: u64,
    pub src_chain_id: String,
    pub request_id: u64,
    pub message: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct NewPingEvent {
    pub request_id: u64,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct ExecutionStatusEvent {
    pub event_identifier: u64,
    pub is_success: bool,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(crate = "near_sdk::serde")]
pub struct AckFromDestinationEvent {
    pub request_id: u64,
    pub ack_message: String,
}
```

We will emit these events as and when required from our contract. Now go to the `lib.rs` file and add these imports along with other imports:

```javascript
use events::{
    AckFromDestinationEvent, EventLog,
    EventLogVariant::{AckFromDestination, ExecutionStatus, NewPing, PingFromSource},
    ExecutionStatusEvent, NewPingEvent, PingFromSourceEvent,
};
use external::*;
use structs::*;
```

### Creating the `set_dapp_metdata` function for setting fee payer address:

```javascript
#[payable]
pub fn set_dapp_metadata(&mut self, fee_payer_address: String) -> Promise {
    gateway_contract::ext(self.gateway.clone())
        .with_attached_deposit(env::attached_deposit())
        .with_static_gas(Gas(5 * TGAS))
        .set_dapp_metadata(fee_payer_address)
}
```

Create a function `set_dapp_metadata` which takes the address of fee payer as a parameter and call the gateway contract's `set_dapp_metadata` function. Make this function payable by adding the decorator `payable` to it. This is because Router Gateway contract charges some minimal static fees to prevent Sybil attacks.

> Note: This fee payer address should be an address on the Router Chain. Check [here](../../../understanding-crosstalk/setDappMetadata) more details about this function.

### Creating the function to send a ping to another chain

Add these imports along with other imports:

```javascript
use router_wasm_bindings::ethabi::{decode, encode,ethereum_types::U256, ParamType, Token};
```

Add this as a function below `set_dapp_metadata` function in the `lib.rs` file:

```javascript
#[payable]
pub fn ping_destination(
    &mut self,
    chain_type: u64,
    chain_id: String,
    dest_gas_limit: u64,
    dest_gas_price: u64,
    ack_gas_limit: u64,
    ack_gas_price: u64,
    destination_contract_address: Vec<u8>,
    message: String,
    expiry_duration_in_seconds: u64,
) -> Promise {
    self.current_request_id += 1;

    let exp_timestamp =
        env::block_timestamp().checked_div(1000000000).unwrap() + expiry_duration_in_seconds;

    let request_args: RequestArgs = RequestArgs {
        exp_timestamp,
        is_atomic_calls: false,
    };

    let ack_type = 1; // ack_type = 1 => ACK_ON_SUCCESS

    let ack_gas_params: AckGasParams = AckGasParams {
        gas_limit: ack_gas_limit,
        gas_price: ack_gas_price,
    };

    let dest_chain_params: DestinationChainParams = DestinationChainParams {
        gas_limit: dest_gas_limit,
        gas_price: dest_gas_price,
        dest_chain_type: chain_type,
        dest_chain_id: chain_id,
        asm_address: Vec::new(),
    };

    let request_id_token: Token = Token::Uint(U256::from(self.current_request_id.clone()));
    let message_token: Token = Token::String(message);
    let encoded: Vec<u8> = encode(&[request_id_token, message_token]);

    let payloads: Vec<Vec<u8>> = vec![encoded];

    let dest_contract_addresses: Vec<Vec<u8>> = vec![destination_contract_address];

    let contract_calls: ContractCalls = ContractCalls {
        payloads,
        dest_contract_addresses,
    };

    let ping_event: EventLog = EventLog::new(NewPing(vec![NewPingEvent {
        request_id: self.current_request_id.clone(),
    }]));

    env::log_str(&ping_event.to_string());

    gateway_contract::ext(self.gateway.clone())
        .with_attached_deposit(env::attached_deposit())
        .request_to_dest(
            request_args,
            ack_type,
            ack_gas_params,
            dest_chain_params,
            contract_calls,
        )
}
```

Let's create the function to send a cross-chain request to another chain with a ping. You can name it anything you like. For simplicity, we will name it `ping_destination`. Make this function payable by adding the decorator `payable` to it. This is because Router Gateway contract charges some minimal static fees to prevent Sybil attacks.This function takes nine parameters:

1. **chain_type:** Chain type of the destination chain. Chain types for various chains can be found [here](../../../understanding-crosstalk/chainTypes).
2. **chain_id:** Chain ID of the destination chain. Pass this as a string.
3. **dest_gas_limit:** The gas limit required for execution of request on the destination chain. Since you will create the function to handle the request on the destination chain, you will know the amount of gas required to execute it.
   If you pass a lower gas limit than required, the request will not get executed on the destination chain. However, we provide a mechanism to increase the gas limit using the Web Relayer.
4. **dest_gas_price:** The gas price for the destination chain. If you don't know or don't want to check the gas price, you can just send `0` in its place and Router Chain will figure out the gas price for the destination chain and deduct the fees respectively.
5. **ack_gas_limit:** The gas limit required for execution of crosstalk acknowledgement received from the destination chain back on the source chain. Since you will create the function to handle the crosstalk acknowledgement request on the source chain, you will know the amount of gas required to execute it.
   If you pass a lower gas limit than required, the crosstalk acknowledgement request will not get executed on the source chain. However, we provide a mechanism to increase the gas limit using the Web Relayer.
6. **ack_gas_price:** The gas price for the source chain. If you don't know or don't want to check the gas price, you can just send `0` in its place and Router Chain will figure out the gas price for the destination chain and deduct the fees respectively.
7. **destination_contract_address:** Address of the contract that will handle the payload on the destination chain. Basically the address on the destination chain which we are going to ping. This has to be passed as vector of type `u8`.

   Please make sure to use the following format:

- For EVM chains as the destination chain:

```javascript
fn convert_evm_address_to_vec(evm_address: String) -> Vec<u8> {
  let addr = evm_address.split_at(2).1;
  let addr_as_vec = hex::decode(addr);

  addr_as_vec.unwrap()
}

```

8. **message:** The message you want to pass as ping to the destination chain.
9. **expiry_duration_in_seconds:** The expiry duration in seconds after which the request will expire and wouldn't be able to execute on the destination chain. If you don't worry about expiry duration, just pass a large number, say a trillion, as the expiry duration.

Now we will increment the request ID and create the parameters for `request_to_dest` function. We will then create the payload by abi encoding the request ID and the message string as payload. Then we will call the `request_to_dest` function of the Gateway contract. Detailed explanation for this function can be found [here](../../../understanding-crosstalk/near_guides/requestToDest).

This will create a cross-chain request to the destination chain along with the payload which is abi encoded argument containing request ID and the message string. Now we will create a function to receive a cross-chain request from another chain. We will also emit a `NewPing` event with the request ID.

### Function to receive ping from another chain

```javascript
pub fn handle_request_from_source(
    &mut self,
    _source_contract_address: String,
    payload: Vec<u8>,
    source_chain_id: String,
    source_chain_type: u64,
) -> Vec<u8> {
    if env::predecessor_account_id() != self.gateway.clone() {
        env::panic_str("not gateway");
    }

    let param_vec: Vec<ParamType> = vec![ParamType::Uint(64), ParamType::String];

    let token_vec: Vec<Token> = match decode(&param_vec, &payload) {
        Ok(data) => data,
        Err(_) => env::panic_str("not able to decode the payload"),
    };

    let request_id: u64 = token_vec[0].clone().into_uint().unwrap().as_u64();
    let message: String = token_vec[1].clone().into_string().unwrap();

    if message == "".to_string() {
        env::panic_str("String should not be empty");
    }

    self.ping_from_source.insert(
        &(
            source_chain_type.clone(),
            source_chain_id.clone(),
            request_id.clone(),
        ),
        &message,
    );

    let ping_from_source: EventLog = EventLog::new(PingFromSource(vec![PingFromSourceEvent {
        src_chain_id: source_chain_id.clone(),
        src_chain_type: source_chain_type.clone(),
        request_id: request_id.clone(),
        message: message.clone(),
    }]));

    env::log_str(&ping_from_source.to_string());

    payload
}

```

Create a function by the name `handle_request_from_source` with the parameters shown in the snippet below. Make sure to keep the name of the function same because otherwise the contract will not be able to receive the requests from another chain. The details of this function is explained here in [detail](../../../understanding-crosstalk/near_guides/handleRequestFromSource).

1. **source_contract_address:** The address of the contract on source chain from where this request was created. You can use it to validate whether the request originated from your contract on the source chain.
2. **payload:** The payload received from the source chain. Since we only created this payload, we know it is an abi encoded argument containing request ID and the message string. So we will decode it accordingly and set the `ping_from_source` mapping with it.
3. **source_chain_id:** Chain ID of the source chain from which this request was created.
4. **source_chain_type:** Chain type of the source chain from which this request was created.

We will also emit the `PingFromSource` event with the source chain ID, the source chain type, the request ID and the message as the parameters. We will return the payload again so that it is sent as acknowledgement back to the source chain.

Now we will create a function to handle the acknowledgement back on the source chain.

### Function to handle the acknowledgement back on the source chain

```javascript
pub fn handle_crosstalk_ack(
    &mut self,
    event_identifier: u64,
    exec_flags: Vec<bool>,
    exec_data: Vec<Vec<u8>>,
) {
    if env::predecessor_account_id() != self.gateway.clone() {
        env::panic_str("not gateway");
    }

    if !exec_flags[0].clone() {
        env::panic_str("Not executed successfully on the destination chain");
    }

    let decoded = decode(&[ParamType::Uint(64), ParamType::String], &exec_data[0]);
    if decoded.is_err() {
        env::panic_str("Cannot decode the exec data");
    }

    let decoded: Vec<Token> = decoded.unwrap();
    let request_id: u64 = decoded[0].clone().into_uint().unwrap().as_u64();
    let ack_message: String = decoded[1].clone().into_string().unwrap();

    self.ack_from_destination.insert(&request_id, &ack_message);

    let exec_status_event: EventLog = EventLog::new(ExecutionStatus(vec![ExecutionStatusEvent{
        event_identifier,
        is_success: exec_flags[0]
    }]));

    env::log_str(&exec_status_event.to_string());

    let ack_from_destination_event : EventLog= EventLog::new(AckFromDestination(vec![AckFromDestinationEvent{
        request_id,
        ack_message
    }]));

    env::log_str(&ack_from_destination_event.to_string());
}
```

Create a function by the name `handle_crosstalk_ack` with the parameters shown in the snippet below. Make sure to keep the name of the function same because otherwise the contract will not be able to receive the acknowledgement requests back from the source chain. The details of this function is explained here in [detail](../../../understanding-crosstalk/near_guides/handleCrossTalkAck).

1. **event_identifier:** The event nonce emitted from Gateway contract when the request was created. You can use this to track the status of the requests.
2. **exec_flags:** Since we sent only one call,

   - **if the execution was successful on the destination chain:**

     We will get <code>[true]</code> in exec_flags and the <code>[payload]</code> in exec_data as we sent this as return value in handle_request_from_source function.

   - **If the execution failed on the destination chain:**

     We will get <code>[false]</code> in exec_flags and <code>[errorBytes]</code> in exec_data where error bytes correspond to the error that was thrown on the destination chain contract.
     Since we sent the payload back as return value from the destination chain’s **handle_request_from_source** function, we can decode it here in the **handle_crosstalk_ack** function. First we decode the exec_data where the return value has come in. We decode it using the snippet shown above. In this way, you can get the data back from the source chain.

     Now we will set the `ack_from_destination` mapping with this data. We will also emit the `exec_status_event` and the `ack_from_destination_event` in this function along with the required parameters.

In this way, we can create a simple ping pong smart contract using the Router CrossTalk Utils library.
