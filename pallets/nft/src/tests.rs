// Tests to be written here

use crate::{mock::*};
use frame_support::{assert_ok};

#[test]
fn it_works_for_default_value() {
	new_test_ext().execute_with(|| {
		assert_ok!(Nft::mint_nft(Origin::signed(1)));
		assert_eq!(Nft::next_token_id(), 1);
	});
}
