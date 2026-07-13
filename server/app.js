const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/user')
const gameRoutes = require('./routes/game')
const scoreRoutes = require('./routes/score')
const wrongbookRoutes = require('./routes/wrongbook')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/game', gameRoutes)
app.use('/api/score', scoreRoutes)
app.use('/api/wrongbook', wrongbookRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[职得闯关] 后端服务已启动: http://0.0.0.0:${PORT}`)
  console.log(`[职得闯关] MySQL 数据库: ${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '3306'}`)
})
