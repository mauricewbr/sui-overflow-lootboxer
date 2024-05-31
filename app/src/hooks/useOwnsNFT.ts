import { useSuiClientQuery } from "@mysten/dapp-kit";

interface OwnsNFTProps {
    address: string;
    nftAddress: string;
}
interface UseOwnsNFT {
    owns: boolean;
}

export const useOwnsNFT = (props: OwnsNFTProps): UseOwnsNFT => {
    const { data: ownedObjects } = useSuiClientQuery("getOwnedObjects", {
        owner: props.address,
    });
    let owned = false;
    ownedObjects?.data.forEach((object) => {
        if (object.data?.objectId == props.nftAddress) {
            console.log("ok yay ", object.data);
            owned = true;
        }
    });
    return { owns: owned};
};
