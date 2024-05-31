import { SuiClient } from '@mysten/sui.js/client';
import fs from 'fs';
import { SUI_NETWORK } from '../config';
import { initializeLootboxData } from '../helpers/actions/initializeLootboxData';

const initializeLootbox = async () => {
    const lootboxDataId = await initializeLootboxData({
        suiClient: new SuiClient({ url: SUI_NETWORK }),
    });
    if (typeof lootboxDataId !== 'undefined') {
        fs.appendFileSync('./.env', `LOOTBOX_DATA_ID=${lootboxDataId}\n`);
        fs.appendFileSync(
            '../app/.env',
            `NEXT_PUBLIC_LOOTBOX_DATA_ID=${lootboxDataId}\n`,
        );
    }
};

initializeLootbox();
