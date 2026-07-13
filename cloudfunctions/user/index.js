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
      case 'login':
        return await login(openid, data)
      case 'getUserData':
        return await getUserData(openid)
      case 'saveProfile':
        return await saveProfile(openid, data)
      case 'saveSettings':
        return await saveSettings(openid, data)
      case 'getSettings':
        return await getSettings(openid)
      default:
        return { code: -1, msg: '未知操作' }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}

async function login(openid, userInfo) {
  const users = db.collection('users')
  const exist = await users.where({ _openid: openid }).get()
  if (exist.data.length > 0) {
    await users.doc(exist.data[0]._id).update({
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        updateTime: db.serverDate()
      }
    })
    return { code: 0, data: exist.data[0] }
  }
  const res = await users.add({
    data: {
      _openid: openid,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      score: 0,
      rankName: '青铜',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  const newUser = await users.doc(res._id).get()
  return { code: 0, data: newUser.data }
}

async function getUserData(openid) {
  const userRes = await db.collection('users').where({ _openid: openid }).get()
  if (userRes.data.length === 0) return { code: -1, msg: '用户不存在' }

  const profileRes = await db.collection('user_profiles').where({ _openid: openid }).get()
  const progressRes = await db.collection('level_progress').where({ _openid: openid }).get()
  const wrongRes = await db.collection('wrong_questions').where({ _openid: openid }).get()
  const signRes = await db.collection('sign_in').where({ _openid: openid }).get()
  const badgeRes = await db.collection('badges').where({ _openid: openid }).get()
  const settingRes = await db.collection('settings').where({ _openid: openid }).get()

  return {
    code: 0,
    data: {
      user: userRes.data[0],
      profile: profileRes.data[0] || null,
      progress: progressRes.data,
      wrongQuestions: wrongRes.data,
      signIn: signRes.data[0] || null,
      badges: badgeRes.data,
      settings: settingRes.data[0] || null
    }
  }
}

async function saveProfile(openid, data) {
  const exist = await db.collection('user_profiles').where({ _openid: openid }).get()
  const profile = {
    _openid: openid,
    grade: data.grade,
    major: data.major,
    target: data.target,
    initialLevel: data.initialLevel || 1,
    quizScore: data.quizScore || 0,
    onboarded: true,
    updateTime: db.serverDate()
  }
  if (exist.data.length > 0) {
    await db.collection('user_profiles').doc(exist.data[0]._id).update({ data: profile })
  } else {
    profile.createTime = db.serverDate()
    await db.collection('user_profiles').add({ data: profile })
  }
  return { code: 0, msg: '保存成功' }
}

async function saveSettings(openid, data) {
  const exist = await db.collection('settings').where({ _openid: openid }).get()
  const setting = {
    _openid: openid,
    pushEnabled: data.pushEnabled !== undefined ? data.pushEnabled : true,
    pushTime: data.pushTime || '08:00',
    showInRank: data.showInRank !== undefined ? data.showInRank : true,
    showProgress: data.showProgress !== undefined ? data.showProgress : true,
    updateTime: db.serverDate()
  }
  if (exist.data.length > 0) {
    await db.collection('settings').doc(exist.data[0]._id).update({ data: setting })
  } else {
    setting.createTime = db.serverDate()
    await db.collection('settings').add({ data: setting })
  }
  return { code: 0, msg: '保存成功' }
}

async function getSettings(openid) {
  const res = await db.collection('settings').where({ _openid: openid }).get()
  return { code: 0, data: res.data[0] || null }
}
