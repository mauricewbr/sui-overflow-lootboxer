import { SuiClient } from '@mysten/sui.js/client';
import fs from 'fs';
import { SUI_NETWORK } from '../config';
import { initializeRegistryData } from '../helpers/actions/initializeRegistryData';

const initializeRegistry = async () => {
    const registryDataId = await initializeRegistryData({
        suiClient: new SuiClient({ url: SUI_NETWORK }),
    });
    if (typeof registryDataId !== 'undefined') {
        fs.appendFileSync('./.env', `REGISTRY_DATA_ID=${registryDataId}\n`);
        fs.appendFileSync(
            '../app/.env',
            `NEXT_PUBLIC_REGISTRY_DATA_ID=${registryDataId}\n`,
        );
    }
};

initializeRegistry();
