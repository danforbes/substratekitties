#![cfg_attr(not(feature = "std"), no_std)]

use codec::FullCodec;
use frame_support::{decl_error, decl_event, decl_module, decl_storage, dispatch, Hashable};
use frame_system::{self as system, ensure_signed};
use sp_runtime::traits::{MaybeSerialize, Member};
use sp_std::{fmt::Debug, vec::Vec};

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

pub trait Trait: system::Trait {
    type Event: From<Event<Self>> + Into<<Self as system::Trait>::Event>;
    type TokenInfo: Hashable + Member + MaybeSerialize + Debug + Default + FullCodec;
}

decl_storage! {
    trait Store for Module<T: Trait> as Nft {
        // Mapping from holder address to their (enumerable) set of owned tokens
        TokensForAccount get(fn tokens_for_account): map hasher(blake2_128_concat) T::AccountId => Vec<Vec<u8>>;
        // Mapping from token ID to the address that owns it
        AccountForToken get(fn account_for_token): map hasher(identity) Vec<u8> => T::AccountId;
        // Mapping from token ID to the info for that token
        InfoForToken get(fn info_for_token): map hasher(identity) Vec<u8> => T::TokenInfo;
    }
}

decl_event!(
    pub enum Event<T>
    where
        AccountId = <T as system::Trait>::AccountId,
    {
        TokenMinted(Vec<u8>, AccountId),
    }
);

decl_error! {
    pub enum Error for Module<T: Trait> {
        // The NFT already exists
        NftAlreadyExists,
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
            let token_info = T::TokenInfo::default();
            let token_id = token_info.blake2_128_concat();
            if InfoForToken::<T>::contains_key(&token_id) {
                Err(Error::<T>::NftAlreadyExists)?;
            }

            TokensForAccount::<T>::append(&who, &token_id);
            AccountForToken::<T>::insert(&token_id, &who);
            InfoForToken::<T>::insert(&token_id, token_info);
            Self::deposit_event(RawEvent::TokenMinted(token_id, who));
            Ok(())
        }
    }
}
