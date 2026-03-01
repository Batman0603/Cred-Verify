import { Credential } from '../types';
import { anchorCredentialToBlockchain, verifyBlockchainHash } from './mockBlockchainService';

const createCredentialId = () => `CRD-${Date.now().toString().slice(-7)}-${Math.floor(Math.random() * 9999)}`;

type IssueInput = Omit<
  Credential,
  'id' | 'status' | 'blockchainHash' | 'transactionHash'
>;

const buildPayload = (id: string, data: IssueInput) =>
  JSON.stringify({
    id,
    studentName: data.studentName,
    studentId: data.studentId,
    studentEmail: data.studentEmail,
    degree: data.degree,
    issueDate: data.issueDate,
    universityName: data.universityName,
    issuerEmail: data.issuerEmail,
  });

export const issueCredential = async (data: IssueInput): Promise<Credential> => {
  const id = createCredentialId();
  const chain = await anchorCredentialToBlockchain(buildPayload(id, data));

  return {
    ...data,
    id,
    status: 'active',
    blockchainHash: chain.blockchainHash,
    transactionHash: chain.transactionHash,
  };
};

export const createSeedCredential = async (
  data: IssueInput & { id?: string; status?: Credential['status'] },
): Promise<Credential> => {
  const id = data.id ?? createCredentialId();
  const chain = await anchorCredentialToBlockchain(buildPayload(id, data));
  return {
    ...data,
    id,
    status: data.status ?? 'active',
    blockchainHash: chain.blockchainHash,
    transactionHash: chain.transactionHash,
  };
};

export const verifyCredentialOnChain = async (credential: Credential) => {
  const payload = buildPayload(credential.id, credential);
  return verifyBlockchainHash(payload, credential.blockchainHash);
};
