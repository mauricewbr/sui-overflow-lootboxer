import { SuiObjectChangeCreated } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";

interface PromptCounterProps {
    packageAddress: string;
}

export const usePromptCounter = ({ packageAddress }: PromptCounterProps) => {
    const { mutate: signAndExecuteTransaction } =
        useSignAndExecuteTransaction();

    const handleUsePromptCounter = () => {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${packageAddress}::counter_nft::mint_and_transfer`,
            arguments: [],
        });
        tx.setGasBudget(1000000000);
        return signAndExecuteTransaction({ transaction: tx });
    };

    return { handleUsePromptCounter };

    // return {};
};
