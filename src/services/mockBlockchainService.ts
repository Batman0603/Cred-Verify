import { randomHex, sha256Hash } from '../utils/hashGenerator';

export const anchorCredentialToBlockchain = async (payload: string) => {
  const blockchainHash = await sha256Hash(payload);
  const transactionHash = `0x${randomHex(64)}`;
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return {
    blockchainHash,
    transactionHash,
    network: 'Sepolia Testnet',
  };
};

export const verifyBlockchainHash = async (payload: string, storedHash: string) => {
  const freshHash = await sha256Hash(payload);
  return freshHash === storedHash;
};
