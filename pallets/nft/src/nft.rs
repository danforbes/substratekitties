//! This trait describes capabilities for managing unique assets, also known as
//! non-fungible tokens (NFTs).

use frame_support::dispatch;

pub trait UniqueAsset<AccountId> {
    type AssetInfo;
    type AssetId;

    fn total() -> u128;
    fn burned() -> u128;
    fn total_for_account(account: AccountId) -> u64;
    fn owner_of(asset_id: Self::AssetId) -> AccountId;

    fn mint(
        owner_account: AccountId,
        asset_info: Self::AssetInfo,
    ) -> dispatch::result::Result<Self::AssetId, dispatch::DispatchError>;
    fn burn(asset_id: Self::AssetId) -> dispatch::DispatchResult;
    fn transfer(dest_account: AccountId, asset_id: Self::AssetId) -> dispatch::DispatchResult;
}
