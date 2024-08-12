# On Mainnet

## Hardware Requirements
Validators should be able to host one or more data center locations with redundant power, networking, firewalls, HSMs, and servers. The initial minimum recommended hardware specifications are specified below. These may change as network usage increases.

```jsx
-> 6+ vCPU x64 2.0+ GHz
-> 16 to 32+ GB RAM
-> 1TB+ SSD
```

:::tip
To check you system configuration, run the following command on your terminal/command prompt:
- **On Linux:** `lshw` or `cat /proc/cpuinfo`
:::

## Running a Validator on Router Mainnet
To run a validator on Router chain's mainnet, follow these 3 steps:
- [Run a Sentry Node on Mainnet](./on-mainnet/run-a-node)
- [Setup a Validator Account](./on-mainnet/setup-a-validator-account)
- [Configure and Run an Orchestrator Instance](./on-mainnet/configure-and-run-an-orchestrator-instance)