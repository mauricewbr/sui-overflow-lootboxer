import { useSuiClientQuery } from '@mysten/dapp-kit';
import { MintNFT } from './MintNFT';
import { SuiClient } from '@mysten/sui.js/client';

interface NFTPlaceholderParams {
    packageAddress: string;
    nftAddress: string;
    address: string;
    registryAddress: string;
}

export const NFTPlaceholder = (props: NFTPlaceholderParams) => {
    const { data: ownedObjects } = useSuiClientQuery('getOwnedObjects', {
        owner: props.address,
    });
    let owned = false;
    ownedObjects?.data.forEach((object) => {
        if (object.data?.objectId == props.nftAddress) {
            console.log("ok yay ", props.nftAddress);
            owned = true;
        }
    });
    return (
        <>
            {owned ? <></> :
                <MintNFT
                    packageAddress={props.packageAddress}
                    nftAddress={props.nftAddress}
                    registryAddress={props.registryAddress}
                />}
        </>
    );
};
