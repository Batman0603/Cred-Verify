import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Credential, VerificationResult } from '../types';
import { issueCredential, verifyCredentialOnChain } from '../services/mockCredentialService';

interface IssueCredentialInput {
  studentName: string;
  studentId: string;
  degree: string;
  issueDate: string;
  universityName: string;
}

interface CredentialContextValue {
  credentials: Credential[];
  issueNewCredential: (input: IssueCredentialInput) => Promise<Credential>;
  revokeCredential: (id: string) => void;
  verifyCredential: (id: string) => Promise<VerificationResult>;
}

const CredentialContext = createContext<CredentialContextValue | undefined>(undefined);

export const CredentialProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  const issueNewCredential = async (input: IssueCredentialInput) => {
    const credential = await issueCredential(input);
    setCredentials((prev) => [credential, ...prev]);
    return credential;
  };

  const revokeCredential = (id: string) => {
    setCredentials((prev) =>
      prev.map((credential) =>
        credential.id === id ? { ...credential, status: 'revoked' as const } : credential,
      ),
    );
  };

  const verifyCredential = async (id: string): Promise<VerificationResult> => {
    const credential = credentials.find((item) => item.id.trim() === id.trim());
    if (!credential) {
      return {
        credential: null,
        databaseStatus: 'Not Found',
        blockchainStatus: 'Not Found',
        isValid: false,
      };
    }

    const blockchainMatch = await verifyCredentialOnChain(credential);
    const active = credential.status === 'active';

    return {
      credential,
      databaseStatus: active ? 'Active' : 'Revoked',
      blockchainStatus: blockchainMatch ? 'Hash Match' : 'Invalid',
      isValid: active && blockchainMatch,
    };
  };

  const value = useMemo(
    () => ({ credentials, issueNewCredential, revokeCredential, verifyCredential }),
    [credentials],
  );

  return <CredentialContext.Provider value={value}>{children}</CredentialContext.Provider>;
};

export const useCredentials = () => {
  const ctx = useContext(CredentialContext);
  if (!ctx) {
    throw new Error('useCredentials must be used within CredentialProvider');
  }
  return ctx;
};
