'use client';

// import { CounterPlaceholder } from '@/components/lootbox/CounterPlaceholder';
import { LootboxCard } from '@/components/lootbox/LootboxCard';
import { NFTPlaceholder } from '@/components/lootbox/NFTPlaceholder';
import { useLootbox } from '@/hooks/useLootbox';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';

interface LootboxData {
    lootbox: string;
    registry: string;
    nft_id: string;
    public_key: string[];
    assets: any[];
    default_asset: any;
    fees: any;
    base_fee_in_bp: number;
}

export default function Home() {
    const account = useCurrentAccount();

    const PACKAGE_ID = "0x5200d31152fcefbe44957c86fcf940c1a0ccff2cacedbed0558f25ec92057748";
    const NFT_ID = "0xbac579e0697a42d753b47ecdf64c5c6f18912a05784828c7e86d858518810553";
    const REGISTRY_ID = "0xc103d5d0fddfed882db1c2fbbf86110e70296cbd23df0f541433f34c0e075863";

    const { lootboxData, isPendingLootbox, isErrorLootbox } = useLootbox();

    if (isPendingLootbox) {
        return <div>Loading...</div>;
    }

    if (isErrorLootbox) {
        return <div>Error loading lootboxes.</div>;
    }

    if (!account) {
        return (
            <div className="text-center font-normal">
                Please connect your wallet
            </div>
        );
    }

    console.log(lootboxData);

    return (
        <div className="relative min-h-[60vh] text-center font-bold text-xl">
            <NFTPlaceholder
                address={new Ed25519PublicKey((account?.publicKey)).toSuiAddress()}
                packageAddress={PACKAGE_ID}
                nftAddress={NFT_ID}
                registryAddress={REGISTRY_ID}
            />
            {/* <CounterPlaceholder
                address={new Ed25519PublicKey((account?.publicKey)).toSuiAddress()}
                packageAddress={PACKAGE_ID}
                registryAddress={REGISTRY_ID}
            /> */}
            <div className="flex justify-between p-8 gap-8 rounded-lg border border-black">
                {lootboxData?.map((lootbox: LootboxData, index) => (
                    <LootboxCard key={index} lootbox={lootbox} />
                ))}
            </div>
        </div>
    );
}
