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
      case 'add':
        return await addWrongQuestion(openid, data)
      case 'list':
        return await getWrongQuestions(openid, data)
      case 'updateStatus':
        return await updateStatus(openid, data)
      case 'remove':
        return await removeWrongQuestion(openid, data)
      default:
        return { code: -1, msg: '未知操作' }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}

async function addWrongQuestion(openid, data) {
  const exist = await db.collection('wrong_questions')
    .where({ _openid: openid, questionId: data.questionId })
    .get()

  if (exist.data.length > 0) {
    await db.collection('wrong_questions').doc(exist.data[0]._id).update({
      data: { wrongCount: _.inc(1), updateTime: db.serverDate() }
    })
    return { code: 0, msg: '已更新' }
  }

  await db.collection('wrong_questions').add({
    data: {
      _openid: openid,
      questionId: data.questionId,
      text: data.text,
      options: data.options,
      answer: data.answer,
      module: data.module,
      explain: data.explain,
      wrongCount: 1,
      status: 'unreviewed',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }
  })
  return { code: 0, msg: '添加成功' }
}

async function getWrongQuestions(openid, filter) {
  const query = { _openid: openid }
  if (filter?.status && filter.status !== 'all') {
    query.status = filter.status
  }

  const res = await db.collection('wrong_questions')
    .where(query)
    .orderBy('updateTime', 'desc')
    .get()

  return { code: 0, data: res.data }
}

async function updateStatus(openid, data) {
  const res = await db.collection('wrong_questions')
    .where({ _openid: openid, questionId: data.questionId })
    .get()

  if (res.data.length === 0) return { code: -1, msg: '记录不存在' }

  await db.collection('wrong_questions').doc(res.data[0]._id).update({
    data: { status: data.status, updateTime: db.serverDate() }
  })
  return { code: 0, msg: '更新成功' }
}

async function removeWrongQuestion(openid, data) {
  const res = await db.collection('wrong_questions')
    .where({ _openid: openid, questionId: data.questionId })
    .get()

  if (res.data.length > 0) {
    await db.collection('wrong_questions').doc(res.data[0]._id).remove()
  }
  return { code: 0, msg: '已移除' }
}
