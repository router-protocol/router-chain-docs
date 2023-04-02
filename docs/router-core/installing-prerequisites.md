---
title: Installing Prerequisites
sidebar_position: 1
---
# Installing Prerequisites
<!-- Recommended Installing Prerequisites for developing on Router in Go. -->

## Install Go

<!-- First, install VSCode: [https://code.visualstudio.com/download](https://code.visualstudio.com/download) -->

If you do not have Go installed in your system, you can set it up by following the three easy steps listed [here](https://go.dev/doc/install). The latest versions of `routerd` require Go version `v1.18+`.

## Set up Rust
To work with CosmWasm, you'll need to make sure you have [rustup](https://rustup.rs/) installed along with a recent `rustc` and `cargo` version installed. Currently, we are testing on `1.58.1+`. We use `rustup` to install rust since it makes maintaining dependencies and handling updates much more efficient.

<details>
<summary><b>Installing Rust on Mac/Linux</b></summary>

**Step 1)** Install [rustup](https://rustup.rs/).

**Step 2)** Once installed, check that you have the correct version installed:
```bash
rustup default stable
cargo version
# If this is lower than 1.58.1+, update
rustup update stable
```
**Step 3)** Once rust is installed, make sure you have the `wasm32` target:
```bash
rustup target list --installed
# if wasm32 is not listed after running the aforementioned command, run the following:
rustup target add wasm32-unknown-unknown
```
</details>

<details>
<summary><b>Installing Rust on Windows 10</b></summary>

**Step 1)** Download and execute `rustup-init.exe` from [rustup.rs](https://rustup.rs/). 
If prompted, download and install Visual C++ Build Tools 2019, from <https://visualstudio.microsoft.com/visual-cpp-build-tools/>. Make sure "Windows 10 SDK" and "English language pack" are selected.

**Step 2)** Once installed, check that you have the correct version installed:
```bash
rustup default stable
cargo version
# If this is lower than 1.58.1+, update
rustup update stable
```
**Step 3)** Once rust is installed, make sure you have the `wasm32` target:
```bash
rustup target list --installed
# if wasm32 is not listed after running the aforementioned command, run the following:
rustup target add wasm32-unknown-unknown
```
</details>

## IDE
To develop and test smart contracts using Rust, a good IDE is a must. Currently, [VSCode](https://code.visualstudio.com/download) is the best-supported environment for RLS (Rust Language Server). Coupled with the [rust-analyzer for the VSCode](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer) plugin, it makes use of the rust compiler to type-check all your code on each save.

## Docker
To optimize production code and make the binary size of compiled CosmWasm contracts as small as possible, we use [rust-optimizer](https://github.com/CosmWasm/rust-optimizer), which uses Docker to work. Download and install Docker Desktop for your system using this [link](https://www.docker.com/).

<!-- ## Clone Osmosis and Cosmos SDK
To set up your local environment for Osmosis, clone the Osmosis repo:

```bash
git clone https://github.com/router-protocol/osmosis.git
```

The next step is not necessary, but it is extremely useful to have as a reference. For

Clone the Cosmos SDK repo:
```bash
git clone https://github.com/cosmos/cosmos-sdk.git
```

Now launch VSCode and open the Osmosis folder through `File -> Open`

Finally, add the Cosmos SDK to your workspace by selecting it in `File -> Add Folder to Workspace`

Both Osmosis and the Cosmos SDK should now show up on the same VSCode page!

## Add Relevant VSCode Extensions
Add the following extensions to your VSCode:
1. [Go by Google](https://marketplace.visualstudio.com/items?itemName=golang.Go)
2. [VSCode Proto 3 by zxh404](https://marketplace.visualstudio.com/items?itemName=zxh404.vscode-proto3)
3. [Git Lens by GitKraken](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
4. [Tabnine AI by Tabnine](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)

## Vscode configuration

To make your environment run tests automatically every time you save"

Go to: `VSCode -> Preferences -> settings -> Extensions -> Go`

* Set `Go: Lint tool` to `golint`. You can use `staticcheck` if you'd like, it can just take lots of computational resources.
    * If you'd like to use the same configuration as osmosis code, use `golangci-lint` .
    * You will likely be prompted to install the linter you choose, click the install button.
* Set `Go: Format tool` to one of the following: `goreturns` or `gofumports`
    * You will likely be prompted to install the formatter you choose, click the install button.
* Check `Go: Test on Save`


At this point, your environment should be ready to go!

## License

This work is dual-licensed under Apache 2.0 and MIT.
You can choose between one of them if you use this work.

`SPDX-License-Identifier: Apache-2.0 OR MIT` -->
