#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{decl_module, decl_event, decl_error};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub trait Trait: frame_system::Trait {
	type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}

decl_event!(
	pub enum Event<T> where AccountId = <T as frame_system::Trait>::AccountId {
		KittyClaimed(AccountId),
	}
);

decl_error! {
	pub enum Error for Module<T: Trait> {
		KittyAlreadyClaimed,
	}
}

decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;
		fn deposit_event() = default;

		// TODO: DEFINE
		// kitty = {dna, power}

		// TODO: CREATE
		// create a kitty with power proportional to some locked funds
		// kitty is assigned to account that dispatched call
		// DNA should be random, initial power derived from DNA
		// DNA used to derive avatar https://www.peppercarrot.com/extras/html/2016_cat-generator/
		// total fee = base fee + optional power multiplier fee

		// TODO: BOOST
		// power up a kitty by locking more funds
		// increases power without altering DNA

		// TODO: ADVERTISE
		// post intent to breed

		// TODO: BREED
		// respond to intent to breed
		// may not result in offspring
		// DNA and power derived from parents
		// each parent randomly "contributes" power
		// offspring owner randomly assigned between parent owners
	}
}
