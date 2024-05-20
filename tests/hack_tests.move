#[test_only]
module hack::lootboxer_tests {

    use sui::coin::{Coin, Self};
    use sui::sui::SUI;
    use sui::test_scenario::{Self, Scenario};
    use sui::bls12381::bls12381_min_pk_verify;

    use hack::lootboxer::{Self as lb, LootboxCap, LootboxData};

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

    #[test]
    fun test_bls_signature_for_lootbox_draw() {
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

    // #[test]
    // fun test_initialize_lootbox_data() {
    //     let mut scenario = test_scenario::begin(ADMIN);

    //     scenario.initialize_lootbox_data_for_test(ADMIN, INITIAL_LOOTBOX_BALANCE);

    //     scenario.next_tx(ADMIN);
    //     {
    //         // validate that the house data is created
    //         let lootbox_data = scenario.take_shared<LootboxData>();
    //         assert!(lootbox_data.public_key() == LOOTBOX_PUBLIC_KEY, 1);
    //         assert!(lootbox_data.lootbox() == ADMIN, 2);
    //         test_scenario::return_shared<LootboxData>(lootbox_data);

    //         // and that the adminHouseCap was burnt
    //         let adminOwnedObjects: vector<ID> = scenario.ids_for_sender<LootboxCap>();
    //         assert!(adminOwnedObjects.length() == 0, 2);
    //     };

    //     scenario.end();
    // }


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
