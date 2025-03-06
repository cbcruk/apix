import { Hono } from 'hono'
import { z } from 'zod'

const querySchema = z.object({
  name: z.enum(['dashboard', 'app', 'server']),
  lang: z.enum(['ko', 'ja']),
  format: z.enum(['json', 'po']).optional(),
})

type QuerySchema = z.infer<typeof querySchema>

type Data = Record<string, string>
type Lang = QuerySchema['lang']

function getHeader(lang: Lang) {
  return `msgid ""
msgstr ""
"Content-Type: text/plain; charset=UTF-8\\n"
"Language: ${lang}\\n"`
}

function getBody(data: Data) {
  return Object.entries(data)
    .map(([key, value]) => {
      return `msgid "${key}"\nmsgstr "${value}"\n`
    })
    .join('\n')
}

export function convertToPo({ data, lang }: { data: Data; lang: Lang }) {
  return [getHeader(lang), getBody(data)].join('\n\n')
}

export const i18n = new Hono()

i18n.get('/', async (c) => {
  const {
    name = 'dashboard',
    lang = 'ko',
    format = 'json',
  } = querySchema.parse(c.req.query())

  const url = new URL(
    `https://script.google.com/macros/s/${process.env.SHEET_ID}/exec`
  )
  url.searchParams.append('name', name)
  url.searchParams.append('lang', lang)

  const data = await fetch(url.toString()).then((r) => r.json())

  if (format === 'po') {
    const po = convertToPo({ data, lang })

    return c.text(po)
  }

  return c.json(data)
})
