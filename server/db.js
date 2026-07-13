const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'offer_dev',
  waitForConnections: true,
  connectionLimit: 10,
  charset: 'utf8mb4'
})

async function query(sql, params) {
  const [rows] = await pool.execute(sql, params)
  return rows
}

module.exports = { query }
