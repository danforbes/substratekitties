// Tests to be written here

use crate::mock::*;
use frame_support::assert_ok;

#[test]
fn it_works_for_default_value() {
    new_test_ext().execute_with(|| {
        assert_ok!(NFT::mint_asset(Origin::ROOT, 2, Vec::<u8>::default()));
        assert_eq!(NFT::assets_for_account(2).len(), 1);
    });
}
