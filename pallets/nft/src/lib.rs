//! # Unique Assets
//!
//! This pallet exposes capabilities for managing unique assets, also known as
//! non-fungible tokens (NFTs).
//!
//! - [`nft::Trait`](./trait.Trait.html)
//! - [`Calls`](./enum.Call.html)
//! - [`Errors`](./enum.Error.html)
//! - [`Events`](./enum.RawEvent.html)
//!
//! ## Overview
//!
//! Assets that share a common metadata structure may be created and distributed
//! by an asset admin. Asset owners may burn assets or transfer their
//! ownership. Configuration parameters are used to limit the total number of a
//! type of asset that may exist as well as the number that any one account may
//! own. Assets are uniquely identified by the Blake2 128 hash of the info that
//! defines them.
//!
//! ### Dispatchable Functions
//!
//! * [`mint`](./enum.Call.html#variant.mint) - Use the provided asset info to
//!   create a new unique asset for the specified user. May only be called by
//!   the asset admin.
//!
//! * [`transfer`](./enum.Call.html#variant.transfer) - Transfer ownership of
//!   an asset to another account. May only be called by current asset owner.
//!
//! * [`burn`](./enum.Call.html#variant.burn) - Destroy an asset. May only be
//!   called by asset owner.

#![cfg_attr(not(feature = "std"), no_std)]

use codec::FullCodec;
use frame_support::{
    decl_error, decl_event, decl_module, decl_storage, dispatch, ensure,
    traits::{EnsureOrigin, Get},
    Hashable,
};
use frame_system::{self as system, ensure_signed};
use sp_runtime::traits::Member;
use sp_std::fmt::Debug;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub trait Trait<I = DefaultInstance>: system::Trait {
    // The dispatch origin that is able to mint new instances of this type of asset.
    type AssetAdmin: EnsureOrigin<Self::Origin>;
    // The data type that is used to describe this type of asset.
    type AssetInfo: Hashable + Member + Debug + Default + FullCodec;
    // The maximum number of this type of asset that may exist.
    type AssetLimit: Get<u128>;
    // The maximum number of this type of asset that any single account may own.
    type UserAssetLimit: Get<u64>;
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

// The Blake2 128 hash algorithm is used to uniquely identify assets.
pub type AssetId = [u8; 16];

decl_storage! {
    trait Store for Module<T: Trait<I>, I: Instance = DefaultInstance> as NFT {
        // The total number of this type of asset that exists (minted - burned).
        Balance get(fn balance): u128 = 0;
        // The total number of this type of asset that has been burned (may overflow).
        Burned get(fn burned): u128 = 0;
        // The total number of this type of asset owned by an account.
        BalanceForAccount get(fn balance_for_account): map hasher(blake2_128_concat) T::AccountId => u64 = 0;
        // A mapping from an asset owner & ID to the info for that asset.
        AssetsForAccount get(fn assets_for_account): double_map hasher(blake2_128_concat) T::AccountId, hasher(identity) AssetId => T::AssetInfo;
        // A mapping from an asset ID to the account that owns it.
        AccountForAsset get(fn account_for_asset): map hasher(identity) AssetId => T::AccountId;
    }
}

decl_event!(
    pub enum Event<T, I = DefaultInstance>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        // The asset has been burned.
        Burned(AssetId),
        // The asset has been minted and distributed to the account.
        Minted(AssetId, AccountId),
        // Ownership of the asset has been transferred to the account.
        Transferred(AssetId, AccountId),
    }
);

decl_error! {
    pub enum Error for Module<T: Trait<I>, I: Instance> {
        // Thrown when there is an attempt to mint a duplicate asset.
        AssetExists,
        // Thrown when someone who is not the owner of an asset attempts to transfer or burn it.
        NotAssetOwner,
        // Thrown when the asset admin attempts to mint an asset and the maximum number of this
        // type of asset already exists.
        TooManyAssets,
        // Thrown when an attempt is made to mint or transfer an asset to an account that already
        // owns the maximum number of this type of asset.
        TooManyAssetsForAccount,
    }
}

decl_module! {
    pub struct Module<T: Trait<I>, I: Instance = DefaultInstance> for enum Call where origin: T::Origin {
        type Error = Error<T, I>;
        fn deposit_event() = default;

        /// Create a new unique asset from the provided asset info and identify the specified
        /// account as its owner. The ID of the new asset will be equal to the Blake 2 128
        /// hash of the info that defines it.
        ///
        /// The dispatch origin for this call must be the asset admin.
        ///
        /// This function will throw an error if it is called with asset info that describes
        /// an existing (duplicate) asset, if the maximum number of this type of asset already
        /// exists or if the specified owner already owns the maximum number of this type of
        /// asset.
        ///
        /// - `owner_account`: Receiver of the asset.
        /// - `asset_info`: The information that defines the asset.
        #[weight = 10_000]
        pub fn mint(origin, owner_account: T::AccountId, asset_info: T::AssetInfo) -> dispatch::DispatchResult {
            T::AssetAdmin::ensure_origin(origin)?;

            let asset_id = asset_info.blake2_128();

            ensure!(!AccountForAsset::<T, I>::contains_key(&asset_id), Error::<T, I>::AssetExists);
            ensure!(Self::balance() <= T::AssetLimit::get(), Error::<T, I>::TooManyAssets);
            ensure!(Self::balance_for_account(&owner_account) <= T::UserAssetLimit::get(), Error::<T, I>::TooManyAssetsForAccount);

            Balance::<I>::mutate(|balance| *balance += 1);
            BalanceForAccount::<T, I>::mutate(&owner_account, |balance| *balance += 1);
            AssetsForAccount::<T, I>::insert(&owner_account, &asset_id, asset_info);
            AccountForAsset::<T, I>::insert(&asset_id, &owner_account);

            Self::deposit_event(RawEvent::Minted(asset_id, owner_account));
            Ok(())
        }

        /// Destroy the specified asset.
        ///
        /// The dispatch origin for this call must be the asset owner.
        ///
        /// - `asset_id`: The Blake2 128 hash of the info that defines the asset to destroy.
        #[weight = 10_000]
        pub fn burn(origin, asset_id: AssetId) -> dispatch::DispatchResult {
            let who = ensure_signed(origin)?;

            ensure!(who == Self::account_for_asset(&asset_id), Error::<T, I>::NotAssetOwner);

            Balance::<I>::mutate(|balance| *balance -= 1);
            Burned::<I>::mutate(|balance| *balance += 1);
            BalanceForAccount::<T, I>::mutate(&who, |balance| *balance -= 1);
            AssetsForAccount::<T, I>::remove(&who, &asset_id);
            AccountForAsset::<T, I>::remove(&asset_id);

            Self::deposit_event(RawEvent::Burned(asset_id));
            Ok(())
        }

        /// Transfer an asset to a new owner.
        ///
        /// The dispatch origin for this call must be the asset owner.
        ///
        /// This function will throw an error if the new owner already owns the maximum
        /// number of this type of asset.
        ///
        /// - `dest_account`: Receiver of the asset.
        /// - `asset_id`: The Blake2 128 hash of the info that defines the asset to transfer.
        #[weight = 10_000]
        pub fn transfer(origin, dest_account: T::AccountId, asset_id: AssetId) -> dispatch::DispatchResult {
            let who = ensure_signed(origin)?;

            ensure!(who == Self::account_for_asset(&asset_id), Error::<T, I>::NotAssetOwner);
            ensure!(Self::balance_for_account(&dest_account) <= T::UserAssetLimit::get(), Error::<T, I>::TooManyAssetsForAccount);

            BalanceForAccount::<T, I>::mutate(&who, |balance| *balance -= 1);
            BalanceForAccount::<T, I>::mutate(&dest_account, |balance| *balance += 1);
            let asset_info = AssetsForAccount::<T, I>::take(who, &asset_id);
            AssetsForAccount::<T, I>::insert(&dest_account, &asset_id, asset_info);
            AccountForAsset::<T, I>::insert(&asset_id, &dest_account);

            Self::deposit_event(RawEvent::Transferred(asset_id, dest_account));
            Ok(())
        }
    }
}
