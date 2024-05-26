import { SuiObjectChangeCreated } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { useSui } from './useSui';

interface UseGetLootboxesFromRegistry {
    handleFetchFromRegistry: () => void;
}

interface OnFetchLootboxesSuccessProps {
    registryAddress: string;
    txDigest: string;
    fetchObjectId: string;
}

export const useGetLootboxesFromRegistry = (): UseGetLootboxesFromRegistry => {
    const { enokiSponsorExecute } = useSui();
    const [isMoveLoading, setIsMoveLoading] = useState<boolean>(false);

    const handleFetchFromRegistry = useCallback(async () => {
        setIsMoveLoading(true);
        const txb = new TransactionBlock();
        let fetch = txb.moveCall({
            target: `${process.env.NEXT_PUBLIC_REGISTRY_PACKAGE_ADDRESS}::registry::get_lootboxes`,
            arguments: [], // TODO: Add arguments for get_lootboxes function
        });
        txb.transferObjects(
            [fetch],
            txb.pure(process.env.NEXT_PUBLIC_ADMIN_ADDRESS!),
        );
        return enokiSponsorExecute({
            transactionBlock: txb,
            options: {
                showObjectChanges: true,
                showEffects: true,
                showEvents: true,
            },
        })
            .then((resp) => {
                const status = resp?.effects?.status.status;
                if (status !== 'success') {
                    throw new Error('Transaction failed');
                }
                const createdObjects = resp.objectChanges?.filter(
                    ({ type }) => type === 'created',
                ) as SuiObjectChangeCreated[];
                const registeredLootboxes = createdObjects.find(
                    ({ objectType }) =>
                        objectType ===
                        `${process.env.NEXT_PUBLIC_PACKAGE_ADDRESS}::registry::VecMap`, // TODO: Likely easier to wrap return data into custom data type
                );

                if (!registeredLootboxes) {
                    throw new Error(
                        "No registered lootboxes in the admin's owned objects",
                    );
                }
                console.log('Registered Lootboxes: ', registeredLootboxes);
                return onFetchLootboxesSuccess({
                    registryAddress: '0x', // TODO: CHANGE TO DYNAMIC
                    txDigest: resp.effects?.transactionDigest!,
                    fetchObjectId: registeredLootboxes?.objectId!,
                });
            })
            .catch((err) => {
                console.log(err);
                setIsMoveLoading(false);
                return null;
            });
    }, []);

    const onFetchLootboxesSuccess = async ({
        registryAddress,
        txDigest,
        fetchObjectId,
    }: OnFetchLootboxesSuccessProps) => {
        return axios
            .post(`/api/registry/${registryAddress}`, {
                fetchObjectId,
                txDigest,
            })
            .then((resp) => {
                const { message, txDigest } = resp.data;
                console.log(message);
                setIsMoveLoading(false);
                return {
                    registryAddress,
                    txDigest,
                };
            })
            .catch((err) => {
                console.log(err);
                setIsMoveLoading(false);
                return null;
            });
    };

    return { handleFetchFromRegistry };
};
