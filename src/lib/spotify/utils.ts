import {
  AccessToken,
  Album,
  PlaybackState,
  RecentlyPlayedTracksPage,
  Track,
  TrackItem,
} from '@spotify/web-api-ts-sdk'

export const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
).toString('base64')

export async function getAccessToken() {
  const response = await fetch(process.env.SPOTIFY_TOKEN_ENDPOINT ?? '', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN ?? '',
    }),
  })
  const data = (await response.json()) as AccessToken

  return data
}

export async function getCurrentTrack() {
  const token = await getAccessToken()
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  if (response.status !== 200) {
    return null
  }

  const data = (await response.json()) as PlaybackState
  const item = data.item as TrackItem as Track

  return item
}

export async function getRecentlyPlayed() {
  const token = await getAccessToken()
  const response = await fetch(
    'https://api.spotify.com/v1/me/player/recently-played',
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  if (response.status !== 200) {
    return null
  }

  const data = (await response.json()) as RecentlyPlayedTracksPage
  const item = data.items[0].track

  return item
}
