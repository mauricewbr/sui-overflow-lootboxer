import { useSuiClientQuery } from "@mysten/dapp-kit";
import { CoinBalance } from "@mysten/sui.js/client";

interface NFTBalanceProps {
    address: string;
    packageAddress: string;
    nftAddress: string;
}
interface UseNFTBalance {
    balance: CoinBalance;
}

export const useNFTBalance = (props: NFTBalanceProps): UseNFTBalance => {
    const { data: balance } = useSuiClientQuery("getBalance", {
        owner: props.address,
        coinType: `${props.packageAddress}::guard_nft::GuardNFT`,
    });
    return { balance: balance! };
};
