import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_PAGE } from './constants';

export const generateId = (): string => {
  return uuidv4();
};

export const paginateArray = <T>(array: T[], limit: string | number, page: string | number): T[] => {
  const parsedLimit = parseInt(limit as string) || DEFAULT_QUERY_LIMIT;
  const parsedPage = parseInt(page as string) || DEFAULT_QUERY_PAGE;
  const startIndex = (parsedPage - 1) * parsedLimit;
  const endIndex = startIndex + parsedLimit;
  return array.slice(startIndex, endIndex);
};

export const saltPassword = async (password: string): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};
