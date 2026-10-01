import { nanoid } from 'nanoid';

/**
 * Generate human-readable custom IDs
 * e.g., usr_x91a2b, addr_k82m0p, prod_00192a
 */
export const generateId = (prefix: string = 'id', length: number = 10): string => {
  return `${prefix}_${nanoid(length)}`;
};
