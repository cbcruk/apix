/** @jsxImportSource hono/jsx */
import { format } from 'date-fns'
import { Hono } from 'hono'

export const now = new Hono()

now.get('/', (c) => {
  const date = new Date()
  const formatted = format(date, 'yyyy-MM-dd:HH:mm:ss')

  return c.html(
    <pre>
      {JSON.stringify(
        {
          date,
          formatted,
        },
        null,
        2
      )}
    </pre>
  )
})
