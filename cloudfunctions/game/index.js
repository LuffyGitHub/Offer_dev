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
      case 'saveProgress':
        return await saveProgress(openid, data)
      case 'getProgress':
        return await getProgress(openid)
      case 'getRanking':
        return await getRanking(data)
      default:
        return { code: -1, msg: '未知操作' }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}

async function saveProgress(openid, data) {
  const levelId = data.levelId
  const exist = await db.collection('level_progress')
    .where({ _openid: openid, levelId: levelId })
    .get()

  const record = {
    _openid: openid,
    levelId: levelId,
    passed: data.passed,
    score: data.score,
    total: data.total,
    stars: data.stars || 0,
    combo: data.combo || 0,
    updateTime: db.serverDate()
  }

  if (exist.data.length > 0) {
    await db.collection('level_progress').doc(exist.data[0]._id).update({ data: record })
  } else {
    record.createTime = db.serverDate()
    await db.collection('level_progress').add({ data: record })
  }

  return { code: 0, msg: '保存成功' }
}

async function getProgress(openid) {
  const res = await db.collection('level_progress').where({ _openid: openid }).get()
  const data = {}
  res.data.forEach(item => { data[item.levelId] = item })
  return { code: 0, data }
}

async function getRanking(filter) {
  const type = filter?.type || 'total'
  const limit = Math.min(filter?.limit || 50, 100)

  const users = await db.collection('users')
    .orderBy('score', 'desc')
    .limit(limit)
    .get()

  const rankList = users.data.map((u, i) => ({
    position: i + 1,
    openid: u._openid,
    name: u.nickName || '匿名',
    avatar: u.avatarUrl || '',
    score: u.score,
    rankName: getRankByScore(u.score)
  }))

  return { code: 0, data: rankList }
}

function getRankByScore(score) {
  if (score >= 2000) return '王者'
  if (score >= 1000) return '钻石'
  if (score >= 600) return '铂金'
  if (score >= 300) return '黄金'
  if (score >= 100) return '白银'
  return '青铜'
}
