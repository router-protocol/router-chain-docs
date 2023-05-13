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

1. `owner`: AccountId of the owner of the contract. This is just for adding some access control mechanisms.
2. `gateway`: This is the AccountId of the Router's Gateway contract.
3. `current_request_id`: Request ID is a counter to count the requests. This is also used to index the messages sent and received across chains.
4. `ping_from_source`: This is a mapping which takes the source chain ID and the request ID and gives the message received from that chain as the output.
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

Implementing the Default trait is necessary in the NEAR protocol, where default values for the states should be set within this function.

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

To initialize the contracts, we will create a `new` function decorated with `init`, indicating it as an initializer function. Within this function, we will pass the AccountId of the Gateway contract and perform the initialization process.

### Creating the helper functions to `set` and `get` data:

Below the new function, you can add the following functions to handle setting and fetching values of state variables in the contract:

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

### Creating the external function interface to call the gateway contract:

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

We have already learnt about the `i_send` function in the [Understanding CrossTalk Section](../../../near-guides/iDapp-functions/i_send).
Also we have learnt about the `set_dapp_metadata` function in the [Set Dapp Metadata Section](../../../near-guides/iDapp-functions/set_dapp_metadata).

### Creating a file for defining events:

Also create another file for recording the events. Let us name it `events.rs`. Also add `mod events;` at the top of `lib.rs` file. Inside the `events.rs`, add the following events:

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

> Note: This fee payer address should be an address on the Router Chain. Check [here](../../../near-guides/iDapp-functions/set_dapp_metadata) more details about this function.

### Creating the function to send a ping to another chain

Add these imports along with other imports:

```javascript
use router_wasm_bindings::ethabi::{decode, encode,ethereum_types::U256, ParamType, Token};
```

Add this as a function below `set_dapp_metadata` function in the `lib.rs` file:

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

Create a function named `i_ping` decorated with `payable` that enables sending a cross-chain request to another chain with a ping.
Decorating with `payable` is necessary because the Router Gateway contract charges a minimal static fees to prevent Sybil attacks. The function accepts the following parameters:

1. **dest_chain_id:** Chain ID of the destination chain. Pass this as a string.
2. **destination_contract_address:** This parameter represents the address of the contract on the destination chain that will handle the payload. It is the address that we are pinging on the destination chain. Pass this as a string.
3. **str:** The message to be passed as ping to the destination chain.
4. **request_metadata:** The request metadata consists of parameters related to source chain and destination chain including the gas limit and price, the relayer fees and so on. Details about this parameter can be found [here](../../../near-guides/iDapp-functions/i_send#5-request_metadata).

The `i_ping` function starts by incrementing the request ID and creating the necessary parameters for the request_to_dest function. It then proceeds to create the packet by ABI encoding the request ID and the `str` string, resulting in a `packet`.

Next, a `request_packet` is constructed using the `destination_contract_address` and the `packet`. This packet contains the necessary information for the cross-chain request.

Next, the `NewPing` event should be emitted with the request ID.

Finally, the `i_send` function of the Gateway contract is invoked, passing in the relevant parameters. A detailed explanation of the i_send function can be found [here](../../../near-guides/iDapp-functions/i_send).

This will create a cross-chain request to the destination chain with the packet which is abi encoded argument containing request ID and the message string. A new function will now be implemented to receive a cross-chain request from another chain.

### Function to receive ping from another chain

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

Create a new function called `i_receive`, which is essential for receiving requests from another chain. Make sure to keep the signature of the function same otherwise the contract will not be able to receive requests from another chain. More about this function is explained here in [detail](../../../near-guides/iDapp-functions/i_receive).

1. **request_sender:** The address of the contract on source chain from where this request was created. You can use it to validate whether the request originated from your contract on the source chain.
2. **packet:** The packet received from the source chain. Since the packet contains the `request_id` and the `message` string, it can be decoded accordingly. After decoding, set the `ping_from_source` mapping with it.
3. **source_chain_id:** Chain ID of the source chain where the request was created.

In addition to handling the received cross-chain request, the `i_receive` function will emit a `PingFromSource` event. This event will include the source chain ID, request ID, and message as parameters. Furthermore, the function will return the `packet` as an acknowledgement, which will be sent back to the source chain.

To handle the acknowledgement, a new function called `i_ack` needs to be implemented into the contract.

### Function to handle the acknowledgement back on the source chain

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

Create a new function called `i_ack`, which is essential for receiving acknowledgment requests from the destination chain back on the source chain. Make sure to keep the signature of the function same otherwise the contract will not be able to receive acknowledgment requests. More about this function is explained here in [detail](../../../near-guides/iDapp-functions/i_ack).

1. **request_identifier:** The event nonce emitted from Gateway contract when the request was created. This can be used this to track the status of the requests.
2. **exec_flag:** The `exec_flag` tells about the status of execution of cross-chain request (`i_receive`) on destination chain.
3. **exec_data:**: The `exec_data` consists of the value returned from the `i_receive` function on the destination chain.

   - **if the execution was successful on the destination chain:**

     execFlag: [true] execData: (abi.encode(request_id, sample_string))

   - **If the execution failed on the destination chain:**

     execFlag: [false] execData: (abi.encode(`error_bytes`))

   Now decode the `exec_data` in the same format as done in the `i_receive` function since the same packet was returned from destination chain.

   Set the `ack_from_destination` mapping with this data. Also emit the `exec_status_event` and the `ack_from_destination_event` in this function along with the required parameters.

In this way, A simple ping pong smart contract can be created using the Router CrossTalk library.

> **Note:** The full contract can be found in [this](https://github.com/router-protocol/crosstalk-sample-near) repository.
