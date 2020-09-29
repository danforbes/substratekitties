# Substratekitties

This project is a work-in-progress. It is a working space for an updated version of
[the original Substratekitties](https://github.com/shawntabrizi/substratekitties) tutorial created by
[Shawn Tabrizi](https://www.shawntabrizi.com/).

## Unique Assets

Like the original Substratekitties, this project is built on the idea of unique assets, commonly known as
[non-fungible tokens](https://en.wikipedia.org/wiki/Non-fungible_token) (NFTs) in the blockchain space. The core NFT
capabilities are provided by a separate library of code,
[the Commodities pallet](https://github.com/danforbes/pallet-nft), which was built with (and is designed to be used
with) [the FRAME system for blockchain runtime development](https://substrate.dev/docs/en/knowledgebase/runtime/frame).

## Build & Run

First, build & run the node:

```shell
cargo run -- --dev --tmp
```

Then build & run the UI by running the following command in the `front-end` directory:

```shell
yarn && yarn start
```

## Acknowledgements

This project was inspired by works such as the following:

- [The ERC-721 specification](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin's ERC-721 implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721)
- [the original Substratekitties project](https://www.shawntabrizi.com/substrate-collectables-workshop/#/), by
  @shawntabrizi
- [Substratekitties from SubstrateCourse](https://github.com/SubstrateCourse/substrate-kitties), by @xlc

Thanks to the following people who helped me overcome my relatively limited understanding of Rust.

- @JoshOrndoff
- @riusricardo
- @rphmeier
- @thiolliere
- @gnunicorn

## Upstream

This project was forked from
[the Substrate DevHub Node Template](https://github.com/substrate-developer-hub/substrate-node-template).
