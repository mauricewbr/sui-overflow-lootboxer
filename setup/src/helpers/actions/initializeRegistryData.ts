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
        "0x5200d31152fcefbe44957c86fcf940c1a0ccff2cacedbed0558f25ec92057748";
    const REGISTRY_CAP =
        "0x7f16ca18464a2d80526e1a6b6a6fd3d0335620dcf1b1af6e79ceea11516eea93";
    const keypair = getKeypair(process.env.ADMIN_SECRET_KEY!);

    tx.setGasBudget(1000000000);
    tx.moveCall({
        target: `${PACKAGE_ADDRESS}::registry::initialize_registry_data`,
        arguments: [tx.object(REGISTRY_CAP)],
    });

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
