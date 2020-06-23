# Substrate Unique Assets (NFTs)

This is a project for experimenting with unique assets, also known as
[non-fungible tokens (NFTs)](https://en.wikipedia.org/wiki/Non-fungible_token), in Substrate.

## Implementation

Refer to [the NFT pallet](pallets/nft/src/lib.rs) to find the unique asset implementation. You should also examine
[the runtime](runtime/src/lib.rs) to see how these capabilities are integrated into a Substrate blockchain.

## Acknowledgements

This project was inspired by works such as the following:

- [The ERC-721 specification](https://eips.ethereum.org/EIPS/eip-721)
- [OpenZeppelin's ERC-721 implementation](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721)
- [the original Substratekitties project](https://www.shawntabrizi.com/substrate-collectables-workshop/#/), by @shawntabrizi
- [Substratekitties from SubstrateCourse](https://github.com/SubstrateCourse/substrate-kitties), by @xlc

## Upstream

This project was forked from [the Substrate DevHub Node Template](https://github.com/substrate-developer-hub/substrate-node-template).
