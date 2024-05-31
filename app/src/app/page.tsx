// import { useZkLogin } from "@mysten/enoki/react";

'use client';

import { useLootbox } from '@/hooks/useLootbox';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function Home() {
    const account = useCurrentAccount();

    const { lootboxes, lootboxData, isPendingLootbox, isErrorLootbox } =
        useLootbox();

    // const { data } = useSuiClientQuery('getObject', {
    //     id: '0xc103d5d0fddfed882db1c2fbbf86110e70296cbd23df0f541433f34c0e075863',
    //     options: {
    //         showContent: true,
    //     },
    // });

    // if (lootboxes === null) return <div>Not found</div>;

    if (isPendingLootbox) {
        return <div>Loading...</div>;
    }

    if (isErrorLootbox) {
        return <div>Error loading lootboxes.</div>;
    }

    console.log(lootboxes);

    if (!account) {
        return (
            <div className="text-center font-normal">
                Please connect your wallet
            </div>
        );
    }

    // if (!lootboxData) {
    //     return (
    //         <>
    //             <div className="text-center font-normal">
    //                 No lootboxes found.
    //             </div>
    //             <div
    //                 className="w-fit p-2 rounded-lg bg-white cursor-pointer"
    //                 onClick={() => handleFetchLootboxes()}
    //             >
    //                 Refresh
    //             </div>
    //         </>
    //     );
    // }

    return (
        <div className="relative min-h-[60vh] text-center font-bold text-xl">
            <div className="flex justify-between p-8 gap-8 rounded-lg border border-black">
                <h1>Lootboxes</h1>
                {lootboxData?.map((lootbox, index) => (
                    <div key={index}>
                        <h3>Lootbox ID: {lootbox.objectId}</h3>
                        <p>Type: {lootbox.type}</p>
                        <p>Version: {lootbox.version}</p>
                        {/* Add other fields you want to display */}
                    </div>
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
