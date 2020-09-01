#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode};
use frame_support::{
	decl_error, decl_event, decl_module, dispatch,
	traits::{Currency, Get, LockIdentifier, LockableCurrency, Randomness, Time, WithdrawReason},
};
use frame_system::ensure_signed;
use sp_core::RuntimeDebug;

use pallet_commodities::nft::UniqueAssets;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

const MODULE_ID: LockIdentifier = *b"subkitis";

/// Implement the Substratekitties unique asset
#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Encode, Decode, Default, RuntimeDebug)]
pub struct KittyInfo<Hash, Moment> {
    dob: Moment,
    dna: Hash,
}

type BalanceOf<T> =
	<<T as Trait>::Currency as Currency<<T as frame_system::Trait>::AccountId>>::Balance;

pub trait Trait: frame_system::Trait {
	type Kitty: pallet_commodities::nft::NFT;
	type Kitties: pallet_commodities::nft::UniqueAssets<Self::Kitty>;
	type Time: frame_support::traits::Time;
	type Randomness: frame_support::traits::Randomness<Self::Hash>;
	type Currency: frame_support::traits::LockableCurrency<Self::AccountId>;
	type BasePrice: Get<BalanceOf<Self>>;
	type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}

decl_event!(
	pub enum Event<T> where AccountId = <T as frame_system::Trait>::AccountId {
		KittyConjured(AccountId),
	}
);

decl_error! {
	pub enum Error for Module<T: Trait> {
		KittyConjureFailure,
	}
}

decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;
		fn deposit_event() = default;

		/// Reserve funds from the sender's account before conjuring them a kitty.
		///
		/// The dispatch origin for this call must be Signed.
		#[weight = 10_000]
		pub fn conjure(origin) -> dispatch::DispatchResult {
			let who = ensure_signed(origin)?;
			T::Currency::set_lock(MODULE_ID, &who, T::BasePrice::get(), WithdrawReason::Fee | WithdrawReason::Reserve);
			// ERROR: expected pallet_commodities::nft::UniqueAssets::AccountId, found frame_system::Trait::AccountId
			// ERROR: expected associated type pallet_commodities::NFT::Info, found struct KittyInfo<frame_system::Trait::Hash, frame_support::traits::Time::Moment>
			T::Kitties::mint(&who, KittyInfo{dob: T::Time::now(), dna: T::Randomness::random(&MODULE_ID)});
			Ok(())
			
			// TODO: DNA used to derive avatar https://www.peppercarrot.com/extras/html/2016_cat-generator/
			// TODO: define an implicit mechanism for deriving a kitty's power from its DNA
			// TODO: store variable kitty metadata (name, etc) in this pallet
			// TODO: allow senders to supply extra funds to lock, which will serve as a power boost
		}

		// TODO: BOOST
		// power up a kitty by locking more funds
		// increases power without altering DNA
		// store as metadata in this pallet

		// TODO: RECOUP
		// remove boost and associated lock

		// TODO: FLIRT
		// post intent to breed, must have power boost

		// TODO: BREED
		// respond to intent to breed, must have power boost
		// DNA and power derived from parents
		// each parent randomly contributes power from boost
		// offspring owner randomly assigned between parent owners

		// TODO: SELL
		// post intent to sell including price

		// TODO: BUY
		// respond to intent to sell
		// transfer funds to seller and transfer kitty ownership

		// TODO: RELEASE
		// burn kitty and unlock funds
	}
}
