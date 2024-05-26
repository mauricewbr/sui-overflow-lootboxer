import { useCurrentAccount } from '@mysten/dapp-kit';
import { useState } from 'react';
import { useFetchExistingLootboxes } from './useFetchExistingLootboxes';

interface LootboxData {
    id: string;
    lootboxName: string;
    lootboxCreator: string;
    lootboxAssets: string[];
    lootboxImage: string;
}

interface UseLootbox {
    // existingLootboxIds: string[] | null;
    lootboxData: LootboxData[] | null;
    handleFetchLootboxes: () => void;
}

export const useLootbox = (): UseLootbox => {
    const { existingLootboxIds, handleFetchExistingLootboxes } =
        useFetchExistingLootboxes();

    const account = useCurrentAccount();

    const [lootboxData, setLootboxData] = useState<LootboxData[] | null>(null);

    const handleFetchLootboxes = async () => {
        handleFetchExistingLootboxes().then((res) => {
            if (!res) {
                return;
            }
            const { lootboxData } = res;
            setLootboxData(lootboxData);
        });
    };

    return {
        lootboxData,
        handleFetchLootboxes,
    };
};
