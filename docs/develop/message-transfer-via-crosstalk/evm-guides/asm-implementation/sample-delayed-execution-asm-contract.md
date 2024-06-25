---
title: Sample Delayed Execution ASM Contract
sidebar_position: 3
---

A delayed execution ASM deliberately delays a cross-chain request by a certain period to force the validation of the request only once a certain amount of time has lapsed. After the request is delayed, the owner has the flexibility to reject the transaction if there is something malicious or invalid with the transaction.

```javascript
// Delay ASM
contract DelayASM is IAdditionalSecurityModule {
    mapping(bytes32 => bool) public delayedTransfers;
    address public immutable gatewayContract;
    uint256 public delayPeriod;
    address public immutable owner;
    string public appRouterBridgeAddress;

    constructor(address gatewayAddress, uint256 _delayPeriod, string memory _routerBridgeAddress) {
        gatewayContract = gatewayAddress;
        owner = msg.sender;
        delayPeriod = _delayPeriod;
        appRouterBridgeAddress = _routerBridgeAddress;
    }

    function setDelayPeriod(uint256 _delayPeriod) external {
        require(msg.sender == owner, "Caller is not owner");
        delayPeriod = _delayPeriod;
    }

    function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }

    function verifyCrossChainRequest(
        uint256 requestIdentifier,
        uint256 requestTimestamp,
        string calldata requestSender,
        string calldata srcChainId,
        bytes calldata payload,
        address handler
    ) external view returns (bool) {
        require(msg.sender == gatewayContract, "Caller is not gateway");
        bytes32 id = keccak256(
            abi.encode(requestIdentifier, requestTimestamp, requestSender, srcChainId, payload, handler)
        );
        if (delayedTransfers[id]) {
            return false;
        }
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        }
        revert("Transaction needs to be delayed");
    }
}
```

- The owner of the ASM contract can set the `delayPeriod`, which is the period that must pass before transactions can be executed on the destination contract once they have been validated on the Router Chain.

```javascript
  function setDelayPeriod(uint256 _delayPeriod) external {
      require(msg.sender == owner, "Caller is not owner");
      delayPeriod = _delayPeriod;
  }
```

- The Gateway contract invokes the `verifyCrossChainRequest` function before invoking the destination contract. It checks whether the transaction (a) has been rejected by the owner of the ASM contract, (b) is delayed or, (c) has reached the delay period.

  ```javascript
  function verifyCrossChainRequest(
    uint256 requestIdentifier,
    uint256 requestTimestamp,
    string memory requestSender,
    string memory srcChainId,
    bytes memory packet,
    address handler
  ) external view returns (bool) {
    require(msg.sender == gatewayContract, "Caller is not gateway");
        bytes32 id = keccak256(
            abi.encode(requestIdentifier, requestTimestamp, requestSender, srcChainId, payload, handler)
        );
        if (delayedTransfers[id]) {
            return false;
        }
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        }
        revert("Transaction needs to be delayed");
  }
  ```

- The owner of the contract can reject a transaction by its `ID`, which is the ABI-encoded function arguments in order.

  ```javascript
  function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }
  ```
