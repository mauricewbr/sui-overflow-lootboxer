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
        '0x08eeccba583b73bca262a3ae2b332851e1acbd381ae9910e32824d722bfeedd1';
    const LOOTBOX_CAP =
        '0xc6bad169e9acf8ea31e29331e193d9932474e48a5c6f04b37249795f2d796bec';
    const REGISTRY_ID =
        '0xb7d8b670d2d79f678da896007a3841f82ae17c574cc338ff2f442005be153dc3';
    const NFT_ID =
        '0x48c0c4dc6a4a736c559f83d1146ecd51f8e39b5fb0803181d71da2bf93e4677f';

    const keypair = getKeypair(process.env.ADMIN_SECRET_KEY!);
    let adminBLSPublicKey = getBLSPublicKey(process.env.ADMIN_SECRET_KEY!);
    const initialDefaultAsset = tx.splitCoins(tx.gas, [
        tx.pure(0.1 * Number(MIST_PER_SUI)),
    ]);

    // tx.setGasPayment([
    //     {
    //         digest: 'G4MwXyT9gftXQzuFLFYCuVHJw6oPAhetQRJw122DaHed',
    //         objectId:
    //             '0x016354b42eab8839c37770a0f4f26d5356ca15693ef6324b2fa4df80cdf1f2b8',
    //         version: 955507,
    //     },
    // ]); // TODO: Change hardcoded values
    tx.setGasBudget(1000000000);
    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::lootboxer::initialize_lootbox_data`,
        arguments: [
            tx.object(LOOTBOX_CAP),
            tx.object(REGISTRY_ID),
            tx.pure(Array.from(adminBLSPublicKey)),
            tx.object(NFT_ID),
            initialDefaultAsset,
        ],
    });
    // tx.setSender(keypair.getPublicKey().toSuiAddress());

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
