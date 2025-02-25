import { Hono } from 'hono'
import smcat from 'state-machine-cat'

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

  const result = smcat.render(input, {
    outputType: 'svg',
  })

  return c.body(
    result
  )
})

smc.get('/', (c) => {
  return c.html(
    <i>
      <img src="http://localhost:3000/smc/svg" alt="" />
    </i>
  )
})
