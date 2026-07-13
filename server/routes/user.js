const express = require('express')
const router = express.Router()
const { query } = require('../db')

const ERR = { code: -1, msg: '服务器错误' }

// POST /api/user/login
router.post('/login', async (req, res) => {
  try {
    const { openid, nickName, avatarUrl } = req.body
    let rows = await query('SELECT * FROM users WHERE openid = ?', [openid])

    if (rows.length > 0) {
      const user = rows[0]
      await query('UPDATE users SET nick_name = ?, avatar_url = ? WHERE id = ?',
        [nickName || '', avatarUrl || '', user.id])
      res.json({ code: 0, data: { ...user, nick_name: nickName, avatar_url: avatarUrl } })
    } else {
      await query(
        'INSERT INTO users (openid, nick_name, avatar_url, score, rank_name) VALUES (?, ?, ?, 0, ?)',
        [openid, nickName || '', avatarUrl || '', '青铜']
      )
      const newRows = await query('SELECT * FROM users WHERE openid = ?', [openid])
      res.json({ code: 0, data: newRows[0] || null })
    }
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/user/getUserData
router.post('/getUserData', async (req, res) => {
  try {
    const { openid } = req.body
    const userRows = await query('SELECT * FROM users WHERE openid = ?', [openid])
    if (userRows.length === 0) return res.json({ code: -1, msg: '用户不存在' })

    const profileRows = await query('SELECT * FROM user_profiles WHERE openid = ?', [openid])
    const progressRows = await query('SELECT * FROM level_progress WHERE openid = ?', [openid])
    const wrongRows = await query('SELECT * FROM wrong_questions WHERE openid = ?', [openid])
    const signRows = await query('SELECT * FROM sign_in WHERE openid = ?', [openid])
    const badgeRows = await query('SELECT * FROM badges WHERE openid = ?', [openid])
    const settingRows = await query('SELECT * FROM user_settings WHERE openid = ?', [openid])

    res.json({
      code: 0,
      data: {
        user: userRows[0],
        profile: profileRows[0] || null,
        progress: progressRows,
        wrongQuestions: wrongRows,
        signIn: signRows[0] || null,
        badges: badgeRows,
        settings: settingRows[0] || null
      }
    })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/user/saveProfile
router.post('/saveProfile', async (req, res) => {
  try {
    const { openid, grade, major, target, initialLevel, quizScore } = req.body
    const exist = await query('SELECT * FROM user_profiles WHERE openid = ?', [openid])

    const profile = { grade, major, target, initial_level: initialLevel || 1, quiz_score: quizScore || 0, onboarded: 1 }

    if (exist.length > 0) {
      const sets = Object.entries(profile).map(([k, v]) => `${k} = ?`).join(', ')
      const vals = Object.values(profile)
      await query(`UPDATE user_profiles SET ${sets} WHERE openid = ?`, [...vals, openid])
    } else {
      const fields = ['openid', ...Object.keys(profile)].join(', ')
      const placeholders = ['?', ...Object.keys(profile).map(() => '?')].join(', ')
      await query(`INSERT INTO user_profiles (${fields}) VALUES (${placeholders})`, [openid, ...Object.values(profile)])
    }
    res.json({ code: 0, msg: '保存成功' })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

// POST /api/user/saveSettings
router.post('/saveSettings', async (req, res) => {
  try {
    const { openid, pushEnabled, pushTime, showInRank, showProgress } = req.body
    const exist = await query('SELECT * FROM user_settings WHERE openid = ?', [openid])

    const data = {
      push_enabled: pushEnabled !== undefined ? (pushEnabled ? 1 : 0) : 1,
      push_time: pushTime || '08:00',
      show_in_rank: showInRank !== undefined ? (showInRank ? 1 : 0) : 1,
      show_progress: showProgress !== undefined ? (showProgress ? 1 : 0) : 1
    }

    if (exist.length > 0) {
      const sets = Object.entries(data).map(([k, v]) => `${k} = ?`).join(', ')
      await query(`UPDATE user_settings SET ${sets} WHERE openid = ?`, [...Object.values(data), openid])
    } else {
      const fields = ['openid', ...Object.keys(data)].join(', ')
      const placeholders = ['?', ...Object.keys(data).map(() => '?')].join(', ')
      await query(`INSERT INTO user_settings (${fields}) VALUES (${placeholders})`, [openid, ...Object.values(data)])
    }
    res.json({ code: 0, msg: '保存成功' })
  } catch (e) {
    res.status(500).json(ERR)
  }
})

module.exports = router
