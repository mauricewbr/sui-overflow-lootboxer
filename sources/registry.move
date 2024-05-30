module hack::registry {
    use sui::package::{Self};

    // Error codes

    const ECallerNotAdmin: u64 = 0;

    // Structs

    public struct RegistryData has key, store {
        id: UID,
        admin: address,
        lootboxes: vector<address>,
    }

    /// [From Sui example] A one-time use capability to initialize the registry data; created and sent
    /// to sender in the initializer.
    public struct RegistryCap has key {
        id: UID
    }

    /// [From Sui example] Used as a one time witness to generate the publisher.
    public struct REGISTRY has drop {}

    /// [From Sui example]
    fun init(otw: REGISTRY, ctx: &mut TxContext) {
        // Creating and sending the Publisher object to the sender.
        package::claim_and_keep(otw, ctx);

        // Creating and sending the LootboxCap object to the sender.
        let registry_cap = RegistryCap {
            id: object::new(ctx)
        };

        transfer::transfer(registry_cap, ctx.sender());
    }

    // Functions

    /// Initializes Lootbox
    /// Default asset probability is set to 100%, currently requires some initial_default_asset balance
    public fun initialize_registry_data(registry_cap: RegistryCap, ctx: &mut TxContext) {
        let registry_data = RegistryData {
            id: object::new(ctx),
            admin: ctx.sender(),
            lootboxes: vector::empty(),
        };

        let RegistryCap { id } = registry_cap;
        object::delete(id);

        transfer::share_object(registry_data);
    }

    public fun register_lootbox(registry_data: &mut RegistryData, ctx: &mut TxContext, new_lootbox: address) {
        assert!(ctx.sender() == registry_data.admin, ECallerNotAdmin);
        vector::push_back(&mut registry_data.lootboxes, new_lootbox);
    }
    
    public fun get_lootboxes(registry_data: &RegistryData): &vector<address> {
        &registry_data.lootboxes
    }

    // Accessors

    /// Returns the admin of the registry
    public fun admin(registry_data: &RegistryData): address {
        registry_data.admin
    }

    // For Testing
    #[test_only]
    public fun get_and_transfer_registry_admin_cap_for_testing(ctx: &mut TxContext) {
        let registry_cap = RegistryCap {
            id: object::new(ctx)
        };
        transfer::transfer(registry_cap, ctx.sender());
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(REGISTRY {}, ctx);
    }
}
