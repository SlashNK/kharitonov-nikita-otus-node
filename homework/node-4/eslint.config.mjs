import globals from 'globals'

import path from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import pluginJs from '@eslint/js'
import jest from 'eslint-plugin-jest'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: pluginJs.configs.recommended })

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  ...compat.extends('standard'),
  {
    rules: {
      'no-void': 'off'
    }
  },
  {
    files: ['**/*.test.js'],
    ...jest.configs['flat/recommended']
  }
]
