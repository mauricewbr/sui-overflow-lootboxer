import Image from 'next/image';
import Link from 'next/link';

interface LootboxInfo {
    id: string;
    lootboxName?: string;
    lootboxCreator?: string;
    lootboxAssets?: string[];
    lootboxImage?: string;
}

export const LootboxCard = ({ lootbox }: { lootbox: LootboxInfo }) => {
    return (
        <Link
            href={{
                pathname: `/lootbox/${lootbox.id}`,
                query: { _id: lootbox.id },
            }}
            passHref
        >
            <div className="w-full p-8 border border-gray-300 rounded-lg shadow-lg">
                {/* Upper Image Section */}
                <div className="h-40 mb-4 overflow-hidden rounded-lg">
                    {lootbox.lootboxImage ? (
                        <Image
                            src={lootbox.lootboxImage}
                            alt="Lootbox"
                            className="object-cover w-full h-full"
                            width={100}
                            height={100}
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200">
                            <span className="text-gray-400">No Image</span>
                        </div>
                    )}
                </div>
                {/* Lower Section */}
                <div>
                    <h2 className="mb-2 text-lg font-semibold text-gray-800">
                        {lootbox.lootboxName || 'Unnamed Lootbox'}
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">
                        by {lootbox.lootboxCreator || 'Unknown Creator'}
                    </p>
                    <div className="space-y-1">
                        {lootbox.lootboxAssets &&
                        lootbox.lootboxAssets.length > 0 ? (
                            lootbox.lootboxAssets.map((asset, index) => (
                                <p
                                    key={index}
                                    className="text-sm text-gray-700"
                                >
                                    {asset}
                                </p>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">
                                No assets available
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};
