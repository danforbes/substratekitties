# Purpose

Demonstrate how to use Substrate to build a not-so-trivial application and fun to play with. It will demonstrate basic concept of Substrate runtime development, such as:

  - declaring module, error, storage, and events as the main runtime pallet logic
  - integrating other pallet logic and use it in our own pallet
  - combining different pallets together in the runtime and make it work together
  - writing RPC call so our runtime can serve external requests. (We will also introduce our RPC mechanism works)

Along the way we will introduce best practice for writing Substrate runtime

  - writing unit tests (and a mock runtime) for our pallet logic
  - introducing tools to help you on development. We have various `debug` constructs to do that.

There will also be a frontend to interact with our Substrate node. We will demonstrate

  - how to use Polkadot-JS api to connect to the substrate node, and interact with the node
  - using frontend template, a React app with modularized components wrapped on top of Polkadot-JS api, to help you write your frontend.

Finally, we will add cat breeding logic in our phase two, and showcase how to perform a forkless runtime upgrade.

This is going to be fun. Let's get start.

_optional_: We will also demonstrate running a Substrate node differently

  - in development mode
  - in a docker container
  - in local_testnet mode with 3 nodes running

# App Design

The app we develop will be a kitty app including the following features:

  - Each kitty will have a nft representing it.
  - We can conjure a kitty
  - We can burn (god forbid) the kitty, and retrieve back some token
  - We can put a kitty on sale. The first one willing to pay the price will purchase the kitty.
  - (phase 2) Allow two kitties to breed. Both kitties must be owned by the same owner. We will play with some bits/numbers manupulation and random number generation in Substrate, which is a bit different due to need to support `no_std` env.
