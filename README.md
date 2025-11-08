![Image](./header.png)

# RescueDAO Stylus

This project combines a Rust smart contract built with Arbitrum Stylus and a Next.js frontend interface. It includes both a Rust implementation of a counter smart contract and a modern web interface to interact with it.

## Project Structure

```
├── src/                 # Rust smart contract (Stylus)
├── examples/            # Rust examples
├── frontend/            # Next.js frontend application
├── Cargo.toml          # Rust dependencies
└── README.md           # This file
```

## Smart Contract (Stylus/Rust)

The smart contract implements a basic counter with the following functions:

The smart contract implements a basic counter with the following functions:

```rust
pub fn number(&self) -> U256                    // Get current number
pub fn set_number(&mut self, new_number: U256)  // Set number to specific value
pub fn increment(&mut self)                     // Increment by 1
pub fn add_number(&mut self, new_number: U256)  // Add to current number
pub fn mul_number(&mut self, new_number: U256)  // Multiply current number
pub fn add_from_msg_value(&mut self)            // Add ETH value sent (payable)
```

## Frontend (Next.js)

The frontend is built with:
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **Wagmi** + **RainbowKit** for Web3 wallet connections
- **Viem** for Ethereum interactions

### Features
- Wallet connection with RainbowKit
- Real-time contract interaction
- Responsive design
- Transaction status tracking

## Quick Start

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Stylus CLI](https://github.com/OffchainLabs/cargo-stylus)

### 1. Install Rust Dependencies

```bash
cargo install --force cargo-stylus cargo-stylus-check
rustup target add wasm32-unknown-unknown
```

### 2. Setup the Smart Contract

```bash
# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Check contract (optional)
cargo stylus check

# Deploy to Arbitrum Sepolia testnet (requires ETH for gas)
# cargo stylus deploy --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

### 3. Setup the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local with your values:
# - Get WalletConnect Project ID from https://cloud.walletconnect.com
# - Update contract address after deployment

# Run development server
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

## Configuration

### Contract Address
After deploying your contract, update the contract address in:
- `frontend/src/lib/contracts.ts`
- `frontend/.env.local`

### WalletConnect Setup
1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy the Project ID
4. Add it to `frontend/.env.local`

## Development

### Smart Contract Development

```bash
# Build contract
cargo build --target wasm32-unknown-unknown --release

# Run tests
cargo test

# Export ABI (useful for frontend integration)
cargo stylus export-abi
```

### Frontend Development

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Deployment

### Smart Contract
Deploy to Arbitrum Sepolia (testnet):
```bash
cargo stylus deploy --endpoint https://sepolia-rollup.arbitrum.io/rpc
```

Deploy to Arbitrum One (mainnet):
```bash
cargo stylus deploy --endpoint https://arb1.arbitrum.io/rpc
```

### Frontend
The frontend can be deployed to any hosting platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Railway
- Self-hosted

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Blockchain    │    │  Smart Contract │
│   (Next.js)     │◄──►│   (Arbitrum)    │◄──►│   (Stylus/Rust) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technologies

- **Smart Contract**: Rust + Stylus SDK + Arbitrum
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **Web3 Stack**: Wagmi + RainbowKit + Viem
- **Development**: Cargo + npm

## Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus)
- [Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh)
- [RainbowKit Documentation](https://www.rainbowkit.com)

To set up more minimal example that still uses the Stylus SDK, use `cargo stylus new --minimal <YOUR_PROJECT_NAME>` under [OffchainLabs/cargo-stylus](https://github.com/OffchainLabs/cargo-stylus).

---

*This template provides a full-stack foundation for building decentralized applications with Rust smart contracts and modern web frontends.*

### Testnet Information

All testnet information, including faucets and RPC endpoints can be found [here](https://docs.arbitrum.io/stylus/reference/testnet-information).

### ABI Export

You can export the Solidity ABI for your program by using the `cargo stylus` tool as follows:

```bash
cargo stylus export-abi
```

which outputs:

```js
/**
 * This file was automatically generated by Stylus and represents a Rust program.
 * For more information, please see [The Stylus SDK](https://github.com/OffchainLabs/stylus-sdk-rs).
 */

// SPDX-License-Identifier: MIT-OR-APACHE-2.0
pragma solidity ^0.8.23;

interface ICounter {
    function number() external view returns (uint256);

    function setNumber(uint256 new_number) external;

    function mulNumber(uint256 new_number) external;

    function addNumber(uint256 new_number) external;

    function increment() external;
}
```

Exporting ABIs uses a feature that is enabled by default in your Cargo.toml:

```toml
[features]
export-abi = ["stylus-sdk/export-abi"]
```

## Deploying

You can use the `cargo stylus` command to also deploy your program to the Stylus testnet. We can use the tool to first check
our program compiles to valid WASM for Stylus and will succeed a deployment onchain without transacting. By default, this will use the Stylus testnet public RPC endpoint. See here for [Stylus testnet information](https://docs.arbitrum.io/stylus/reference/testnet-information)

```bash
cargo stylus check
```

If successful, you should see:

```bash
Finished release [optimized] target(s) in 1.88s
Reading WASM file at stylus-hello-world/target/wasm32-unknown-unknown/release/stylus-hello-world.wasm
Compressed WASM size: 8.9 KB
Program succeeded Stylus onchain activation checks with Stylus version: 1
```

Next, we can estimate the gas costs to deploy and activate our program before we send our transaction. Check out the [cargo-stylus](https://github.com/OffchainLabs/cargo-stylus) README to see the different wallet options for this step:

```bash
cargo stylus deploy \
  --private-key-path=<PRIVKEY_FILE_PATH> \
  --estimate-gas
```

You will then see the estimated gas cost for deploying before transacting:

```bash
Deploying program to address e43a32b54e48c7ec0d3d9ed2d628783c23d65020
Estimated gas for deployment: 1874876
```

The above only estimates gas for the deployment tx by default. To estimate gas for activation, first deploy your program using `--mode=deploy-only`, and then run `cargo stylus deploy` with the `--estimate-gas` flag, `--mode=activate-only`, and specify `--activate-program-address`.


Here's how to deploy:

```bash
cargo stylus deploy \
  --private-key-path=<PRIVKEY_FILE_PATH>
```

The CLI will send 2 transactions to deploy and activate your program onchain.

```bash
Compressed WASM size: 8.9 KB
Deploying program to address 0x457b1ba688e9854bdbed2f473f7510c476a3da09
Estimated gas: 1973450
Submitting tx...
Confirmed tx 0x42db…7311, gas used 1973450
Activating program at address 0x457b1ba688e9854bdbed2f473f7510c476a3da09
Estimated gas: 14044638
Submitting tx...
Confirmed tx 0x0bdb…3307, gas used 14044638
```

Once both steps are successful, you can interact with your program as you would with any Ethereum smart contract.

## Calling Your Program

This template includes an example of how to call and transact with your program in Rust using [ethers-rs](https://github.com/gakonst/ethers-rs) under the `examples/counter.rs`. However, your programs are also Ethereum ABI equivalent if using the Stylus SDK. **They can be called and transacted with using any other Ethereum tooling.**

By using the program address from your deployment step above, and your wallet, you can attempt to call the counter program and increase its value in storage:

```rs
abigen!(
    Counter,
    r#"[
        function number() external view returns (uint256)
        function setNumber(uint256 number) external
        function increment() external
    ]"#
);
let counter = Counter::new(address, client);
let num = counter.number().call().await;
println!("Counter number value = {:?}", num);

let _ = counter.increment().send().await?.await?;
println!("Successfully incremented counter via a tx");

let num = counter.number().call().await;
println!("New counter number value = {:?}", num);
```

Before running, set the following env vars or place them in a `.env` file (see: [.env.example](./.env.example)) in this project:

```
RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
STYLUS_CONTRACT_ADDRESS=<the onchain address of your deployed program>
PRIV_KEY_PATH=<the file path for your priv key to transact with>
```

Next, run:

```
cargo run --example counter --target=<YOUR_ARCHITECTURE>
```

Where you can find `YOUR_ARCHITECTURE` by running `rustc -vV | grep host`. For M1 Apple computers, for example, this is `aarch64-apple-darwin` and for most Linux x86 it is `x86_64-unknown-linux-gnu`

## Build Options

By default, the cargo stylus tool will build your project for WASM using sensible optimizations, but you can control how this gets compiled by seeing the full README for [cargo stylus](https://github.com/OffchainLabs/cargo-stylus). If you wish to optimize the size of your compiled WASM, see the different options available [here](https://github.com/OffchainLabs/cargo-stylus/blob/main/OPTIMIZING_BINARIES.md).

## Peeking Under the Hood

The [stylus-sdk](https://github.com/OffchainLabs/stylus-sdk-rs) contains many features for writing Stylus programs in Rust. It also provides helpful macros to make the experience for Solidity developers easier. These macros expand your code into pure Rust code that can then be compiled to WASM. If you want to see what the `stylus-hello-world` boilerplate expands into, you can use `cargo expand` to see the pure Rust code that will be deployed onchain.

First, run `cargo install cargo-expand` if you don't have the subcommand already, then:

```
cargo expand --all-features --release --target=<YOUR_ARCHITECTURE>
```

Where you can find `YOUR_ARCHITECTURE` by running `rustc -vV | grep host`. For M1 Apple computers, for example, this is `aarch64-apple-darwin`.

## License

This project is fully open source, including an Apache-2.0 or MIT license at your choosing under your own copyright.
# RescueDAO_Stylus
