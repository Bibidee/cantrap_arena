export const STUDIONET = { id: 61999, name: 'Studionet', rpcUrl: 'https://studio.genlayer.com/api', explorer: 'https://explorer-studio.genlayer.com', currency: 'GEN' } as const;
export const explorerTx = (hash: string) => `${STUDIONET.explorer}/tx/${hash}`;
export const isStudionet = (chainId?: string) => chainId === `0x${STUDIONET.id.toString(16)}`;
