import { readdir } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const testsDir = resolve(rootDir, 'tests')

const files = (await readdir(testsDir))
  .filter(f => f.endsWith('.test.mjs') || f.endsWith('.test.ts') || f.endsWith('.test.js'))
  .map(f => resolve(testsDir, f))

if (files.length === 0) {
  console.log('No test files found in tests/')
  process.exit(0)
}

const child = spawn(process.execPath, ['--import', 'tsx', '--test', ...files], {
  stdio: 'inherit',
  cwd: rootDir,
})

child.on('exit', (code) => {
  process.exit(code ?? 1)
})

