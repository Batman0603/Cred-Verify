import { Credential } from '../types';
import { anchorCredentialToBlockchain, verifyBlockchainHash } from './mockBlockchainService';

const createCredentialId = () => `CRD-${Date.now().toString().slice(-7)}-${Math.floor(Math.random() * 9999)}`;

export const issueCredential = async (
  data: Omit<Credential, 'id' | 'status' | 'blockchainHash' | 'transactionHash'>,
): Promise<Credential> => {
  const id = createCredentialId();
  const payload = JSON.stringify({ id, ...data });
  const chain = await anchorCredentialToBlockchain(payload);

  return {
    ...data,
    id,
    status: 'active',
    blockchainHash: chain.blockchainHash,
    transactionHash: chain.transactionHash,
  };
};

export const verifyCredentialOnChain = async (credential: Credential) => {
  const payload = JSON.stringify({
    id: credential.id,
    studentName: credential.studentName,
    studentId: credential.studentId,
    degree: credential.degree,
    issueDate: credential.issueDate,
    universityName: credential.universityName,
  });

  return verifyBlockchainHash(payload, credential.blockchainHash);
};
