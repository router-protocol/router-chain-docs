# On Devnet

## Hardware Requirements
Validators should be able to host one or more data center locations with redundant power, networking, firewalls, HSMs, and servers. The initial minimum recommended hardware specifications are specified below. These may change as network usage increases.

```jsx
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

## Running a Validator on Router Devnet
To run a validator on Router chain's devnet, follow these 3 steps:
- [Run a Sentry Node on Devnet](./on-devnet/run-a-sentry-node)
- [Setup a Validator Account](./on-devnet/setup-a-validator-account)
- [Configure and Run an Orchestrator Instance](./on-devnet/configure-and-run-an-orchestrator-instance)



