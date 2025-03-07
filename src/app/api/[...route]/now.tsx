/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'

export const now = new Hono()

now.get('/', (c) => {
  const date = new Date()

  return c.html(<pre>{JSON.stringify({ date }, null, 2)}</pre>)
})
