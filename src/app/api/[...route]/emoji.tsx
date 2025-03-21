/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'

export const emoji = new Hono()

emoji.get('/svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 's-maxage=1')

  return c.body(
    `<svg id="emoji" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    <g id="color">
      <path fill="#FCEA2B" d="M36,13.1161c-12.6823,0-23,10.3177-23,23c0,12.6822,10.3177,23,23,23c12.6822,0,23-10.3178,23-23 C59,23.4338,48.6822,13.1161,36,13.1161z"/>
    </g>
    <g id="hair"/>
    <g id="skin"/>
    <g id="skin-shadow"/>
    <g id="line">
      <circle cx="36" cy="36" r="23" fill="none" stroke="#000" stroke-miterlimit="10" stroke-width="2"/>
      <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="m23.64 27.87 7.928 2.431-7.862 3.248"/>
      <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" d="m48.36 27.87-7.928 2.431 7.862 3.248"/>
      <path fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m23.93 44.39 3.533-2.896 3.931 5.55 4.608-4.044 4.608 4.044 3.944-5.55 3.532 2.905v-0.0107"/>
    </g>
  </svg>`
  )
})

emoji.get('/', (c) => {
  const url = new URL(c.req.url)

  return c.html(
    <i>
      <img src={`${url.origin}/api/emoji/svg`} alt="" />
    </i>
  )
})
