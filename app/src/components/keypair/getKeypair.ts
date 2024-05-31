import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { fromB64 } from "@mysten/sui.js/utils";

export const getKeypair = (secretKey: string) => {
    let secretKeyUint8Array: Uint8Array = Uint8Array.from(fromB64(secretKey));
    return Ed25519Keypair.fromSecretKey(secretKeyUint8Array.slice(1));
};
