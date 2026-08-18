import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// A precomputed hash of an unrelated, unknown value. Comparing against this
// when a user doesn't exist keeps login response time close to the "user
// exists but password is wrong" path, so timing can't be used to enumerate
// registered emails.
export const DUMMY_PASSWORD_HASH = bcrypt.hashSync("not-a-real-password-oraclemaster", SALT_ROUNDS);

export function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
