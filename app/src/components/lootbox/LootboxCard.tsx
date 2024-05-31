interface LootboxInfo {
    lootbox: string;
    registry: string;
    nft_id: string;
    public_key: string[];
    assets: any[];
    default_asset: any;
    fees: any;
    base_fee_in_bp: number;
}

export const LootboxCard = ({ lootbox }: { lootbox: LootboxInfo }) => {
    return (
        <div className="w-full p-8 border border-gray-300 rounded-lg shadow-lg">
            {/* Upper Image Section */}
            <div className="h-40 mb-4 overflow-hidden rounded-lg">
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                </div>
            </div>
            {/* Lower Section */}
            <div>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                    {lootbox.public_key || 'Unnamed Lootbox'}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                    by {lootbox.lootbox || 'Unknown Creator'}
                </p>
                <div className="space-y-1">
                    {lootbox.assets && lootbox.assets.length > 0 ? (
                        lootbox.assets.map((asset, index) => (
                            <p key={index} className="text-sm text-gray-700">
                                {asset}
                            </p>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400">
                            No assets available
                        </p>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-sm text-gray-700">
                        {lootbox.default_asset.fields.asset}
                    </p>
                </div>
                <div className="space-y-1">
                    {lootbox.assets && lootbox.assets.length > 0 ? (
                        <button>draw from lootbox</button>
                    ) : (
                        <p className="text-sm text-gray-400">
                            Cant draw without assets
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
