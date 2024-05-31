import { SuiClient, SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "../keypair/getKeypair";

interface InitializeRegistryProps {
    suiClient: SuiClient;
}

export const initializeRegistryData = async ({
    suiClient,
}: InitializeRegistryProps): Promise<string | undefined> => {
    console.log("Initializing RegistryData...");
    const tx = new TransactionBlock();

    const PACKAGE_ADDRESS =
        "0x08eeccba583b73bca262a3ae2b332851e1acbd381ae9910e32824d722bfeedd1";
    const REGISTRY_CAP =
        "0x5db38a41429c2e15facdff6a3f49996aae8f92a1bbefa1e03caf73a817478159";
    const keypair = getKeypair(process.env.ADMIN_SECRET_KEY!);

    tx.setGasPayment([
        {
            digest: "G4MwXyT9gftXQzuFLFYCuVHJw6oPAhetQRJw122DaHed",
            objectId:
                "0x016354b42eab8839c37770a0f4f26d5356ca15693ef6324b2fa4df80cdf1f2b8",
            version: 955507,
        },
    ]); // TODO: Change hardcoded values
    tx.setGasBudget(1000000000);
    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::registry::initialize_registry_data`,
        arguments: [tx.object(REGISTRY_CAP)],
    });
    tx.setSender(keypair.getPublicKey().toSuiAddress());

    console.log(keypair.toSuiAddress());

    return suiClient
        .signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            requestType: "WaitForLocalExecution",
            options: {
                showObjectChanges: true,
                showEffects: true,
            },
        })
        .then((resp) => {
            const status = resp?.effects?.status.status;
            console.log("executed! status = ", status);
            if (status !== "success") {
                throw new Error("RegistryData not created");
            }
            if (status === "success") {
                const createdObjects = resp.objectChanges?.filter(
                    ({ type }) => type === "created"
                ) as SuiObjectChangeCreated[];
                const createdRegistryData = createdObjects.find(
                    ({ objectType }) =>
                        objectType.endsWith("registry::RegistryData")
                );
                if (!createdRegistryData) {
                    throw new Error("RegistryData not created");
                }
                const { objectId: registryDataId } = createdRegistryData;
                console.log({ registryDataId });
                return registryDataId;
            }
        })
        .catch((err) => {
            console.error("Error = ", err);
            return undefined;
        });
};
