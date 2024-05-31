import { MintNFT } from './MintNFT';
import { useOwnsNFT } from '@/hooks/useOwnsNFT';

interface NFTPlaceholderParams {
    packageAddress: string;
    nftAddress: string;
    address: string;
    registryAddress: string;
}

export const NFTPlaceholder = (props: NFTPlaceholderParams) => {
    const { owns } = useOwnsNFT({
        address: props.address,
        nftAddress: props.nftAddress
    });

    return (
        <>
            {owns ? <></> :
                <MintNFT
                    packageAddress={props.packageAddress}
                    nftAddress={props.nftAddress}
                    registryAddress={props.registryAddress}
                />}
        </>
    );
};
