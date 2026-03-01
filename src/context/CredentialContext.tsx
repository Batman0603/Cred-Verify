import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Credential, VerificationResult } from '../types';
import {
  createSeedCredential,
  issueCredential,
  verifyCredentialOnChain,
} from '../services/mockCredentialService';

export interface IssueCredentialInput {
  studentName: string;
  studentId: string;
  studentEmail: string;
  degree: string;
  issueDate: string;
  universityName: string;
  issuerEmail: string;
}

interface UpdateCredentialInput {
  degree: string;
  issueDate: string;
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
  updateCredential: (id: string, updates: UpdateCredentialInput) => void;
  deleteCredential: (id: string) => void;
  revokeCredential: (id: string) => void;
  verifyCredential: (id: string) => Promise<VerificationResult>;
}

const CredentialContext = createContext<CredentialContextValue | undefined>(undefined);

export const CredentialProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    const seed = async () => {
      if (credentials.length > 0) {
        return;
      }

      const seeded = await Promise.all([
        createSeedCredential({
          id: 'CRD-ADMIN-1001',
          studentName: 'Alice Student',
          studentId: 'S-1001',
          studentEmail: 'alice@student.com',
          degree: 'B.Sc Computer Science',
          issueDate: '2025-01-15',
          universityName: 'Issuer Admin University',
          issuerEmail: 'admin@gmail.com',
          status: 'active',
        }),
        createSeedCredential({
          id: 'CRD-ADMIN-1002',
          studentName: 'Bob Student',
          studentId: 'S-1002',
          studentEmail: 'bob@student.com',
          degree: 'BBA',
          issueDate: '2024-12-10',
          universityName: 'Issuer Admin University',
          issuerEmail: 'admin@gmail.com',
          status: 'revoked',
        }),
      ]);
      setCredentials(seeded);
    };

    void seed();
  }, [credentials.length]);

  const issueNewCredential = async (input: IssueCredentialInput) => {
    const credential = await issueCredential(input);
    setCredentials((prev) => [credential, ...prev]);
    return credential;
  };

  const updateCredential = (id: string, updates: UpdateCredentialInput) => {
    setCredentials((prev) =>
      prev.map((credential) =>
        credential.id === id ? { ...credential, degree: updates.degree, issueDate: updates.issueDate } : credential,
      ),
    );
  };

  const deleteCredential = (id: string) => {
    setCredentials((prev) => prev.filter((credential) => credential.id !== id));
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
    () => ({ credentials, issueNewCredential, updateCredential, deleteCredential, revokeCredential, verifyCredential }),
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
