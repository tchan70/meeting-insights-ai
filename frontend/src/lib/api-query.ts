import { initQueryClient } from '@ts-rest/react-query';
import { contract } from './contract';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiQuery = initQueryClient(contract, {
  baseUrl,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
});
