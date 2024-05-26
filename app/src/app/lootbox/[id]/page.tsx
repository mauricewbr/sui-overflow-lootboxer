'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LootboxInfo {
    id: string;
    lootboxName?: string;
    lootboxCreator?: string;
    lootboxAssets?: string[];
    lootboxImages?: string[];
    lootboxAssetImages?: string[];
}

const dummyLootboxData: LootboxInfo[] = [
    {
        id: '0',
        lootboxName: 'Mystery Box 1',
        lootboxCreator: 'Alice',
        lootboxAssets: ['Golden Coin', 'Silver Coin', 'Bronze Coin'],
        lootboxImages: [
            '/mnt/data/A_shiny_golden_coin_with_intricate_details,_glowin.png',
        ],
        lootboxAssetImages: [
            '/mnt/data/A_shiny_golden_coin_with_intricate_details,_glowin.png',
            '/mnt/data/A_shiny_silver_coin_with_intricate_details,_glowin.png',
            '/mnt/data/A_shiny_bronze_coin_with_intricate_details,_glowin.png',
        ],
    },
    {
        id: '1',
        lootboxName: 'Treasure Chest',
        lootboxCreator: 'Bob',
        lootboxAssets: ['Diamond', 'Treasure Chest'],
        lootboxImages: [
            '/mnt/data/A_detailed_treasure_chest_with_gold_coins_and_jewe.png',
        ],
        lootboxAssetImages: [
            '/mnt/data/A_sparkling_diamond_with_multiple_facets,_reflecti.png',
            '/mnt/data/A_detailed_treasure_chest_with_gold_coins_and_jewe.png',
        ],
    },
    // Add more data as needed
];

export default function LootboxDetail() {
    const searchParams = useSearchParams();

    const id = searchParams.get('_id');

    const [lootbox, setLootbox] = useState<LootboxInfo | null>(null);

    useEffect(() => {
        if (id) {
            const foundLootbox = dummyLootboxData.find(
                (lootbox) => lootbox.id === id,
            );
            setLootbox(foundLootbox || null);
        }
    }, [id]);

    if (!lootbox) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{lootbox.lootboxName}</h1>
            <p className="text-lg mb-2">Created by: {lootbox.lootboxCreator}</p>
            <div className="mb-4">
                {lootbox.lootboxImages && lootbox.lootboxImages.length > 0 && (
                    <img
                        src={lootbox.lootboxImages[0]}
                        alt="Lootbox Image"
                        className="w-full h-60 object-cover rounded-lg shadow-md"
                    />
                )}
            </div>
            <h2 className="text-xl font-semibold mb-2">Assets</h2>
            <ul className="list-disc list-inside">
                {lootbox.lootboxAssets?.map((asset, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        {lootbox.lootboxAssetImages &&
                            lootbox.lootboxAssetImages[index] && (
                                <img
                                    src={lootbox.lootboxAssetImages[index]}
                                    alt={asset}
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                        <span className="text-lg">{asset}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
