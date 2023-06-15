# On Testnet

## Hardware Requirements
Validators should be able to host one or more data center locations with redundant power, networking, firewalls, HSMs, and servers. The initial minimum recommended hardware specifications are specified below. These may change as network usage increases.

```jsx
-> Ubuntu 22.04.x
-> 4+ vCPU x64 2.0+ GHz
-> 32+ GB RAM
-> 1TB+ SSD
```

:::tip
To check you system configuration, run the following command on your terminal/command prompt:
- **On Linux:** `lshw` or `cat /proc/cpuinfo`
- **On macOS:** `system_profiler SPHardwareDataType`
- **On Windows:** `systeminfo`'
:::

## Running a Validator on Router Testnet
To run a validator on Router chain's testnet, follow these 3 steps:
- [Run a Node on Testnet](./on-testnet/run-a-node)
- [Setup a Validator Account](./on-testnet/setup-a-validator-account)
- [Configure and Run an Orchestrator Instance](./on-testnet/configure-and-run-an-orchestrator-instance)
