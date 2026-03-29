import { base } from '@handshake/config/eslint/base'

export default [
  ...base,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]
