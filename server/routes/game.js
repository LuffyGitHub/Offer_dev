const express = require('express')
const router = express.Router()
const { query } = require('../db')

const ERR = { code: -1, msg: '服务器错误' }

function getRankName(score) {
  if (score >= 2000) return '王者'
  if (score >= 1000) return '钻石'
  if (score >= 600) return '铂金'
  if (score >= 300) return '黄金'
  if (score >= 100) return '白银'
  return '青铜'
}

// POST /api/game/saveProgress
router.post('/saveProgress', async (req, res) => {
  try {
    const { openid, levelId, passed, score, total, stars, combo } = req.body
    const exist = await query('SELECT * FROM level_progress WHERE openid = ? AND level_id = ?', [openid, levelId])

    const data = { passed: passed ? 1 : 0, score: score || 0, total: total || 0, stars: stars || 0, combo: combo || 0 }

    if (exist.length > 0) {
      const sets = Object.entries(data).map(([k, v]) => `${k} = ?`).join(', ')
      await query(`UPDATE level_progress SET ${sets} WHERE openid = ? AND level_id = ?`,
        [...Object.values(data), openid, levelId])
    } else {
      const fields = ['openid', 'level_id', ...Object.keys(data)].join(', ')
      const placeholders = ['?', '?', ...Object.keys(data).map(() => '?')].join(', ')
      await query(`INSERT INTO level_progress (${fields}) VALUES (${placeholders})`,
        [openid, levelId, ...Object.values(data)])
    }
    res.json({ code: 0, msg: '保存成功' })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/game/getProgress
router.post('/getProgress', async (req, res) => {
  try {
    const { openid } = req.body
    const rows = await query('SELECT * FROM level_progress WHERE openid = ?', [openid])
    const data = {}
    rows.forEach(r => { data[r.level_id] = r })
    res.json({ code: 0, data })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/game/getRanking
router.post('/getRanking', async (req, res) => {
  try {
    const limit = Math.min(req.body.limit || 50, 100)
    const rows = await query('SELECT openid, nick_name, avatar_url, score FROM users ORDER BY score DESC LIMIT ?', [limit])

    const list = rows.map((r, i) => ({
      position: i + 1,
      openid: r.openid,
      name: r.nick_name || '匿名',
      avatar: r.avatar_url || '',
      score: r.score,
      rankName: getRankName(r.score)
    }))

    res.json({ code: 0, data: list })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

module.exports = router
