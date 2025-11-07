import { initClient } from '@ts-rest/core'
import { contract } from './contract'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const apiClient = initClient(contract, {
  baseUrl,
  baseHeaders: {
    'Content-Type': 'application/json',
  },
})
