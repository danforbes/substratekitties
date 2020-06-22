#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch};
use frame_system::{self as system, ensure_signed};
use sp_std::vec::Vec;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub trait Trait: system::Trait {
	type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
}

decl_storage! {
	trait Store for Module<T: Trait> as Nft {
		// Monotonically increasing account ID
		NextTokenId get(fn next_token_id): u32 = 0;
		// Mapping from holder address to their (enumerable) set of owned tokens
		TokensForAccount get(fn tokens_for_account): map hasher(blake2_128_concat) T::AccountId => Vec<u32>;
		// Mapping from token ID to the address that owns it
		AccountForToken get(fn account_for_token): map hasher(blake2_128_concat) u32 => T::AccountId;
	}
}

decl_event!(
	pub enum Event<T> where AccountId = <T as system::Trait>::AccountId {
		TokenMinted(u32, AccountId),
	}
);

decl_error! {
	pub enum Error for Module<T: Trait> {
		// An account owns too many tokens
		TooManyTokens,
	}
}

// The pallet's dispatchable functions.
decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;
		fn deposit_event() = default;

		#[weight = 10_000]
		pub fn mint_nft(origin) -> dispatch::DispatchResult {
			let who = ensure_signed(origin)?;
			let mut origin_tokens = Self::tokens_for_account(&who);
			if origin_tokens.len() > 4 {
				Err(Error::<T>::TooManyTokens)?;
			}

			let token_id = Self::next_token_id();
			origin_tokens.push(token_id);
			AccountForToken::<T>::insert(token_id, &who);
			NextTokenId::put(token_id + 1);
			Self::deposit_event(RawEvent::TokenMinted(token_id, who));
			Ok(())
		}
	}
}
