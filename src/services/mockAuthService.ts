export const mockLogin = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  return {
    name: email.split('@')[0].replace('.', ' '),
    email,
  };
};

export const mockRegister = async (name: string, email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  return { name, email };
};
