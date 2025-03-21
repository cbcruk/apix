/** @jsxImportSource hono/jsx */
import { getHtml } from '@/lib/spotify/html'
import { basic, getRecentlyPlayed } from '@/lib/spotify/utils'
import { Hono } from 'hono'

export const spotify = new Hono()

spotify.get('/auth', async (c) => {
  const code = c.req.query('code')

  if (!code) {
    const query = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID ?? '',
      response_type: 'code',
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI ?? '',
      scope:
        'user-read-currently-playing user-read-recently-played user-top-read',
    })

    return c.redirect(
      `https://accounts.spotify.com/authorize?${query.toString()}`
    )
  }

  const response = await fetch(process.env.SPOTIFY_TOKEN_ENDPOINT ?? '', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI ?? '',
    }),
  })

  const data = await response.json()

  return c.html(`<pre>${data.refresh_token}</pre>`)
})

spotify.get('/playing', async (c) => {
  const track = await getRecentlyPlayed()

  if (!track) {
    return c.html(`NULL`)
  }

  const html = getHtml(track)

  return c.html(html)
})
