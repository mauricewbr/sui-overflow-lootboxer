'use client';

import { LootboxCard } from '@/components/lootbox/LootboxCard';
import { NFTPlaceholder } from '@/components/lootbox/NFTPlaceholder';
import { useLootbox } from '@/hooks/useLootbox';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui.js/client';
import { Ed25519PublicKey } from '@mysten/sui.js/keypairs/ed25519';

function getLootboxData(data: SuiObjectData) {
    if (data.content?.dataType !== 'moveObject') {
        return null;
    }

    return data.content.fields as {
        lootbox: string;
        public_key: number[];
        assets: { asset: { value: number }; probability: number }[];
        default_asset: { asset: { value: number }; probability: number };
        fees: { value: number };
        base_fee_in_bp: number;
    };
}

export default function Home() {
    // const { address } = useZkLogin();

    // if (!address) {
    //   return <SignIn />
    // }

    const account = useCurrentAccount();

    const { lootboxData, handleFetchLootboxes } = useLootbox();
    const PACKAGE_ID = "0x5200d31152fcefbe44957c86fcf940c1a0ccff2cacedbed0558f25ec92057748";
    const NFT_ID = "0xbac579e0697a42d753b47ecdf64c5c6f18912a05784828c7e86d858518810553";
    const REGISTRY_ID = "0xc103d5d0fddfed882db1c2fbbf86110e70296cbd23df0f541433f34c0e075863";

    const { data } = useSuiClientQuery('getObject', {
        id: REGISTRY_ID,
        options: {
            showContent: true,
        },
    });

    if (!data?.data) return <div>Not found</div>;

    console.log('getLootboxData result: ', getLootboxData(data.data));
    console.log('getLootboxData result: ', data);

    if (!account) {
        return (
            <div className="text-center font-normal">
                Please connect your wallet
            </div>
        );
    }

    if (!lootboxData) {
        return (
            <>
                <div className="text-center font-normal">
                    No lootboxes found.
                </div>
                <div
                    className="w-fit p-2 rounded-lg bg-white cursor-pointer"
                    onClick={() => handleFetchLootboxes()}
                >
                    Refresh
                </div>
            </>
        );
    }

    return (
        <div className="relative min-h-[60vh] text-center font-bold text-xl">
            <NFTPlaceholder
                address={new Ed25519PublicKey((account?.publicKey)).toSuiAddress()}
                packageAddress={PACKAGE_ID}
                nftAddress={NFT_ID}
                registryAddress={REGISTRY_ID}
            />
            <div className="flex justify-between p-8 gap-8 rounded-lg border border-black">
                {lootboxData.map((lootbox) => (
                    <LootboxCard key={lootbox.id} lootbox={lootbox} />
                ))}
            </div>
            <div
                className="w-fit p-2 rounded-lg bg-white cursor-pointer"
                onClick={() => { }}
            >
                Refresh
            </div>
        </div>
    );
}
