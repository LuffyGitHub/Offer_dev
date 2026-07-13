const API_BASE = 'http://localhost:3000/api'

async function request(method, path, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_BASE}${path}`,
      method: method,
      data: data,
      header: { 'Content-Type': 'application/json' },
      success(res) {
        if (res.data && res.data.code === 0) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data?.msg || '请求失败'))
        }
      },
      fail(err) {
        reject(new Error('网络请求失败: ' + (err.errMsg || '')))
      },
      timeout: 10000
    })
  })
}

function POST(path, data) {
  return request('POST', path, data)
}

const api = {
  user: {
    login(openid, nickName, avatarUrl) {
      return POST('/user/login', { openid, nickName, avatarUrl })
    },
    getUserData(openid) {
      return POST('/user/getUserData', { openid })
    },
    saveProfile(openid, data) {
      return POST('/user/saveProfile', { openid, ...data })
    },
    saveSettings(openid, data) {
      return POST('/user/saveSettings', { openid, ...data })
    }
  },
  game: {
    saveProgress(openid, data) {
      return POST('/game/saveProgress', { openid, ...data })
    },
    getProgress(openid) {
      return POST('/game/getProgress', { openid })
    },
    getRanking(openid, limit = 50) {
      return POST('/game/getRanking', { openid, limit })
    }
  },
  score: {
    addScore(openid, amount) {
      return POST('/score/addScore', { openid, amount })
    },
    getScore(openid) {
      return POST('/score/getScore', { openid })
    },
    signIn(openid) {
      return POST('/score/signIn', { openid })
    },
    getSignIn(openid) {
      return POST('/score/getSignIn', { openid })
    },
    unlockBadge(openid, badgeId) {
      return POST('/score/unlockBadge', { openid, badgeId })
    },
    getBadges(openid) {
      return POST('/score/getBadges', { openid })
    }
  },
  wrongbook: {
    add(openid, data) {
      return POST('/wrongbook/add', { openid, ...data })
    },
    list(openid, status = 'all') {
      return POST('/wrongbook/list', { openid, status })
    },
    updateStatus(openid, questionId, status) {
      return POST('/wrongbook/updateStatus', { openid, questionId, status })
    },
    remove(openid, questionId) {
      return POST('/wrongbook/remove', { openid, questionId })
    }
  }
}

module.exports = api
