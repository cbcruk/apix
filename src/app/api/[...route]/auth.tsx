import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

export const auth = new Hono()

auth.use(
  '/*',
  basicAuth({
    username: '',
    password: '',
  })
)

auth.get('/page', (c) => {
  return c.html(<p>Authorized</p>)
})
