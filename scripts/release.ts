import { generateChangelog, release } from '@vitejs/release-scripts'
import colors from 'picocolors'
import { logRecentCommits } from './releaseUtils'

release({
  repo: 'vite-plugin-basic-ssl',
  packages: ['plugin-basic-ssl'],
  getPkgDir: () => '.',
  toTag: (_pkg, version) => `v${version}`,
  logChangelog: (pkg) => logRecentCommits(pkg),
  generateChangelog: async (_pkgName) => {
    console.log(colors.cyan('\nGenerating changelog...'))
    await generateChangelog({ getPkgDir: () => '.' })
  },
})
