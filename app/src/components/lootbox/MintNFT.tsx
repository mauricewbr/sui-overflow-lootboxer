import { useMintNFT } from '@/hooks/useMintNFT';
import { SuiClient } from '@mysten/sui.js/client';

interface MintNFTParams {
    packageAddress: string;
    nftAddress: string;
    registryAddress: string
}

export const MintNFT = (props: MintNFTParams) => {
    useMintNFT({
        packageAddress: props.packageAddress,
        nftAddress: props.nftAddress,
        registryAddress: props.registryAddress,
    });

    return (<></>);
};
