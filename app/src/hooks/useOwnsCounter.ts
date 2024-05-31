import { useSuiClientQuery } from "@mysten/dapp-kit";

interface OwnsCounterProps {
    address: string;
    packageAddress: string;
}
interface useOwnsCounter {
    owns: boolean;
}

export const useOwnsCounter = (props: OwnsCounterProps): useOwnsCounter => {
    const { data: ownedObjects } = useSuiClientQuery("getOwnedObjects", {
        owner: props.address,
    });
    let owns = false;
    ownedObjects?.data.forEach((object) => {
        if (object.data?.objectId == `${props.packageAddress}::counter_nft::Counter`) {
            owns = true;
        }
    });
    return { owns };
};
