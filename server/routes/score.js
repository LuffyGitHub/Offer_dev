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

// POST /api/score/addScore
router.post('/addScore', async (req, res) => {
  try {
    const { openid, amount } = req.body
    const rows = await query('SELECT * FROM users WHERE openid = ?', [openid])
    if (rows.length === 0) return res.json({ code: -1, msg: '用户不存在' })

    const newScore = (rows[0].score || 0) + (amount || 0)
    const newRank = getRankName(newScore)
    await query('UPDATE users SET score = ?, rank_name = ? WHERE openid = ?', [newScore, newRank, openid])

    res.json({ code: 0, data: { score: newScore, rankName: newRank } })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/score/getScore
router.post('/getScore', async (req, res) => {
  try {
    const { openid } = req.body
    const rows = await query('SELECT score, rank_name FROM users WHERE openid = ?', [openid])
    if (rows.length === 0) return res.json({ code: -1, msg: '用户不存在' })
    res.json({ code: 0, data: { score: rows[0].score || 0, rankName: rows[0].rank_name || '青铜' } })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/score/signIn
router.post('/signIn', async (req, res) => {
  try {
    const { openid } = req.body
    const today = new Date().toISOString().slice(0, 10)
    const rows = await query('SELECT * FROM sign_in WHERE openid = ?', [openid])

    if (rows.length > 0) {
      const record = rows[0]
      if (record.last_date === today) {
        return res.json({ code: -1, msg: '今日已签到' })
      }

      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
      const streak = record.last_date === yesterday ? (record.streak || 0) + 1 : 1

      await query('UPDATE sign_in SET last_date = ?, streak = ? WHERE openid = ?', [today, streak, openid])
      res.json({ code: 0, data: { lastDate: today, streak } })
    } else {
      await query('INSERT INTO sign_in (openid, last_date, streak) VALUES (?, ?, 1)', [openid, today])
      res.json({ code: 0, data: { lastDate: today, streak: 1 } })
    }
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/score/getSignIn
router.post('/getSignIn', async (req, res) => {
  try {
    const { openid } = req.body
    const rows = await query('SELECT * FROM sign_in WHERE openid = ?', [openid])
    res.json({ code: 0, data: rows[0] || null })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/score/unlockBadge
router.post('/unlockBadge', async (req, res) => {
  try {
    const { openid, badgeId } = req.body
    if (!badgeId) return res.json({ code: -1, msg: '缺少badgeId' })

    const exist = await query('SELECT * FROM badges WHERE openid = ? AND badge_id = ?', [openid, badgeId])
    if (exist.length > 0) return res.json({ code: 0, msg: '已解锁', isNew: false })

    await query('INSERT INTO badges (openid, badge_id) VALUES (?, ?)', [openid, badgeId])
    res.json({ code: 0, msg: '解锁成功', isNew: true })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/score/getBadges
router.post('/getBadges', async (req, res) => {
  try {
    const { openid } = req.body
    const rows = await query('SELECT badge_id FROM badges WHERE openid = ?', [openid])
    res.json({ code: 0, data: rows.map(r => r.badge_id) })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

module.exports = router
