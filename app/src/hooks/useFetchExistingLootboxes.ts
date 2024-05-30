import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useCallback, useState } from 'react';
import { useSui } from './useSui';

interface LootboxData {
    id: string;
    lootboxName: string;
    lootboxCreator: string;
    lootboxAssets: string[];
    lootboxImage: string;
}

interface HandleFetchExistingLootboxesProps {
    lootboxIds: string[];
    lootboxData: LootboxData[];
}

export const useFetchExistingLootboxes = () => {
    const { suiClient } = useSui();
    const [existingLootboxIds, setExistingLootboxIds] = useState<
        string[] | null
    >(null);

    const lootboxIds = ['0', '1', '2'];
    const lootboxData: LootboxData[] = [
        {
            id: '0',
            lootboxName: 'Mystery Box 1',
            lootboxCreator: 'Alice',
            lootboxAssets: ['Asset 1', 'Asset 2', 'Asset 3'],
            lootboxImage: '/static/sample_treasure_chest.png',
        },
        {
            id: '1',
            lootboxName: 'Treasure Chest',
            lootboxCreator: 'Bob',
            lootboxAssets: ['Gold', 'Silver', 'Bronze'],
            lootboxImage: '/static/sample_treasure_chest.png',
        },
        {
            id: '2',
            lootboxName: 'Surprise Pack',
            lootboxCreator: 'Carol',
            lootboxAssets: ['Surprise Item 1', 'Surprise Item 2'],
            lootboxImage: '/static/sample_treasure_chest.png',
        },
        {
            id: '3',
            lootboxName: 'Lucky Box',
            lootboxCreator: 'Dave',
            lootboxAssets: [
                'Lucky Charm 1',
                'Lucky Charm 2',
                'Lucky Charm 3',
                'Lucky Charm 4',
            ],
            lootboxImage: '/static/sample_treasure_chest.png',
        },
        {
            id: '4',
            lootboxName: 'Random Box',
            lootboxCreator: 'Eve',
            lootboxAssets: ['Random Item 1', 'Random Item 2', 'Random Item 3'],
            lootboxImage: '/static/sample_treasure_chest.png',
        },
    ];

    const handleFetchExistingLootboxes =
        useCallback(async (): Promise<HandleFetchExistingLootboxesProps | null> => {
            console.log('Fetching existing lootboxes...');

            const txb = new TransactionBlock();
            // txb.moveCall({
            //     target: `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::lootbox_registry::fetch_existing_lootboxes`,
            //     arguments: [],
            // });

            console.log('Executing fetch...');
            // const bytes = await txb.build({ client: suiClient });

            // TODO: Return actual array of lootboxIds
            setExistingLootboxIds(lootboxIds);
            return { lootboxIds, lootboxData };

            const keypair = new Ed25519Keypair();
            // const { signature } = await keypair.signTransactionBlock(bytes);
            // let res = client.executeTransactionBlock({
            //     transactionBlock: bytes,
            //     signature,
            // });

            const res = suiClient.signAndExecuteTransactionBlock({
                transactionBlock: txb,
                signer: keypair,
                requestType: 'WaitForLocalExecution',
                options: {
                    showObjectChanges: true,
                    showEffects: true,
                },
            });

            console.log('Res of signAndExecuteTransactionBlock ' + res);

            // return res.then((resp) => {
            //     const status = resp?.effects?.status.status;
            //     if (status !== 'success') {
            //         console.log(resp.effects);
            //         throw new Error('Fetching existing lootboxes failed');
            //     }

            //     // TODO: Return actual resp
            //     return;
            // });
        }, []);

    return {
        existingLootboxIds,
        handleFetchExistingLootboxes,
    };
};
