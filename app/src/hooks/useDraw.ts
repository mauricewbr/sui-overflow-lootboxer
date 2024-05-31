import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useMouseRandomness } from "./useMouseRandomness";
import { useNFTBalance } from "./useNFTBalance";
import { useCounter } from "./useCounter";
import { bytesToHex } from "@noble/hashes/utils";
import { bls12_381 } from "@noble/curves/bls12-381";
import { getBLSSecretKey } from "../../../setup/src/helpers/bls/getBLSSecretKey";

interface DrawProps {
    randomness: number[];
    address: string;
    packageAddress: string;
    nftAddress: string;
    counterAddress: string;
    lootboxerAddress: string;
}
interface UseDraw {}

export const useDraw = (props: DrawProps): UseDraw => {
    // const { randomness, gathered } = useMouseRandomness();

    const nftBalance = useNFTBalance({
        address: props.address,
        packageAddress: props.packageAddress,
        nftAddress: props.nftAddress,
    });

    const { counter } = useCounter({
        counterAddress: props.counterAddress,
    });
    const counterHex = bytesToHex(Uint8Array.from([counter]));
    const randomnessHexString = bytesToHex(Uint8Array.from(props.randomness));
    const messageToSign = randomnessHexString.concat(counterHex);
    let signedHash = bls12_381.sign(
        messageToSign,
        getBLSSecretKey(process.env.ADMIN_SECRET_KEY!)
    );

    const tx = new TransactionBlock();
    tx.setGasBudget(1000000000);
    tx.moveCall({
        target: `${props.packageAddress}::lootboxer::draw_from_lootbox`,
        arguments: [
            tx.pure(props.randomness),
            tx.object(props.counterAddress),
            tx.pure(Array.from(signedHash), "vector<u8>"),
            tx.object(props.lootboxerAddress),
            tx.object(props.nftAddress),
            tx.pure(nftBalance.balance),
        ],
    });

    const { mutate: signAndExecuteTransaction } =
        useSignAndExecuteTransaction();

    signAndExecuteTransaction(
        {
            transaction: tx,
            requestType: "WaitForLocalExecution",
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        },
        {
            onSuccess: (tx) => {
                const status = tx?.effects?.status.status;
                console.log("executed! status = ", status);
                if (status !== "success") {
                    throw new Error("RegistryData not created");
                }
                if (status === "success") {
                }
            },
            onError: (err) => {
                console.log(err);
                return undefined;
            },
        }
    );
    return {};
};
