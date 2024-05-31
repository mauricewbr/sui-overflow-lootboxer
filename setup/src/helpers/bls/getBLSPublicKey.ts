import { bls12_381 } from '@noble/curves/bls12-381';
import { getBLSSecretKey } from './getBLSSecretKey';

export const getBLSPublicKey = (secretKey: string) => {
    const blsSecretKey = getBLSSecretKey(secretKey);
    const blsPublicKey = bls12_381.getPublicKey(blsSecretKey);
    return blsPublicKey;
};
