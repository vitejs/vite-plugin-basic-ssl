import { defineConfig } from 'vite'
import basicSsl from '../src/index'

const config = defineConfig({
  build: {
    sourcemap: true,
    minify: false
  },
  plugins: [
    basicSsl()
  ]
})

export default config
