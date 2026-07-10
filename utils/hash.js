import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS) || 10
  );
};

export const comparePassword = async (
  plainPassword,
  hashedPassword
) => {
  return await bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};