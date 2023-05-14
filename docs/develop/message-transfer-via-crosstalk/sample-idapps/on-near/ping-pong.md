---
title: Cross-chain Ping Pong
sidebar_position: 1
description: A simple ping pong dApp using Router CrossTalk
---

## Overview

In this section, we will create a cross-chain ping pong dApp using Router CrossTalk. Using this dApp, you can send any message (ping) from a source chain to a destination chain and receive an acknowledgment (pong) back to the source chain. 

## Step-by-Step Guide

<details>
<summary><b>Step 1) Cloning the NEAR Boilerplate code in Rust</b></summary>
Go to the terminal and clone the boilerplate repository using the following command:

```bash
git clone https://github.com/near/boilerplate-template-rs-dev
```
After cloning the this repo, change your directory:

```bash
cd ./boilerplate-template-rs-dev/contract
```
</details>

<details>
<summary><b>Step 2) Installing the dependencies using Cargo</b></summary>

Open the `Cargo.toml` file and paste the folowing:

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
</details>

<details>
<summary><b>Step 3) Add state variables to the contract</b></summary>

Change your directory to the `src` folder and add the state variables. To do this, open the file `lib.rs` in your code editor and add the following code.

```javascript
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env,
    json_types::U128,
    near_bindgen, AccountId, Gas, Promise,
};

pub const CONTRACT_VERSION: &str = "1.0.0";
pub const CONTRACT_NAME: &str = "PingPong";

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct PingPong {
    owner: AccountId,
    gateway: AccountId,
    current_request_id: u64,
    // src_chain_id, request_id -> ping_from_source
    ping_from_source: UnorderedMap<(String, u64), String>,
    // request_id => ack_message
    ack_from_destination: UnorderedMap<u64, String>,
}

```

**1. `owner` -** Account address (known as `AccountId` on NEAR) of contract's owner. This is just for adding some access control mechanisms.

**2. `gateway` -** This is the account address of the Router's Gateway contract.

**3. `current_request_id` -** A variable to maintain the count of the requests. This is also used to index the messages sent and received across chains.

**4. `ping_from_source` -** This is a mapping that takes the source chain ID and the request ID and returns the message received from that chain as the output.

**5. `ack_from_destination` -** This is a mapping which takes the request ID and gives the message received as acknowledgement back from the destination chain.

</details>

<details>
<summary><b>Step 4) Implementing default trait for the state variables</b></summary>

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

Implementing the default trait is necessary on NEAR. Default values for the states should be set within the aforementioned function.
</details>

<details>
<summary><b>Step 5) Creating the implementation of the contract and adding an initializer function</b></summary>

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

To initialize the contracts, we will create a `new` function with `init` decorator, indicating it as an initializer function. Within this function, we will pass the account address of the Gateway contract and perform the initialization process.

</details>

<details>
<summary><b>Step 6) Creating helper functions</b></summary>

Below the `new` function, you can add the following functions to handle setting and fetching values of state variables in the contract:

```javascript
// Function to set the Gateway account ID.
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
    src_chain_id: String,
    request_id: u64,
) -> String {
    self.ping_from_source
        .get(&(src_chain_id, request_id))
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

</details>

<details>
<summary><b>Step 7) Creating an external function interface to call the Gateway contract</b></summary>

Create another file `external.rs` in the `src` folder. Also add `mod external;` at the top of `lib.rs` file.
In the file `external.rs`, add the following code:

```javascript
use near_sdk::ext_contract;

pub const TGAS: u64 = 1_000_000_000_000;

// Validator interface, for cross-contract calls
#[ext_contract(gateway_contract)]
trait GatewayContract {
    fn i_send(
        &mut self,
        version: U128,
        dest_chain_id: String,
        request_metadata: Vec<u8>,
        request_packet: Vec<u8>,
    ) -> bool;

    fn set_dapp_metadata(&self, fee_payer_address: String);
}
```

We have already learnt about the `i_send` function in the [i_send section](../../near-guides/iDapp-functions/i_send).
Also we have learnt about the `set_dapp_metadata` function in the [set_dapp_metadata section](../../near-guides/iDapp-functions/set_dapp_metadata).
</details>

<details>
<summary><b>Step 8) Creating a file for defining events</b></summary>

Now, we'll create a file for recording the events. Let us name it `events.rs`. Also add `mod events;` at the top of `lib.rs` file. Inside the `events.rs`, add the following events:

```javascript
use near_sdk::{
    json_types::U128,
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
    pub request_identifier: u64,
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
```
</details>

<details>
<summary><b>Step 9) Creating a function to set the fee payer address</b></summary>

```javascript
#[payable]
pub fn set_dapp_metadata(&mut self, fee_payer_address: String) -> Promise {
    gateway_contract::ext(self.gateway.clone())
        .with_attached_deposit(env::attached_deposit())
        .with_static_gas(Gas(5 * TGAS))
        .set_dapp_metadata(fee_payer_address)
}
```

Create a function `set_dapp_metadata` that takes the `fee_payer_address` as a parameter and calls the Gateway contract's `set_dapp_metadata` function. Make this function payable by adding the decorator `payable` to it. This is because Router Gateway contract charges some minimal fees to prevent Sybil attacks.

:::tip
The fee payer address should be an address on the Router chain. Check [here](../../near-guides/iDapp-functions/set_dapp_metadata) more details about this function.
:::

</details>

<details>
<summary><b>Step 10) Creating a function to send a ping to another chain</b></summary>

Add these imports along with other imports:

```javascript
use router_wasm_bindings::ethabi::{decode, encode,ethereum_types::U256, ParamType, Token};
```

Add this as a function below the `set_dapp_metadata` function in the `lib.rs` file:

```javascript
#[payable]
pub fn i_ping(
    &mut self,
    dest_chain_id: String,
    destination_contract_address: String,
    str: String,
    request_metadata: Vec<u8>,
) -> Promise {
    self.current_request_id += 1;

    let request_id_token: Token = Token::Uint(U256::from(
        self.current_request_id.clone()
    ));
    let message_token: Token = Token::String(str);
    // abi.encode(request_id, message)
    let packet: Vec<u8> = encode(&[request_id_token, message_token]);

    let handler_token: Token = Token::String(destination_contract_address);
    let packet_token: Token = Token::Bytes(packet);

        // abi.encode(packet, message)
    let request_packet: Vec<u8> =
        encode(&[handler_token, packet_token]);

    let ping_event: EventLog = EventLog::new(NewPing(vec![NewPingEvent {
        request_id: self.current_request_id.clone(),
    }]));

    env::log_str(&ping_event.to_string());

    gateway_contract::ext(self.gateway.clone())
        .with_attached_deposit(env::attached_deposit())
        .i_send(
            U128::from(1),
            dest_chain_id,
            request_metadata,
            request_packet,
        )
}
```

Create a function named `i_ping` decorated with `payable` that enables sending a message to another chain.  The function accepts the following parameters:

**1) `dest_chain_id` -** Network ID of the destination chain in string format.

**2) `destination_contract_address` -** This parameter represents the destination contract address that will handle the payload. Pass this as a string.

**3) `str` -** The message to be passed as a ping to the destination chain.

**4) `request_metadata` -** The `request_metadata` consists of parameters related based on the source chain and destination chain including the gas limit and price, the relayer fees, among others. Details about this parameter can be found [here](../../near-guides/iDapp-functions/i_send#5-request_metadata).

The `i_ping` function starts by incrementing the `request_id` and creating the necessary parameters for the `i_ping` function. It then proceeds to create the `packet` by ABI encoding the `request_id `and the message string, resulting in a `packet`.

Next, a `request_packet` is constructed using the `destination_contract_address` and the `packet`. This packet contains the necessary information for the cross-chain request.

Next, the `NewPing` event should be emitted whenever a new request is generated.

Finally, the `i_send` function of the Gateway contract is invoked, passing in the relevant parameters. A detailed explanation of the `i_send` function can be found [here](../../near-guides/iDapp-functions/i_send). This will create a cross-chain request to the destination chain with the abi-encoded packet.

</details>

<details>
<summary><b>Step 11) Function to receive a ping from the source chain</b></summary>

```javascript
pub fn i_receive(
    &mut self,
    request_sender: String,
    packet: Vec<u8>,
    src_chain_id: String,
) -> Vec<u8> {
    if env::predecessor_account_id() != self.gateway.clone() {
        env::panic_str("not gateway");
    }

    let param_vec: Vec<ParamType> = vec![ParamType::Uint(64), ParamType::String];

    let token_vec: Vec<Token> = match decode(&param_vec, &packet) {
        Ok(data) => data,
        Err(_) => env::panic_str("not able to decode the packet"),
    };

    let request_id: u64 = token_vec[0].clone().into_uint().unwrap().as_u64();
    let message: String = token_vec[1].clone().into_string().unwrap();

    if message == "".to_string() {
        env::panic_str("String should not be empty");
    }

    self.ping_from_source.insert(
        &(
            source_chain_id.clone(),
            request_id.clone(),
        ),
        &message,
    );

    let ping_from_source: EventLog = EventLog::new(PingFromSource(vec![PingFromSourceEvent {
        src_chain_id: source_chain_id.clone(),
        request_id: request_id.clone(),
        message: message.clone(),
    }]));

    env::log_str(&ping_from_source.to_string());

    packet
}

```

Create a new function called `i_receive`, which is essential to receive and handle requests coming from another chain. Make sure to keep the signature of the function same as above otherwise the contract will not be able to receive requests from another chain. More about this function is explained [here](../../near-guides/iDapp-functions/i_receive).

**1) `request_sender` -** The address of the contract on source chain from where this request was created. You can use it to validate whether the request originated from your contract on the source chain.

**2) `packet` -** The packet received from the source chain. Decode the packet and set the `ping_from_source` mapping in the decoded data.

**3) `source_chain_id` -** Network ID of the source chain where the request was created.

In addition to handling the incoming cross-chain request, the `i_receive` function will emit a `PingFromSource` event. This event will include the `source_chain_id`, `request_id`, and the message string. Furthermore, the function will return the `packet` as an acknowledgement, which will be sent back to the source chain.

To handle the acknowledgement, a new function called `i_ack` needs to be implemented into the contract.
</details>

<details>
<summary><b>Step 12) Function to handle the acknowledgement on the source chain</b></summary>

```javascript
pub fn i_ack(
    &mut self,
    request_identifier: U128,
    exec_flag: bool,
    exec_data: Vec<u8>
) {
    if env::predecessor_account_id() != self.gateway.clone() {
        env::panic_str("not gateway");
    }

    let decoded = decode(&[ParamType::Uint(64), ParamType::String], &exec_data);
    if decoded.is_err() {
        let format_str: String = format!(
            "Cannot decode the exec data for request_id: {:?}",
            request_identifier.clone()
        );
        env::panic_str(&format_str);
    }

    let decoded: Vec<Token> = decoded.unwrap();
    let request_id: u64 = decoded[0].clone().into_uint().unwrap().as_u64();
    let ack_message: String = decoded[1].clone().into_string().unwrap();

    self.ack_from_destination.insert(&request_id, &ack_message);

    let exec_status_event: EventLog =
        EventLog::new(ExecutionStatus(vec![ExecutionStatusEvent {
            request_identifier,
            is_success: exec_flag,
        }]));

    env::log_str(&exec_status_event.to_string());

    let ack_from_destination_event: EventLog =
        EventLog::new(AckFromDestination(vec![AckFromDestinationEvent {
            request_id,
            ack_message,
        }]));

    env::log_str(&ack_from_destination_event.to_string());
}
```

Create a new function called `i_ack`, which is essential to receive and handle acknowledgments on the source chain. Make sure to keep the signature of the function same as above otherwise the contract will not be able to receive acknowledgment requests. More about this function is explained [here](../../near-guides/iDapp-functions/i_ack).

**1) `request_identifier` -** The event nonce emitted from Gateway contract when the request was created. This can be used this to track the status of the requests.
**2) `exec_flag` -** The `exec_flag` is a boolean value that tells you the execution status of your request on destination chain.
**3) `exec_data` -**: The `exec_data` parameter is the data in bytes that provides the abi-encoded return value from the `i_receive` call on the destination chain.
   - **If the execution is successful on the destination chain:**  
      - `exec_flag` - `[true]`
      - `exec_data` - `(abi.encode(request_id, sample_string))`

    Since the return value is `uint256`, this `execData` can be decoded using abi decoding in the following way:

   - **If the execution fails on the destination chain:**
      - `execFlag` - `[false]`
      - `execData` - `(abi.encode(`error_bytes`))`

   Now decode the `exec_data` in the same format as done in the `i_receive` function since the same packet was returned from the destination chain.

   Set the `ack_from_destination` mapping with this data and emit the `exec_status_event` and the `ack_from_destination_event`.

</details>

:::info
The full contract can be found in [this repository](https://github.com/router-protocol/crosstalk-sample-near).
:::
