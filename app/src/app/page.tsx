// import { useZkLogin } from "@mysten/enoki/react";

'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';

export default function Home() {
    // const { address } = useZkLogin();

    // if (!address) {
    //   return <SignIn />
    // }

    const account = useCurrentAccount();

    if (!account) {
        return (
            <div className="text-center font-normal">
                Please connect your wallet
            </div>
        );
    }

    return (
        <div className="relative min-h-[60vh] text-center font-bold text-xl">
            <div>Eyyyyyy</div>
        </div>
    );
}
