const { STORAGE_KEYS, set } = require('../../utils/storage')
const api = require('../../utils/api')
const { getOpenid } = require('../../utils/openid')
const app = getApp()

Page({
  onLogin(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = e.detail.userInfo
      app.globalData.userInfo = userInfo
      set(STORAGE_KEYS.USER_INFO, userInfo)

      wx.showLoading({ title: '登录中...' })

      const openid = getOpenid()
      api.user.login(openid, userInfo.nickName, userInfo.avatarUrl).then(cloudUser => {
        wx.hideLoading()
        if (cloudUser) {
          app.globalData.score = cloudUser.score || 0
          app.globalData.rankName = cloudUser.rankName || '青铜'
        }
        if (!app.isOnboarded()) {
          wx.redirectTo({ url: '/pages/onboarding/onboarding' })
        } else {
          app.syncFromServer().then(() => {
            wx.reLaunch({ url: '/pages/index/index' })
          })
        }
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({ title: '服务器未连接，使用本地模式', icon: 'none' })
        if (!app.isOnboarded()) {
          wx.redirectTo({ url: '/pages/onboarding/onboarding' })
        } else {
          wx.reLaunch({ url: '/pages/index/index' })
        }
      })
    } else {
      wx.showToast({ title: '需要授权才能使用', icon: 'none' })
    }
  }
})
