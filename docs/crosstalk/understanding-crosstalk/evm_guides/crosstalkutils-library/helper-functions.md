---
title: Helper Functions
sidebar_position: 3
---

### `toBytes`
A function to convert type address to type bytes:
```javascript
function toBytes(address addr) internal pure returns (bytes memory b){
  assembly {
      let m := mload(0x40)
      addr := and(addr, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
      mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, addr))
      mstore(0x40, add(m, 52))
      b := m
  }
}
```

### `toAddress`
A function to convert type bytes to type address:
```javascript
function toAddress(bytes memory _bytes) internal pure returns (address addr) {
    bytes20 srcTokenAddress;
    assembly {
        srcTokenAddress := mload(add(_bytes, 0x20))
    }
    addr = address(srcTokenAddress);
}
```

### `getTxStatusForAtomicCall`
When you send multiple contract calls to the destination chain with the **`isAtomicCalls`** flag set as true, either all the calls will be executed or none of the calls will be executed. When the acknowledgement comes back on the source chain, a parameter called **`execFlags`**, an array of booleans, denotes which calls were executed and which failed.

Since this is the case of atomic calls, we are sure that either all the call were executed or none of the calls were executed. But for the purposes of debugging, we provide **`true`** in the array till the point of failure so that the developer knows exactly which call failed.

Besides the acknowledgment, developers can use the function **`getTxStatusForAtomicCall`** to fetch whether the calls were successfully executed on the destination chain.

### `getTheIndexOfCallFailure`
In case of atomic calls, the function **`getTheIndexOfCallFailure`** can be used to get the index of the call that failed on the destination chain. Note that this function will throw an error if all the calls were successfully executed. Therefore, it is advised that you check whether or not **`getTxStatusForAtomicCall`** returns false before calling this function.
```javascript
function getTheIndexOfCallFailure(
	bool[] calldata execFlags
) internal pure returns (uint8);
```