import { Hono } from 'hono'
import { querySchema } from '../schema'
import { convertToPo } from '../utils'
import { config } from 'dotenv'

const env = config()

const SHEET_ID = env.parsed?.SHEET_ID

export const i18n = new Hono()

i18n.get('/', async (c) => {
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
