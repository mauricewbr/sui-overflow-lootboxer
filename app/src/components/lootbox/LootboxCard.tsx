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
    const shortenAddress = (address: string) => {
        return address.length > 10
            ? `${address.slice(0, 6)}...${address.slice(-4)}`
            : address;
    };

    return (
        <div className="w-[350px] h-[300px] p-8 border border-gray-300 rounded-lg shadow-lg">
            <div className="space-y-6">
                <h1 className="-mb-4">Lootbox</h1>
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                    {lootbox.public_key
                        ? shortenAddress(lootbox.public_key.join(''))
                        : 'Unnamed Lootbox'}
                </h2>
                <p className="mb-4 text-sm text-gray-600">
                    by{' '}
                    {lootbox.lootbox
                        ? shortenAddress(lootbox.lootbox)
                        : 'Unknown Creator'}
                </p>
                <div>
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
                <div>
                    <p className="text-sm text-gray-700">
                        {lootbox.default_asset.fields.asset}
                    </p>
                </div>
                <div>
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
