// import { useZkLogin } from "@mysten/enoki/react";

'use client';

import { LootboxCard } from '@/components/lootbox/LootboxCard';
import { useLootbox } from '@/hooks/useLootbox';
import { useCurrentAccount } from '@mysten/dapp-kit';

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
            <div className="flex justify-between p-8 gap-8 rounded-lg border border-black">
                {lootboxData?.map((lootbox: LootboxData, index) => (
                    <LootboxCard key={index} lootbox={lootbox} />
                ))}
            </div>
        </div>
    );
}
