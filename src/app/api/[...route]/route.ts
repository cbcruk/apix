import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { auth } from './auth'
import { emoji } from './emoji'
import { smc } from './smc'
import { i18n } from './i18n'
import { now } from './now'
import { spotify } from './spotify'

export const dynamic = 'force-dynamic'

const app = new Hono().basePath('/api')

app.route('/auth', auth)
app.route('/i18n', i18n)
app.route('/emoji', emoji)
app.route('/smc', smc)
app.route('/now', now)
app.route('/spotify', spotify)

export const POST = handle(app)
export const GET = handle(app)
