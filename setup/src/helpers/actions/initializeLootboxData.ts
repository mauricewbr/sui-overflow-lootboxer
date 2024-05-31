import { SuiClient, SuiObjectChangeCreated } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { getBLSPublicKey } from '../bls/getBLSPublicKey';
import { getKeypair } from '../keypair/getKeypair';

interface InitializeLootboxProps {
    suiClient: SuiClient;
}

export const initializeLootboxData = async ({
    suiClient,
}: InitializeLootboxProps): Promise<string | undefined> => {
    console.log('Initializing LootboxData...');
    const tx = new TransactionBlock();

    const PACKAGE_ADDRESS =
        '0x5200d31152fcefbe44957c86fcf940c1a0ccff2cacedbed0558f25ec92057748';
    const LOOTBOX_CAP =
        '0x4bcc205998d2eb6a77c6c6ef0beade084a1ebc7d28cd6a68014b3e3a5a1a47cc';
    const REGISTRY_ID =
        '0xc103d5d0fddfed882db1c2fbbf86110e70296cbd23df0f541433f34c0e075863';
    const NFT_ID =
        '0xad86225e145c18bbfe24dd54497f324e9b19f113bfcbe3c73d152483b01d980d';

    const keypair = getKeypair(process.env.ADMIN_SECRET_KEY!);
    let adminBLSPublicKey = getBLSPublicKey(process.env.ADMIN_SECRET_KEY!);
    const initialDefaultAsset = tx.splitCoins(tx.gas, [
        tx.pure(0.1 * Number(MIST_PER_SUI)),
    ]);

    tx.setGasBudget(1000000000);
    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::lootboxer::initialize_lootbox_data`,
        arguments: [
            tx.object(LOOTBOX_CAP),
            tx.object(REGISTRY_ID),
            tx.pure(Array.from(adminBLSPublicKey)),
            tx.pure(NFT_ID),
            initialDefaultAsset,
        ],
    });

    console.log(keypair.toSuiAddress());

    return suiClient
        .signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            requestType: 'WaitForLocalExecution',
            options: {
                showObjectChanges: true,
                showEffects: true,
            },
        })
        .then((resp) => {
            const status = resp?.effects?.status.status;
            console.log('executed! status = ', status);
            if (status !== 'success') {
                throw new Error('LootboxData not created');
            }
            if (status === 'success') {
                const createdObjects = resp.objectChanges?.filter(
                    ({ type }) => type === 'created',
                ) as SuiObjectChangeCreated[];
                const createdLootboxData = createdObjects.find(
                    ({ objectType }) =>
                        objectType.endsWith('lootboxer::LootboxData'),
                );
                if (!createdLootboxData) {
                    throw new Error('LootboxData not created');
                }
                const { objectId: lootboxDataId } = createdLootboxData;
                console.log({ lootboxDataId });
                return lootboxDataId;
            }
        })
        .catch((err) => {
            console.error('Error = ', err);
            return undefined;
        });
};
