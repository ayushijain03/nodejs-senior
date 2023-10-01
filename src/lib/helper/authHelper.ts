import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export function isRoleValid(role: Role): boolean {
  return role in Role;
}

export async function encryptText(plainText: string) {
  const hashedPassword = await bcrypt.hash(plainText, 10);
  return hashedPassword;
}

export async function compareWithEncryptedText(
  inputPassword: string,
  originalPassword: string,
) {
  return await bcrypt.compare(inputPassword, originalPassword);
}

export function getRandomCode(): number {
  return Math.floor(10000 + Math.random() * 90000);
}
