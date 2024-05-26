// import { useZkLogin } from "@mysten/enoki/react";

'use client';

import { LootboxCard } from '@/components/lootbox/LootboxCard';
import { useLootbox } from '@/hooks/useLootbox';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function Home() {
    // const { address } = useZkLogin();

    // if (!address) {
    //   return <SignIn />
    // }

    const account = useCurrentAccount();

    const { lootboxData, handleFetchLootboxes } = useLootbox();

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
            <div className="flex justify-between p-8 gap-8 rounded-lg border border-black">
                {lootboxData.map((lootbox) => (
                    <LootboxCard key={lootbox.id} lootbox={lootbox} />
                ))}
            </div>
            <div
                className="w-fit p-2 rounded-lg bg-white cursor-pointer"
                onClick={() => {}}
            >
                Refresh
            </div>
        </div>
    );
}
