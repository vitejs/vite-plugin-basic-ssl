# @vitejs/plugin-basic-ssl [![npm](https://img.shields.io/npm/v/@vitejs/plugin-basic-ssl.svg)](https://npmjs.com/package/@vitejs/plugin-basic-ssl)

A plugin to generate untrusted certificates which still allows to access the page after proceeding a wall with warning.

In most scenarios, it is recommended to generate a secure trusted certificate instead and use it to configure [`server.https`](https://vitejs.dev/config/server-options.html#server-https)

This plugin will only generate the certificate, to prevent the browser from complaining about the certificate, check [install section](##install).

```html

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

## Install

Once you have configured this plugin on your project, start dev server to generate the SSL/TLS certificate: we suggest to install it on a known location and use it on any project.

### Firefox

Start dev server if not started yet, and then:
- open Firefox settings
- go to `Privacy & Security` > `Certificates` > `View Certificates` > `Servers`
- click on `Add Exception...` button
- enter dev server address (i.e. https://localhost:5173)
- click on `Get Certificate` button
- check `Save this exception permanently` checkbox
- click on `Confirm Security Exception` button

### Windows

#### Chrome, Edge, Chromium, Internet Explorer

Go to `node_modules/.vite/basic-ssl` folder and open `_cert.pem` file in text editor: 
- copy to clipboard from `-----BEGIN CERTIFICATE-----` to `-----END CERTIFICATE-----` (including both lines)
- paste clipboard content into a new one file, save it wherever you want with `.cer` extension
- double click on saved `.cer` file
- click `Install Certificate` button and follow the wizard until finish
- Windows will ask if you want to install the new certificate authority, click `Yes` button

### MacOS

WIP

### Linux

WIP

## License

MIT
