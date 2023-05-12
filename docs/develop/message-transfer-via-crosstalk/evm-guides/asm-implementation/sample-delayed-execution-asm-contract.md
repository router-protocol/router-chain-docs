---
title: Sample Delayed Execution ASM Contract
sidebar_position: 3
---

A delayed execution ASM deliberately delays a cross-chain request by a certain period to force the validation of the request only once a certain amount of time has lapsed. After the request is delayed, the owner has the flexibility to reject the transaction if there is something malicious or invalid with the transaction.

```javascript
// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0 <0.9.0;
import "@routerprotocol/evm-gateway-contracts/contracts/IAdditionalSecurityModule.sol";

/// @title Delayed Execution
/// @notice This contract enables user to delay a request by a certain time period
/// and in the mean time owner has the flexibility to reject the transaction if
/// there is something malicious or invalid with it
contract DelayASM is IAdditionalSecurityModule {
    mapping(bytes32 => bool) public delayedTransfers; // request id => bool(if it is delayed or not)
    address public gatewayContract; // address of the Gateway contract
    uint256 public delayPeriod; // time period by which the transaction shall be delayed
    address public owner; // address of the owner of the contract

    constructor(address gatewayAddress, uint256 _delayPeriod) {
        gatewayContract = gatewayAddress;
        owner = msg.sender;
        delayPeriod = _delayPeriod;
    }

    ///@notice This is a function that sets the time period by which the tx shall be delayed
    ///@notice This can only be set by the owner of the contract
    ///@param _delayPeriod time period in seconds
    function setDelayPeriod(uint256 _delayPeriod) external {
        require(msg.sender == owner, "Caller is not owner");
        delayPeriod = _delayPeriod;
    }

    ///@notice This is a function that allows the owner to reject a tx when it has been delayed
    ///@notice This can only be called by the owner of the contract
    ///@param id This is the request id
    function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }

    ///@notice This is an internal function that checks if a request has been delayed
    ///@param id This is the request id
    ///@return Returns true if the request is rejected and false if not rejected
    function isRequestRejected(bytes32 id) internal view returns (bool) {
        return delayedTransfers[id];
    }

    ///@notice This is an internal function that validates if a tx needs to be delayed
    ///@notice or if a tx has already passed its delay period
    ///@param requestTimestamp This is the request timestamp when this request was added/verified on the Router chain.
    ///@return Returns true if the request has surpassed its delay period
    function _validateDelay(
        uint256 requestTimestamp
    ) internal view returns (bool) {
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        } else {
            revert("Transaction needs to be delayed");
        }
    }

    ///@notice This is a function triggered by Router's Gateway contract to execute waiting period.
    ///@notice This function can only be called by the Gateway contract
    ///@return Returns true if tx does not need to be delayed or if a tx has already surpassed its delay period
    /// and false if it is rejected by the owner.
    function verifyCrossChainRequest(
        uint256 eventNonce,
        uint256 requestTimestamp,
        string memory srcContractAddress,
        string memory srcChainId,
        bytes memory payload,
        address handler
    ) external view returns (bool) {
        require(msg.sender == gatewayContract, "Caller is not Gateway");
        bytes32 id = keccak256(
            abi.encode(
                eventNonce,
                requestTimestamp,
                srcContractAddress,
                srcChainId,
                payload,
                handler
            )
        );
        // TODO: add your business logic here
        bool isRejected = isRequestRejected(id);
        if (isRejected) {
            return !isRejected;
        }
        _validateDelay(requestTimestamp);
        return !isRejected;
    }
}
```

- The owner of the ASM contract can set the `delayPeriod`, which is the period that must pass before transactions can be executed on the destination contract once they have been validated on the Router chain.

  ```javascript
  function setDelayPeriod(uint256 _delayPeriod) external {
      require(msg.sender == owner, "Caller is not owner");
      delayPeriod = _delayPeriod;
  }
  ```

- The Gateway contract invokes the `verifyCrossChainRequest` function before invoking the destination contract. It checks whether the transaction (a) has been rejected by the owner of the ASM contract, (b) is delayed or, (c) has reached the delay period, by calling the `_validateDelay` function.
  ```javascript
  function verifyCrossChainRequest(
  uint256 eventNonce,
  uint256 requestTimestamp,
  string memory srcContractAddress,
  string memory srcChainId,
  bytes memory payload,
  address handler
  ) external view returns (bool) {
  require(msg.sender == gatewayContract, "Caller is not Gateway");
  bytes32 id = keccak256(
      abi.encode(
          eventNonce,
          requestTimestamp,
          srcContractAddress,
          srcChainId,
          payload,
          handler
      )
  );
  // TODO: add your business logic here
  bool isRejected = isRequestRejected(id);
  if (isRejected) {
      return !isRejected;
  }
  _validateDelay(requestTimestamp);
  return !isRejected;
  }
  ```
- The owner of the contract can reject a transaction by its `ID`, which is the ABI-encoded function arguments in order.

  ```javascript
  function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }
  ```
- The `isRequestRejected` function checks whether a transaction has been rejected by the owner or not.
  ```javascript
  function isRequestRejected(bytes32 id) internal view returns (bool) {
      return delayedTransfers[id];
  }
  ```
- The `_validateDelay` function determines whether a transaction is delayed or not. If it is delayed, the function reverts to notify the Gateway to wait for some time before trying again.

    ```javascript
    function _validateDelay(
        uint256 requestTimestamp
    ) internal view returns (bool) {
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        } else {
            revert("Transaction needs to be delayed");
        }
    }
    ```