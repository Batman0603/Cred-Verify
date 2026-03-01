import { AuthUser } from '../types';

const defaultUsers: AuthUser[] = [
  {
    name: 'Issuer Admin',
    email: 'Admin@gmail.com',
    password: 'admin@123',
    role: 'university',
  },
  {
    name: 'Alice Student',
    email: 'alice@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Bob Student',
    email: 'bob@student.com',
    password: 'student123',
    role: 'student',
  },
  {
    name: 'Dummy Student',
    email: 'student@gmail.com',
    password: 'student@123',
    role: 'student',
  },
  {
    name: 'Merchant One',
    email: 'merchant@verify.com',
    password: 'merchant123',
    role: 'merchant',
  },
];

const usersDb: AuthUser[] = [...defaultUsers];

const ensureDefaultUsers = () => {
  defaultUsers.forEach((seed) => {
    const exists = usersDb.some((item) => item.email.toLowerCase() === seed.email.toLowerCase());
    if (!exists) {
      usersDb.push({ ...seed });
    }
  });
};

export const getMockUsers = () => {
  ensureDefaultUsers();
  return usersDb.map(({ password, ...user }) => user);
};

export const mockLogin = async (email: string, password: string) => {
  ensureDefaultUsers();
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
  ensureDefaultUsers();
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

export const upsertStudentLogin = (name: string, email: string, password: string) => {
  ensureDefaultUsers();
  const normalizedEmail = email.trim().toLowerCase();
  const existingIndex = usersDb.findIndex((item) => item.email.toLowerCase() === normalizedEmail);

  const student: AuthUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: 'student',
  };

  if (existingIndex !== -1) {
    return;
  }

  usersDb.push(student);
};
