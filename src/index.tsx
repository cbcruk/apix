import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { i18n } from './api/i18n'
import { auth } from './auth'
import { emoji } from './emoji'

export const app = new Hono()

app.route('/auth', auth)
app.route('/api/i18n', i18n)
app.route('/emoji', emoji)

serve(app)
