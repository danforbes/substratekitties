//! # Unique Assets Interface
//!
//! This trait describes an abstraction over a set of unique assets, also known as non-fungible
//! tokens (NFTs).
//!
//! ## Overview
//!
//! Unique assets have an owner, identified by an account ID, and are defined by a common set of
//! attributes (the asset info type). An asset ID type distinguishes unique assets from one another.
//! Assets may be created (minted), destroyed (burned) or transferred.
//!
//! This abstraction is implemented by [nft::Module](../struct.Module.html).

use frame_support::{dispatch, traits::Get};
use sp_std::vec::Vec;

/// A unique asset; assets with equivalent attributes (as defined by the Info type) *must* have an
/// equal ID and assets with different IDs *must not* have equivalent attributes.
pub trait NFT {
    /// The type used to identify unique assets.
    type Id;
    /// The attributes that distinguish unique assets.
    type Info;
}

/// An interface over a set of unique assets.
pub trait UniqueAssets<AccountId, Asset: NFT> {
    /// The maximum number of this type of asset that may exist (minted - burned).
    type AssetLimit: Get<u128>;
    /// The maximum number of this type of asset that any single account may own.
    type UserAssetLimit: Get<u64>;

    /// The total number of this type of asset that exists (minted - burned).
    fn total() -> u128;
    /// The total number of this type of asset that has been burned (may overflow).
    fn burned() -> u128;
    /// The total number of this type of asset owned by an account.
    fn total_for_account(account: &AccountId) -> u64;
    /// The set of unique assets owned by an account.
    fn assets_for_account(account: &AccountId) -> Vec<Asset>;
    /// The ID of the account that owns an asset.
    fn owner_of(asset_id: &Asset::Id) -> AccountId;

    /// Use the provided asset info to create a new unique asset for the specified user.
    fn mint(owner_account: &AccountId, asset_info: Asset::Info) -> dispatch::DispatchResult;
    /// Destroy an asset.
    fn burn(asset_id: &Asset::Id) -> dispatch::DispatchResult;
    /// Transfer ownership of an asset to another account.
    fn transfer(dest_account: &AccountId, asset_id: &Asset::Id) -> dispatch::DispatchResult;
}
