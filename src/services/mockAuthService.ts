import { AuthUser } from '../types';

const usersDb: AuthUser[] = [
  {
    name: 'Issuer Admin',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'university',
  },
  {
    name: 'Alice Student',
    email: 'alice@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Merchant One',
    email: 'merchant@verify.com',
    password: 'merchant123',
    role: 'merchant',
  },
];

export const getMockUsers = () => usersDb.map(({ password, ...user }) => user);

export const mockLogin = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const normalizedEmail = email.trim().toLowerCase();
  const user = usersDb.find((item) => item.email.toLowerCase() === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const { password: _, ...profile } = user;
  return profile;
};

export const mockRegisterMerchant = async (name: string, email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = usersDb.some((item) => item.email.toLowerCase() === normalizedEmail);
  if (exists) {
    throw new Error('Merchant account already exists for this email');
  }

  const merchant: AuthUser = {
    name,
    email: normalizedEmail,
    password,
    role: 'merchant',
  };

  usersDb.push(merchant);
  const { password: _, ...profile } = merchant;
  return profile;
};
