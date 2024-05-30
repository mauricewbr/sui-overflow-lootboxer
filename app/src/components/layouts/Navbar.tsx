import { ConnectButton } from '@mysten/dapp-kit';
import Link from 'next/link';

export const Navbar = () => {
    return (
        <div className="backdrop-blur-md md:backdrop-blur-none sticky top-0 flex w-full h-full bg-inherit p-5 space-x-2 md:space-x-4 justify-between items-center z-10">
            <Link
                href="/new"
                className="w-[min-content] md:w-[300px] text-2xl font-bold text-white"
            >
                Lootboxer
            </Link>
            <div className="flex flex-1 justify-end items-center space-x-1">
                <ConnectButton />
            </div>
        </div>
    );
};
