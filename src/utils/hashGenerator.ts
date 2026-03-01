export const sha256Hash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const randomHex = (length = 64) =>
  Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
