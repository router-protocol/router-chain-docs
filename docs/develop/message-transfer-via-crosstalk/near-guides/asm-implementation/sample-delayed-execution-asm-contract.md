---
title: Sample Delayed Execution ASM Contract
sidebar_position: 3
---

A delayed execution ASM deliberately delays a cross-chain request by a certain period to force the validation of the request only once a certain amount of time has lapsed. After the request is delayed, the owner has the flexibility to reject the transaction if there is something malicious or invalid with the transaction.

```javascript
use ethabi::{encode, ethereum_types::U256, Token};
use near_sdk::{
    borsh::{self, BorshDeserialize, BorshSerialize},
    collections::UnorderedMap,
    env::{self, keccak256},
    json_types::U128,
    near_bindgen, AccountId, PanicOnDefault,
};

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct DelayAsm {
    delayed_transfers: UnorderedMap<Vec<u8>, bool>,
    gateway_contract: AccountId,
    delay_period: U128,
    owner: AccountId,
}

// Implement the contract structure
#[near_bindgen]
impl DelayAsm {
    #[init]
    pub fn new(gateway: AccountId, delay_period: U128) -> Self {
        Self {
            delayed_transfers: UnorderedMap::new(b"D"),
            gateway_contract: gateway,
            delay_period,
            owner: env::predecessor_account_id(),
        }
    }

    pub fn get_gateway(&self) -> AccountId {
        self.gateway_contract.clone()
    }

    pub fn get_delay_period(&self) -> U128 {
        self.delay_period.clone()
    }

    pub fn is_request_rejected(&self, id: Vec<u8>) -> bool {
        self.delayed_transfers.get(&id).unwrap_or(false)
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner.clone()
    }

    pub fn set_gateway(&mut self, gateway: AccountId) {
        if self.owner.clone() != env::predecessor_account_id() {
            env::panic_str("only owner");
        }

        self.gateway_contract = gateway;
    }

    pub fn set_delay_period(&mut self, delay_period: U128) {
        if self.owner.clone() != env::predecessor_account_id() {
            env::panic_str("only owner");
        }

        self.delay_period = delay_period;
    }

    pub fn reject_request(&mut self, id: Vec<u8>) {
        if self.owner.clone() != env::predecessor_account_id() {
            env::panic_str("only owner");
        }

        self.delayed_transfers.insert(&id, &true);
    }

    fn get_id(
        request_identifier: U128,
        request_timestamp: U128,
        src_chain_id: String,
        request_sender: String,
        packet: Vec<u8>,
        handler: AccountId,
    ) -> Vec<u8> {
        let request_id_u256: U256 = U256::from(u128::from(request_identifier));
        let request_id_token: Token = Token::Uint(request_id_u256);

        let request_timestamp_u256: U256 = U256::from(u128::from(request_timestamp));
        let request_timestamp_token: Token = Token::Uint(request_timestamp_u256);

        let src_chain_id_token: Token = Token::String(src_chain_id);
        let request_sender_token: Token = Token::String(request_sender);
        let packet_token: Token = Token::Bytes(packet);
        let handler_token: Token = Token::String(handler.to_string());

        let id: Vec<u8> = encode(&[
            request_id_token,
            request_timestamp_token,
            request_sender_token,
            src_chain_id_token,
            packet_token,
            handler_token,
        ]);

        keccak256(&id)
    }

    pub fn verify_cross_chain_request(
        &mut self,
        request_identifier: U128,
        request_timestamp: U128,
        src_chain_id: String,
        request_sender: String,
        packet: Vec<u8>,
        handler: AccountId,
    ) -> bool {
        if self.gateway_contract.clone() != env::predecessor_account_id() {
            env::panic_str("Caller is not gateway");
        }

        let id: Vec<u8> = Self::get_id(
            request_identifier,
            request_timestamp,
            src_chain_id,
            request_sender,
            packet,
            handler,
        );

        if self.delayed_transfers.get(&id).unwrap_or(false) {
            return false;
        }

        let current_timestamp: u64 = env::block_timestamp().checked_div(1000000000).unwrap();

        if U128::from(u128::from(current_timestamp))
            > U128::from(u128::from(request_timestamp) + u128::from(self.delay_period))
        {
            return true;
        }

        env::panic_str("Transaction needs to be delayed");
    }
}
```

- The owner of the ASM contract can set the `delay_period`, which is the period that must pass before transactions can be executed on the destination contract once they have been validated on the Router Chain.

  ```javascript
  pub fn set_delay_period(&mut self, delay_period: U128) {
    if self.owner.clone() != env::predecessor_account_id() {
        env::panic_str("only owner");
    }

    self.delay_period = delay_period;
  }
  ```

- The Gateway contract invokes the `verify_cross_chain_request` function before invoking the destination contract. It checks whether the transaction (a) has been rejected by the owner of the ASM contract, (b) is delayed or, (c) has reached the delay period.

  ```javascript
  pub fn verify_cross_chain_request(
    &mut self,
    request_identifier: U128,
    request_timestamp: U128,
    src_chain_id: String,
    request_sender: String,
    packet: Vec<u8>,
    handler: AccountId,
  ) -> bool {
    if self.gateway_contract.clone() != env::predecessor_account_id() {
        env::panic_str("Caller is not gateway");
    }

    let id: Vec<u8> = Self::get_id(
        request_identifier,
        request_timestamp,
        src_chain_id,
        request_sender,
        packet,
        handler,
    );

    if self.delayed_transfers.get(&id).unwrap_or(false) {
        return false;
    }

    let current_timestamp: u64 = env::block_timestamp().checked_div(1000000000).unwrap();

    if U128::from(u128::from(current_timestamp))
        > U128::from(u128::from(request_timestamp) + u128::from(self.delay_period))
    {
        return true;
    }

    env::panic_str("Transaction needs to be delayed");
  }
  ```

- The owner of the contract can reject a transaction by its `ID`, which is the ABI-encoded function arguments in order.

  ```javascript
  pub fn reject_request(&mut self, id: Vec<u8>) {
    if self.owner.clone() != env::predecessor_account_id() {
        env::panic_str("only owner");
    }

    self.delayed_transfers.insert(&id, &true);
  }
  ```

- The `is_request_rejected` function checks whether a transaction has been rejected by the owner or not.
  ```javascript
  pub fn is_request_rejected(&self, id: Vec<u8>) -> bool {
    self.delayed_transfers.get(&id).unwrap_or(false)
  }
  ```
