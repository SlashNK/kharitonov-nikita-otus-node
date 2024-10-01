import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
export const generateId = () => {
  return uuidv4();
};
export const saltPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
