const express = require('express')
const router = express.Router()
const { query } = require('../db')

const ERR = { code: -1, msg: '服务器错误' }

// POST /api/wrongbook/add
router.post('/add', async (req, res) => {
  try {
    const { openid, questionId, text, options, answer, module, explain } = req.body
    const exist = await query('SELECT * FROM wrong_questions WHERE openid = ? AND question_id = ?', [openid, questionId])

    if (exist.length > 0) {
      await query('UPDATE wrong_questions SET wrong_count = wrong_count + 1 WHERE openid = ? AND question_id = ?',
        [openid, questionId])
      return res.json({ code: 0, msg: '已更新' })
    }

    await query(
      'INSERT INTO wrong_questions (openid, question_id, `text`, `options`, answer, `module`, explain_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [openid, questionId, text || '', JSON.stringify(options || []), answer || 0, module || '', explain || '']
    )
    res.json({ code: 0, msg: '添加成功' })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/wrongbook/list
router.post('/list', async (req, res) => {
  try {
    const { openid, status } = req.body
    let sql = 'SELECT * FROM wrong_questions WHERE openid = ?'
    const params = [openid]

    if (status && status !== 'all') {
      sql += ' AND status = ?'
      params.push(status)
    }
    sql += ' ORDER BY update_time DESC'

    const rows = await query(sql, params)
    res.json({ code: 0, data: rows })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/wrongbook/updateStatus
router.post('/updateStatus', async (req, res) => {
  try {
    const { openid, questionId, status } = req.body
    await query('UPDATE wrong_questions SET status = ? WHERE openid = ? AND question_id = ?',
      [status, openid, questionId])
    res.json({ code: 0, msg: '更新成功' })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/wrongbook/remove
router.post('/remove', async (req, res) => {
  try {
    const { openid, questionId } = req.body
    await query('DELETE FROM wrong_questions WHERE openid = ? AND question_id = ?', [openid, questionId])
    res.json({ code: 0, msg: '已移除' })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

module.exports = router
