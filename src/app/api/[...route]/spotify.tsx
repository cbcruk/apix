import { basic, getCurrentTrack } from '@/lib/spotify/utils'
import { Hono } from 'hono'
import satori from 'satori'

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
  const track = await getCurrentTrack()

  if (!track) {
    return c.html(`NULL`)
  }

  const width = 240
  const height = 52

  const cover = track.album.images[0].url
  const name = track.name
  const artists = track.artists.map((artist) => artist.name)

  const svg = await satori(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#333',
        padding: 5,
        borderRadius: 6,
        width,
        overflow: 'hidden',
      }}
    >
      <img src={cover} alt="" width={42} height={42} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          fontFamily: 'Roboto, sans-serif',
          color: '#E5E5E5',
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            overflow: 'hidden',
            maxWidth: 180,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#BDBDBD',
            overflow: 'hidden',
            maxWidth: 180,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {artists.join(', ')}
        </div>
      </div>
    </div>,
    {
      width,
      height,
      fonts: [
        {
          name: 'Roboto',
          data: await fetch(
            'https://github.com/vercel/satori/raw/refs/heads/main/playground/public/inter-latin-ext-400-normal.woff'
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Roboto',
          data: await fetch(
            'https://github.com/vercel/satori/raw/refs/heads/main/playground/public/inter-latin-ext-700-normal.woff'
          ).then((res) => res.arrayBuffer()),
          weight: 700,
          style: 'normal',
        },
      ],
      embedFont: true,
    }
  )

  c.header('Content-Type', 'image/svg+xml')

  return c.body(svg)
})
