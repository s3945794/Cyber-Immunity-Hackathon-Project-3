import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Never touch real Firebase in unit tests.
vi.mock('@/lib/firebase/client', () => ({
  getClientApp: vi.fn(() => ({})),
  getClientDb: vi.fn(() => ({})),
}))

vi.mock('@/lib/firebase/admin', () => ({
  adminAuth: {},
  adminDb: {},
}))
