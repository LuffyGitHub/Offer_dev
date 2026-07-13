const ENV = 'your-env-id' // 替换为你的云环境ID

function call(functionName, params) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: functionName,
      data: params
    }).then(res => {
      if (res.result && res.result.code === 0) {
        resolve(res.result.data)
      } else {
        reject(new Error(res.result?.msg || '操作失败'))
      }
    }).catch(err => {
      reject(err)
    })
  })
}

const user = {
  login(userInfo) {
    return call('user', { action: 'login', data: userInfo })
  },
  getUserData() {
    return call('user', { action: 'getUserData' })
  },
  saveProfile(data) {
    return call('user', { action: 'saveProfile', data })
  },
  saveSettings(data) {
    return call('user', { action: 'saveSettings', data })
  },
  getSettings() {
    return call('user', { action: 'getSettings' })
  }
}

const game = {
  saveProgress(data) {
    return call('game', { action: 'saveProgress', data })
  },
  getProgress() {
    return call('game', { action: 'getProgress' })
  },
  getRanking(type = 'total', limit = 50) {
    return call('game', { action: 'getRanking', data: { type, limit } })
  }
}

const score = {
  addScore(amount) {
    return call('score', { action: 'addScore', data: { amount } })
  },
  getScore() {
    return call('score', { action: 'getScore' })
  },
  signIn() {
    return call('score', { action: 'signIn' })
  },
  getSignIn() {
    return call('score', { action: 'getSignIn' })
  },
  unlockBadge(badgeId) {
    return call('score', { action: 'unlockBadge', data: { badgeId } })
  },
  getBadges() {
    return call('score', { action: 'getBadges' })
  }
}

const wrongbook = {
  add(data) {
    return call('wrongbook', { action: 'add', data })
  },
  list(status = 'all') {
    return call('wrongbook', { action: 'list', data: { status } })
  },
  updateStatus(questionId, status) {
    return call('wrongbook', { action: 'updateStatus', data: { questionId, status } })
  },
  remove(questionId) {
    return call('wrongbook', { action: 'remove', data: { questionId } })
  }
}

module.exports = { user, game, score, wrongbook, ENV }
