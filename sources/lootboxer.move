

module hack::lootboxer {
    
    use sui::bls12381::bls12381_min_pk_verify;
    use sui::balance::{Self, Balance};
    use sui::hash::{blake2b256};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::package::{Self};

    use hack::counter_nft::Counter;

    // Error codes

    const ECallerNotHouse: u64 = 0;
    const EInsufficientBalance: u64 = 1;
    const EInsufficientDefaultProbability: u64 = 2;
    const EInvalidBlsSig: u64 = 3;

    // Structs

    public struct AssetWithProbability has store {
        asset: Balance<SUI>,
        probability: u8,
    }

    public struct LootboxData has key {
        id: UID,
        balance: Balance<SUI>,
        lootbox: address,
        public_key: vector<u8>,
        assets: vector<AssetWithProbability>,
        default_asset: AssetWithProbability,
        fees: Balance<SUI>,
        base_fee_in_bp: u16
    }

    /// [From Sui example] A one-time use capability to initialize the lootbox data; created and sent
    /// to sender in the initializer.
    public struct LootboxCap has key {
        id: UID
    }

    /// [From Sui example] Used as a one time witness to generate the publisher.
    public struct LOOTBOXER has drop {}

    /// [From Sui example]
    fun init(otw: LOOTBOXER, ctx: &mut TxContext) {
        // Creating and sending the Publisher object to the sender.
        package::claim_and_keep(otw, ctx);

        // Creating and sending the LootboxCap object to the sender.
        let lootbox_cap = LootboxCap {
            id: object::new(ctx)
        };

        transfer::transfer(lootbox_cap, ctx.sender());
    }

    // Functions

    /// Initializes Lootbox
    /// Default asset probability is set to 100%, currently requires some initial_default_asset balance
    /// TODO: Default asset should be treated as a blank, drawing default asset == not winning
    public fun initialize_lootbox_data(lootbox_cap: LootboxCap, coin: Coin<SUI>, public_key: vector<u8>, initial_default_asset: Coin<SUI>, ctx: &mut TxContext) {
        assert!(coin.value() > 0, EInsufficientBalance);

        let lootbox_data = LootboxData {
            id: object::new(ctx),
            balance: coin.into_balance(),
            lootbox: ctx.sender(),
            assets: vector::empty(),
            default_asset: AssetWithProbability {
                asset: initial_default_asset.into_balance(),
                probability: 100,
            },
            public_key,
            fees: balance::zero(),
            base_fee_in_bp: 100
        };

        let LootboxCap { id } = lootbox_cap;
        object::delete(id);

        transfer::share_object(lootbox_data);
    }

    /// Used to add an asset and associated probability to an existing Lootbox
    /// Can only be called by the lootbox creator address
    public fun add_lootbox_asset(lootbox_data: &mut LootboxData, ctx: &mut TxContext, new_asset: Coin<SUI>, new_probability: u8) {
        assert!(ctx.sender() == lootbox_data.lootbox, ECallerNotHouse);

        // Ensure there is "enough" default probability left for new asset probability
        assert!((lootbox_data.default_asset.probability - new_probability) >= 0, EInsufficientDefaultProbability);

        // Add the new asset
        vector::push_back(&mut lootbox_data.assets, AssetWithProbability {
            asset: new_asset.into_balance(),
            probability: new_probability,
        });

        // Adjust the default asset's probability
        lootbox_data.default_asset.probability = lootbox_data.default_asset.probability - new_probability;
    }

    /// Lootbox creator can withdraw the accumulated fees of the lootbox object.
    public fun claim_fees(lootbox_data: &mut LootboxData, ctx: &mut TxContext) {
        // Only the lootbox address can withdraw fee funds.
        assert!(ctx.sender() == lootbox_data.lootbox, ECallerNotHouse);

        let total_fees = lootbox_data.fees.value();
        let coin = coin::take(&mut lootbox_data.fees, total_fees, ctx);
        transfer::public_transfer(coin, lootbox_data.lootbox);
    }

    public fun draw_from_lootbox(
        user_randomness: vector<u8>, 
        user_counter: &mut Counter,
        bls_sig: vector<u8>, // Vector of bls signature of lootbox id, player's random bytes and counter
        lootbox_data: &mut LootboxData, 
        ctx: &mut TxContext
    ) {
        // Handle randomness
        let mut messageVector = user_randomness;
        messageVector.append(user_counter.increment_and_get());

        let is_sig_valid = bls12381_min_pk_verify(&bls_sig, &lootbox_data.public_key, &messageVector);
        assert!(is_sig_valid, EInvalidBlsSig);

        let hashed_sign = blake2b256(&bls_sig);

        let random_value = from_le_bytes(hashed_sign);

        let mut cumulative_probability = 0u64;
        let total_probabilities = calculate_total_probabilities(lootbox_data);

        let selection_value = random_value % total_probabilities;

        let mut i: u8 = 0;
        let n: u8 = (lootbox_data.assets.length() as u8);

        while (i < n) {
            let asset = &lootbox_data.assets[i as u64];
            cumulative_probability = cumulative_probability + (asset.probability as u64);
            if (selection_value < cumulative_probability) {
                let player_rewards = balance::value(&lootbox_data.assets[i as u64].asset);
                let coin = coin::take(&mut lootbox_data.assets[i as u64].asset, player_rewards, ctx);
                transfer::public_transfer(coin, ctx.sender());
                return // Exit after withdrawing the selected asset
            };
            i = i + 1;
        };

        // Handle the case where no asset is selected (should not happen if probabilities sum to 100%)
        abort(404) // No valid asset found

    }

    fun calculate_total_probabilities(lootbox_data: & LootboxData): u64 {
        let mut total_probabilities: u64 = 0;
        
        let mut i: u64 = 0;
        let n: u64 = lootbox_data.assets.length();

        while (i < n) {
            let prob: u64 = lootbox_data.assets[i].probability as u64;
            total_probabilities = total_probabilities + prob;

            i = i + 1;
        };

        total_probabilities
    }

    // Helper function to convert the first byte of a hash output to an unsigned 8-bit integer
    fun from_le_bytes(bytes: vector<u8>): u64 {
        let mut sum = 0u64;
        let mut multiplier = 1u64;

        let bytes_len = bytes.length();
        let mut i = 0;

        while (i < bytes_len) {
            let byte = &bytes[i];
            sum = sum + (*byte as u64) * multiplier;
            multiplier = multiplier * 256;
            i = i + 1;
        };

        sum
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(LOOTBOXER {}, ctx);
    }
}