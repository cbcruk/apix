import { QuerySchema } from './schema'

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
