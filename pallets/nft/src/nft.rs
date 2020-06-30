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
//! This trait is implemented in the `lib.rs` file for this crate.

use frame_support::dispatch;

pub trait UniqueAssets<AccountId> {
    // The attributes that uniquely identify assets from one another.
    type AssetInfo;
    //The type used to identify unique asset instances.
    type AssetId;

    // The total number of this type of asset that exists (minted - burned).
    fn total() -> u128;
    // The total number of this type of asset that has been burned (may overflow).
    fn burned() -> u128;
    // The total number of this type of asset owned by an account.
    fn total_for_account(account: AccountId) -> u64;
    // The ID of the account that owns an asset.
    fn owner_of(asset_id: Self::AssetId) -> AccountId;

    // Use the provided asset info to create a new unique asset for the specified user.
    fn mint(
        owner_account: AccountId,
        asset_info: Self::AssetInfo,
    ) -> dispatch::result::Result<Self::AssetId, dispatch::DispatchError>;
    // Destroy an asset.
    fn burn(asset_id: Self::AssetId) -> dispatch::DispatchResult;
    // Transfer ownership of an asset to another account.
    fn transfer(dest_account: AccountId, asset_id: Self::AssetId) -> dispatch::DispatchResult;
}
