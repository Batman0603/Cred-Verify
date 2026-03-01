export type UserRole = 'student' | 'university' | 'merchant';

export interface User {
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthUser extends User {
  password: string;
}

export type CredentialStatus = 'active' | 'revoked';

export interface Credential {
  id: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  degree: string;
  issueDate: string;
  universityName: string;
  issuerEmail: string;
  status: CredentialStatus;
  blockchainHash: string;
  transactionHash: string;
}

export interface VerificationResult {
  credential: Credential | null;
  databaseStatus: 'Active' | 'Revoked' | 'Not Found';
  blockchainStatus: 'Hash Match' | 'Invalid' | 'Not Found';
  isValid: boolean;
}
