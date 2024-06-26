import { useSuiClientQueries, useSuiClientQuery } from '@mysten/dapp-kit';
import { SuiObjectData } from '@mysten/sui.js/client';
import { useEffect, useState } from 'react';

interface UseLootbox {
    lootboxData: any[] | null;
    isPendingLootbox: boolean;
    isErrorLootbox: boolean;
}

function getRegistryData(data: SuiObjectData) {
    if (data.content?.dataType !== 'moveObject') {
        return null;
    }

    return data.content.fields as {
        admin: string;
        lootboxes: string[];
    };
}

function getLootboxData(data: SuiObjectData | null | undefined) {
    if (!data) return;

    if (data.content?.dataType !== 'moveObject') {
        return null;
    }

    return data.content.fields as {
        lootbox: string;
        registry: string;
        nft_id: string;
        public_key: string[];
        assets: any[];
        default_asset: any;
        fees: any;
        base_fee_in_bp: number;
    };
}

export const useLootbox = (): UseLootbox => {
    const [lootboxes, setLootboxes] = useState<string[] | null>(null);

    const {
        data: rawRegistryData,
        isPending: isPendingRegistry,
        isError: isErrorRegistry,
    } = useSuiClientQuery('getObject', {
        id: '0xc103d5d0fddfed882db1c2fbbf86110e70296cbd23df0f541433f34c0e075863',
        options: {
            showContent: true,
        },
    });

    useEffect(() => {
        if (rawRegistryData?.data) {
            const registryData = getRegistryData(rawRegistryData.data);
            if (registryData?.lootboxes) {
                setLootboxes(registryData.lootboxes);
            }
        }
    }, [rawRegistryData]);

    const {
        data: lootboxData,
        isPending: isPendingLootbox,
        isError: isErrorLootbox,
    } = useSuiClientQueries({
        queries:
            lootboxes?.map((address) => ({
                method: 'getObject',
                params: { id: address, options: { showContent: true } },
            })) || [],
        combine: (result) => {
            return {
                data: result.map((res) => getLootboxData(res.data?.data)),
                isSuccess: result.every((res) => res.isSuccess),
                isPending: result.some((res) => res.isPending),
                isError: result.some((res) => res.isError),
            };
        },
    });

    return {
        lootboxData,
        isPendingLootbox,
        isErrorLootbox,
    };
};
