module hack::guard_nft {
    use sui::url::{Self, Url};
    use std::string;
    use sui::tx_context::{sender};
    use sui::event;
    use sui::coin::{Self, TreasuryCap};
    use hack::registry::RegistryData;

    // Error codes
    const ECallerNotRegistryAdmin: u64 = 0;
    const ECallerNotOwner: u64 = 1;

    /// OTW and the type for the NFT.
    public struct GUARD_NFT has drop {}

    public struct GuardNFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        url: Url,
        admin: address,
    }

    // ===== Events =====

    public struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }

    fun init(otw: GUARD_NFT, ctx: &mut TxContext) {
        let treasury_cap = create_currency(otw, ctx);
        transfer::public_transfer(treasury_cap, ctx.sender());
    }

    fun create_currency<T: drop>(
        otw: T,
        ctx: &mut TxContext
    ): TreasuryCap<T> {
        let (treasury_cap, metadata) = coin::create_currency(
            otw, 6,
            b"REG",
            b"Regulated Coin",
            b"Coin that illustrates different regulatory requirements",
            option::none(),
            ctx
        );
        transfer::public_freeze_object(metadata);
        treasury_cap
    }

    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &GuardNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &GuardNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &GuardNFT): &Url {
        &nft.url
    }

    public fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        to: address,
        registry: &RegistryData,
        ctx: &mut TxContext
    ) {
        let sender = ctx.sender();
        let admin = registry.admin();

        assert!(sender == admin, ECallerNotRegistryAdmin);

        let nft = GuardNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            admin,
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, to);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: GuardNFT, recipient: address, ctx: &mut TxContext
    ) {
        // TODO: assert sender owns NFT
        transfer::public_transfer(nft, recipient)
    }

    /// Permanently delete `nft`
    public fun burn(nft: GuardNFT, ctx: &mut TxContext) {
        // TODO: assert sender owns NFT
        let GuardNFT { id, name: _, description: _, url: _, admin: _} = nft;
        object::delete(id)
    }
}
