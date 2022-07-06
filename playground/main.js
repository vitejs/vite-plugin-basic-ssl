import './style.css'
import viteLogo from '/vite.svg'
import lockIcon from '/lock.svg'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://github.com/vitejs/vite-plugin-basic-ssl" target="_blank">
      <img src="${lockIcon}" class="logo vanilla" alt="Lock Icon" />
    </a>
    <h1>Hello Vite + Basic SSL!</h1>
    <p class="read-the-docs">
        Example of a basic ssl setup using an automatically generated self-signed certificate
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
