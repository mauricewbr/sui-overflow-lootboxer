import { SuiClient, SuiObjectChangeCreated } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { getBLSPublicKey } from '../bls/getBLSPublicKey';
import { getKeypair } from '../keypair/getKeyPair';

interface InitializeRegistryProps {
    suiClient: SuiClient;
}

export const initializeRegistryData = async ({
    suiClient,
}: InitializeRegistryProps): Promise<string | undefined> => {
    console.log('Initializing RegistryData...');
    const tx = new TransactionBlock();

    const PACKAGE_ADDRESS =
        '0x08eeccba583b73bca262a3ae2b332851e1acbd381ae9910e32824d722bfeedd1';
    const REGISTRY_CAP =
        '0x5db38a41429c2e15facdff6a3f49996aae8f92a1bbefa1e03caf73a817478159';
    const ADMIN = process.env.ADMIN_SECRET_KEY!;
    console.log(ADMIN);

    let adminBLSPublicKey = getBLSPublicKey(ADMIN!);
    console.log('adminBLSPubKey: ', adminBLSPublicKey);

    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::registry::initialize_registry_data`,
        arguments: [
            tx.object(REGISTRY_CAP),
            // tx.pure(Array.from(adminBLSPublicKey)),
        ],
    });

    const keypair = new Ed25519Keypair();
    console.log('keypair: ', keypair);

    return suiClient
        .signAndExecuteTransactionBlock({
            signer: getKeypair(ADMIN!),
            // signer: keypair,
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
                throw new Error('RegistryData not created');
            }
            if (status === 'success') {
                const createdObjects = resp.objectChanges?.filter(
                    ({ type }) => type === 'created',
                ) as SuiObjectChangeCreated[];
                const createdRegistryData = createdObjects.find(
                    ({ objectType }) =>
                        objectType.endsWith('registry::RegistryData'),
                );
                if (!createdRegistryData) {
                    throw new Error('RegistryData not created');
                }
                const { objectId: registryDataId } = createdRegistryData;
                console.log({ registryDataId });
                return registryDataId;
            }
        })
        .catch((err) => {
            console.error('Error = ', err);
            return undefined;
        });
};
