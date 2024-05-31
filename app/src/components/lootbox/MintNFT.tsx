import { useMintNFT } from '@/hooks/useMintNFT';
import { usePromptCounter } from '@/hooks/usePromptCounter';

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
