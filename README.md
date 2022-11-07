# @vitejs/plugin-basic-ssl [![npm](https://img.shields.io/npm/v/@vitejs/plugin-basic-ssl.svg)](https://npmjs.com/package/@vitejs/plugin-basic-ssl)

A plugin to generate untrusted certificates which still allows to access the page after proceeding a wall with warning.

In most scenarios, it is recommended to generate a secure trusted certificate instead and use it to configure [`server.https`](https://vitejs.dev/config/server-options.html#server-https)

## Usage

```js
// vite.config.js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [
    basicSsl()
  ]
}
```
 
## License

MIT
