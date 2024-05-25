#[test_only]
module hack::lootboxer_tests {

    use sui::coin::{Self};
    use sui::sui::SUI;
    use sui::test_scenario::{Self, Scenario};
    use sui::bls12381::bls12381_min_pk_verify;

    use hack::lootboxer::{Self as lb, LootboxCap, LootboxData};
    use hack::counter_nft::{Self as counter_nft, Counter};

    const ADMIN: address = @0x65391674eb4210940ea98ae451237d9335920297e7c8abaeb7e05b221ee36917;
    const PLAYER: address = @0xfff196b9e146b115301408f624903fc488f42d357a7fa6fc70f5751e3d0570fc;
    const INITIAL_LOOTBOX_BALANCE: u64 = 5000000000;

    const LOOTBOX_PUBLIC_KEY: vector<u8> = vector<u8> [
        185, 195,  27,  41,  48, 111, 208,  32,  77,
        189, 168,  94,  72, 179, 194, 183,  67, 237,
        230, 179, 239, 181, 149, 238,   0, 100, 248,
        74, 194, 109, 159,   4, 225,  77, 194, 108,
        113,  19, 186, 231,  98, 188,   9, 246,  82,
        32, 114,  74
    ];

    const GAME_RANDOMNESS: vector<u8> = vector<u8> [
        49, 54, 54, 100, 57, 55, 51, 51, 52, 48, 57, 55, 57, 99,
        101, 101, 101, 54, 56, 97, 101, 55, 57, 97, 57, 48, 98,
        98, 56, 100, 55, 52, 203, 238, 99, 168, 234, 77, 171, 131,
        149, 30, 131, 196, 89, 118, 163, 234, 52, 79, 168, 132,
        153, 253, 170, 108, 219, 244, 73, 224, 168, 245, 135, 100,
        0, 0, 0, 0, 0, 0, 0, 0
    ];

    const BLS_SIG_0: vector<u8> = vector<u8> [
        169,  88, 140, 191, 205,  35, 255, 181, 115, 187, 198,  50,
        217, 127,  22, 249, 255, 162, 240, 175, 121, 135,  45, 171,
        185, 195, 190,  95, 206, 115, 147, 173, 237, 202, 155, 184,
        49, 143, 135, 156,  51, 101,  52,  10, 202, 169,  54, 137,
        0, 155,  35, 203,  50, 193, 171, 198, 219, 160, 237, 171,
        251, 144,  91,  30,  20, 227, 235, 176, 241, 228, 193, 149,
        134,  51, 233,  74, 151,  97,  71,  93, 216, 191,  12, 174,
        212, 203, 120,  70,  86,  57, 230, 150,  21,  60,  24,  49
    ];

    const BLS_SIG_1: vector<u8> = vector<u8> [
        175,  38, 188, 119, 128, 205, 237, 223, 127,  57,  99,  63,
        10,  25, 156, 246,  20, 189, 174, 252,   0,  30, 175, 193,
        149, 241, 198, 106, 239, 127,  60,  59, 217, 147,  18, 172,
        154, 241, 201,  38,  20,  84,  93,  18, 251,  77,   5, 245,
        12, 133,  20,  16,  72, 177,  54, 165, 219, 227,  14, 116,
        56, 251, 179, 156, 215, 195, 134,  65, 209,  47, 210,  54,
        161, 155, 248,  11, 230, 251, 156,  70, 102, 103,   8,  29,
        122, 156,  40, 121, 198, 220, 116,  73, 114,  66,  74, 217
    ];

    #[test]
    fun test_bls_signature_for_lootbox_draw_0() {
        let mut messageVector = GAME_RANDOMNESS;
        messageVector.append(vector<u8>[0]);
        let bls_sig = BLS_SIG_0;
        let house_public_key = LOOTBOX_PUBLIC_KEY;
        let is_sig_valid = bls12381_min_pk_verify(
            &bls_sig,
            &house_public_key,
            &messageVector
        );
        assert!(is_sig_valid, 1);
    }

    #[test]
    fun test_bls_signature_for_lootbox_draw_1() {
        let mut messageVector = GAME_RANDOMNESS;
        messageVector.append(vector<u8>[1]);
        let bls_sig = BLS_SIG_1;
        let house_public_key = LOOTBOX_PUBLIC_KEY;
        let is_sig_valid = bls12381_min_pk_verify(
            &bls_sig,
            &house_public_key,
            &messageVector
        );
        assert!(is_sig_valid, 1);
    }

    #[test]
    fun test_initialize_lootbox_data() {
        let mut scenario = test_scenario::begin(ADMIN);

        scenario.initialize_lootbox_data_for_test(ADMIN, INITIAL_LOOTBOX_BALANCE);

        scenario.next_tx(ADMIN);
        {
            // validate that the house data is created
            let lootbox_data = scenario.take_shared<LootboxData>();
            assert!(lootbox_data.public_key() == LOOTBOX_PUBLIC_KEY, 1);
            assert!(lootbox_data.lootbox() == ADMIN, 2);
            assert!(lb::get_total_balance_of_lootbox_for_testing(&lootbox_data) == INITIAL_LOOTBOX_BALANCE);
            test_scenario::return_shared<LootboxData>(lootbox_data);

            // and that the adminHouseCap was burnt
            let adminOwnedObjects: vector<ID> = scenario.ids_for_sender<LootboxCap>();
            assert!(adminOwnedObjects.length() == 0, 2);
        };

        scenario.end();
    }

    #[test]
    fun test_add_assets() {
        let mut scenario = test_scenario::begin(ADMIN);
        scenario.initialize_lootbox_data_for_test(ADMIN, INITIAL_LOOTBOX_BALANCE);
        scenario.next_tx(ADMIN);
        {            
            let mut lootbox_data = scenario.take_shared<LootboxData>();
            let balance = lb::get_initial_default_asset_for_testing(&mut lootbox_data);
            let another_asset = coin::take<SUI>(balance, INITIAL_LOOTBOX_BALANCE / 2, scenario.ctx());
            lb::add_lootbox_asset(&mut lootbox_data, scenario.ctx(), another_asset, 20);

            assert!(lb::get_assets_len_for_testing(&lootbox_data) == 1);
            assert!(lb::get_total_balance_of_lootbox_for_testing(&lootbox_data) == INITIAL_LOOTBOX_BALANCE);

            test_scenario::return_shared<LootboxData>(lootbox_data);
        };
        scenario.end();
    }

    #[test]
    fun test_draw() {
        let mut scenario = test_scenario::begin(ADMIN);
        scenario.initialize_lootbox_data_for_test(ADMIN, INITIAL_LOOTBOX_BALANCE);
        scenario.next_tx(ADMIN);
        {
            let mut lootbox_data = scenario.take_shared<LootboxData>();
            let balance = lb::get_initial_default_asset_for_testing(&mut lootbox_data);
            let another_asset = coin::take<SUI>(balance, INITIAL_LOOTBOX_BALANCE / 2, scenario.ctx());
            lb::add_lootbox_asset(&mut lootbox_data, scenario.ctx(), another_asset, 20);
            test_scenario::return_shared<LootboxData>(lootbox_data);
        };
        scenario.next_tx(PLAYER);
        {
            counter_nft::mint_and_transfer(scenario.ctx());
        };
        scenario.next_tx(PLAYER);
        {
            let mut lootbox_data = scenario.take_shared<LootboxData>();
            let mut counter = scenario.take_from_sender<Counter>();
            lb::draw_from_lootbox(GAME_RANDOMNESS, &mut counter, BLS_SIG_0, &mut lootbox_data, scenario.ctx());
            assert!(lb::get_total_balance_of_lootbox_for_testing(&lootbox_data) < INITIAL_LOOTBOX_BALANCE);
            test_scenario::return_shared<LootboxData>(lootbox_data);
            scenario.return_to_sender(counter);
        };

        scenario.end();
    }

    //  --- Helper functions ---

    use fun initialize_lootbox_data_for_test as Scenario.initialize_lootbox_data_for_test;

    fun initialize_lootbox_data_for_test(
        scenario: &mut Scenario,
        admin: address,
        balance_to_mint: u64,
    ) {
        scenario.next_tx(admin);
        {
            lb::get_and_transfer_lootbox_admin_cap_for_testing(scenario.ctx());
        };

        scenario.next_tx(admin);
        {
            let lootbox_cap = scenario.take_from_sender<LootboxCap>();
            let initial_default_asset = coin::mint_for_testing<SUI>(balance_to_mint, scenario.ctx());
            lootbox_cap.initialize_lootbox_data(
                LOOTBOX_PUBLIC_KEY,
                initial_default_asset,
                scenario.ctx(),
            );
        }
    }
}
