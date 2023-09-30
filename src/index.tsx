/** @jsx jsx */
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import dotenv from 'dotenv'
import pkg from '../package.json'
import { convertToPo } from './utils'
import { querySchema } from './schema'

const env = dotenv.config()

const SHEET_ID = env.parsed?.SHEET_ID

const app = new Hono()

app.get('/', (c) => c.json(pkg))

app.get('/api/i18n', async (c) => {
  const {
    name = 'dashboard',
    lang = 'ko',
    format = 'json',
  } = querySchema.parse(c.req.query())

  const url = new URL(`https://script.google.com/macros/s/${SHEET_ID}/exec`)
  url.searchParams.append('name', name)
  url.searchParams.append('lang', lang)

  const data = await fetch(url.toString()).then((r) => r.json())

  if (format === 'po') {
    const po = convertToPo({ data, lang })

    return c.text(po)
  }

  return c.json(data)
})

serve(app)
