import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import router from './routes'

const app = new Hono()

app.use('*', logger())
app.use('*', cors())
app.route('/', router)

const port = process.env.PORT || 3001
console.log(`Server is running on port ${port}`)

export default {
    port,
    fetch: app.fetch,
}
