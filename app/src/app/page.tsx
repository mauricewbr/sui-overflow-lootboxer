// import { useZkLogin } from "@mysten/enoki/react";

'use client';

import { LootboxCard } from '@/components/lootbox/LootboxCard';
import { useLootbox } from '@/hooks/useLootbox';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui.js/client';

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

    const { data } = useSuiClientQuery('getObject', {
        // id: '0xa9a9b00be09f7461dfe4f55c9761018dac6439603611554754266269f3dbcd5c',
        id: '0x08eeccba583b73bca262a3ae2b332851e1acbd381ae9910e32824d722bfeedd1',
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
