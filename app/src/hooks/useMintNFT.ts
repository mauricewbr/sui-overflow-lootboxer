import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiClient, SuiObjectData } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getKeypair } from "@/components/keypair/getKeypair";

function getNFTData(data: SuiObjectData) {
    if (data.content?.dataType !== "moveObject") {
        return null;
    }

    return data.content.fields as {
        name: string;
        description: string;
    };
}

interface MintNFTProps {
    packageAddress: string;
    nftAddress: string;
    registryAddress: string;
}
interface UseMintNFT {}

export const useMintNFT = (props: MintNFTProps): UseMintNFT => {
    const suiClient = new SuiClient({
        url: process.env.NEXT_PUBLIC_SUI_NETWORK!,
    });

    const account = useCurrentAccount();

    const { data: nftObject } = useSuiClientQuery("getObject", {
        id: props.nftAddress,
        options: {
            showType: true,
            showContent: true,
        },
    });

    if (!nftObject?.data) return {};
    let nftData = getNFTData(nftObject?.data);
    if (!nftData) return {};

    // TODO: DON'T
    const admin_keypair = getKeypair(
        "AOy64dX4BiDYGbVcgrPDFFQ8r7Ao/aHZ4GENMUFX38iK"
    );
    const tx = new TransactionBlock();
    tx.setGasBudget(1000000000);
    tx.moveCall({
        target: `${props.packageAddress}::guard_nft::mint`,
        arguments: [
            tx.pure(nftData.name),
            tx.pure(nftData.description),
            tx.pure(""),
            tx.pure(account?.address),
            tx.object(props.registryAddress),
        ],
    });

    suiClient
        .signAndExecuteTransactionBlock({
            signer: admin_keypair,
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
                // const createdObjects = resp.objectChanges?.filter(
                //     ({ type }) => type === "created"
                // ) as SuiObjectChangeCreated[];
                // const createdRegistryData = createdObjects.find(
                //     ({ objectType }) =>
                //         objectType.endsWith("registry::RegistryData")
                // );
                // if (!createdRegistryData) {
                //     throw new Error("RegistryData not created");
                // }
                // const { objectId: registryDataId } = createdRegistryData;
                // console.log({ registryDataId });
                // return registryDataId;
            }
        })
        .catch((err) => {
            console.error("Error = ", err);
            return undefined;
        });

    return {};
};
