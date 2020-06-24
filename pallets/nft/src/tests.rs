// Tests to be written here

use crate::mock::*;
use crate::*;
use frame_support::{assert_ok, Hashable};

#[test]
fn it_mints_an_assets() {
    new_test_ext().execute_with(|| {
        assert_eq!(NFT::total_balance(), 0);
        assert_eq!(NFT::balance_for_account(2), 0);
        assert_eq!(NFT::account_for_asset(AssetId::default().blake2_128()), 0);

        assert_ok!(NFT::mint_asset(Origin::ROOT, 2, Vec::<u8>::default()));

        assert_eq!(NFT::total_balance(), 1);
        assert_eq!(NFT::total_burned(), 0);
        assert_eq!(NFT::balance_for_account(2), 1);
        assert_eq!(NFT::account_for_asset(Vec::<u8>::default().blake2_128()), 2);
    });
}
