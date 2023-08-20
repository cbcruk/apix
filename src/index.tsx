/** @jsx jsx */
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})

app
  .get('/posts/:id', (c) => {
    const page = c.req.query('page')
    const id = c.req.param('id')

    c.header('X-Message', 'Hi!')

    return c.text(`You want see ${page} of ${id}`)
  })
  .post('/posts', (c) => c.text('Created!', 201))
  .delete('/posts/:id', (c) => c.text(`${c.req.param('id')} is deleted!`))

app.get('/page', (c) => {
  return c.html(<h1>Hello Hono!</h1>)
})

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => {
  return c.text('Your are authorized!')
})

serve(app)
