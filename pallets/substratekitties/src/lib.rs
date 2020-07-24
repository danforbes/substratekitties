#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{decl_module, decl_event, decl_error, dispatch};
use frame_system::{self as system, ensure_signed};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub trait Trait: system::Trait {
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
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

		#[weight = 10_000]
		pub fn claim_kitty(origin) -> dispatch::DispatchResult {
			ensure_signed(origin)?;
			Ok(())
		}
	}
}
