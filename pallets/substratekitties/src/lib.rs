#![cfg_attr(not(feature = "std"), no_std)]

use codec::{Decode, Encode};
use frame_support::{
    decl_error, decl_event, decl_module, decl_storage, dispatch,
    traits::{Currency, Get, LockIdentifier, LockableCurrency, Randomness, Time, WithdrawReason},
};
use frame_system::ensure_signed;
use sp_core::RuntimeDebug;
use sp_std::vec::Vec;

use pallet_commodities::nft::UniqueAssets;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

const MODULE_ID: LockIdentifier = *b"subkitis";

/// Attributes that uniquely identify a kitty
#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Encode, Decode, Default, RuntimeDebug)]
pub struct KittyInfo<Hash, Moment> {
    dob: Moment,
    dna: Hash,
}

/// Attributes that do not uniquely identify a kitty
#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Encode, Decode, Default, RuntimeDebug)]
pub struct KittyMetadata {
    name: Vec<u8>,
}

type BalanceOf<T> =
    <<T as Trait>::Currency as Currency<<T as frame_system::Trait>::AccountId>>::Balance;
type KittyInfoOf<T> =
    KittyInfo<<T as frame_system::Trait>::Hash, <<T as Trait>::Time as Time>::Moment>;

pub trait Trait: frame_system::Trait {
    type Kitties: pallet_commodities::nft::UniqueAssets<
        Self::AccountId,
        AssetId = Self::Hash,
        AssetInfo = KittyInfoOf<Self>,
    >;
    type Time: frame_support::traits::Time;
    type Randomness: frame_support::traits::Randomness<Self::Hash>;
    type Currency: frame_support::traits::LockableCurrency<Self::AccountId>;
    type BasePrice: Get<BalanceOf<Self>>;
    type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}

decl_storage! {
    trait Store for Module<T: Trait> as Substratekitties {
        MetadataForKitty get(fn metadata_for_kitty): map hasher(identity) T::Hash => KittyMetadata;
    }
}

decl_event!(
    pub enum Event<T>
    where
        KittyId = <T as frame_system::Trait>::Hash,
        AccountId = <T as frame_system::Trait>::AccountId,
    {
        Conjured(KittyId, AccountId),
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
        pub fn conjure(origin, name: Vec<u8>) -> dispatch::DispatchResult {
            let who = ensure_signed(origin)?;
            T::Currency::set_lock(MODULE_ID, &who, T::BasePrice::get(), WithdrawReason::Fee | WithdrawReason::Reserve);
            match T::Kitties::mint(&who, KittyInfo{dob: T::Time::now(), dna: T::Randomness::random(&MODULE_ID)}) {
                Ok(id) => {
                    MetadataForKitty::<T>::insert(id, KittyMetadata{name: name});
                    Self::deposit_event(RawEvent::Conjured(id, who));
                },
                Err(err) => Err(err)?
            }

            // TODO: allow senders to supply extra funds to lock, which will serve as a power boost

            Ok(())
        }
        #[weight = 10_000]
        pub fn boost(origin, foo: Vec<u8>, bar: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
        }
        #[weight = 10_000]
        pub fn recoup(origin, foo: Vec<u8>, bar: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
        }
        #[weight = 10_000]
        pub fn flirt(origin, foo: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
        }
        #[weight = 10_000]
        pub fn breed(origin, foo: Vec<u8>, bar: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
        }
        #[weight = 10_000]
        pub fn sell(origin, foo: Vec<u8>, bar: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
        }
        #[weight = 10_000]
        pub fn buy(origin, foo: Vec<u8>, bar: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
        }
        #[weight = 10_000]
        pub fn release(origin, foo: Vec<u8>) -> dispatch::DispatchResult {
            Ok(())
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
