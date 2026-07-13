const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    switch (action) {
      case 'addScore':
        return await addScore(openid, data)
      case 'getScore':
        return await getScore(openid)
      case 'signIn':
        return await signIn(openid)
      case 'getSignIn':
        return await getSignIn(openid)
      case 'unlockBadge':
        return await unlockBadge(openid, data)
      case 'getBadges':
        return await getBadges(openid)
      default:
        return { code: -1, msg: '未知操作' }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}

async function addScore(openid, data) {
  const amount = data.amount || 0
  const userRes = await db.collection('users').where({ _openid: openid }).get()
  if (userRes.data.length === 0) return { code: -1, msg: '用户不存在' }

  const user = userRes.data[0]
  const newScore = (user.score || 0) + amount
  const newRank = getRankByScore(newScore)

  await db.collection('users').doc(user._id).update({
    data: {
      score: newScore,
      rankName: newRank,
      updateTime: db.serverDate()
    }
  })

  return { code: 0, data: { score: newScore, rankName: newRank } }
}

async function getScore(openid) {
  const res = await db.collection('users').where({ _openid: openid }).get()
  if (res.data.length === 0) return { code: -1, msg: '用户不存在' }
  return { code: 0, data: { score: res.data[0].score || 0, rankName: res.data[0].rankName || '青铜' } }
}

async function signIn(openid) {
  const today = getTodayStr()
  const exist = await db.collection('sign_in').where({ _openid: openid }).get()

  let signInData
  if (exist.data.length > 0) {
    signInData = exist.data[0]
    if (signInData.lastDate === today) {
      return { code: -1, msg: '今日已签到' }
    }

    const yesterday = getDateStr(-1)
    let streak = signInData.lastDate === yesterday ? (signInData.streak || 0) + 1 : 1

    await db.collection('sign_in').doc(signInData._id).update({
      data: { lastDate: today, streak, updateTime: db.serverDate() }
    })

    return { code: 0, data: { lastDate: today, streak, firstToday: true } }
  }

  await db.collection('sign_in').add({
    data: { _openid: openid, lastDate: today, streak: 1, createTime: db.serverDate() }
  })
  return { code: 0, data: { lastDate: today, streak: 1, firstToday: true } }
}

async function getSignIn(openid) {
  const res = await db.collection('sign_in').where({ _openid: openid }).get()
  return { code: 0, data: res.data[0] || null }
}

async function unlockBadge(openid, data) {
  const badgeId = data.badgeId
  if (!badgeId) return { code: -1, msg: '缺少badgeId' }

  const exist = await db.collection('badges')
    .where({ _openid: openid, badgeId: badgeId })
    .get()

  if (exist.data.length > 0) return { code: 0, msg: '已解锁', isNew: false }

  await db.collection('badges').add({
    data: { _openid: openid, badgeId: badgeId, unlockTime: db.serverDate() }
  })
  return { code: 0, msg: '解锁成功', isNew: true }
}

async function getBadges(openid) {
  const res = await db.collection('badges').where({ _openid: openid }).get()
  return { code: 0, data: res.data.map(b => b.badgeId) }
}

function getTodayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

function getDateStr(offset) {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
}

function pad(n) { return n < 10 ? '0' + n : '' + n }

function getRankByScore(score) {
  if (score >= 2000) return '王者'
  if (score >= 1000) return '钻石'
  if (score >= 600) return '铂金'
  if (score >= 300) return '黄金'
  if (score >= 100) return '白银'
  return '青铜'
}
