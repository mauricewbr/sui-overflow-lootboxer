'use client';

import { Navbar } from '@/components/layouts/Navbar';
import {
    SuiClientProvider,
    WalletProvider,
    createNetworkConfig,
} from '@mysten/dapp-kit';
import '@mysten/dapp-kit/dist/index.css';
import { EnokiFlowProvider } from '@mysten/enoki/react';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

export const ProvidersAndLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const queryClient = new QueryClient();
    const { networkConfig } = createNetworkConfig({
        localnet: { url: getFullnodeUrl('localnet') },
        devnet: { url: getFullnodeUrl('devnet') },
        testnet: { url: getFullnodeUrl('testnet') },
        mainnet: { url: getFullnodeUrl('mainnet') },
    });

    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider
                networks={networkConfig}
                defaultNetwork="testnet"
            >
                <WalletProvider>
                    <EnokiFlowProvider
                        apiKey={process.env.NEXT_PUBLIC_ENOKI_API_KEY!}
                    >
                        <main
                            className={`min-h-screen w-screen`}
                            style={{
                                // backgroundImage: "url('/general/background.svg')",
                                backgroundSize: 'cover',
                                backgroundPositionX: 'center',
                                backgroundPositionY: 'top',
                            }}
                        >
                            <div className={`relative w-full h-full flex-col`}>
                                <Navbar />
                                <div className="flex-1 p-4 bg-grey-100">
                                    <div className="max-w-[1300px] mx-auto">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </main>
                    </EnokiFlowProvider>
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    );
};
