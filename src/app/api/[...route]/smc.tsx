/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { render } from 'state-machine-cat'

export const smc = new Hono()

const input = `initial,
collection {
  # categoryId, companyIds
  collection_form:
    do/ input(),
  collection_preview:
    entry/ render();

  collection_form -> collection_preview: fetch;
},
confirm {
  confirm_modal:
    entry/ showModal()
    exit/ hideModal(),
  # subject, hasBanner
  confirm_form:
    do/ input();
},
mailchimp {
  server:
    entry/ fetch()
    exit/ abort(),
  success,
  fail;

  server -> success;
  server -> fail;
},
final;

initial => collection;
collection => confirm;
confirm => mailchimp;
mailchimp => final;`

smc.get('/svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 's-maxage=1')

  const result = render(input, {
    outputType: 'svg',
  })

  return c.body(result)
})

smc.get('/', (c) => {
  const url = new URL(c.req.url)

  return c.html(
    <i>
      <img src={`${url.origin}/api/smc/svg`} alt="" />
    </i>
  )
})
